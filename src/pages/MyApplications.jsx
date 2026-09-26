import { companies, opportunities } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { StatusBadge } from '../components.jsx'

// The application lifecycle, in order, for the progress stepper
export const STEPS = ['submitted', 'under_review', 'accepted', 'assigned', 'active']


export default function MyApplications() {
  const { t, L } = useLang()
  const { state, userId } = useStore()
  const mine = state.applications.filter((a) => a.studentId === userId)

  return (
    <>
      <h1>{t('nav_applications')}</h1>
      {mine.length === 0 && <p className="empty">{t('noApplications')}</p>}
      <div className="stack">
        {mine.map((a) => {
          const op = opportunities.find((o) => o.id === a.oppId)
          const idx = a.status === 'completed' ? STEPS.length - 1 : STEPS.indexOf(a.status)
          return (
            <article key={a.id} className="card">
              <div className="row between">
                <div>
                  <h3>{L(op.title)}</h3>
                  <p className="muted">
                    {L(companies[op.companyId])} · {t('submittedOn')} {a.createdAt}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              {idx >= 0 && (
                <ol className="stepper">
                  {STEPS.map((s, i) => (
                    <li key={s} className={i <= idx ? 'done' : ''}>
                      {t('status_' + s)}
                    </li>
                  ))}
                </ol>
              )}
            </article>
          )
        })}
      </div>
    </>
  )
}
