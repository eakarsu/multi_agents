const db = require('./database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

function seed() {
  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (existingUsers.count > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database...');

  const hash = bcrypt.hashSync('Password1!', 10);

  // ============ USERS (20) ============
  const users = [
    { id: uuidv4(), email: 'admin@craftagent.com', password_hash: hash, first_name: 'Sarah', last_name: 'Johnson', role: 'admin', phone: '+1-555-0101', department: 'Engineering', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'manager@craftagent.com', password_hash: hash, first_name: 'Michael', last_name: 'Chen', role: 'manager', phone: '+1-555-0102', department: 'Product', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'user@craftagent.com', password_hash: hash, first_name: 'Emily', last_name: 'Davis', role: 'user', phone: '+1-555-0103', department: 'Marketing', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'viewer@craftagent.com', password_hash: hash, first_name: 'James', last_name: 'Wilson', role: 'viewer', phone: '+1-555-0104', department: 'Sales', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'alice@craftagent.com', password_hash: hash, first_name: 'Alice', last_name: 'Martinez', role: 'user', phone: '+1-555-0105', department: 'Support', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'bob@craftagent.com', password_hash: hash, first_name: 'Bob', last_name: 'Taylor', role: 'user', phone: '+1-555-0106', department: 'Engineering', status: 'active', is_email_verified: 0 },
    { id: uuidv4(), email: 'carol@craftagent.com', password_hash: hash, first_name: 'Carol', last_name: 'Anderson', role: 'manager', phone: '+1-555-0107', department: 'HR', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'david@craftagent.com', password_hash: hash, first_name: 'David', last_name: 'Thomas', role: 'user', phone: '+1-555-0108', department: 'Finance', status: 'inactive', is_email_verified: 1 },
    { id: uuidv4(), email: 'eve@craftagent.com', password_hash: hash, first_name: 'Eve', last_name: 'Jackson', role: 'user', phone: '+1-555-0109', department: 'Operations', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'frank@craftagent.com', password_hash: hash, first_name: 'Frank', last_name: 'White', role: 'viewer', phone: '+1-555-0110', department: 'Legal', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'grace@craftagent.com', password_hash: hash, first_name: 'Grace', last_name: 'Harris', role: 'user', phone: '+1-555-0111', department: 'Marketing', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'henry@craftagent.com', password_hash: hash, first_name: 'Henry', last_name: 'Clark', role: 'user', phone: '+1-555-0112', department: 'Engineering', status: 'suspended', is_email_verified: 1 },
    { id: uuidv4(), email: 'iris@craftagent.com', password_hash: hash, first_name: 'Iris', last_name: 'Lewis', role: 'manager', phone: '+1-555-0113', department: 'Product', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'jack@craftagent.com', password_hash: hash, first_name: 'Jack', last_name: 'Robinson', role: 'user', phone: '+1-555-0114', department: 'Sales', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'kate@craftagent.com', password_hash: hash, first_name: 'Kate', last_name: 'Walker', role: 'user', phone: '+1-555-0115', department: 'Support', status: 'active', is_email_verified: 0 },
    { id: uuidv4(), email: 'liam@craftagent.com', password_hash: hash, first_name: 'Liam', last_name: 'Young', role: 'viewer', phone: '+1-555-0116', department: 'Finance', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'mia@craftagent.com', password_hash: hash, first_name: 'Mia', last_name: 'King', role: 'user', phone: '+1-555-0117', department: 'HR', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'noah@craftagent.com', password_hash: hash, first_name: 'Noah', last_name: 'Wright', role: 'user', phone: '+1-555-0118', department: 'Operations', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'olivia@craftagent.com', password_hash: hash, first_name: 'Olivia', last_name: 'Lopez', role: 'manager', phone: '+1-555-0119', department: 'Engineering', status: 'active', is_email_verified: 1 },
    { id: uuidv4(), email: 'peter@craftagent.com', password_hash: hash, first_name: 'Peter', last_name: 'Hill', role: 'user', phone: '+1-555-0120', department: 'Marketing', status: 'active', is_email_verified: 1 },
  ];

  const insertUser = db.prepare(`INSERT INTO users (id, email, password_hash, first_name, last_name, role, phone, department, status, is_email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertManyUsers = db.transaction((items) => {
    for (const u of items) {
      insertUser.run(u.id, u.email, u.password_hash, u.first_name, u.last_name, u.role, u.phone, u.department, u.status, u.is_email_verified);
    }
  });
  insertManyUsers(users);

  // ============ AGENTS (18) ============
  const agents = [
    { id: uuidv4(), name: 'Communication Agent', type: 'craft', category: 'CRAFT Framework', description: 'Handles all customer communications including emails, chats, and ticket responses with natural language processing.', status: 'active', provider: 'anthropic', total_conversations: 1250, success_rate: 94.5, avg_response_time: 1.2, created_by: users[0].id },
    { id: uuidv4(), name: 'Research Agent', type: 'craft', category: 'CRAFT Framework', description: 'Conducts market research, competitive analysis, and trend identification using AI-powered data gathering.', status: 'active', provider: 'anthropic', total_conversations: 890, success_rate: 91.2, avg_response_time: 2.5, created_by: users[0].id },
    { id: uuidv4(), name: 'Analytics Agent', type: 'craft', category: 'CRAFT Framework', description: 'Processes and analyzes business data, generates insights, and creates visual reports automatically.', status: 'active', provider: 'anthropic', total_conversations: 1100, success_rate: 96.8, avg_response_time: 1.8, created_by: users[0].id },
    { id: uuidv4(), name: 'Functional Agent', type: 'craft', category: 'CRAFT Framework', description: 'Automates repetitive business processes including data entry, form processing, and workflow automation.', status: 'active', provider: 'anthropic', total_conversations: 2300, success_rate: 98.1, avg_response_time: 0.8, created_by: users[0].id },
    { id: uuidv4(), name: 'Technical Agent', type: 'craft', category: 'CRAFT Framework', description: 'Provides technical support, code review, debugging assistance, and system monitoring capabilities.', status: 'active', provider: 'anthropic', total_conversations: 760, success_rate: 89.3, avg_response_time: 3.1, created_by: users[0].id },
    { id: uuidv4(), name: 'Healthcare Assistant', type: 'industry', category: 'Healthcare', description: 'Assists with patient intake, appointment scheduling, and medical record summarization for healthcare providers.', status: 'active', provider: 'anthropic', total_conversations: 450, success_rate: 92.0, avg_response_time: 1.5, created_by: users[1].id },
    { id: uuidv4(), name: 'Financial Advisor Bot', type: 'industry', category: 'Finance', description: 'Provides financial planning suggestions, portfolio analysis, and market trend summaries for clients.', status: 'active', provider: 'openai', total_conversations: 320, success_rate: 87.5, avg_response_time: 2.0, created_by: users[1].id },
    { id: uuidv4(), name: 'Retail Sales Agent', type: 'industry', category: 'Retail', description: 'Assists customers with product recommendations, order tracking, and returns processing in retail environments.', status: 'active', provider: 'anthropic', total_conversations: 1800, success_rate: 95.2, avg_response_time: 0.9, created_by: users[1].id },
    { id: uuidv4(), name: 'HR Onboarding Agent', type: 'department', category: 'Human Resources', description: 'Guides new employees through onboarding processes, policy questions, and benefits enrollment.', status: 'active', provider: 'anthropic', total_conversations: 280, success_rate: 93.7, avg_response_time: 1.3, created_by: users[6].id },
    { id: uuidv4(), name: 'Marketing Content Creator', type: 'department', category: 'Marketing', description: 'Generates marketing copy, social media posts, email campaigns, and blog articles automatically.', status: 'active', provider: 'anthropic', total_conversations: 670, success_rate: 88.9, avg_response_time: 2.8, created_by: users[2].id },
    { id: uuidv4(), name: 'Legal Document Reviewer', type: 'department', category: 'Legal', description: 'Reviews contracts, NDAs, and legal documents for compliance issues and key clause extraction.', status: 'training', provider: 'anthropic', total_conversations: 150, success_rate: 85.0, avg_response_time: 4.5, created_by: users[0].id },
    { id: uuidv4(), name: 'DevOps Monitor', type: 'custom', category: 'Technology', description: 'Monitors server health, deployment pipelines, and alerts on infrastructure issues in real-time.', status: 'active', provider: 'anthropic', total_conversations: 3400, success_rate: 99.1, avg_response_time: 0.3, created_by: users[0].id },
    { id: uuidv4(), name: 'Sales Lead Scorer', type: 'custom', category: 'Sales', description: 'Analyzes incoming leads, scores them based on engagement and fit, and routes to appropriate sales reps.', status: 'active', provider: 'openai', total_conversations: 540, success_rate: 90.4, avg_response_time: 1.1, created_by: users[3].id },
    { id: uuidv4(), name: 'Customer Feedback Analyzer', type: 'custom', category: 'Support', description: 'Collects, categorizes, and analyzes customer feedback from multiple channels to identify trends.', status: 'active', provider: 'anthropic', total_conversations: 920, success_rate: 93.2, avg_response_time: 1.7, created_by: users[4].id },
    { id: uuidv4(), name: 'Supply Chain Optimizer', type: 'industry', category: 'Manufacturing', description: 'Optimizes supply chain logistics, predicts demand fluctuations, and manages inventory levels.', status: 'inactive', provider: 'anthropic', total_conversations: 200, success_rate: 86.5, avg_response_time: 3.5, created_by: users[1].id },
    { id: uuidv4(), name: 'Education Tutor', type: 'industry', category: 'Education', description: 'Provides personalized tutoring, generates quizzes, and adapts learning content based on student progress.', status: 'active', provider: 'anthropic', total_conversations: 1500, success_rate: 91.8, avg_response_time: 1.4, created_by: users[12].id },
    { id: uuidv4(), name: 'Invoice Processor', type: 'department', category: 'Finance', description: 'Automatically extracts data from invoices, matches with POs, and routes for approval processing.', status: 'active', provider: 'anthropic', total_conversations: 4200, success_rate: 97.5, avg_response_time: 0.6, created_by: users[7].id },
    { id: uuidv4(), name: 'Recruitment Screener', type: 'department', category: 'Human Resources', description: 'Screens resumes, schedules interviews, and conducts initial candidate assessments via chat.', status: 'active', provider: 'openai', total_conversations: 380, success_rate: 88.0, avg_response_time: 2.2, created_by: users[6].id },
  ];

  const insertAgent = db.prepare(`INSERT INTO agents (id, name, type, category, description, status, provider, total_conversations, success_rate, avg_response_time, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertManyAgents = db.transaction((items) => {
    for (const a of items) {
      insertAgent.run(a.id, a.name, a.type, a.category, a.description, a.status, a.provider, a.total_conversations, a.success_rate, a.avg_response_time, a.created_by);
    }
  });
  insertManyAgents(agents);

  // ============ TASKS (20) ============
  const tasks = [
    { id: uuidv4(), title: 'Set up customer support chatbot', description: 'Configure and deploy the customer support chatbot on the main website with FAQ integration.', agent_id: agents[0].id, assigned_to: users[4].id, status: 'completed', priority: 'high', due_date: '2026-02-15', completed_at: '2026-02-14', tags: '["chatbot","support","deployment"]', created_by: users[0].id },
    { id: uuidv4(), title: 'Create Q1 marketing content plan', description: 'Develop comprehensive content calendar for Q1 including blog posts, social media, and email campaigns.', agent_id: agents[9].id, assigned_to: users[2].id, status: 'in_progress', priority: 'high', due_date: '2026-03-01', tags: '["marketing","content","planning"]', created_by: users[1].id },
    { id: uuidv4(), title: 'Analyze customer churn data', description: 'Run comprehensive analysis on customer churn patterns from the last 6 months and identify key factors.', agent_id: agents[2].id, assigned_to: users[8].id, status: 'pending', priority: 'critical', due_date: '2026-02-28', tags: '["analytics","churn","data"]', created_by: users[1].id },
    { id: uuidv4(), title: 'Review NDA templates', description: 'Review and update all NDA templates for compliance with new data protection regulations.', agent_id: agents[10].id, assigned_to: users[9].id, status: 'pending', priority: 'medium', due_date: '2026-03-15', tags: '["legal","compliance","review"]', created_by: users[0].id },
    { id: uuidv4(), title: 'Optimize API response times', description: 'Profile and optimize all agent API endpoints to reduce average response time by 30%.', agent_id: agents[4].id, assigned_to: users[5].id, status: 'in_progress', priority: 'high', due_date: '2026-02-20', tags: '["performance","api","optimization"]', created_by: users[0].id },
    { id: uuidv4(), title: 'Train healthcare agent on new protocols', description: 'Update the healthcare assistant agent with the latest medical protocols and guidelines for 2026.', agent_id: agents[5].id, assigned_to: users[1].id, status: 'pending', priority: 'high', due_date: '2026-03-10', tags: '["healthcare","training","update"]', created_by: users[1].id },
    { id: uuidv4(), title: 'Generate monthly performance report', description: 'Create automated monthly performance reports for all active agents including KPIs and trends.', agent_id: agents[2].id, assigned_to: users[8].id, status: 'completed', priority: 'medium', due_date: '2026-02-05', completed_at: '2026-02-04', tags: '["reporting","performance","monthly"]', created_by: users[1].id },
    { id: uuidv4(), title: 'Integrate Salesforce CRM', description: 'Set up bidirectional data sync between CraftAgent Pro and Salesforce CRM for lead management.', agent_id: agents[12].id, assigned_to: users[13].id, status: 'in_progress', priority: 'critical', due_date: '2026-02-25', tags: '["integration","crm","salesforce"]', created_by: users[0].id },
    { id: uuidv4(), title: 'Onboard 50 new employees', description: 'Process onboarding for the new batch of 50 employees joining in March across all departments.', agent_id: agents[8].id, assigned_to: users[6].id, status: 'pending', priority: 'high', due_date: '2026-03-01', tags: '["hr","onboarding","batch"]', created_by: users[6].id },
    { id: uuidv4(), title: 'Set up monitoring dashboards', description: 'Create real-time monitoring dashboards for all production agents with alerting capabilities.', agent_id: agents[11].id, assigned_to: users[0].id, status: 'completed', priority: 'high', due_date: '2026-01-31', completed_at: '2026-01-30', tags: '["devops","monitoring","dashboard"]', created_by: users[0].id },
    { id: uuidv4(), title: 'Process Q4 invoices', description: 'Batch process all remaining Q4 invoices and reconcile with purchase orders.', agent_id: agents[16].id, assigned_to: users[7].id, status: 'completed', priority: 'critical', due_date: '2026-01-15', completed_at: '2026-01-14', tags: '["finance","invoices","processing"]', created_by: users[7].id },
    { id: uuidv4(), title: 'Update product recommendation engine', description: 'Retrain the retail sales agent recommendation model with latest product catalog and purchase data.', agent_id: agents[7].id, assigned_to: users[1].id, status: 'pending', priority: 'medium', due_date: '2026-03-20', tags: '["retail","ml","recommendations"]', created_by: users[1].id },
    { id: uuidv4(), title: 'Conduct security audit', description: 'Perform comprehensive security audit of all agent endpoints and data handling procedures.', agent_id: agents[4].id, assigned_to: users[0].id, status: 'pending', priority: 'critical', due_date: '2026-03-05', tags: '["security","audit","compliance"]', created_by: users[0].id },
    { id: uuidv4(), title: 'Design email campaign templates', description: 'Create 10 new responsive email campaign templates for the marketing content creator agent.', agent_id: agents[9].id, assigned_to: users[10].id, status: 'in_progress', priority: 'medium', due_date: '2026-02-28', tags: '["marketing","email","design"]', created_by: users[2].id },
    { id: uuidv4(), title: 'Screen engineering candidates', description: 'Screen 200+ engineering applicants for the senior developer positions and shortlist top 20.', agent_id: agents[17].id, assigned_to: users[6].id, status: 'in_progress', priority: 'high', due_date: '2026-02-22', tags: '["hr","recruitment","screening"]', created_by: users[6].id },
    { id: uuidv4(), title: 'Optimize supply chain routes', description: 'Analyze and optimize delivery routes for Q2 to reduce shipping costs by 15%.', agent_id: agents[14].id, assigned_to: users[17].id, status: 'pending', priority: 'medium', due_date: '2026-03-30', tags: '["logistics","optimization","cost"]', created_by: users[1].id },
    { id: uuidv4(), title: 'Create student progress reports', description: 'Generate personalized progress reports for 500 students in the online learning program.', agent_id: agents[15].id, assigned_to: users[12].id, status: 'pending', priority: 'low', due_date: '2026-03-15', tags: '["education","reports","students"]', created_by: users[12].id },
    { id: uuidv4(), title: 'Analyze customer feedback trends', description: 'Process 10,000 customer feedback entries from January and identify top 5 improvement areas.', agent_id: agents[13].id, assigned_to: users[4].id, status: 'completed', priority: 'high', due_date: '2026-02-10', completed_at: '2026-02-09', tags: '["feedback","analysis","trends"]', created_by: users[4].id },
    { id: uuidv4(), title: 'Update financial compliance rules', description: 'Update the financial advisor bot with new SEC regulations and compliance requirements for 2026.', agent_id: agents[6].id, assigned_to: users[1].id, status: 'pending', priority: 'high', due_date: '2026-02-28', tags: '["finance","compliance","regulations"]', created_by: users[1].id },
    { id: uuidv4(), title: 'Build agent performance benchmarks', description: 'Create standardized benchmarks for measuring agent performance across all categories and types.', agent_id: agents[2].id, assigned_to: users[0].id, status: 'in_progress', priority: 'medium', due_date: '2026-03-10', tags: '["benchmarks","performance","testing"]', created_by: users[0].id },
  ];

  const insertTask = db.prepare(`INSERT INTO tasks (id, title, description, agent_id, assigned_to, status, priority, due_date, completed_at, tags, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertManyTasks = db.transaction((items) => {
    for (const t of items) {
      insertTask.run(t.id, t.title, t.description, t.agent_id, t.assigned_to, t.status, t.priority, t.due_date, t.completed_at || null, t.tags, t.created_by);
    }
  });
  insertManyTasks(tasks);

  // ============ TEMPLATES (18) ============
  const templates = [
    { id: uuidv4(), name: 'Customer Support Pro', description: 'Enterprise-grade customer support template with sentiment analysis and escalation workflows.', category: 'Support', agent_type: 'craft', system_prompt: 'You are a professional customer support agent...', sample_tasks: '["Handle billing inquiry","Process refund request","Resolve technical issue"]', usage_count: 1540, rating: 4.8, is_public: 1, created_by: users[0].id },
    { id: uuidv4(), name: 'Content Writer', description: 'Versatile content creation template for blogs, articles, social media, and marketing copy.', category: 'Marketing', agent_type: 'craft', system_prompt: 'You are an expert content creator...', sample_tasks: '["Write blog post","Create social media content","Draft email campaign"]', usage_count: 2100, rating: 4.7, is_public: 1, created_by: users[2].id },
    { id: uuidv4(), name: 'Data Analyst', description: 'Advanced data analysis template with statistical modeling and visualization recommendations.', category: 'Analytics', agent_type: 'craft', system_prompt: 'You are a data analysis expert...', sample_tasks: '["Analyze sales trends","Create KPI dashboard","Generate forecast"]', usage_count: 890, rating: 4.6, is_public: 1, created_by: users[0].id },
    { id: uuidv4(), name: 'Code Reviewer', description: 'Automated code review template that checks for bugs, security issues, and best practices.', category: 'Engineering', agent_type: 'custom', system_prompt: 'You are a senior code reviewer...', sample_tasks: '["Review pull request","Check security vulnerabilities","Suggest optimizations"]', usage_count: 670, rating: 4.5, is_public: 1, created_by: users[0].id },
    { id: uuidv4(), name: 'Sales Outreach', description: 'Personalized sales outreach template with lead scoring and follow-up sequence generation.', category: 'Sales', agent_type: 'department', system_prompt: 'You are a sales development representative...', sample_tasks: '["Draft cold email","Qualify lead","Create follow-up sequence"]', usage_count: 1200, rating: 4.4, is_public: 1, created_by: users[3].id },
    { id: uuidv4(), name: 'HR Policy Assistant', description: 'Template for answering HR policy questions, benefits inquiries, and leave management.', category: 'Human Resources', agent_type: 'department', system_prompt: 'You are an HR policy assistant...', sample_tasks: '["Answer policy question","Process leave request","Explain benefits"]', usage_count: 430, rating: 4.3, is_public: 1, created_by: users[6].id },
    { id: uuidv4(), name: 'Medical Triage', description: 'Initial patient triage template that collects symptoms and recommends appropriate care levels.', category: 'Healthcare', agent_type: 'industry', system_prompt: 'You are a medical triage assistant...', sample_tasks: '["Assess symptoms","Recommend care level","Schedule appointment"]', usage_count: 780, rating: 4.9, is_public: 0, created_by: users[1].id },
    { id: uuidv4(), name: 'Financial Planner', description: 'Personal financial planning template with budgeting, investment, and retirement planning features.', category: 'Finance', agent_type: 'industry', system_prompt: 'You are a financial planning advisor...', sample_tasks: '["Create budget plan","Review investment portfolio","Plan retirement"]', usage_count: 560, rating: 4.6, is_public: 1, created_by: users[7].id },
    { id: uuidv4(), name: 'E-commerce Assistant', description: 'Shopping assistant template with product recommendations, comparison, and order management.', category: 'Retail', agent_type: 'industry', system_prompt: 'You are a shopping assistant...', sample_tasks: '["Recommend products","Compare items","Track order"]', usage_count: 3200, rating: 4.7, is_public: 1, created_by: users[1].id },
    { id: uuidv4(), name: 'Project Manager', description: 'Project management template for task tracking, resource allocation, and status reporting.', category: 'Operations', agent_type: 'department', system_prompt: 'You are a project management assistant...', sample_tasks: '["Create project plan","Assign tasks","Generate status report"]', usage_count: 950, rating: 4.5, is_public: 1, created_by: users[1].id },
    { id: uuidv4(), name: 'Legal Contract Analyzer', description: 'Contract analysis template that extracts key terms, identifies risks, and suggests modifications.', category: 'Legal', agent_type: 'department', system_prompt: 'You are a legal contract analyst...', sample_tasks: '["Extract key terms","Identify risks","Suggest modifications"]', usage_count: 340, rating: 4.4, is_public: 0, created_by: users[9].id },
    { id: uuidv4(), name: 'DevOps Automation', description: 'Infrastructure automation template for CI/CD pipeline management and deployment orchestration.', category: 'Engineering', agent_type: 'custom', system_prompt: 'You are a DevOps automation specialist...', sample_tasks: '["Set up CI/CD","Monitor deployments","Manage infrastructure"]', usage_count: 480, rating: 4.6, is_public: 1, created_by: users[0].id },
    { id: uuidv4(), name: 'Research Assistant', description: 'Academic and market research template with literature review and data collection capabilities.', category: 'Research', agent_type: 'craft', system_prompt: 'You are a research assistant...', sample_tasks: '["Literature review","Data collection","Summarize findings"]', usage_count: 720, rating: 4.5, is_public: 1, created_by: users[12].id },
    { id: uuidv4(), name: 'Quality Assurance Tester', description: 'Automated QA testing template that generates test cases, runs scenarios, and reports bugs.', category: 'Engineering', agent_type: 'custom', system_prompt: 'You are a QA testing specialist...', sample_tasks: '["Generate test cases","Run regression tests","Report bugs"]', usage_count: 290, rating: 4.3, is_public: 1, created_by: users[0].id },
    { id: uuidv4(), name: 'Social Media Manager', description: 'Social media management template for scheduling posts, analyzing engagement, and growing audience.', category: 'Marketing', agent_type: 'department', system_prompt: 'You are a social media manager...', sample_tasks: '["Schedule posts","Analyze engagement","Respond to comments"]', usage_count: 1800, rating: 4.7, is_public: 1, created_by: users[2].id },
    { id: uuidv4(), name: 'Inventory Manager', description: 'Inventory management template for stock tracking, reorder automation, and demand forecasting.', category: 'Operations', agent_type: 'department', system_prompt: 'You are an inventory management specialist...', sample_tasks: '["Track stock levels","Generate reorder alerts","Forecast demand"]', usage_count: 410, rating: 4.4, is_public: 1, created_by: users[17].id },
    { id: uuidv4(), name: 'Training Curriculum Designer', description: 'Training and course design template for creating learning paths, assessments, and certifications.', category: 'Education', agent_type: 'industry', system_prompt: 'You are an instructional design expert...', sample_tasks: '["Design curriculum","Create assessments","Build learning path"]', usage_count: 350, rating: 4.5, is_public: 1, created_by: users[12].id },
    { id: uuidv4(), name: 'Compliance Checker', description: 'Regulatory compliance template that monitors changes, checks adherence, and generates compliance reports.', category: 'Legal', agent_type: 'department', system_prompt: 'You are a compliance monitoring specialist...', sample_tasks: '["Monitor regulations","Check compliance","Generate audit report"]', usage_count: 260, rating: 4.2, is_public: 0, created_by: users[0].id },
  ];

  const insertTemplate = db.prepare(`INSERT INTO templates (id, name, description, category, agent_type, system_prompt, sample_tasks, usage_count, rating, is_public, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertManyTemplates = db.transaction((items) => {
    for (const t of items) {
      insertTemplate.run(t.id, t.name, t.description, t.category, t.agent_type, t.system_prompt, t.sample_tasks, t.usage_count, t.rating, t.is_public, t.created_by);
    }
  });
  insertManyTemplates(templates);

  // ============ CONVERSATIONS (18) ============
  const conversations = [
    { id: uuidv4(), title: 'Billing Issue Resolution', agent_id: agents[0].id, user_id: users[2].id, message_count: 12, status: 'archived', last_message: 'Thank you for resolving my billing issue so quickly!', satisfaction: 5, duration: 480 },
    { id: uuidv4(), title: 'Product Feature Inquiry', agent_id: agents[0].id, user_id: users[3].id, message_count: 8, status: 'archived', last_message: 'That answers all my questions about the premium features.', satisfaction: 4, duration: 320 },
    { id: uuidv4(), title: 'Market Research: AI Trends 2026', agent_id: agents[1].id, user_id: users[2].id, message_count: 15, status: 'active', last_message: 'Can you also look into the European market?', satisfaction: null, duration: 900 },
    { id: uuidv4(), title: 'Q4 Revenue Analysis', agent_id: agents[2].id, user_id: users[8].id, message_count: 6, status: 'archived', last_message: 'The revenue breakdown by segment is very helpful.', satisfaction: 5, duration: 240 },
    { id: uuidv4(), title: 'Blog Post: Future of AI Agents', agent_id: agents[9].id, user_id: users[10].id, message_count: 10, status: 'active', last_message: 'Let me refine the introduction paragraph.', satisfaction: null, duration: 600 },
    { id: uuidv4(), title: 'Technical Support: API Integration', agent_id: agents[4].id, user_id: users[5].id, message_count: 20, status: 'active', last_message: 'The webhook setup is still throwing errors.', satisfaction: null, duration: 1200 },
    { id: uuidv4(), title: 'Patient Intake Form Review', agent_id: agents[5].id, user_id: users[1].id, message_count: 5, status: 'archived', last_message: 'The new intake form looks great.', satisfaction: 4, duration: 200 },
    { id: uuidv4(), title: 'Investment Portfolio Review', agent_id: agents[6].id, user_id: users[7].id, message_count: 9, status: 'archived', last_message: 'I agree with the recommended rebalancing strategy.', satisfaction: 5, duration: 450 },
    { id: uuidv4(), title: 'Product Recommendation Chat', agent_id: agents[7].id, user_id: users[13].id, message_count: 7, status: 'archived', last_message: 'I will go with the premium package recommendation.', satisfaction: 4, duration: 300 },
    { id: uuidv4(), title: 'New Employee Onboarding: March Batch', agent_id: agents[8].id, user_id: users[6].id, message_count: 25, status: 'active', last_message: 'Please send the benefits enrollment links to the new batch.', satisfaction: null, duration: 1500 },
    { id: uuidv4(), title: 'Contract Review: Vendor Agreement', agent_id: agents[10].id, user_id: users[9].id, message_count: 11, status: 'active', last_message: 'Flagged 3 clauses that need legal review.', satisfaction: null, duration: 700 },
    { id: uuidv4(), title: 'Server Health Alert Investigation', agent_id: agents[11].id, user_id: users[0].id, message_count: 4, status: 'archived', last_message: 'Memory issue resolved after container restart.', satisfaction: 5, duration: 180 },
    { id: uuidv4(), title: 'Lead Qualification: Enterprise Prospects', agent_id: agents[12].id, user_id: users[13].id, message_count: 16, status: 'active', last_message: 'Scored 15 new enterprise leads, 4 marked as hot.', satisfaction: null, duration: 800 },
    { id: uuidv4(), title: 'January Feedback Analysis', agent_id: agents[13].id, user_id: users[4].id, message_count: 3, status: 'archived', last_message: 'Report generated with top 5 improvement areas.', satisfaction: 5, duration: 150 },
    { id: uuidv4(), title: 'Resume Screening: Senior Dev', agent_id: agents[17].id, user_id: users[6].id, message_count: 8, status: 'active', last_message: 'Shortlisted 12 candidates for the next round.', satisfaction: null, duration: 500 },
    { id: uuidv4(), title: 'Social Media Campaign: Product Launch', agent_id: agents[9].id, user_id: users[2].id, message_count: 14, status: 'active', last_message: 'Draft posts ready for review across all platforms.', satisfaction: null, duration: 850 },
    { id: uuidv4(), title: 'Invoice Batch Processing: February', agent_id: agents[16].id, user_id: users[7].id, message_count: 2, status: 'archived', last_message: 'All 347 invoices processed successfully.', satisfaction: 5, duration: 120 },
    { id: uuidv4(), title: 'Student Progress Reports: Semester 1', agent_id: agents[15].id, user_id: users[12].id, message_count: 6, status: 'active', last_message: 'Generated reports for 200 of 500 students so far.', satisfaction: null, duration: 400 },
  ];

  const insertConversation = db.prepare(`INSERT INTO conversations (id, title, agent_id, user_id, message_count, status, last_message, satisfaction, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertManyConversations = db.transaction((items) => {
    for (const c of items) {
      insertConversation.run(c.id, c.title, c.agent_id, c.user_id, c.message_count, c.status, c.last_message, c.satisfaction, c.duration);
    }
  });
  insertManyConversations(conversations);

  // ============ REPORTS (16) ============
  const reports = [
    { id: uuidv4(), title: 'Monthly Agent Performance Report - January 2026', description: 'Comprehensive performance metrics for all active agents including response times, success rates, and user satisfaction.', type: 'performance', status: 'published', agent_id: agents[2].id, data: '{"totalConversations":12500,"avgResponseTime":1.8,"overallSuccessRate":93.2}', generated_by: users[0].id },
    { id: uuidv4(), title: 'Q4 2025 Revenue Analytics', description: 'Quarterly revenue breakdown by product line, customer segment, and geographic region.', type: 'financial', status: 'published', agent_id: agents[2].id, data: '{"totalRevenue":2450000,"growth":18.5,"topSegment":"Enterprise"}', generated_by: users[7].id },
    { id: uuidv4(), title: 'Customer Satisfaction Survey Results', description: 'Analysis of customer satisfaction scores across all agent interactions for the past quarter.', type: 'analytics', status: 'published', agent_id: agents[13].id, data: '{"avgSatisfaction":4.3,"totalResponses":3200,"nps":72}', generated_by: users[4].id },
    { id: uuidv4(), title: 'Agent Usage Trends - February 2026', description: 'Tracking agent usage patterns, peak hours, and resource utilization across the platform.', type: 'usage', status: 'draft', agent_id: agents[2].id, data: '{"peakHour":"14:00","avgDailyUsers":450,"topAgent":"Communication Agent"}', generated_by: users[0].id },
    { id: uuidv4(), title: 'Infrastructure Cost Analysis', description: 'Breakdown of infrastructure costs per agent type including compute, storage, and API call expenses.', type: 'financial', status: 'published', agent_id: agents[11].id, data: '{"totalCost":45000,"costPerConversation":0.12,"savings":15}', generated_by: users[0].id },
    { id: uuidv4(), title: 'Lead Conversion Funnel Analysis', description: 'Analysis of lead-to-customer conversion rates at each stage of the sales funnel.', type: 'analytics', status: 'published', agent_id: agents[12].id, data: '{"totalLeads":850,"qualified":340,"converted":125,"conversionRate":14.7}', generated_by: users[3].id },
    { id: uuidv4(), title: 'Content Performance Dashboard', description: 'Performance metrics for AI-generated content including engagement rates and audience reach.', type: 'performance', status: 'published', agent_id: agents[9].id, data: '{"postsCreated":145,"avgEngagement":4.2,"reach":125000}', generated_by: users[2].id },
    { id: uuidv4(), title: 'Security Audit Report - Q1 2026', description: 'Results of the quarterly security audit including vulnerability scan results and remediation status.', type: 'analytics', status: 'draft', agent_id: agents[4].id, data: '{"vulnerabilities":3,"critical":0,"remediated":2,"pending":1}', generated_by: users[0].id },
    { id: uuidv4(), title: 'Employee Onboarding Efficiency Report', description: 'Analysis of onboarding process efficiency, time-to-productivity, and new hire satisfaction.', type: 'performance', status: 'published', agent_id: agents[8].id, data: '{"avgOnboardingDays":5,"satisfaction":4.5,"completionRate":98}', generated_by: users[6].id },
    { id: uuidv4(), title: 'API Usage and Rate Limiting Report', description: 'Overview of API usage patterns, rate limit hits, and recommended threshold adjustments.', type: 'usage', status: 'published', agent_id: agents[4].id, data: '{"totalCalls":1250000,"rateLimitHits":45,"p99Latency":280}', generated_by: users[0].id },
    { id: uuidv4(), title: 'Recruitment Pipeline Analysis', description: 'Analysis of recruitment pipeline metrics including time-to-hire, source effectiveness, and candidate quality.', type: 'analytics', status: 'published', agent_id: agents[17].id, data: '{"applicants":1200,"interviewed":180,"hired":25,"avgTimeToHire":18}', generated_by: users[6].id },
    { id: uuidv4(), title: 'Supply Chain Optimization Results', description: 'Results from supply chain optimization initiatives including cost savings and delivery time improvements.', type: 'performance', status: 'archived', agent_id: agents[14].id, data: '{"costReduction":12,"deliveryImprovement":8,"routesOptimized":34}', generated_by: users[17].id },
    { id: uuidv4(), title: 'Student Learning Outcomes Report', description: 'Analysis of student learning outcomes, course completion rates, and assessment scores.', type: 'analytics', status: 'draft', agent_id: agents[15].id, data: '{"avgScore":82,"completionRate":89,"topCourse":"AI Fundamentals"}', generated_by: users[12].id },
    { id: uuidv4(), title: 'Financial Compliance Status Report', description: 'Current status of financial compliance across all regulatory requirements and upcoming deadlines.', type: 'financial', status: 'published', agent_id: agents[6].id, data: '{"compliantItems":42,"pendingItems":3,"upcomingDeadlines":2}', generated_by: users[7].id },
    { id: uuidv4(), title: 'Platform Uptime Report - January 2026', description: 'Monthly uptime and availability metrics for all platform services and agent endpoints.', type: 'performance', status: 'published', agent_id: agents[11].id, data: '{"uptime":99.97,"incidents":2,"mttr":15}', generated_by: users[0].id },
    { id: uuidv4(), title: 'Customer Churn Prediction Model Results', description: 'Results from the churn prediction model including at-risk accounts and recommended retention actions.', type: 'analytics', status: 'draft', agent_id: agents[2].id, data: '{"atRiskAccounts":28,"churnProbability":0.15,"retentionActions":12}', generated_by: users[8].id },
  ];

  const insertReport = db.prepare(`INSERT INTO reports (id, title, description, type, status, agent_id, data, generated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertManyReports = db.transaction((items) => {
    for (const r of items) {
      insertReport.run(r.id, r.title, r.description, r.type, r.status, r.agent_id, r.data, r.generated_by);
    }
  });
  insertManyReports(reports);

  // ============ INTEGRATIONS (16) ============
  const integrations = [
    { id: uuidv4(), name: 'Salesforce CRM', type: 'crm', provider: 'Salesforce', status: 'connected', config: '{"version":"v58.0","syncInterval":"15min"}', last_sync: '2026-02-18T10:30:00Z', created_by: users[0].id },
    { id: uuidv4(), name: 'HubSpot CRM', type: 'crm', provider: 'HubSpot', status: 'connected', config: '{"apiVersion":"v3","syncContacts":true}', last_sync: '2026-02-18T10:00:00Z', created_by: users[3].id },
    { id: uuidv4(), name: 'SendGrid Email', type: 'email', provider: 'SendGrid', status: 'connected', config: '{"dailyLimit":10000,"templates":["welcome","reset","notification"]}', last_sync: '2026-02-18T09:45:00Z', created_by: users[0].id },
    { id: uuidv4(), name: 'Mailchimp', type: 'email', provider: 'Mailchimp', status: 'disconnected', config: '{"lists":["marketing","newsletter"]}', last_sync: '2026-02-10T15:30:00Z', created_by: users[2].id },
    { id: uuidv4(), name: 'Slack Workspace', type: 'chat', provider: 'Slack', status: 'connected', config: '{"channels":["#support","#alerts","#general"],"botName":"CraftBot"}', last_sync: '2026-02-18T10:35:00Z', created_by: users[0].id },
    { id: uuidv4(), name: 'Microsoft Teams', type: 'chat', provider: 'Microsoft', status: 'pending', config: '{"tenant":"craftagent.onmicrosoft.com"}', last_sync: null, created_by: users[0].id },
    { id: uuidv4(), name: 'Google Analytics', type: 'analytics', provider: 'Google', status: 'connected', config: '{"propertyId":"GA-123456","trackingEvents":true}', last_sync: '2026-02-18T08:00:00Z', created_by: users[2].id },
    { id: uuidv4(), name: 'Mixpanel', type: 'analytics', provider: 'Mixpanel', status: 'connected', config: '{"projectToken":"abc123","trackUsers":true}', last_sync: '2026-02-18T09:30:00Z', created_by: users[0].id },
    { id: uuidv4(), name: 'AWS S3 Storage', type: 'storage', provider: 'Amazon', status: 'connected', config: '{"bucket":"craftagent-files","region":"us-east-1"}', last_sync: '2026-02-18T10:15:00Z', created_by: users[0].id },
    { id: uuidv4(), name: 'Google Cloud Storage', type: 'storage', provider: 'Google', status: 'error', config: '{"bucket":"craftagent-backup","error":"Permission denied"}', last_sync: '2026-02-15T14:20:00Z', created_by: users[0].id },
    { id: uuidv4(), name: 'Stripe Payments', type: 'payment', provider: 'Stripe', status: 'connected', config: '{"currency":"USD","webhookEnabled":true}', last_sync: '2026-02-18T10:40:00Z', created_by: users[7].id },
    { id: uuidv4(), name: 'PayPal Business', type: 'payment', provider: 'PayPal', status: 'disconnected', config: '{"environment":"production"}', last_sync: '2026-01-30T12:00:00Z', created_by: users[7].id },
    { id: uuidv4(), name: 'Zendesk', type: 'crm', provider: 'Zendesk', status: 'connected', config: '{"subdomain":"craftagent","ticketSync":true}', last_sync: '2026-02-18T10:20:00Z', created_by: users[4].id },
    { id: uuidv4(), name: 'Intercom', type: 'chat', provider: 'Intercom', status: 'connected', config: '{"appId":"xyz789","messengerEnabled":true}', last_sync: '2026-02-18T10:25:00Z', created_by: users[4].id },
    { id: uuidv4(), name: 'Datadog Monitoring', type: 'analytics', provider: 'Datadog', status: 'connected', config: '{"apiKey":"configured","dashboards":["production","staging"]}', last_sync: '2026-02-18T10:38:00Z', created_by: users[0].id },
    { id: uuidv4(), name: 'Dropbox Business', type: 'storage', provider: 'Dropbox', status: 'pending', config: '{"teamFolder":"/craftagent-docs"}', last_sync: null, created_by: users[0].id },
  ];

  const insertIntegration = db.prepare(`INSERT INTO integrations (id, name, type, provider, status, config, last_sync, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertManyIntegrations = db.transaction((items) => {
    for (const i of items) {
      insertIntegration.run(i.id, i.name, i.type, i.provider, i.status, i.config, i.last_sync, i.created_by);
    }
  });
  insertManyIntegrations(integrations);

  // ============ NOTIFICATIONS (20) ============
  const notifications = [
    { id: uuidv4(), user_id: users[0].id, title: 'System Update Complete', message: 'Platform has been updated to version 2.5.0 with improved agent response times.', type: 'success', is_read: 1 },
    { id: uuidv4(), user_id: users[0].id, title: 'High Memory Usage Alert', message: 'Server memory usage exceeded 85% threshold. Consider scaling up resources.', type: 'warning', is_read: 0 },
    { id: uuidv4(), user_id: users[0].id, title: 'New Agent Deployed', message: 'Legal Document Reviewer agent has been successfully deployed to production.', type: 'info', is_read: 1 },
    { id: uuidv4(), user_id: users[1].id, title: 'Task Overdue', message: 'Task "Train healthcare agent on new protocols" is past its due date.', type: 'error', is_read: 0 },
    { id: uuidv4(), user_id: users[1].id, title: 'Integration Connected', message: 'HubSpot CRM integration has been successfully connected and synced.', type: 'success', is_read: 1 },
    { id: uuidv4(), user_id: users[2].id, title: 'Content Published', message: 'Blog post "Future of AI Agents" has been published successfully.', type: 'success', is_read: 1 },
    { id: uuidv4(), user_id: users[2].id, title: 'Campaign Performance Alert', message: 'Email campaign open rate dropped below 15% threshold.', type: 'warning', is_read: 0 },
    { id: uuidv4(), user_id: users[3].id, title: 'New Lead Alert', message: '5 new hot leads detected from the enterprise segment - review recommended.', type: 'info', is_read: 0 },
    { id: uuidv4(), user_id: users[4].id, title: 'Feedback Report Ready', message: 'January customer feedback analysis report is ready for review.', type: 'info', is_read: 1 },
    { id: uuidv4(), user_id: users[4].id, title: 'Support Ticket Escalated', message: 'Ticket #4521 has been escalated to senior support. Immediate attention required.', type: 'error', is_read: 0 },
    { id: uuidv4(), user_id: users[5].id, title: 'Deployment Failed', message: 'API deployment to staging environment failed. Check build logs for details.', type: 'error', is_read: 0 },
    { id: uuidv4(), user_id: users[6].id, title: 'Onboarding Batch Ready', message: 'March onboarding batch of 50 employees has been prepared and scheduled.', type: 'info', is_read: 1 },
    { id: uuidv4(), user_id: users[7].id, title: 'Invoice Processing Complete', message: 'All 347 Q4 invoices have been processed and reconciled successfully.', type: 'success', is_read: 1 },
    { id: uuidv4(), user_id: users[7].id, title: 'Budget Alert', message: 'Department budget utilization has reached 90% for the current quarter.', type: 'warning', is_read: 0 },
    { id: uuidv4(), user_id: users[8].id, title: 'Analysis Complete', message: 'Customer churn analysis has been completed. View results in the reports section.', type: 'success', is_read: 0 },
    { id: uuidv4(), user_id: users[9].id, title: 'Contract Review Alert', message: '3 vendor contracts are expiring within 30 days. Review and renewal required.', type: 'warning', is_read: 0 },
    { id: uuidv4(), user_id: users[10].id, title: 'Template Published', message: 'Email campaign template "Spring Sale" has been published to the template library.', type: 'success', is_read: 1 },
    { id: uuidv4(), user_id: users[12].id, title: 'Student Reports Generated', message: '200 student progress reports have been generated for Semester 1.', type: 'info', is_read: 0 },
    { id: uuidv4(), user_id: users[13].id, title: 'CRM Sync Error', message: 'Salesforce CRM sync failed for 3 contacts. Manual review required.', type: 'error', is_read: 0 },
    { id: uuidv4(), user_id: users[17].id, title: 'Route Optimization Complete', message: 'Q2 delivery route optimization is complete. Projected 15% cost reduction.', type: 'success', is_read: 1 },
  ];

  const insertNotification = db.prepare(`INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`);
  const insertManyNotifications = db.transaction((items) => {
    for (const n of items) {
      insertNotification.run(n.id, n.user_id, n.title, n.message, n.type, n.is_read);
    }
  });
  insertManyNotifications(notifications);

  console.log('Database seeded successfully!');
  console.log(`  - ${users.length} users`);
  console.log(`  - ${agents.length} agents`);
  console.log(`  - ${tasks.length} tasks`);
  console.log(`  - ${templates.length} templates`);
  console.log(`  - ${conversations.length} conversations`);
  console.log(`  - ${reports.length} reports`);
  console.log(`  - ${integrations.length} integrations`);
  console.log(`  - ${notifications.length} notifications`);
}

module.exports = seed;
