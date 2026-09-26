// Demo seed data. Replaced by a real backend in a later phase.
// Training records are generated relative to *today*, so whenever the demo is
// presented Yazan is mid-training and Lana is at the end of hers.
import { addDays, buildChain, isWeekend, todayStr } from './lib/verify.js'

// inLogin: false → background data only (appears in tables, not on the login screen)
export const users = [
  { id: 's1', role: 'student', name: { ar: 'أمل أحمد', en: 'Amal Ahmad' }, stageHint: 'start' },
  { id: 's4', role: 'student', name: { ar: 'يزن عبد الله', en: 'Yazan Abdullah' }, stageHint: 'middle' },
  { id: 's3', role: 'student', name: { ar: 'لانا محمود', en: 'Lana Mahmoud' }, stageHint: 'end' },
  { id: 's2', role: 'student', name: { ar: 'عمر خالد', en: 'Omar Khaled' }, stageHint: 'ineligible' },
  { id: 'k1', role: 'company', companyId: 'c1', name: { ar: 'م. خالد الزعبي', en: 'Eng. Khaled Alzoubi' } },
  { id: 'd1', role: 'supervisor', name: { ar: 'د. محمد علي', en: 'Dr. Mohammad Ali' } },
  { id: 'o1', role: 'officer', name: { ar: 'سارة يوسف', en: 'Sara Yousef' } },
  { id: 'd2', role: 'supervisor', inLogin: false, name: { ar: 'د. ليلى حسن', en: 'Dr. Layla Hasan' } },
  { id: 's5', role: 'student', inLogin: false, name: { ar: 'نور الهدى سالم', en: 'Nour Salem' } },
  { id: 's6', role: 'student', inLogin: false, name: { ar: 'هادي منصور', en: 'Hadi Mansour' } },
  { id: 's7', role: 'student', inLogin: false, name: { ar: 'رنا القاسم', en: 'Rana Alqasem' } },
  { id: 's8', role: 'student', inLogin: false, name: { ar: 'تالا جابر', en: 'Tala Jaber' } },
]
export const userById = (id) => users.find((u) => u.id === id)

// Academic profile used by the automatic eligibility check
export const students = {
  s1: { uniId: '20211234', major: 'design', gpa: 3.6, completedHours: 102, passedCourses: ['UX101', 'GD201'], hasIncompleteTraining: false },
  s2: { uniId: '20225678', major: 'cs', gpa: 2.9, completedHours: 64, passedCourses: ['CS101'], hasIncompleteTraining: false },
  s3: { uniId: '20203344', major: 'design', gpa: 3.8, completedHours: 118, passedCourses: ['UX101', 'GD201'], hasIncompleteTraining: false },
  s4: { uniId: '20219021', major: 'design', gpa: 3.2, completedHours: 96, passedCourses: ['UX101'], hasIncompleteTraining: false },
  s5: { uniId: '20214410', major: 'design', gpa: 3.4, completedHours: 99, passedCourses: ['GD201'], hasIncompleteTraining: false },
  s6: { uniId: '20207788', major: 'cs', gpa: 3.1, completedHours: 110, passedCourses: ['CS101', 'CS220'], hasIncompleteTraining: false },
  s7: { uniId: '20216502', major: 'business', gpa: 3.0, completedHours: 93, passedCourses: ['BA110'], hasIncompleteTraining: false },
  s8: { uniId: '20218833', major: 'cs', gpa: 3.5, completedHours: 101, passedCourses: ['CS101'], hasIncompleteTraining: false },
}

export const majors = {
  design: { ar: 'التصميم الجرافيكي وتجربة المستخدم', en: 'Graphic Design & UX' },
  cs: { ar: 'علم الحاسوب', en: 'Computer Science' },
  business: { ar: 'إدارة الأعمال', en: 'Business Administration' },
}

export const companies = {
  c1: { ar: 'شركة X للحلول الرقمية', en: 'X Digital Solutions' },
  c2: { ar: 'استوديو نون للتصميم', en: 'Noon Design Studio' },
  c3: { ar: 'تك هب', en: 'TechHub' },
  c4: { ar: 'البنك العربي المتحد', en: 'United Arab Bank' },
  c5: { ar: 'مستشفى الأمل', en: 'Al-Amal Hospital' },
}

export const opportunities = [
  { id: 'op1', title: { ar: 'مصمم واجهات UI/UX', en: 'UI/UX Designer' }, companyId: 'c1', seats: 5, durationMonths: 2, requiredHours: 240, deadline: '2026-10-30',
    requirements: { majors: ['design'] } },
  { id: 'op2', title: { ar: 'مصمم جرافيك', en: 'Graphic Designer' }, companyId: 'c2', seats: 3, durationMonths: 2, requiredHours: 240, deadline: '2026-11-15',
    requirements: { majors: ['design'] } },
  { id: 'op3', title: { ar: 'مطور واجهات أمامية', en: 'Front-end Developer' }, companyId: 'c3', seats: 4, durationMonths: 3, requiredHours: 360, deadline: '2026-10-20',
    requirements: { majors: ['cs', 'design'] } },
  { id: 'op4', title: { ar: 'مطور تطبيقات موبايل', en: 'Mobile App Developer' }, companyId: 'c3', seats: 2, durationMonths: 3, requiredHours: 360, deadline: '2026-11-01',
    requirements: { majors: ['cs'] } },
  { id: 'op5', title: { ar: 'متدرب خدمات مصرفية رقمية', en: 'Digital Banking Trainee' }, companyId: 'c4', seats: 6, durationMonths: 2, requiredHours: 240, deadline: '2026-10-25',
    requirements: { majors: ['business', 'cs'] } },
  { id: 'op6', title: { ar: 'مصمم تجربة المرضى', en: 'Patient Experience Designer' }, companyId: 'c5', seats: 2, durationMonths: 2, requiredHours: 240, deadline: '2026-11-10',
    requirements: { majors: ['design'] } },
]
export const oppById = (id) => opportunities.find((o) => o.id === id)

// Institution-wide numbers so the dashboard looks like a real university.
// Live actions in the demo are added on top of these.
export const baseline = {
  students: 1250, eligible: 980, newApps: 126, inTraining: 540, completed: 320,
  late: 27, companies: 85, opportunities: 140, attendance: 91,
  hours: { claimed: 61840, counted: 60125, pending: 1210, cut: 505 },
  byStatus: { submitted: 126, under_review: 58, needs_changes: 14, accepted: 72, rejected: 31, active: 540 },
  byCollege: [
    { ar: 'تكنولوجيا المعلومات', en: 'Information Technology', value: 164 },
    { ar: 'الهندسة', en: 'Engineering', value: 131 },
    { ar: 'الأعمال', en: 'Business', value: 102 },
    { ar: 'العلوم الطبية المساندة', en: 'Allied Medical Sciences', value: 83 },
    { ar: 'الفنون والتصميم', en: 'Arts & Design', value: 60 },
  ],
}

// Course catalogue per major, used when the supervisor picks required courses
export const courses = {
  design: { UX101: { ar: 'مبادئ تجربة المستخدم', en: 'UX Fundamentals' }, GD201: { ar: 'التصميم الجرافيكي 2', en: 'Graphic Design II' }, UX210: { ar: 'بحث المستخدم', en: 'User Research' } },
  cs: { CS101: { ar: 'مقدمة في البرمجة', en: 'Intro to Programming' }, CS220: { ar: 'تطوير تطبيقات الموبايل', en: 'Mobile Development' }, CS310: { ar: 'هندسة البرمجيات', en: 'Software Engineering' } },
  business: { BA110: { ar: 'مبادئ الإدارة', en: 'Principles of Management' }, BA210: { ar: 'التسويق الرقمي', en: 'Digital Marketing' } },
}

// Eligibility rules per major — owned and edited by the academic supervisor
export const defaultRules = {
  design: { minHours: 90, minGpa: 2.5, courses: ['UX101'], blockIncomplete: true, updatedBy: 'd1', updatedAt: '2026-09-01T10:00:00' },
  cs: { minHours: 90, minGpa: 2.5, courses: ['CS101'], blockIncomplete: true, updatedBy: 'd1', updatedAt: '2026-09-01T10:00:00' },
  business: { minHours: 85, minGpa: 2.0, courses: [], blockIncomplete: true, updatedBy: 'd1', updatedAt: '2026-09-01T10:00:00' },
}

export const providerCriteria = ['pc_commitment', 'pc_skills', 'pc_teamwork', 'pc_communication', 'pc_initiative']
export const academicCriteria = ['ac_knowledge', 'ac_reports', 'ac_growth']

// The automatic eligibility check: the opportunity decides which majors it accepts,
// the supervisor's rules for the student's major decide the academic conditions.
// Returns { ok, reasons: [{ key, vars }] }
export function checkEligibility(studentId, opp, rules) {
  const s = students[studentId]
  const r = rules[s.major]
  const reasons = []
  if (!opp.requirements.majors.includes(s.major)) reasons.push({ key: 'reason_major' })
  if (s.completedHours < r.minHours) reasons.push({ key: 'reason_hours', vars: { have: s.completedHours, need: r.minHours } })
  if (s.gpa < r.minGpa) reasons.push({ key: 'reason_gpa', vars: { have: s.gpa, need: r.minGpa } })
  for (const c of r.courses)
    if (!s.passedCourses.includes(c)) reasons.push({ key: 'reason_course', vars: { course: c } })
  if (r.blockIncomplete && s.hasIncompleteTraining) reasons.push({ key: 'reason_incomplete' })
  return { ok: reasons.length === 0, reasons }
}

// ---------- seed generation ----------

// Small deterministic random so the demo looks the same every reset
function rng(seed) {
  let s = seed
  return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648)
}
const time = (h, m) => `${String(h).padStart(2, '0')}:${String(Math.max(0, Math.min(59, m))).padStart(2, '0')}`

const TASKS = [
  'تصميم شاشات تطبيق الحجز في Figma',
  'إعداد نظام الألوان والخطوط (Design System)',
  'مقابلات مع المستخدمين وتحليل النتائج',
  'رسم مخطط رحلة المستخدم (User Journey)',
  'تصميم نماذج أولية تفاعلية واختبارها',
  'مراجعة التصاميم مع فريق التطوير',
  'تحسين تجربة التسجيل في التطبيق',
  'تصميم لوحة التحكم الإدارية',
  'اختبار قابلية الاستخدام مع 5 مستخدمين',
  'توثيق مكونات الواجهة للمطورين',
  'تصميم أيقونات ورسومات توضيحية',
  'إعداد عرض تقديمي للعميل',
]
const DETAILS = ['لقسم المبيعات', 'بإشراف قائد الفريق', 'للنسخة الثانية من المنتج', 'مع فريق تجربة العملاء', 'لتطبيق الجوال', 'للموقع الإلكتروني', 'وفق ملاحظات العميل']
const taskText = (i) => `${TASKS[i % TASKS.length]} ${DETAILS[i % DETAILS.length]}`
const SKILLS = ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing', 'Wireframing']

function makeTraining({ id, studentId, start, seed, absences = [], quirks = {}, pendingTail = 0 }) {
  const rand = rng(seed)
  const today = todayStr()
  const opp = oppById('op1')
  const end = addDays(start, 61)
  const attendance = []
  const logs = []
  const events = []
  let n = 0

  for (let d = start; d < today && d <= end; d = addDays(d, 1)) {
    if (isWeekend(d)) continue
    n++
    if (absences.includes(n)) continue
    const inAt = time(8, Math.floor(rand() * 20))
    const outAt = time(14 + Math.floor(rand() * 2), Math.floor(rand() * 60))
    attendance.push({ date: d, in: inAt, out: outAt, geo: quirks.geoOutside === n ? 'outside' : 'inside' })
    events.push({ at: `${d}T${inAt}:00`, actor: studentId, action: 'checkin', detail: { date: d, time: inAt } })
  }

  // one log per attended day (except the most recent, left for the live demo)
  const attended = attendance.slice(0, quirks.skipLast ? -1 : undefined)
  attended.forEach((a, i) => {
    const [ih, im] = a.in.split(':').map(Number)
    const [oh, om] = a.out.split(':').map(Number)
    const real = Math.floor(((oh * 60 + om - ih * 60 - im) / 60) * 2) / 2
    const day = i + 1
    const log = {
      id: `${id}-l${day}`,
      date: a.date,
      hours: quirks.exceeds === day ? 9 : real,
      tasks: taskText(day - 1),
      skills: SKILLS[day % SKILLS.length],
      submittedAt: `${quirks.late === day ? addDays(a.date, 6) : a.date}T${a.out}:00`,
      company: 'confirmed',
      academic: 'approved',
    }
    if (quirks.duplicate === day) log.tasks = logs[logs.length - 1].tasks
    const fromEnd = attended.length - day
    if (fromEnd < pendingTail) {
      log.company = fromEnd < pendingTail - 1 ? 'pending' : 'confirmed'
      log.academic = 'pending'
    }
    logs.push(log)
  })

  // A weekend claim with no attendance that the company disputed
  if (quirks.weekendClaim) {
    const fri = attendance.map((a) => a.date).find((d, i) => i > 8 && new Date(d + 'T12:00:00').getDay() === 4)
    const date = addDays(fri, 1)
    logs.push({ id: `${id}-lw`, date, hours: 5, tasks: 'العمل على التصاميم من المنزل', skills: 'Figma', submittedAt: `${addDays(date, 2)}T20:10:00`, company: 'disputed', academic: 'pending', disputeReason: 'لم يحضر الطالب إلى الشركة في هذا اليوم (عطلة)' })
  }
  logs.sort((a, b) => (a.date < b.date ? 1 : -1))

  for (const l of logs) {
    events.push({ at: l.submittedAt, actor: studentId, action: 'log_submitted', detail: { id: l.id, date: l.date, hours: l.hours } })
    if (l.company !== 'pending') events.push({ at: `${addDays(l.submittedAt.slice(0, 10), 1)}T10:15:00`, actor: 'k1', action: l.company === 'confirmed' ? 'log_confirmed' : 'log_disputed', detail: { date: l.date } })
    if (l.academic === 'approved') events.push({ at: `${addDays(l.submittedAt.slice(0, 10), 2)}T12:30:00`, actor: 'd1', action: 'log_approved', detail: { date: l.date } })
  }

  // weekly reports every 5 working days
  const reports = []
  const weeks = Math.floor(attendance.length / 5)
  for (let w = 1; w <= weeks; w++) {
    const date = attendance[w * 5 - 1].date
    const pending = quirks.lastWeeklyPending && w === weeks
    reports.push({ id: `${id}-w${w}`, type: 'weekly', week: w, text: `ملخص الأسبوع ${w}: ${TASKS[w % TASKS.length]}، و${TASKS[(w + 3) % TASKS.length]}.`, submittedAt: `${date}T18:00:00`, status: pending ? 'pending' : 'approved' })
    events.push({ at: `${date}T18:00:00`, actor: studentId, action: 'report_submitted', detail: { week: w } })
    if (!pending) events.push({ at: `${addDays(date, 2)}T11:00:00`, actor: 'd1', action: 'report_approved', detail: { week: w } })
  }

  const visits = (quirks.visitsDone || []).map((k) => {
    const date = attendance[k].date
    events.push({ at: `${date}T11:30:00`, actor: 'd1', action: 'visit', detail: { date } })
    return { date, status: 'excellent', notes: 'الطالب ملتزم ويعمل ضمن فريق التصميم على مشروع حقيقي، والمشرف في الشركة راضٍ عن أدائه.', recommendations: 'التركيز على توثيق قرارات التصميم في التقرير الأسبوعي.', by: 'd1' }
  })

  const appEvents = [
    { at: `${addDays(start, -20)}T09:00:00`, actor: studentId, action: 'applied', detail: {} },
    { at: `${addDays(start, -15)}T10:00:00`, actor: 'o1', action: 'app_accepted', detail: {} },
    { at: `${addDays(start, -14)}T10:05:00`, actor: 'o1', action: 'assigned', detail: { supervisor: 'd1' } },
    { at: `${addDays(start, -12)}T13:00:00`, actor: 'k1', action: 'company_accepted', detail: {} },
  ]

  return {
    id, studentId, oppId: opp.id, companyId: opp.companyId, supervisorId: 'd1', companySupId: 'k1',
    status: 'active', start, end, requiredHours: opp.requiredHours,
    attendance, logs, reports, visits, visitsRequired: 2,
    scores: { provider: null, academic: null, report: null }, providerEval: null, academicEval: null,
    companyRating: null,
    audit: buildChain([...appEvents, ...events].sort((a, b) => (a.at < b.at ? -1 : 1))),
  }
}

export function buildInitialState() {
  const today = todayStr()
  const yazan = makeTraining({
    id: 'r-yazan', studentId: 's4', start: addDays(today, -32), seed: 7,
    absences: [9], pendingTail: 3,
    quirks: { exceeds: 12, geoOutside: 15, duplicate: 20, late: 6, weekendClaim: true, skipLast: true, lastWeeklyPending: true, visitsDone: [8] },
  })
  const lana = makeTraining({
    id: 'r-lana', studentId: 's3', start: addDays(today, -63), seed: 3,
    absences: [17],
    quirks: { visitsDone: [10, 30] },
  })
  return {
    applications: [
      { id: 'a1', studentId: 's2', oppId: 'op3', status: 'submitted', createdAt: addDays(today, -6) },
      { id: 'a2', studentId: 's8', oppId: 'op3', status: 'under_review', createdAt: addDays(today, -8) },
      { id: 'a3', studentId: 's5', oppId: 'op2', status: 'submitted', createdAt: addDays(today, -4) },
      { id: 'a4', studentId: 's6', oppId: 'op4', status: 'accepted', createdAt: addDays(today, -11) },
      { id: 'a5', studentId: 's7', oppId: 'op5', status: 'needs_changes', createdAt: addDays(today, -9) },
      { id: 'a6', studentId: 's4', oppId: 'op1', status: 'active', createdAt: addDays(today, -52) },
      { id: 'a7', studentId: 's3', oppId: 'op1', status: 'active', createdAt: addDays(today, -83) },
    ],
    records: [yazan, lana],
    rules: structuredClone(defaultRules),
    rulesLog: [],
    certificates: [
      {
        id: 'TR-2026-0001', studentName: { ar: 'ريم سعيد', en: 'Reem Saeed' }, uniId: '20201111',
        major: 'design', companyId: 'c2', durationMonths: 2, hours: 240, score: 94, issuedOn: '2026-06-15',
        fingerprint: '7d1f0c2a9b8e4d3c6a5f1e0b9c8d7a6e5f4b3c2d1a0e9f8b7c6d5e4f3a2b1c0d',
      },
    ],
    tamperBackup: null,
  }
}
