import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
const dbPath = path.join(dataDir, 'mental_health_center.db')

fs.mkdirSync(dataDir, { recursive: true })
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

db.prepare(`
  CREATE TABLE IF NOT EXISTS counselors (
    id INTEGER PRIMARY KEY,
    name TEXT,
    title TEXT,
    department TEXT,
    phone TEXT,
    email TEXT,
    summary TEXT
  )
`).run()

db.prepare(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY,
    title TEXT,
    category TEXT,
    summary TEXT,
    url TEXT,
    published_at TEXT
  )
`).run()

db.prepare(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY,
    type TEXT,
    duration TEXT,
    mode TEXT,
    description TEXT
  )
`).run()

db.prepare(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY,
    student_name TEXT,
    student_id TEXT,
    email TEXT,
    counselor_id INTEGER,
    appointment_type TEXT,
    mode TEXT,
    date TEXT,
    topic TEXT,
    status TEXT,
    created_at TEXT,
    FOREIGN KEY(counselor_id) REFERENCES counselors(id)
  )
`).run()

const appointmentColumns = db.prepare(`PRAGMA table_info(appointments)`).all()
if (!appointmentColumns.some((column) => column.name === 'student_id')) {
  db.prepare('ALTER TABLE appointments ADD COLUMN student_id TEXT').run()
}
if (!appointmentColumns.some((column) => column.name === 'appointment_type')) {
  db.prepare('ALTER TABLE appointments ADD COLUMN appointment_type TEXT').run()
}
if (!appointmentColumns.some((column) => column.name === 'mode')) {
  db.prepare('ALTER TABLE appointments ADD COLUMN mode TEXT').run()
}

const counselorCount = db.prepare('SELECT COUNT(*) AS total FROM counselors').get().total
if (counselorCount === 0) {
  const insert = db.prepare(`INSERT INTO counselors (name, title, department, phone, email, summary) VALUES (@name, @title, @department, @phone, @email, @summary)`)
  const counselors = [
    {
      name: '林怡君',
      title: '諮商心理師',
      department: '心理輔導中心',
      phone: '02-1234-5678',
      email: 'yijun.lin@school.edu.tw',
      summary: '專長情緒管理、考試焦慮與人際衝突，提供學生安心的諮商空間。'
    },
    {
      name: '張立華',
      title: '諮商心理師',
      department: '心理輔導中心',
      phone: '02-1234-5679',
      email: 'lihua.zhang@school.edu.tw',
      summary: '專注於壓力調適、職涯探索與心理危機介入。'
    },
    {
      name: '陳美玲',
      title: '社工師',
      department: '校園心理健康',
      phone: '02-1234-5680',
      email: 'meiling.chen@school.edu.tw',
      summary: '擅長社會支持、資源媒合與生活適應協助。'
    }
  ]
  const transaction = db.transaction((rows) => {
    for (const row of rows) insert.run(row)
  })
  transaction(counselors)
}

const articleCount = db.prepare('SELECT COUNT(*) AS total FROM articles').get().total
if (articleCount === 0) {
  const insert = db.prepare(`INSERT INTO articles (title, category, summary, url, published_at) VALUES (@title, @category, @summary, @url, @published_at)`)
  const articles = [
    {
      title: '如何在校園生活中建立健康的情緒節奏',
      category: '情緒調節',
      summary: '介紹簡單的呼吸練習、日記習慣與支持系統建立，幫助學生自然調整情緒。',
      url: 'https://example.com/article1',
      published_at: '2026-06-01'
    },
    {
      title: '考試期間的壓力管理策略',
      category: '考試焦慮',
      summary: '從時間規劃、休息安排與自我對話三個面向，讓考前準備更穩定。',
      url: 'https://example.com/article2',
      published_at: '2026-05-28'
    },
    {
      title: '從失眠到好眠：校園生的睡眠小技巧',
      category: '睡眠品質',
      summary: '分析常見校園睡眠問題，並提供收心儀式與環境調整方法。',
      url: 'https://example.com/article3',
      published_at: '2026-05-20'
    }
  ]
  const transaction = db.transaction((rows) => {
    for (const row of rows) insert.run(row)
  })
  transaction(articles)
}

const sessionCount = db.prepare('SELECT COUNT(*) AS total FROM sessions').get().total
if (sessionCount === 0) {
  const insert = db.prepare(`INSERT INTO sessions (type, duration, mode, description) VALUES (@type, @duration, @mode, @description)`)
  const sessions = [
    {
      type: '週一至週五 上午時段',
      duration: '08:00 - 12:00',
      mode: '面談 / 線上',
      description: '每日早上固定開放諮商時段，適合想在早上安排心理諮商的學生。'
    },
    {
      type: '週一至週五 下午時段',
      duration: '13:00 - 17:00',
      mode: '面談 / 線上',
      description: '每日午後固定開放諮商時段，適合想在課後或下午時間預約的學生。'
    },
    {
      type: '初次諮商',
      duration: '50 分鐘',
      mode: '面談',
      description: '協助學生初步了解需求、評估狀態並建立後續諮商方向。'
    },
    {
      type: '情緒支持',
      duration: '50 分鐘',
      mode: '線上/面談',
      description: '針對壓力、焦慮、低落情緒提供情緒調節與支持。'
    },
    {
      type: '職涯探索',
      duration: '50 分鐘',
      mode: '面談',
      description: '從大學學習、興趣與未來規劃著手，協助學生找到行動方向。'
    }
  ]
  const transaction = db.transaction((rows) => {
    for (const row of rows) insert.run(row)
  })
  transaction(sessions)
}

const appointmentCount = db.prepare('SELECT COUNT(*) AS total FROM appointments').get().total
if (appointmentCount === 0) {
  const insert = db.prepare(`INSERT INTO appointments (student_name, student_id, email, counselor_id, appointment_type, mode, date, topic, status, created_at) VALUES (@student_name, @student_id, @email, @counselor_id, @appointment_type, @mode, @date, @topic, @status, @created_at)`)
  const appointments = [
    {
      student_name: '吳俊廷',
      student_id: 'A123456789',
      email: 'junting.wu@student.school.edu.tw',
      counselor_id: 1,
      appointment_type: '後續治療',
      mode: '線上',
      date: '2026-06-19 14:00',
      topic: '考試壓力與注意力管理',
      status: '已確認',
      created_at: '2026-06-10T09:42:00Z'
    },
    {
      student_name: '李雅婷',
      student_id: 'B987654321',
      email: 'yating.li@student.school.edu.tw',
      counselor_id: null,
      appointment_type: '初次諮商',
      mode: null,
      date: '2026-06-22 10:00',
      topic: '人際衝突與團隊合作困擾',
      status: '已確認',
      created_at: '2026-06-12T11:15:00Z'
    }
  ]
  const transaction = db.transaction((rows) => {
    for (const row of rows) insert.run(row)
  })
  transaction(appointments)
}

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/status', (req, res) => {
  res.json({ service: 'campus-mental-health-api', status: 'ok', version: '0.1.0' })
})

app.get('/api/counselors', (req, res) => {
  const counselors = db.prepare('SELECT * FROM counselors ORDER BY id').all()
  res.json(counselors)
})

app.get('/api/articles', (req, res) => {
  const articles = db.prepare('SELECT * FROM articles ORDER BY published_at DESC').all()
  res.json(articles)
})

app.get('/api/sessions', (req, res) => {
  const sessions = db.prepare('SELECT * FROM sessions ORDER BY id').all()
  res.json(sessions)
})

app.get('/api/appointments', (req, res) => {
  const appointments = db
    .prepare(`SELECT a.id, a.student_name, a.student_id, a.email, a.appointment_type, a.mode, a.date, a.topic, a.status, a.created_at, c.name AS counselor_name
      FROM appointments a
      LEFT JOIN counselors c ON a.counselor_id = c.id
      ORDER BY a.created_at DESC`)
    .all()
  res.json(appointments)
})

app.post('/api/appointments', (req, res) => {
  const { student_name, student_id, email, counselor_id, appointment_type, mode, date, topic } = req.body
  if (!student_name || !student_id || !email || !appointment_type || !date || !topic) {
    return res.status(400).json({ error: '請提供所有預約欄位' })
  }

  if (appointment_type !== '初次諮商' && appointment_type !== '後續治療') {
    return res.status(400).json({ error: '諮商類型不正確' })
  }

  if (appointment_type === '後續治療') {
    if (!mode) {
      return res.status(400).json({ error: '請選擇諮商方式' })
    }
    if (!counselor_id) {
      return res.status(400).json({ error: '請選擇諮商師' })
    }

    const counselor = db.prepare('SELECT * FROM counselors WHERE id = ?').get(counselor_id)
    if (!counselor) {
      return res.status(400).json({ error: '選擇的諮商師不存在' })
    }
  } else {
    if (counselor_id) {
      return res.status(400).json({ error: '初次諮商不需要選擇諮商師' })
    }
  }

  const createdAt = new Date().toISOString()
  const result = db
    .prepare('INSERT INTO appointments (student_name, student_id, email, counselor_id, appointment_type, mode, date, topic, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(student_name, student_id, email, appointment_type === '後續治療' ? counselor_id : null, appointment_type, mode || null, date, topic, '待確認', createdAt)

  const appointment = db
    .prepare(`SELECT a.id, a.student_name, a.student_id, a.email, a.appointment_type, a.mode, a.date, a.topic, a.status, a.created_at, c.name AS counselor_name
      FROM appointments a
      LEFT JOIN counselors c ON a.counselor_id = c.id
      WHERE a.id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(appointment)
})

app.get('/api/summary', (req, res) => {
  const counselorCount = db.prepare('SELECT COUNT(*) AS total FROM counselors').get().total
  const articleCount = db.prepare('SELECT COUNT(*) AS total FROM articles').get().total
  const sessionCount = db.prepare('SELECT COUNT(*) AS total FROM sessions').get().total
  const appointmentCount = db.prepare('SELECT COUNT(*) AS total FROM appointments').get().total
  res.json({ counselorCount, articleCount, sessionCount, appointmentCount })
})

const clientDistPath = path.join(__dirname, '../client/dist')
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath))
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'))
    }
  })
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Campus mental health API running at http://localhost:${PORT}`)
})
