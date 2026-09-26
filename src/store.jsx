import { createContext, useContext, useEffect, useState } from 'react'
import { buildInitialState, oppById, students, userById } from './data.js'
import { signCert } from './lib/signing.js'
import {
  addDays, appendAudit, buildChain, finalScore, fingerprint, hhmm, hoursSummary, todayStr,
} from './lib/verify.js'

const KEY = 'tadreeb-state-v4'
const StoreContext = createContext(null)

const now = () => new Date().toISOString()
const uid = () => Math.random().toString(36).slice(2, 9)

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* storage unavailable */
  }
  return buildInitialState()
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const [userId, setUserId] = useState(() => {
    try {
      return sessionStorage.getItem('tadreeb-user')
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable */
    }
  }, [state])

  useEffect(() => {
    try {
      if (userId) sessionStorage.setItem('tadreeb-user', userId)
      else sessionStorage.removeItem('tadreeb-user')
    } catch {
      /* storage unavailable */
    }
  }, [userId])

  // Seeded certificates are signed on first load
  useEffect(() => {
    const unsigned = state.certificates.filter((c) => !c.sig)
    if (!unsigned.length) return
    Promise.all(unsigned.map(async (c) => ({ id: c.id, sig: await signCert(c) }))).then((sigs) =>
      setState((s) => ({
        ...s,
        certificates: s.certificates.map((c) => ({ ...c, sig: c.sig || sigs.find((x) => x.id === c.id)?.sig })),
      })),
    )
  }, [state.certificates])

  // Applies fn to one record and appends an audit entry signed by the current user.
  // detail may be a function of the record before the change.
  const updateRecord = (recordId, fn, action, detail = {}) =>
    setState((s) => ({
      ...s,
      records: s.records.map((r) => {
        if (r.id !== recordId) return r
        const next = fn(r)
        const d = typeof detail === 'function' ? detail(r) : detail
        const a = typeof action === 'function' ? action(r) : action
        return { ...next, audit: appendAudit(next.audit, { at: now(), actor: userId, action: a, detail: d }) }
      }),
    }))

  const actions = {
    login: setUserId,
    logout: () => setUserId(null),
    reset: () => setState(buildInitialState()),

    // ----- applications -----
    apply: (studentId, oppId) =>
      setState((s) => ({
        ...s,
        applications: [
          ...s.applications,
          { id: uid(), studentId, oppId, status: 'submitted', createdAt: todayStr(), history: [{ at: now(), actor: studentId, action: 'applied', detail: {} }] },
        ],
      })),

    setStatus: (appId, status) =>
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === appId
            ? { ...a, status, companyRejected: false, history: [...(a.history || []), { at: now(), actor: userId, action: 'app_' + status, detail: {} }] }
            : a,
        ),
      })),

    // Assigning opens a Training Record that waits for the company to accept the student
    assign: (appId, supervisorId) =>
      setState((s) => {
        const app = s.applications.find((a) => a.id === appId)
        const opp = oppById(app.oppId)
        const start = todayStr()
        const history = [...(app.history || []), { at: now(), actor: userId, action: 'assigned', detail: { supervisor: supervisorId } }]
        return {
          ...s,
          applications: s.applications.map((a) => (a.id === appId ? { ...a, status: 'assigned', history } : a)),
          records: [
            ...s.records.filter((r) => r.studentId !== app.studentId),
            {
              id: 'r-' + uid(), studentId: app.studentId, oppId: opp.id, companyId: opp.companyId,
              supervisorId, companySupId: 'k1', status: 'pending_company',
              start, end: addDays(start, opp.durationMonths * 30), requiredHours: opp.requiredHours,
              attendance: [], logs: [], reports: [], visits: [], visitsRequired: 2,
              scores: { provider: null, academic: null, report: null }, providerEval: null, academicEval: null,
              companyRating: null,
              audit: buildChain(history),
            },
          ],
        }
      }),

    // ----- company -----
    companyAccept: (recordId) => {
      setState((s) => {
        const r = s.records.find((x) => x.id === recordId)
        return { ...s, applications: s.applications.map((a) => (a.studentId === r.studentId && a.status === 'assigned' ? { ...a, status: 'active' } : a)) }
      })
      updateRecord(recordId, (r) => ({ ...r, status: 'active', start: todayStr() }), 'company_accepted')
    },

    // Exception case: the company declines the student → back to the officer for reassignment
    companyReject: (recordId) =>
      setState((s) => {
        const r = s.records.find((x) => x.id === recordId)
        return {
          ...s,
          records: s.records.filter((x) => x.id !== recordId),
          applications: s.applications.map((a) =>
            a.studentId === r.studentId && a.status === 'assigned'
              ? { ...a, status: 'accepted', companyRejected: true, history: [...(a.history || []), { at: now(), actor: userId, action: 'company_rejected', detail: {} }] }
              : a,
          ),
        }
      }),

    // Check-in on the first valid code of the day, check-out on the second
    scanAttendance: (recordId) => {
      const t = hhmm()
      const date = todayStr()
      setState((s) => ({
        ...s,
        records: s.records.map((r) => {
          if (r.id !== recordId) return r
          const existing = r.attendance.find((a) => a.date === date)
          const attendance = existing
            ? r.attendance.map((a) => (a.date === date ? { ...a, out: t } : a))
            : [...r.attendance, { date, in: t, out: null, geo: 'inside' }]
          return {
            ...r,
            attendance,
            audit: appendAudit(r.audit, { at: now(), actor: userId, action: existing ? 'checkout' : 'checkin', detail: { date, time: t } }),
          }
        }),
      }))
    },

    reviewLogCompany: (recordId, logId, decision, reason) =>
      updateRecord(
        recordId,
        (r) => ({ ...r, logs: r.logs.map((l) => (l.id === logId ? { ...l, company: decision, disputeReason: reason } : l)) }),
        decision === 'confirmed' ? 'log_confirmed' : 'log_disputed',
        (r) => ({ date: r.logs.find((l) => l.id === logId).date }),
      ),

    evaluateProvider: (recordId, criteria) => {
      const vals = Object.values(criteria)
      const score = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20)
      updateRecord(recordId, (r) => ({ ...r, providerEval: criteria, scores: { ...r.scores, provider: score } }), 'eval_provider', { score })
    },

    // ----- student -----
    addLog: (recordId, log) => {
      const id = uid()
      updateRecord(
        recordId,
        (r) => ({ ...r, logs: [{ id, ...log, submittedAt: now(), company: 'pending', academic: 'pending' }, ...r.logs].sort((a, b) => (a.date < b.date ? 1 : -1)) }),
        'log_submitted',
        { id, date: log.date, hours: log.hours },
      )
    },

    submitReport: (recordId, type, text) =>
      updateRecord(
        recordId,
        (r) => {
          const week = r.reports.filter((x) => x.type === 'weekly').length + 1
          const others = type === 'final' ? r.reports.filter((x) => x.type !== 'final') : r.reports
          return { ...r, reports: [...others, { id: uid(), type, week: type === 'weekly' ? week : null, text, submittedAt: now(), status: 'pending' }] }
        },
        type === 'final' ? 'final_submitted' : 'report_submitted',
        (r) => (type === 'weekly' ? { week: r.reports.filter((x) => x.type === 'weekly').length + 1 } : {}),
      ),

    rateCompany: (recordId, rating, comment) =>
      updateRecord(recordId, (r) => ({ ...r, companyRating: { rating, comment } }), 'eval_student', { rating }),

    // ----- academic supervisor -----
    reviewLogAcademic: (recordId, logId, decision) =>
      updateRecord(
        recordId,
        (r) => ({ ...r, logs: r.logs.map((l) => (l.id === logId ? { ...l, academic: decision } : l)) }),
        decision === 'approved' ? 'log_approved' : 'log_returned',
        (r) => ({ date: r.logs.find((l) => l.id === logId).date }),
      ),

    reviewReport: (recordId, reportId, decision, grade) =>
      updateRecord(
        recordId,
        (r) => {
          const rep = r.reports.find((x) => x.id === reportId)
          const isFinal = rep.type === 'final'
          return {
            ...r,
            reports: r.reports.map((x) => (x.id === reportId ? { ...x, status: decision } : x)),
            scores: isFinal && decision === 'approved' ? { ...r.scores, report: grade } : r.scores,
          }
        },
        (r) => {
          const rep = r.reports.find((x) => x.id === reportId)
          return rep.type === 'final' ? (decision === 'approved' ? 'final_approved' : 'final_returned') : decision === 'approved' ? 'report_approved' : 'report_returned'
        },
        (r) => ({ week: r.reports.find((x) => x.id === reportId).week, grade }),
      ),

    addVisit: (recordId, visit) =>
      updateRecord(recordId, (r) => ({ ...r, visits: [...r.visits, { ...visit, by: userId }] }), 'visit', { date: visit.date }),

    evaluateAcademic: (recordId, criteria) => {
      const vals = Object.values(criteria)
      const score = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20)
      updateRecord(recordId, (r) => ({ ...r, academicEval: criteria, scores: { ...r.scores, academic: score } }), 'eval_academic', { score })
    },

    // Supervisor edits the eligibility rules of a major; every change is logged
    updateRules: (major, rules) =>
      setState((s) => ({
        ...s,
        rules: { ...s.rules, [major]: { ...rules, updatedBy: userId, updatedAt: now() } },
        rulesLog: [{ at: now(), actor: userId, major, before: s.rules[major], after: rules }, ...s.rulesLog],
      })),

    // ----- officer -----
    issueCertificate: async (recordId) => {
      const r = state.records.find((x) => x.id === recordId)
      const opp = oppById(r.oppId)
      const cert = {
        id: `TR-2026-${String(state.certificates.length + 1).padStart(4, '0')}`,
        recordId,
        studentId: r.studentId,
        studentName: userById(r.studentId).name,
        uniId: students[r.studentId].uniId,
        major: students[r.studentId].major,
        companyId: opp.companyId,
        durationMonths: opp.durationMonths,
        hours: hoursSummary(r).counted,
        score: finalScore(r),
        issuedOn: todayStr(),
        fingerprint: fingerprint(r),
      }
      cert.sig = await signCert(cert)
      setState((s) => ({
        ...s,
        certificates: [...s.certificates, cert],
        applications: s.applications.map((a) => (a.studentId === r.studentId && a.status === 'active' ? { ...a, status: 'completed' } : a)),
      }))
      updateRecord(recordId, (x) => ({ ...x, status: 'completed' }), 'cert_issued', { id: cert.id })
    },

    // Demo of an unauthorised edit made directly in the database: changes a log's hours
    // AND rewrites its audit entry to match — the hash chain still exposes it.
    simulateTamper: (recordId) =>
      setState((s) => {
        const r = s.records.find((x) => x.id === recordId)
        const target = r.logs.find((l) => l.company === 'confirmed' && l.academic === 'approved' && l.hours < 9)
        const logs = r.logs.map((l) => (l.id === target.id ? { ...l, hours: 9 } : l))
        const audit = r.audit.map((e) =>
          e.action === 'log_submitted' && e.detail.id === target.id ? { ...e, detail: { ...e.detail, hours: 9 } } : e,
        )
        return {
          ...s,
          tamperBackup: r,
          records: s.records.map((x) => (x.id === recordId ? { ...r, logs, audit } : x)),
        }
      }),

    undoTamper: () =>
      setState((s) => ({
        ...s,
        records: s.records.map((x) => (s.tamperBackup && x.id === s.tamperBackup.id ? s.tamperBackup : x)),
        tamperBackup: null,
      })),
  }

  return (
    <StoreContext.Provider value={{ state, userId, ...actions }}>{children}</StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
