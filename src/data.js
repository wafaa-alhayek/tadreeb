// Demo seed data. Replaced by a real backend in a later phase.

export const users = [
  { id: 's1', role: 'student', name: { ar: 'أمل أحمد', en: 'Amal Ahmad' } },
  { id: 's2', role: 'student', name: { ar: 'عمر خالد', en: 'Omar Khaled' } },
  { id: 'o1', role: 'officer', name: { ar: 'سارة يوسف', en: 'Sara Yousef' } },
  { id: 'd1', role: 'supervisor', name: { ar: 'د. محمد علي', en: 'Dr. Mohammad Ali' } },
  { id: 'd2', role: 'supervisor', name: { ar: 'د. ليلى حسن', en: 'Dr. Layla Hasan' } },
]

// Academic profile used by the automatic eligibility check
export const students = {
  s1: {
    uniId: '20211234',
    major: 'design',
    completedHours: 102,
    passedCourses: ['UX101', 'GD201'],
    hasIncompleteTraining: false,
  },
  s2: {
    uniId: '20225678',
    major: 'cs',
    completedHours: 64,
    passedCourses: ['CS101'],
    hasIncompleteTraining: false,
  },
}

export const majors = {
  design: { ar: 'التصميم الجرافيكي وتجربة المستخدم', en: 'Graphic Design & UX' },
  cs: { ar: 'علم الحاسوب', en: 'Computer Science' },
}

export const companies = {
  c1: { ar: 'شركة X للحلول الرقمية', en: 'X Digital Solutions' },
  c2: { ar: 'استوديو نون للتصميم', en: 'Noon Design Studio' },
  c3: { ar: 'تك هب', en: 'TechHub' },
}

export const opportunities = [
  {
    id: 'op1',
    title: { ar: 'مصمم واجهات UI/UX', en: 'UI/UX Designer' },
    companyId: 'c1',
    seats: 5,
    durationMonths: 3,
    deadline: '2026-10-30',
    requirements: { minHours: 90, majors: ['design'], courses: ['UX101'] },
  },
  {
    id: 'op2',
    title: { ar: 'مصمم جرافيك', en: 'Graphic Designer' },
    companyId: 'c2',
    seats: 3,
    durationMonths: 2,
    deadline: '2026-11-15',
    requirements: { minHours: 80, majors: ['design'], courses: ['GD201'] },
  },
  {
    id: 'op3',
    title: { ar: 'مطور واجهات أمامية', en: 'Front-end Developer' },
    companyId: 'c3',
    seats: 4,
    durationMonths: 3,
    deadline: '2026-10-20',
    requirements: { minHours: 90, majors: ['cs', 'design'], courses: [] },
  },
]

export const initialState = {
  applications: [
    { id: 'a1', studentId: 's2', oppId: 'op3', status: 'submitted', createdAt: '2026-09-20' },
  ],
  records: [],
  certificates: [
    {
      id: 'TR-2026-0001',
      studentName: { ar: 'ريم سعيد', en: 'Reem Saeed' },
      uniId: '20201111',
      major: 'design',
      companyId: 'c2',
      durationMonths: 2,
      hours: 240,
      result: { ar: 'ممتاز (94%)', en: 'Excellent (94%)' },
      issuedOn: '2026-06-15',
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
