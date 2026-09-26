import { createContext, useContext, useEffect, useState } from 'react'

const dict = {
  ar: {
    appName: 'تدريب',
    tagline: 'منصة إدارة التدريب الميداني',
    switchLang: 'English',
    logout: 'تسجيل الخروج',
    loginTitle: 'اختر حسابًا تجريبيًا للدخول',
    loginHint: 'هذه نسخة أولية ببيانات تجريبية — لا يوجد تسجيل دخول حقيقي بعد.',
    verifyLink: 'التحقق من شهادة',

    role_student: 'طالب',
    role_officer: 'مسؤول التدريب الميداني',
    role_supervisor: 'مشرف أكاديمي',

    nav_opportunities: 'فرص التدريب',
    nav_applications: 'طلباتي',
    nav_record: 'ملف التدريب',
    nav_dashboard: 'لوحة التحكم',
    nav_review: 'مراجعة الطلبات',
    nav_logs: 'سجلات الطلاب',

    seats: 'المقاعد',
    duration: 'المدة',
    months: 'أشهر',
    deadline: 'آخر موعد',
    requirements: 'الشروط',
    minHours: 'ساعات معتمدة لا تقل عن',
    majors: 'التخصصات',
    courses: 'مواد مطلوبة',
    eligible: 'أنت مؤهل للتقديم',
    notEligible: 'غير مؤهل',
    reason_hours: 'لم تكمل عدد الساعات المطلوبة ({have} من {need})',
    reason_major: 'تخصصك غير مطابق لهذه الفرصة',
    reason_course: 'لم تنجح في مادة: {course}',
    reason_incomplete: 'لديك تدريب سابق غير مكتمل',
    apply: 'قدّم الآن',
    applied: 'تم التقديم',
    applyConfirm: 'تم إرسال طلبك بنجاح',

    status: 'الحالة',
    status_submitted: 'مرسل',
    status_under_review: 'قيد المراجعة',
    status_needs_changes: 'بحاجة إلى تعديل',
    status_accepted: 'مقبول',
    status_rejected: 'مرفوض',
    status_assigned: 'تم التوزيع',
    noApplications: 'لم تقدم على أي فرصة بعد.',
    submittedOn: 'تاريخ التقديم',

    student: 'الطالب',
    opportunity: 'الفرصة',
    company: 'جهة التدريب',
    actions: 'الإجراءات',
    startReview: 'بدء المراجعة',
    accept: 'قبول',
    reject: 'رفض',
    requestChanges: 'طلب تعديل',
    assign: 'توزيع وتعيين مشرف',
    supervisor: 'المشرف الأكاديمي',

    stat_students: 'عدد الطلاب',
    stat_eligible: 'المؤهلين',
    stat_newApps: 'طلبات جديدة',
    stat_inTraining: 'قيد التدريب',
    stat_completed: 'أكملوا التدريب',
    stat_companies: 'جهات التدريب',
    stat_opportunities: 'فرص التدريب',
    stat_pendingLogs: 'سجلات بانتظار الاعتماد',

    noRecord: 'لا يوجد ملف تدريب بعد. سيُفتح ملفك بعد توزيعك على جهة تدريب.',
    hoursProgress: 'الساعات المنجزة',
    of: 'من',
    period: 'الفترة',
    addLog: 'إضافة سجل يومي',
    date: 'التاريخ',
    hours: 'عدد الساعات',
    tasks: 'المهام',
    skills: 'المهارات المكتسبة',
    save: 'حفظ',
    dailyLog: 'السجل اليومي',
    noLogs: 'لا توجد سجلات بعد.',
    log_pending: 'بانتظار الاعتماد',
    log_approved: 'معتمد',
    log_returned: 'مُعاد للتعديل',
    approve: 'اعتماد',
    returnLog: 'إرجاع',
    noPendingLogs: 'لا توجد سجلات بانتظار الاعتماد.',
    myStudents: 'طلابي',

    verifyTitle: 'التحقق من شهادة تدريب',
    certNumber: 'رقم الشهادة',
    verify: 'تحقق',
    certValid: 'الشهادة صحيحة',
    certInvalid: 'لم يتم العثور على شهادة بهذا الرقم',
    universityName: 'الجامعة التجريبية',
    uniId: 'الرقم الجامعي',
    major: 'التخصص',
    result: 'النتيجة',
    issuedOn: 'تاريخ الإصدار',
    back: 'رجوع',
    resetDemo: 'إعادة ضبط البيانات التجريبية',
  },
  en: {
    appName: 'Tadreeb',
    tagline: 'Field Training Management Platform',
    switchLang: 'العربية',
    logout: 'Log out',
    loginTitle: 'Pick a demo account to sign in',
    loginHint: 'This is an early prototype with demo data — no real login yet.',
    verifyLink: 'Verify a certificate',

    role_student: 'Student',
    role_officer: 'Field Training Officer',
    role_supervisor: 'Academic Supervisor',

    nav_opportunities: 'Opportunities',
    nav_applications: 'My applications',
    nav_record: 'Training record',
    nav_dashboard: 'Dashboard',
    nav_review: 'Review applications',
    nav_logs: 'Student logs',

    seats: 'Seats',
    duration: 'Duration',
    months: 'months',
    deadline: 'Deadline',
    requirements: 'Requirements',
    minHours: 'Minimum credit hours',
    majors: 'Majors',
    courses: 'Required courses',
    eligible: 'You are eligible to apply',
    notEligible: 'Not eligible',
    reason_hours: 'Required credit hours not completed ({have} of {need})',
    reason_major: 'Your major does not match this opportunity',
    reason_course: 'Course not passed: {course}',
    reason_incomplete: 'You have an incomplete previous training',
    apply: 'Apply now',
    applied: 'Applied',
    applyConfirm: 'Your application was submitted',

    status: 'Status',
    status_submitted: 'Submitted',
    status_under_review: 'Under review',
    status_needs_changes: 'Needs changes',
    status_accepted: 'Accepted',
    status_rejected: 'Rejected',
    status_assigned: 'Assigned',
    noApplications: "You haven't applied to any opportunity yet.",
    submittedOn: 'Submitted on',

    student: 'Student',
    opportunity: 'Opportunity',
    company: 'Training provider',
    actions: 'Actions',
    startReview: 'Start review',
    accept: 'Accept',
    reject: 'Reject',
    requestChanges: 'Request changes',
    assign: 'Assign & set supervisor',
    supervisor: 'Academic supervisor',

    stat_students: 'Students',
    stat_eligible: 'Eligible',
    stat_newApps: 'New applications',
    stat_inTraining: 'In training',
    stat_completed: 'Completed',
    stat_companies: 'Training providers',
    stat_opportunities: 'Opportunities',
    stat_pendingLogs: 'Logs awaiting approval',

    noRecord: "No training record yet. It opens once you're assigned to a training provider.",
    hoursProgress: 'Hours completed',
    of: 'of',
    period: 'Period',
    addLog: 'Add daily log',
    date: 'Date',
    hours: 'Hours',
    tasks: 'Tasks',
    skills: 'Skills gained',
    save: 'Save',
    dailyLog: 'Daily log',
    noLogs: 'No logs yet.',
    log_pending: 'Awaiting approval',
    log_approved: 'Approved',
    log_returned: 'Returned',
    approve: 'Approve',
    returnLog: 'Return',
    noPendingLogs: 'No logs awaiting approval.',
    myStudents: 'My students',

    verifyTitle: 'Verify a training certificate',
    certNumber: 'Certificate number',
    verify: 'Verify',
    certValid: 'Certificate is valid',
    certInvalid: 'No certificate found with this number',
    universityName: 'Demo University',
    uniId: 'University ID',
    major: 'Major',
    result: 'Result',
    issuedOn: 'Issued on',
    back: 'Back',
    resetDemo: 'Reset demo data',
  },
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('tadreeb-lang') || 'ar'
    } catch {
      return 'ar'
    }
  })

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try {
      localStorage.setItem('tadreeb-lang', lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])

  // t('key', {var: value}) looks up a UI string; L({ar, en}) picks a data field
  const t = (key, vars = {}) =>
    (dict[lang][key] ?? key).replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? '')
  const L = (obj) => (obj && typeof obj === 'object' ? obj[lang] : obj)
  const toggle = () => setLang(lang === 'ar' ? 'en' : 'ar')

  return <LangContext.Provider value={{ lang, t, L, toggle }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
