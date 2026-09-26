import { companies, opportunities, users } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { LogList } from './TrainingRecord.jsx'

export default function SupervisorLogs() {
  const { t, L } = useLang()
  const { state, userId, setLogStatus } = useStore()
  const mine = state.records.filter((r) => r.supervisorId === userId)

  return (
    <>
      <h1>{t('myStudents')}</h1>
      {mine.length === 0 && <p className="empty">{t('noPendingLogs')}</p>}
      <div className="stack">
        {mine.map((r) => {
          const st = users.find((u) => u.id === r.studentId)
          const op = opportunities.find((o) => o.id === r.oppId)
          return (
            <section key={r.id} className="card">
              <h3>{L(st.name)}</h3>
              <p className="muted">
                {L(op.title)} · {L(companies[op.companyId])}
              </p>
              {r.logs.length === 0 && <p className="empty">{t('noLogs')}</p>}
              <LogList
                logs={r.logs}
                actions={(l) => (
                  <div className="actions">
                    <button className="btn primary" onClick={() => setLogStatus(r.id, l.id, 'approved')}>
                      {t('approve')}
                    </button>
                    <button className="btn" onClick={() => setLogStatus(r.id, l.id, 'returned')}>
                      {t('returnLog')}
                    </button>
                  </div>
                )}
              />
            </section>
          )
        })}
      </div>
    </>
  )
}
