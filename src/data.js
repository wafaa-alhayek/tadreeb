// Demo seed data. Replaced by a real backend in a later phase.

// inLogin: false → background data only (appears in tables, not on the login screen)
export const users = [
  { id: 's1', role: 'student', name: { ar: 'أمل أحمد', en: 'Amal Ahmad' } },
  { id: 's2', role: 'student', name: { ar: 'عمر خالد', en: 'Omar Khaled' } },
  { id: 's3', role: 'student', name: { ar: 'لانا محمود', en: 'Lana Mahmoud' } },
  { id: 'o1', role: 'officer', name: { ar: 'سارة يوسف', en: 'Sara Yousef' } },
  { id: 'd1', role: 'supervisor', name: { ar: 'د. محمد علي', en: 'Dr. Mohammad Ali' } },
  { id: 'd2', role: 'supervisor', name: { ar: 'د. ليلى حسن', en: 'Dr. Layla Hasan' } },
  { id: 's4', role: 'student', inLogin: false, name: { ar: 'يزن عبد الله', en: 'Yazan Abdullah' } },
  { id: 's5', role: 'student', inLogin: false, name: { ar: 'نور الهدى سالم', en: 'Nour Salem' } },
  { id: 's6', role: 'student', inLogin: false, name: { ar: 'هادي منصور', en: 'Hadi Mansour' } },
  { id: 's7', role: 'student', inLogin: false, name: { ar: 'رنا القاسم', en: 'Rana Alqasem' } },
]

// Academic profile used by the automatic eligibility check
export const students = {
  s1: { uniId: '20211234', major: 'design', completedHours: 102, passedCourses: ['UX101', 'GD201'], hasIncompleteTraining: false },
  s2: { uniId: '20225678', major: 'cs', completedHours: 64, passedCourses: ['CS101'], hasIncompleteTraining: false },
  s3: { uniId: '20203344', major: 'design', completedHours: 118, passedCourses: ['UX101', 'GD201'], hasIncompleteTraining: false },
  s4: { uniId: '20219021', major: 'design', completedHours: 96, passedCourses: ['UX101'], hasIncompleteTraining: false },
  s5: { uniId: '20214410', major: 'design', completedHours: 99, passedCourses: ['GD201'], hasIncompleteTraining: false },
  s6: { uniId: '20207788', major: 'cs', completedHours: 110, passedCourses: ['CS101', 'CS220'], hasIncompleteTraining: false },
  s7: { uniId: '20216502', major: 'business', completedHours: 93, passedCourses: ['BA110'], hasIncompleteTraining: false },
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
  { id: 'op1', title: { ar: 'مصمم واجهات UI/UX', en: 'UI/UX Designer' }, companyId: 'c1', seats: 5, durationMonths: 3, deadline: '2026-10-30',
    requirements: { minHours: 90, majors: ['design'], courses: ['UX101'] } },
  { id: 'op2', title: { ar: 'مصمم جرافيك', en: 'Graphic Designer' }, companyId: 'c2', seats: 3, durationMonths: 2, deadline: '2026-11-15',
    requirements: { minHours: 80, majors: ['design'], courses: ['GD201'] } },
  { id: 'op3', title: { ar: 'مطور واجهات أمامية', en: 'Front-end Developer' }, companyId: 'c3', seats: 4, durationMonths: 3, deadline: '2026-10-20',
    requirements: { minHours: 90, majors: ['cs', 'design'], courses: [] } },
  { id: 'op4', title: { ar: 'مطور تطبيقات موبايل', en: 'Mobile App Developer' }, companyId: 'c3', seats: 2, durationMonths: 3, deadline: '2026-11-01',
    requirements: { minHours: 100, majors: ['cs'], courses: ['CS220'] } },
  { id: 'op5', title: { ar: 'متدرب خدمات مصرفية رقمية', en: 'Digital Banking Trainee' }, companyId: 'c4', seats: 6, durationMonths: 2, deadline: '2026-10-25',
    requirements: { minHours: 90, majors: ['business', 'cs'], courses: [] } },
  { id: 'op6', title: { ar: 'مصمم تجربة المرضى', en: 'Patient Experience Designer' }, companyId: 'c5', seats: 2, durationMonths: 2, deadline: '2026-11-10',
    requirements: { minHours: 90, majors: ['design'], courses: ['UX101'] } },
]

// Institution-wide numbers so the dashboard looks like a real university.
// Live actions in the demo are added on top of these.
export const baseline = {
  students: 1250, eligible: 980, newApps: 126, inTraining: 540, completed: 320,
  late: 27, companies: 85, opportunities: 140, attendance: 91,
  byStatus: { submitted: 126, under_review: 58, needs_changes: 14, accepted: 72, rejected: 31, assigned: 540 },
  byCollege: [
    { ar: 'تكنولوجيا المعلومات', en: 'Information Technology', value: 164 },
    { ar: 'الهندسة', en: 'Engineering', value: 131 },
    { ar: 'الأعمال', en: 'Business', value: 102 },
    { ar: 'العلوم الطبية المساندة', en: 'Allied Medical Sciences', value: 83 },
    { ar: 'الفنون والتصميم', en: 'Arts & Design', value: 60 },
  ],
}

// Evaluation weights set by the university (sum = 1)
export const weights = { provider: 0.4, academic: 0.4, report: 0.2 }

// 40 approved 6-hour days for Lana's finished training
const lanaLogs = Array.from({ length: 40 }, (_, i) => {
  const d = new Date('2026-06-01')
  d.setDate(d.getDate() + Math.floor(i * 1.4))
  return {
    id: 'll' + i,
    date: d.toISOString().slice(0, 10),
    hours: 6,
    tasks: i % 2 ? 'تصميم هوية بصرية لحملة إعلانية' : 'إعداد نماذج أولية في Figma',
    skills: 'Figma, Branding',
    status: 'approved',
  }
}).reverse()

export const initialState = {
  applications: [
    { id: 'a1', studentId: 's2', oppId: 'op3', status: 'submitted', createdAt: '2026-09-20' },
    { id: 'a2', studentId: 's4', oppId: 'op1', status: 'under_review', createdAt: '2026-09-18' },
    { id: 'a3', studentId: 's5', oppId: 'op2', status: 'submitted', createdAt: '2026-09-22' },
    { id: 'a4', studentId: 's6', oppId: 'op4', status: 'accepted', createdAt: '2026-09-15' },
    { id: 'a5', studentId: 's7', oppId: 'op5', status: 'needs_changes', createdAt: '2026-09-17' },
    { id: 'a6', studentId: 's3', oppId: 'op2', status: 'assigned', createdAt: '2026-05-10' },
  ],
  records: [
    {
      id: 'r-lana', studentId: 's3', oppId: 'op2', supervisorId: 'd2',
      start: '2026-06-01', end: '2026-07-31', requiredHours: 240,
      attendance: 96, finalReport: 'approved',
      visits: { required: 2, done: 2 },
      scores: { provider: 92, academic: 88, report: 95 },
      logs: lanaLogs,
    },
  ],
  certificates: [
    {
      id: 'TR-2026-0001', studentName: { ar: 'ريم سعيد', en: 'Reem Saeed' }, uniId: '20201111',
      major: 'design', companyId: 'c2', durationMonths: 2, hours: 240, score: 94, issuedOn: '2026-06-15',
    },
  ],
}

// Returns { ok, reasons: [{ key, vars }] } — the automatic eligibility check
export function checkEligibility(studentId, opp) {
  const s = students[studentId]
  const r = opp.requirements
  const reasons = []
  if (s.completedHours < r.minHours)
    reasons.push({ key: 'reason_hours', vars: { have: s.completedHours, need: r.minHours } })
  if (!r.majors.includes(s.major)) reasons.push({ key: 'reason_major' })
  for (const c of r.courses)
    if (!s.passedCourses.includes(c)) reasons.push({ key: 'reason_course', vars: { course: c } })
  if (s.hasIncompleteTraining) reasons.push({ key: 'reason_incomplete' })
  return { ok: reasons.length === 0, reasons }
}

export const approvedHours = (record) =>
  record.logs.filter((l) => l.status === 'approved').reduce((n, l) => n + l.hours, 0)

// Weighted final grade, or null while any evaluation is missing
export function finalScore(record) {
  const s = record.scores
  if (s.provider == null || s.academic == null || s.report == null) return null
  return Math.round(s.provider * weights.provider + s.academic * weights.academic + s.report * weights.report)
}

export function gradeLabel(score) {
  if (score >= 90) return { ar: 'ممتاز', en: 'Excellent' }
  if (score >= 80) return { ar: 'جيد جدًا', en: 'Very good' }
  if (score >= 70) return { ar: 'جيد', en: 'Good' }
  return { ar: 'مقبول', en: 'Pass' }
}

// The completion checklist that must be all green before a certificate is issued
export function checkCompletion(record) {
  const hours = approvedHours(record)
  const s = record.scores
  return [
    { key: 'c_hours', ok: hours >= record.requiredHours, detail: `${hours} / ${record.requiredHours}` },
    { key: 'c_attendance', ok: record.attendance != null && record.attendance >= 90, detail: record.attendance != null ? record.attendance + '%' : '—' },
    { key: 'c_report', ok: record.finalReport === 'approved' },
    { key: 'c_evals', ok: finalScore(record) != null, detail: [s.provider, s.academic, s.report].filter((x) => x != null).length + ' / 3' },
    { key: 'c_visits', ok: record.visits.done >= record.visits.required, detail: `${record.visits.done} / ${record.visits.required}` },
    { key: 'c_pending', ok: !record.logs.some((l) => l.status === 'pending') },
  ]
}

// Demo shortcut: the verify link carries the certificate data itself (base64url JSON)
// so a phone scanning the QR can verify it without a server. A real system would
// look the certificate number up in its database instead.
export function encodeCert(c) {
  const json = JSON.stringify([c.id, c.studentName, c.uniId, c.major, c.companyId, c.durationMonths, c.hours, c.score, c.issuedOn])
  const bytes = new TextEncoder().encode(json)
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeCert(str) {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0))
    const [id, studentName, uniId, major, companyId, durationMonths, hours, score, issuedOn] = JSON.parse(new TextDecoder().decode(bytes))
    return { id, studentName, uniId, major, companyId, durationMonths, hours, score, issuedOn }
  } catch {
    return null
  }
}

export function verifyUrl(cert) {
  return `${location.origin}${location.pathname}#/verify/${cert.id}?d=${encodeCert(cert)}`
}
