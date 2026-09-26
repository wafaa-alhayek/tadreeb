import { checkEligibility, companies, opportunities, students } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'

export default function Dashboard() {
  const { t } = useLang()
  const { state } = useStore()
  const ids = Object.keys(students)

  const stats = [
    ['stat_students', ids.length],
    ['stat_eligible', ids.filter((id) => opportunities.some((o) => checkEligibility(id, o).ok)).length],
    ['stat_newApps', state.applications.filter((a) => a.status === 'submitted').length],
    ['stat_inTraining', state.records.length],
    ['stat_completed', state.certificates.length],
    ['stat_companies', Object.keys(companies).length],
    ['stat_opportunities', opportunities.length],
    ['stat_pendingLogs', state.records.flatMap((r) => r.logs).filter((l) => l.status === 'pending').length],
  ]

  const byStatus = state.applications.reduce((m, a) => ({ ...m, [a.status]: (m[a.status] || 0) + 1 }), {})
  const total = state.applications.length || 1

  return (
    <>
      <h1>{t('nav_dashboard')}</h1>
      <div className="stats">
        {stats.map(([k, v]) => (
          <div key={k} className="stat">
            <span className="num">{v}</span>
            <span className="muted">{t(k)}</span>
          </div>
        ))}
      </div>
      <section className="card">
        <h3>{t('nav_review')}</h3>
        <ul className="bars">
          {Object.entries(byStatus).map(([s, n]) => (
            <li key={s}>
              <span>{t('status_' + s)}</span>
              <div className="bar">
                <div className={'s-' + s} style={{ inlineSize: (n / total) * 100 + '%' }} />
              </div>
              <span className="num-sm">{n}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
