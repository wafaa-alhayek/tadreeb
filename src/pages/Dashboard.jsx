import { baseline } from '../data.js'
import { hoursSummary } from '../lib/verify.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'

// Horizontal bar list: one hue, value labelled at the end, tooltip on hover
function Bars({ rows }) {
  const max = Math.max(...rows.map((r) => r.value))
  return (
    <ul className="bars">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${r.value.toLocaleString()}`}>
          <span>{r.label}</span>
          <div className="bar">
            <div style={{ inlineSize: (r.value / max) * 100 + '%' }} />
          </div>
          <span className="num-sm">{r.value.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Dashboard() {
  const { t, L } = useLang()
  const { state } = useStore()
  const fmt = (n) => n.toLocaleString('en-US')

  // Changes made during the demo, on top of the institution-wide baseline
  const count = (list, pred) => list.filter(pred).length
  const liveApps = state.applications.filter((a) => a.history)
  const newRecords = state.records.filter((r) => !['r-yazan', 'r-lana'].includes(r.id)).length
  const newCerts = state.certificates.filter((c) => c.recordId).length
  const liveCounted = state.records.reduce((a, r) => a + hoursSummary(r).counted, 0)

  const stats = [
    ['stat_students', fmt(baseline.students)],
    ['stat_eligible', fmt(baseline.eligible)],
    ['stat_newApps', fmt(baseline.newApps + count(liveApps, (a) => a.status === 'submitted'))],
    ['stat_inTraining', fmt(baseline.inTraining + newRecords - newCerts)],
    ['stat_completed', fmt(baseline.completed + newCerts)],
    ['stat_late', fmt(baseline.late)],
    ['stat_companies', fmt(baseline.companies)],
    ['stat_opportunities', fmt(baseline.opportunities)],
    ['stat_attendance', fmt(baseline.attendance) + '%'],
    ['stat_verifiedHours', fmt(Math.round(baseline.hours.counted + liveCounted))],
    ['stat_pendingLogs', fmt(state.records.flatMap((r) => r.logs).filter((l) => l.company === 'pending' || l.academic === 'pending').length)],
  ]

  const statusRows = Object.entries(baseline.byStatus).map(([s, n]) => ({
    label: t('status_' + s),
    value: n + count(liveApps, (a) => a.status === s),
  }))
  const collegeRows = baseline.byCollege.map((c) => ({ label: L(c), value: c.value }))

  return (
    <>
      <div className="row between wrap">
        <h1>{t('nav_dashboard')}</h1>
        <span className="chip">{t('semester')}</span>
      </div>
      <div className="stats">
        {stats.map(([k, v]) => (
          <div key={k} className="stat">
            <span className="num">{v}</span>
            <span className="muted">{t(k)}</span>
          </div>
        ))}
      </div>
      <div className="two-col even">
        <section className="card">
          <h3>{t('byCollege')}</h3>
          <Bars rows={collegeRows} />
        </section>
        <section className="card">
          <h3>{t('appsByStatus')}</h3>
          <Bars rows={statusRows} />
        </section>
      </div>
    </>
  )
}
