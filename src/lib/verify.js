// The verification engine: every rule that decides whether a claimed hour is real.
import { sha256 } from './sha256.js'

// ---------- dates ----------
export const ymd = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const todayStr = () => ymd(new Date())
export const addDays = (dateStr, n) => {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return ymd(d)
}
export const daysBetween = (a, b) =>
  Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000)
export const hhmm = (d = new Date()) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
export const fmtTime = (iso) => {
  const d = new Date(iso)
  return `${ymd(d)} ${hhmm(d)}`
}

// Friday & Saturday are the weekend
export const isWeekend = (dateStr) => [5, 6].includes(new Date(dateStr + 'T12:00:00').getDay())

// ---------- rotating attendance code ----------
// The company screen shows a code that changes every 30 s, derived from a
// per-company secret, so a code photographed and sent to a friend expires quickly.
const WINDOW_MS = 30_000
const GRACE_WINDOWS = 3 // demo-friendly: accept codes up to ~2 minutes old
const SECRET = 'tadreeb-demo-attendance-secret'

export function attendanceCode(companyId, t = Date.now()) {
  const w = Math.floor(t / WINDOW_MS)
  return String(parseInt(sha256(`${SECRET}:${companyId}:${w}`).slice(0, 8), 16) % 1_000_000).padStart(6, '0')
}
export const secondsLeft = (t = Date.now()) => Math.ceil((WINDOW_MS - (t % WINDOW_MS)) / 1000)
export function isValidCode(code, companyId, t = Date.now()) {
  for (let i = 0; i <= GRACE_WINDOWS; i++)
    if (attendanceCode(companyId, t - i * WINDOW_MS) === code.trim()) return true
  return false
}

// ---------- attendance ----------
const toMin = (s) => {
  const [h, m] = s.split(':').map(Number)
  return h * 60 + m
}
export const attendanceOn = (record, date) => record.attendance.find((a) => a.date === date)
export function attendedHours(record, date) {
  const a = attendanceOn(record, date)
  if (!a || !a.out) return 0
  return Math.round(((toMin(a.out) - toMin(a.in)) / 60) * 10) / 10
}

// Share of working days (from start until yesterday, or until the end date) with a check-in
export function attendanceRate(record) {
  if (record.status === 'pending_company') return null
  const last = record.end < todayStr() ? record.end : addDays(todayStr(), -1)
  let working = 0
  let present = 0
  for (let d = record.start; d <= last; d = addDays(d, 1)) {
    if (isWeekend(d)) continue
    working++
    if (attendanceOn(record, d)) present++
  }
  return working === 0 ? null : Math.round((present / working) * 100)
}

// ---------- daily log checks ----------
const norm = (s) => s.replace(/\s+/g, ' ').trim()

// Returns [{ key, severity, vars }] — 'high' = strong evidence against the claim, 'warn' = worth a human look
export function logFlags(record, log) {
  const flags = []
  const att = attendanceOn(record, log.date)
  const attended = attendedHours(record, log.date)
  if (!att) flags.push({ key: 'f_no_attendance', severity: 'high' })
  else if (log.hours > attended + 0.25)
    flags.push({ key: 'f_exceeds', severity: 'high', vars: { claimed: log.hours, attended } })
  if (att && att.geo === 'outside') flags.push({ key: 'f_geo', severity: 'high' })
  if (isWeekend(log.date)) flags.push({ key: 'f_weekend', severity: 'high' })
  if (log.hours > 10) flags.push({ key: 'f_over_limit', severity: 'high' })
  const lateDays = daysBetween(log.date, log.submittedAt.slice(0, 10))
  if (lateDays > 3) flags.push({ key: 'f_late', severity: 'warn', vars: { days: lateDays } })
  const dup = record.logs.find(
    (o) => o.id !== log.id && o.date < log.date && daysBetween(o.date, log.date) <= 14 && norm(o.tasks) === norm(log.tasks),
  )
  if (dup) flags.push({ key: 'f_duplicate', severity: 'warn', vars: { date: dup.date } })
  return flags
}

// Where a log sits in its chain of trust
export function logStage(log) {
  if (log.company === 'disputed' || log.academic === 'returned') return 'rejected'
  if (log.company === 'pending') return 'awaiting_company'
  if (log.academic === 'pending') return 'awaiting_academic'
  return 'verified'
}

// Hours that count: fully approved logs, never more than the attendance recorded that day
export function countedHours(record, log) {
  if (logStage(log) !== 'verified') return 0
  return Math.floor(Math.min(log.hours, attendedHours(record, log.date)) * 2) / 2
}

export function hoursSummary(record) {
  let claimed = 0, counted = 0, pending = 0, cut = 0
  for (const l of record.logs) {
    const stage = logStage(l)
    claimed += l.hours
    if (stage === 'verified') {
      const c = countedHours(record, l)
      counted += c
      cut += l.hours - c
    } else if (stage === 'rejected') cut += l.hours
    else pending += l.hours
  }
  const r = (x) => Math.round(x * 10) / 10
  return { claimed: r(claimed), counted: r(counted), pending: r(pending), cut: r(cut), required: record.requiredHours }
}

// ---------- stage in the training timeline ----------
export function trainingStage(record) {
  if (record.status === 'pending_company') return 'new'
  if (record.status === 'completed') return 'done'
  const { counted, required } = hoursSummary(record)
  if (counted >= required || record.end < todayStr()) return 'final'
  return 'active'
}

// ---------- grading & completion ----------
export const weights = { provider: 0.4, academic: 0.4, report: 0.2 }

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

export function checkCompletion(record) {
  const h = hoursSummary(record)
  const rate = attendanceRate(record)
  const weekly = record.reports.filter((r) => r.type === 'weekly')
  const final = record.reports.find((r) => r.type === 'final')
  const s = record.scores
  return [
    { key: 'c_hours', ok: h.counted >= h.required, detail: `${h.counted} / ${h.required}` },
    { key: 'c_attendance', ok: rate != null && rate >= 90, detail: rate != null ? rate + '%' : '—' },
    { key: 'c_pending', ok: !record.logs.some((l) => ['awaiting_company', 'awaiting_academic'].includes(logStage(l))) },
    { key: 'c_weekly', ok: weekly.length > 0 && weekly.every((r) => r.status === 'approved'), detail: `${weekly.filter((r) => r.status === 'approved').length} / ${weekly.length}` },
    { key: 'c_visits', ok: record.visits.length >= record.visitsRequired, detail: `${record.visits.length} / ${record.visitsRequired}` },
    { key: 'c_final', ok: final?.status === 'approved' },
    { key: 'c_eval_provider', ok: s.provider != null, detail: s.provider != null ? s.provider + '%' : null },
    { key: 'c_eval_academic', ok: s.academic != null, detail: s.academic != null ? s.academic + '%' : null },
    { key: 'c_eval_student', ok: record.companyRating != null },
  ]
}

// ---------- tamper-evident audit trail ----------
// Each entry's hash covers the previous hash + its own content, so editing any
// past entry (or deleting one) breaks every hash after it.
const GENESIS = '0'.repeat(64)
const entryHash = (prev, e) => sha256(prev + JSON.stringify([e.at, e.actor, e.action, e.detail]))

export function appendAudit(audit, entry) {
  const prev = audit.length ? audit[audit.length - 1].hash : GENESIS
  return [...audit, { ...entry, prev, hash: entryHash(prev, entry) }]
}

export function buildChain(entries) {
  return entries.reduce((chain, e) => appendAudit(chain, e), [])
}

// Checks the hash chain, and that every log still matches what was recorded when it was submitted
export function checkIntegrity(record) {
  const issues = []
  let prev = GENESIS
  record.audit.forEach((e, i) => {
    if (e.prev !== prev || entryHash(prev, e) !== e.hash) {
      if (!issues.some((x) => x.type === 'chain')) issues.push({ type: 'chain', index: i + 1, at: e.at })
    }
    prev = e.hash
  })
  for (const l of record.logs) {
    const sub = record.audit.find((e) => e.action === 'log_submitted' && e.detail.id === l.id)
    if (sub && sub.detail.hours !== l.hours)
      issues.push({ type: 'mismatch', date: l.date, recorded: sub.detail.hours, now: l.hours })
  }
  return { ok: issues.length === 0, entries: record.audit.length, issues }
}

export const fingerprint = (record) => (record.audit.length ? record.audit[record.audit.length - 1].hash : GENESIS)
