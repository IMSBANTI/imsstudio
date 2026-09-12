import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { initialData } from './data/initial_data.js';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'studio_db.json');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust reverse proxy headers (Render, Cloudflare, Nginx) for accurate client IP detection
app.set('trust proxy', true);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check endpoint (always accessible for Render deployment health monitoring)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- IP Whitelisting Gate ---
// Activated only when the ALLOWED_IPS environment variable is configured in Render
app.use((req, res, next) => {
  const allowedIpsEnv = process.env.ALLOWED_IPS;
  // If ALLOWED_IPS is not defined or empty, allow all connections
  if (!allowedIpsEnv || !allowedIpsEnv.trim()) {
    return next();
  }

  // Extract client's real public IP address
  const rawIp = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : (req.ip || req.socket.remoteAddress || '');
  const clientIp = rawIp.replace(/^::ffff:/, '').trim();

  // Allow localhost / loopback for server-side calls
  if (clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === '') {
    return next();
  }

  const allowedList = allowedIpsEnv
    .split(',')
    .map(ip => ip.trim())
    .filter(Boolean);

  // Check for exact match or subnet wildcard (e.g. 103.145.12.*)
  const isAllowed = allowedList.some(allowed => {
    if (allowed === '*' || allowed === clientIp) return true;
    if (allowed.endsWith('*') && clientIp.startsWith(allowed.slice(0, -1))) return true;
    return false;
  });

  if (isAllowed) {
    return next();
  }

  console.warn(`[IMS Studio Security] Blocked access attempt from unauthorized IP: ${clientIp} on path: ${req.path}`);

  // Return JSON for API requests
  if (req.path.startsWith('/api/') || req.headers.accept?.includes('application/json')) {
    return res.status(403).json({
      error: 'Access restricted: Your IP is not whitelisted for this studio portal.',
      clientIp
    });
  }

  // Return styled access denied page for browser visitors
  return res.status(403).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>403 - Access Restricted | IMS Studio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0B0F14;
      color: #E6EDF3;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #161B22;
      border: 1px solid #30363D;
      border-radius: 24px;
      padding: 38px 28px;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);
    }
    .badge-icon {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: rgba(229, 37, 42, 0.12);
      border: 1px solid rgba(229, 37, 42, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 26px;
    }
    h1 {
      color: #FFFFFF;
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .subtitle {
      color: #8B949E;
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .ip-box {
      background: #0D1117;
      border: 1px dashed #30363D;
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 24px;
    }
    .ip-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #8B949E;
      margin-bottom: 6px;
    }
    .ip-val {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 17px;
      font-weight: bold;
      color: #58A6FF;
      user-select: all;
    }
    .instructions {
      font-size: 12px;
      color: #8B949E;
      line-height: 1.6;
      border-top: 1px solid #21262D;
      padding-top: 20px;
    }
    .brand {
      margin-top: 22px;
      font-size: 11px;
      color: #484F58;
      font-weight: 600;
    }
    .brand span {
      color: #E5252A;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge-icon">🔒</div>
    <h1>Access Restricted</h1>
    <p class="subtitle">This studio management portal is protected and only accessible from authorized company IP networks.</p>
    <div class="ip-box">
      <div class="ip-label">Your Detected Public IP</div>
      <div class="ip-val">\${clientIp || 'Unknown IP'}</div>
    </div>
    <div class="instructions">
      If you are an authorized team member, please send the IP address above to your IMS Studio administrator to whitelist your connection.
    </div>
    <div class="brand">IMS <span>Studio</span> Security Gate</div>
  </div>
</body>
</html>
  `);
});

// Ensure data directory and DB file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// PostgreSQL Persistent Pool (Activated when DATABASE_URL environment variable is provided)
let pgPool = null;
if (process.env.DATABASE_URL) {
  try {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
    console.log('[IMS Studio] Persistent PostgreSQL configured via DATABASE_URL');
  } catch (err) {
    console.error('[IMS Studio] PostgreSQL init error:', err);
    pgPool = null;
  }
}

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure notifications array exists
      if (!parsed.notifications) parsed.notifications = [];
      // Ensure admin member exists
      if (!parsed.members || !parsed.members.find(m => m.roleType === 'admin')) {
        parsed.members = [initialData.members[0], ...(parsed.members || [])];
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading DB file, fallback to initial data:', err);
  }
  saveDatabase(initialData);
  return JSON.parse(JSON.stringify(initialData));
}

function saveDatabase(data) {
  data.lastModified = Date.now();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB file:', err);
  }

  // If cloud PostgreSQL is configured, persist state permanently to the cloud
  if (pgPool) {
    pgPool.query(
      `INSERT INTO studio_storage (key, payload, last_modified)
       VALUES ($1, $2, $3)
       ON CONFLICT (key) DO UPDATE SET payload = $2, last_modified = $3`,
      ['production_db', data, data.lastModified]
    ).catch(err => console.error('[IMS Studio] Cloud PostgreSQL write error:', err));
  }
}

let db = loadDatabase();

// Asynchronously initialize PostgreSQL storage table & load cloud data if available
async function initStorage() {
  if (!pgPool) return;
  try {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS studio_storage (
        key VARCHAR(64) PRIMARY KEY,
        payload JSONB NOT NULL,
        last_modified BIGINT NOT NULL
      );
    `);
    const res = await pgPool.query('SELECT payload, last_modified FROM studio_storage WHERE key = $1', ['production_db']);
    if (res.rows.length > 0 && res.rows[0].payload) {
      db = res.rows[0].payload;
      db.lastModified = Number(res.rows[0].last_modified);
      console.log('[IMS Studio] Successfully loaded persistent state from Cloud PostgreSQL database');
    }
  } catch (err) {
    console.error('[IMS Studio] PostgreSQL initStorage error:', err);
  }
}
initStorage();

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    studio: 'IMS Studio',
    version: '1.0.0',
    totalProjects: db.projects.length,
    totalBriefs: db.briefs.length,
    totalMembers: db.members.length,
    totalNotifications: (db.notifications || []).length
  });
});

// --- Authentication & User Credentials ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const member = db.members.find(
    m => m.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!member) {
    return res.status(401).json({ error: 'No user account found with this email address' });
  }

  // Verify password (default 'ims2026' if not explicitly set)
  const currentPass = member.password || 'ims2026';
  if (currentPass !== password) {
    return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
  }

  // Return authenticated profile (strip sensitive internal info if needed, but include permissions)
  const { password: _, ...userProfile } = member;
  res.json({
    success: true,
    user: {
      ...userProfile,
      isAdmin: member.roleType === 'admin',
      isManager: member.roleType === 'admin' || member.roleType === 'manager'
    }
  });
});

app.post('/api/auth/change-password', (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'User ID, current password, and new password are required' });
  }

  const member = db.members.find(m => m.id === userId);
  if (!member) {
    return res.status(404).json({ error: 'User not found' });
  }

  const existingPass = member.password || 'ims2026';
  if (existingPass !== currentPassword) {
    return res.status(400).json({ error: 'Current password does not match' });
  }

  if (newPassword.length < 4) {
    return res.status(400).json({ error: 'New password must be at least 4 characters long' });
  }

  member.password = newPassword;
  member.passwordUpdatedAt = new Date().toISOString();
  saveDatabase(db);

  res.json({ success: true, message: 'Password changed successfully' });
});

app.post('/api/auth/admin-reset-password', (req, res) => {
  const { adminId, targetUserId, newPassword } = req.body;
  const admin = db.members.find(m => m.id === adminId && m.roleType === 'admin');
  if (!admin) {
    return res.status(403).json({ error: 'Only administrators can perform password resets' });
  }

  const target = db.members.find(m => m.id === targetUserId);
  if (!target) {
    return res.status(404).json({ error: 'Target user not found' });
  }

  target.password = newPassword || 'ims2026';
  target.passwordUpdatedAt = new Date().toISOString();
  saveDatabase(db);

  res.json({ success: true, message: `Password for ${target.name} has been reset to: ${target.password}` });
});

// --- Notifications System ---
app.get('/api/notifications', (req, res) => {
  const { recipientId } = req.query;
  const list = db.notifications || [];
  if (recipientId) {
    const userNotifs = list.filter(n => n.recipientId === recipientId);
    return res.json(userNotifs);
  }
  res.json(list);
});

app.post('/api/notifications', (req, res) => {
  const newNotif = {
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isRead: false,
    ...req.body
  };
  db.notifications = db.notifications || [];
  db.notifications.unshift(newNotif);
  saveDatabase(db);
  res.status(201).json(newNotif);
});

app.put('/api/notifications/:id/read', (req, res) => {
  db.notifications = db.notifications || [];
  const notif = db.notifications.find(n => n.id === req.params.id);
  if (notif) {
    notif.isRead = true;
    saveDatabase(db);
  }
  res.json({ success: true });
});

app.put('/api/notifications/read-all', (req, res) => {
  const { recipientId } = req.body;
  db.notifications = db.notifications || [];
  if (recipientId) {
    db.notifications.forEach(n => {
      if (n.recipientId === recipientId) n.isRead = true;
    });
    saveDatabase(db);
  }
  res.json({ success: true });
});

app.delete('/api/notifications/clear', (req, res) => {
  const { recipientId } = req.query;
  db.notifications = db.notifications || [];
  if (recipientId) {
    db.notifications = db.notifications.filter(n => !(n.recipientId === recipientId && n.isRead));
    saveDatabase(db);
  }
  res.json({ success: true });
});

// --- Full Database Ingestion / Sync ---
app.get('/api/data', (req, res) => {
  res.json(db);
});

app.post('/api/data/reset', (req, res) => {
  db = JSON.parse(JSON.stringify(initialData));
  saveDatabase(db);
  res.json({ success: true, message: 'Database reset to initial studio seed data', db });
});

app.post('/api/data/import', (req, res) => {
  const incoming = req.body;
  if (!incoming || !incoming.departments || !incoming.projects) {
    return res.status(400).json({ error: 'Invalid database payload format' });
  }
  db = incoming;
  if (!db.notifications) db.notifications = [];
  saveDatabase(db);
  res.json({ success: true, message: 'Database imported successfully', db });
});

app.post('/api/data/clear-sample-members', (req, res) => {
  db.members = db.members.filter(m => m.roleType === 'admin' || !/^mem-\d{1,2}$/.test(m.id));
  db.isSampleCleared = true;
  saveDatabase(db);
  res.json({ success: true, message: 'Sample demo team members removed successfully', db });
});

app.post('/api/data/clear-sample-work', (req, res) => {
  db.briefs = [];
  db.projects = [];
  db.tasks = [];
  db.timelogs = [];
  db.notifications = [];
  db.isSampleWorkCleared = true;
  saveDatabase(db);
  res.json({ success: true, message: 'All sample projects, briefs, tasks, and timelogs cleared. Team members preserved!', db });
});

app.post('/api/data/clear-all-sample-data', (req, res) => {
  db.briefs = [];
  db.projects = [];
  db.tasks = [];
  db.timelogs = [];
  db.notifications = [];
  db.members = db.members.filter(m => m.roleType === 'admin' || !/^mem-\d{1,2}$/.test(m.id));
  db.isSampleCleared = true;
  db.isProductionClean = true;
  saveDatabase(db);
  res.json({ success: true, message: 'All sample demo data cleared! Production workspace ready.', db });
});

app.get('/api/data/export', (req, res) => {
  res.setHeader('Content-disposition', `attachment; filename=ims_studio_backup_${new Date().toISOString().slice(0, 10)}.json`);
  res.setHeader('Content-type', 'application/json');
  res.send(JSON.stringify(db, null, 2));
});

// --- Business Development Briefs ---
app.post('/api/briefs', (req, res) => {
  const newBrief = {
    id: `brief-${Date.now()}`,
    createdAt: new Date().toISOString(),
    convertedProjectId: null,
    outcomeStatus: req.body.outcomeStatus || 'Pitch Under Review',
    briefStatus: req.body.briefStatus || 'Received',
    ...req.body
  };
  db.briefs.unshift(newBrief);
  saveDatabase(db);
  res.status(201).json(newBrief);
});

app.put('/api/briefs/:id', (req, res) => {
  const idx = db.briefs.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Brief not found' });
  db.briefs[idx] = { ...db.briefs[idx], ...req.body, updatedAt: new Date().toISOString() };
  saveDatabase(db);
  res.json(db.briefs[idx]);
});

app.delete('/api/briefs/:id', (req, res) => {
  db.briefs = db.briefs.filter(b => b.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Handover BD Brief to Studio -> Creates active Project
app.post('/api/briefs/:id/handover', (req, res) => {
  const brief = db.briefs.find(b => b.id === req.params.id);
  if (!brief) return res.status(404).json({ error: 'Brief not found' });

  const projectCount = db.projects.length + 1;
  const projectCode = `IMS-${new Date().getFullYear()}-${String(projectCount).padStart(3, '0')}`;
  
  const newProject = {
    id: `proj-${Date.now()}`,
    code: projectCode,
    title: req.body.title || brief.projectTitle,
    client: brief.clientName,
    briefId: brief.id,
    department: req.body.department || brief.targetDepartment || 'Hybrid 2D+3D',
    status: 'Ongoing',
    priority: req.body.priority || 'High',
    venue: req.body.venue || 'TBD Event Venue',
    eventDate: req.body.eventDate || brief.eventDate || new Date().toISOString().slice(0, 10),
    loadInDate: req.body.loadInDate || new Date().toISOString().slice(0, 10),
    screenSpecs: req.body.screenSpecs || 'Custom Experiential Canvas / LED',
    frameRate: req.body.frameRate || '60 fps',
    mediaServerFormat: req.body.mediaServerFormat || 'ProRes 4444',
    budgetHours: Number(req.body.budgetHours) || 80,
    budgetAmountBDT: Number(req.body.budgetAmountBDT) || 250000,
    loggedHours: 0,
    leadVisualizerId: req.body.leadVisualizerId || '',
    assignedMemberIds: req.body.assignedMemberIds || [],
    description: req.body.description || brief.notes || '',
    month: new Date().toISOString().slice(0, 7)
  };

  db.projects.unshift(newProject);

  // Update brief status to Won / Handed to Studio
  brief.outcomeStatus = 'Won / Handed to Studio';
  brief.briefStatus = 'Confirmed';
  brief.convertedProjectId = newProject.id;
  brief.handoverDate = new Date().toISOString();

  // If lead visualizer is assigned, send notification
  if (newProject.leadVisualizerId) {
    db.notifications = db.notifications || [];
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: newProject.leadVisualizerId,
      senderName: req.body.senderName || 'Studio Director (Admin)',
      type: 'PROJECT_ASSIGNED',
      title: `Assigned as Lead: ${newProject.title}`,
      message: `You have been assigned as Lead Visualizer for project '${newProject.title}' (${newProject.code}). Canvas: ${newProject.screenSpecs}.`,
      entityType: 'project',
      entityId: newProject.id,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  saveDatabase(db);
  res.json({ success: true, project: newProject, brief });
});

// --- Projects ---
app.post('/api/projects', (req, res) => {
  const count = db.projects.length + 1;
  const newProject = {
    id: `proj-${Date.now()}`,
    code: req.body.code || `IMS-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`,
    status: req.body.status || 'Ongoing',
    loggedHours: 0,
    month: req.body.month || new Date().toISOString().slice(0, 7),
    assignedMemberIds: req.body.assignedMemberIds || [],
    ...req.body
  };
  db.projects.unshift(newProject);

  // Notify assigned lead visualizer if present
  if (newProject.leadVisualizerId) {
    db.notifications = db.notifications || [];
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: newProject.leadVisualizerId,
      senderName: req.body.senderName || 'Studio Director (Admin)',
      type: 'PROJECT_ASSIGNED',
      title: `Assigned to Project: ${newProject.title}`,
      message: `You were assigned as Lead Visualizer for '${newProject.title}' (${newProject.code}).`,
      entityType: 'project',
      entityId: newProject.id,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  saveDatabase(db);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const idx = db.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  db.projects[idx] = { ...db.projects[idx], ...req.body };
  saveDatabase(db);
  res.json(db.projects[idx]);
});

app.delete('/api/projects/:id', (req, res) => {
  db.projects = db.projects.filter(p => p.id !== req.params.id);
  db.tasks = db.tasks.filter(t => t.projectId !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// --- Tasks ---
app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: `task-${Date.now()}`,
    loggedHours: 0,
    revisionCount: 0,
    status: req.body.status || 'Pending',
    priority: req.body.priority || 'Medium',
    createdAt: new Date().toISOString(),
    ...req.body
  };
  db.tasks.unshift(newTask);

  // Auto-dispatch Notification to the assigned visualizer!
  if (newTask.assigneeId) {
    db.notifications = db.notifications || [];
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: newTask.assigneeId,
      senderName: req.body.senderName || 'Studio Admin',
      type: 'TASK_ASSIGNED',
      title: `New Task Assigned: ${newTask.title}`,
      message: `You have been assigned to '${newTask.title}' in project '${newTask.projectTitle || 'Studio Project'}'. Deliverable: ${newTask.deliverableSpec || 'Experiential Master'}. Priority: ${newTask.priority}.`,
      entityType: 'task',
      entityId: newTask.id,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  saveDatabase(db);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const idx = db.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  
  const prevTask = db.tasks[idx];
  db.tasks[idx] = { ...db.tasks[idx], ...req.body };
  const updatedTask = db.tasks[idx];

  // If newly assigned or reassigned to another artist, notify them!
  if (req.body.assigneeId && req.body.assigneeId !== prevTask.assigneeId) {
    db.notifications = db.notifications || [];
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: req.body.assigneeId,
      senderName: req.body.senderName || 'Studio Admin',
      type: 'TASK_ASSIGNED',
      title: `Task Assigned: ${updatedTask.title}`,
      message: `You have been assigned to task '${updatedTask.title}'. Priority: ${updatedTask.priority}.`,
      entityType: 'task',
      entityId: updatedTask.id,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  // If revision status set, notify assignee
  if (req.body.status === 'Revision' && prevTask.status !== 'Revision' && updatedTask.assigneeId) {
    db.notifications = db.notifications || [];
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: updatedTask.assigneeId,
      senderName: req.body.senderName || 'Studio Admin',
      type: 'REVISION_REQUESTED',
      title: `Revision Requested: ${updatedTask.title}`,
      message: `Client revision requested (Rev ${updatedTask.revisionCount || 1}): ${updatedTask.revisionNotes || 'Please check feedback notes.'}`,
      entityType: 'task',
      entityId: updatedTask.id,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  saveDatabase(db);
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  db.tasks = db.tasks.filter(t => t.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// --- Time Logs ---
app.post('/api/timelogs', (req, res) => {
  const hours = parseFloat(req.body.hours) || 0;
  const member = db.members.find(m => m.id === req.body.memberId);
  const hourlyRateBDT = Number(req.body.hourlyRateBDT) || member?.hourlyRateBDT || 1500;
  const monetaryValueBDT = Math.round(hours * hourlyRateBDT);

  const newLog = {
    id: `time-${Date.now()}`,
    timestamp: new Date().toISOString(),
    date: req.body.date || new Date().toISOString().slice(0, 10),
    hours,
    hourlyRateBDT,
    monetaryValueBDT,
    ...req.body
  };
  db.timelogs.unshift(newLog);

  // Update logged hours on task & project
  if (req.body.taskId) {
    const task = db.tasks.find(t => t.id === req.body.taskId);
    if (task) {
      task.loggedHours = (task.loggedHours || 0) + hours;
    }
  }
  if (req.body.projectId) {
    const project = db.projects.find(p => p.id === req.body.projectId);
    if (project) {
      project.loggedHours = (project.loggedHours || 0) + hours;
    }
  }

  saveDatabase(db);
  res.status(201).json(newLog);
});

app.delete('/api/timelogs/:id', (req, res) => {
  const log = db.timelogs.find(l => l.id === req.params.id);
  if (log) {
    const hours = log.hours || 0;
    if (log.taskId) {
      const task = db.tasks.find(t => t.id === log.taskId);
      if (task) task.loggedHours = Math.max(0, (task.loggedHours || 0) - hours);
    }
    if (log.projectId) {
      const project = db.projects.find(p => p.id === log.projectId);
      if (project) project.loggedHours = Math.max(0, (project.loggedHours || 0) - hours);
    }
  }
  db.timelogs = db.timelogs.filter(l => l.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// --- Departments & Roles (Dynamic Structure) ---
app.post('/api/departments', (req, res) => {
  const newDept = {
    id: `dept-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...req.body
  };
  db.departments.push(newDept);
  saveDatabase(db);
  res.status(201).json(newDept);
});

app.put('/api/departments/:id', (req, res) => {
  const idx = db.departments.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Department not found' });
  db.departments[idx] = { ...db.departments[idx], ...req.body };
  saveDatabase(db);
  res.json(db.departments[idx]);
});

app.delete('/api/departments/:id', (req, res) => {
  db.departments = db.departments.filter(d => d.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

app.post('/api/roles', (req, res) => {
  const newRole = {
    id: `role-${Date.now()}`,
    ...req.body
  };
  db.roles.push(newRole);
  saveDatabase(db);
  res.status(201).json(newRole);
});

app.put('/api/roles/:id', (req, res) => {
  const idx = db.roles.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Role not found' });
  db.roles[idx] = { ...db.roles[idx], ...req.body };
  saveDatabase(db);
  res.json(db.roles[idx]);
});

app.delete('/api/roles/:id', (req, res) => {
  db.roles = db.roles.filter(r => r.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// --- Team Members ---
app.post('/api/members', (req, res) => {
  const newMember = {
    id: `mem-${Date.now()}`,
    status: 'Active',
    weeklyCapacityHours: 40,
    password: req.body.password || 'ims2026',
    roleType: req.body.roleType || 'visualizer',
    ...req.body
  };
  db.members.push(newMember);
  saveDatabase(db);
  res.status(201).json(newMember);
});

app.put('/api/members/:id', (req, res) => {
  const idx = db.members.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Member not found' });
  db.members[idx] = { ...db.members[idx], ...req.body };
  saveDatabase(db);
  res.json(db.members[idx]);
});

app.delete('/api/members/:id', (req, res) => {
  db.members = db.members.filter(m => m.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Serve static client build if present
const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).send('<html><body><h1>IMS Studio API Server is running</h1><p>Client assets compiling or ready. Please visit /api/health for system status.</p></body></html>');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[IMS Studio Server] running on http://0.0.0.0:${PORT} (accessible from multi-location web / local network)`);
});
