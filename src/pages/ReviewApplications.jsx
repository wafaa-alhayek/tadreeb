import { useState } from 'react'
import { companies, opportunities, users } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { StatusBadge } from './MyApplications.jsx'

const supervisors = users.filter((u) => u.role === 'supervisor')

function Actions({ app }) {
  const { t, L } = useLang()
  const { setStatus, assign } = useStore()
  const [sup, setSup] = useState(supervisors[0].id)

  switch (app.status) {
    case 'submitted':
    case 'needs_changes':
      return (
        <button className="btn" onClick={() => setStatus(app.id, 'under_review')}>
          {t('startReview')}
        </button>
      )
    case 'under_review':
      return (
        <div className="actions">
          <button className="btn primary" onClick={() => setStatus(app.id, 'accepted')}>
            {t('accept')}
          </button>
          <button className="btn" onClick={() => setStatus(app.id, 'needs_changes')}>
            {t('requestChanges')}
          </button>
          <button className="btn danger" onClick={() => setStatus(app.id, 'rejected')}>
            {t('reject')}
          </button>
        </div>
      )
    case 'accepted':
      return (
        <div className="actions">
          <select value={sup} onChange={(e) => setSup(e.target.value)} aria-label={t('supervisor')}>
            {supervisors.map((s) => (
              <option key={s.id} value={s.id}>
                {L(s.name)}
              </option>
            ))}
          </select>
          <button className="btn primary" onClick={() => assign(app.id, sup)}>
            {t('assign')}
          </button>
        </div>
      )
    default:
      return <span className="muted">—</span>
  }
}

export default function ReviewApplications() {
  const { t, L } = useLang()
  const { state } = useStore()

  return (
    <>
      <h1>{t('nav_review')}</h1>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t('student')}</th>
              <th>{t('opportunity')}</th>
              <th>{t('company')}</th>
              <th>{t('status')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {state.applications.map((a) => {
              const op = opportunities.find((o) => o.id === a.oppId)
              const st = users.find((u) => u.id === a.studentId)
              return (
                <tr key={a.id}>
                  <td>{L(st.name)}</td>
                  <td>{L(op.title)}</td>
                  <td>{L(companies[op.companyId])}</td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td>
                    <Actions app={a} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
