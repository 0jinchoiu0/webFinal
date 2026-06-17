<template>
  <div class="app-shell">
    <header class="hero">
      <div class="hero-content">
        <h1>校園心理健康中心</h1>
        <p>為學生提供諮商服務、情緒資源與安心預約系統。</p>
      </div>
    </header>

    <section class="summary-cards">
      <div class="card" v-for="metric in summary" :key="metric.label">
        <strong>{{ metric.value }}</strong>
        <p>{{ metric.label }}</p>
      </div>
    </section>

    <section class="section-block">
      <h2>諮商師團隊</h2>
      <div class="card-grid">
        <article class="card" v-for="c in counselors" :key="c.id">
          <h3>{{ c.name }}</h3>
          <p class="meta">{{ c.title }} / {{ c.department }}</p>
          <p>{{ c.summary }}</p>
          <p class="contact">{{ c.phone }} · {{ c.email }}</p>
        </article>
      </div>
    </section>

    <section class="section-block">
      <div class="section-header">
        <div>
          <h2>熱門心理健康文章</h2>
          <p>AI 生成模擬文章內容，適合校園學生閱讀。</p>
        </div>
      </div>
      <div class="card-grid">
        <article class="card" v-for="a in articles" :key="a.id">
          <h3>{{ a.title }}</h3>
          <p class="meta">{{ a.category }} · {{ a.published_at }}</p>
          <p>{{ a.summary }}</p>
          <a :href="a.url" target="_blank" rel="noopener">閱讀更多</a>
        </article>
      </div>
    </section>

    <section class="section-block">
      <h2>服務時段</h2>
      <div class="card-grid cards-3">
        <article class="card" v-for="s in sessions" :key="s.id">
          <h3>{{ s.type }}</h3>
          <p class="meta">{{ s.duration }} · {{ s.mode }}</p>
          <p>{{ s.description }}</p>
        </article>
      </div>
    </section>

    <section class="section-block appointment-form">
      <div class="form-grid">
        <div>
          <h2>預約諮商</h2>
          <p>填妥資訊後即可送出預約，中心將儘快與您聯繫確認。</p>
        </div>
        <form @submit.prevent="submitAppointment">
          <label>
            學生姓名
            <input v-model="form.student_name" required />
          </label>
          <label>
            學生學號
            <input v-model="form.student_id" required />
          </label>
          <label>
            Email
            <input type="email" v-model="form.email" required />
          </label>
          <label>
            諮商類型
            <select v-model="form.appointment_type" required>
              <option disabled value="">請選擇類型</option>
              <option value="初次諮商">初次諮商</option>
              <option value="後續治療">後續治療</option>
            </select>
          </label>
          <label v-if="isFollowUp">
            諮商師
            <select v-model.number="form.counselor_id" required>
              <option disabled value="">請選擇諮商師</option>
              <option v-for="c in counselors" :value="c.id" :key="c.id">{{ c.name }} ({{ c.title }})</option>
            </select>
          </label>
          <label v-else>
            預約諮商服務
            <input type="text" disabled value="初次諮商，不需選擇諮商師" />
          </label>
          <label v-if="isFollowUp">
            諮商方式
            <select v-model="form.mode" required>
              <option disabled value="">請選擇方式</option>
              <option value="線上">線上</option>
              <option value="面談">面談</option>
            </select>
          </label>
          <div class="date-time-row">
            <label>
              選擇日期
              <input type="date" v-model="form.date" required />
            </label>
            <label>
              選擇時段
              <select v-model="form.time" required>
                <option disabled value="">請選擇時段</option>
                <option value="08:00">早上 08:00</option>
                <option value="09:00">早上 09:00</option>
                <option value="10:00">早上 10:00</option>
                <option value="11:00">早上 11:00</option>
                <option value="13:00">下午 13:00</option>
                <option value="14:00">下午 14:00</option>
                <option value="15:00">下午 15:00</option>
                <option value="16:00">下午 16:00</option>
              </select>
            </label>
          </div>
          <label>
            諮商主題
            <input v-model="form.topic" required />
          </label>
          <button type="submit" class="primary">送出預約</button>
        </form>
      </div>
      <div class="appointment-result" v-if="appointmentResult">
        <h3>預約已送出</h3>
        <p><strong>學生姓名：</strong>{{ appointmentResult.student_name }}</p>
        <p><strong>學生學號：</strong>{{ appointmentResult.student_id }}</p>
        <p><strong>諮商師：</strong>{{ appointmentResult.counselor_name }}</p>
        <p><strong>時間：</strong>{{ appointmentResult.date }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const counselors = ref([])
const articles = ref([])
const sessions = ref([])
const summary = ref([])
const appointmentResult = ref(null)

const form = ref({
  student_name: '',
  student_id: '',
  email: '',
  appointment_type: '',
  counselor_id: null,
  mode: '',
  date: '',
  time: '',
  topic: ''
})

const isFollowUp = computed(() => form.value.appointment_type === '後續治療')

const loadData = async () => {
  try {
    const [summaryRes, counselorsRes, articlesRes, sessionsRes] = await Promise.all([
      fetch('/api/summary'),
      fetch('/api/counselors'),
      fetch('/api/articles'),
      fetch('/api/sessions')
    ])

    const summaryData = await summaryRes.json()
    summary.value = [
      { label: '諮商師人數', value: summaryData.counselorCount },
      { label: '文章資源', value: summaryData.articleCount },
      { label: '服務項目', value: summaryData.sessionCount },
      { label: '預約紀錄', value: summaryData.appointmentCount }
    ]
    counselors.value = await counselorsRes.json()
    articles.value = await articlesRes.json()
    sessions.value = await sessionsRes.json()
  } catch (error) {
    console.error(error)
    alert('無法載入資料，請先啟動 server')
  }
}

const submitAppointment = async () => {
  appointmentResult.value = null
  try {
    const payload = {
      ...form.value,
      date: `${form.value.date} ${form.value.time}`,
      counselor_id: isFollowUp.value ? form.value.counselor_id : null
    }
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json()
      alert(error.error || '預約發生錯誤')
      return
    }

    appointmentResult.value = await response.json()
    form.value = { student_name: '', student_id: '', email: '', appointment_type: '', counselor_id: null, mode: '', date: '', time: '', topic: '' }
  } catch (error) {
    console.error(error)
    alert('無法送出預約，請檢查 API 是否可用')
  }
}

onMounted(loadData)
</script>

<style>
:root {
  color-scheme: light;
  font-family: 'Noto Sans TC', sans-serif;
  background: #f4f7fb;
  color: #1f2937;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.app-shell {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px;
}

.hero {
  background: linear-gradient(135deg, #5b7cff 0%, #9bc8ff 100%);
  border-radius: 24px;
  color: #fff;
  padding: 48px 32px;
  margin-bottom: 24px;
}

.hero h1 {
  margin: 0 0 16px;
  font-size: clamp(2.4rem, 3vw, 4rem);
}

.hero p {
  margin: 0;
  font-size: 1.05rem;
}

.summary-cards {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.card-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 14px 32px rgba(31, 41, 55, 0.08);
}

.card h3 {
  margin: 0 0 10px;
}

.card p {
  margin: 0 0 12px;
  line-height: 1.7;
}

.card a {
  color: #2563eb;
  text-decoration: none;
}

.meta {
  color: #4b5563;
  font-size: 0.96rem;
}

.contact {
  color: #475569;
  font-size: 0.95rem;
}

.section-block {
  margin-bottom: 32px;
}

.section-block h2 {
  margin-bottom: 18px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.cards-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.appointment-form {
  display: grid;
  gap: 20px;
}

.form-grid {
  display: grid;
  gap: 20px;
}

form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  font-weight: 600;
}

input,
select {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}

button.primary {
  display: inline-flex;
  justify-content: center;
  padding: 14px 20px;
  background: #2563eb;
  border: none;
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
}

button.primary:hover {
  background: #1d4ed8;
}

.date-time-row {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 720px) {
  .date-time-row {
    grid-template-columns: 1fr;
  }
}

.appointment-result {
  padding: 24px;
  border-radius: 20px;
  background: #eef2ff;
}

@media (max-width: 840px) {
  .cards-3 {
    grid-template-columns: 1fr;
  }
}
</style>
