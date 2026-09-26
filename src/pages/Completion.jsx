import { Link } from 'react-router-dom'
import { checkCompletion, companies, finalScore, gradeLabel, opportunities, users } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'

export default function Completion() {
  const { t, L } = useLang()
  const { state, issueCertificate } = useStore()

  return (
    <>
      <h1>{t('nav_completion')}</h1>
      <p className="muted note">{t('weightsNote')}</p>
      <div className="grid">
        {state.records.map((r) => {
          const st = users.find((u) => u.id === r.studentId)
          const op = opportunities.find((o) => o.id === r.oppId)
          const checks = checkCompletion(r)
          const ready = checks.every((c) => c.ok)
          const score = finalScore(r)
          const cert = state.certificates.find((c) => c.recordId === r.id)
          return (
            <article key={r.id} className="card opp">
              <div>
                <h3>{L(st.name)}</h3>
                <p className="muted">
                  {L(op.title)} · {L(companies[op.companyId])}
                </p>
              </div>
              <ul className="checklist">
                {checks.map((c) => (
                  <li key={c.key} className={c.ok ? 'ok' : 'no'}>
                    <span className="mark" aria-hidden="true">{c.ok ? '✓' : '✕'}</span>
                    <span>{t(c.key)}</span>
                    {c.detail && <span className="detail">{c.detail}</span>}
                  </li>
                ))}
              </ul>
              {score != null && (
                <div className="row between grade">
                  <span>{t('finalGrade')}</span>
                  <strong>
                    {score}% · {L(gradeLabel(score))}
                  </strong>
                </div>
              )}
              <div className={'elig ' + (ready ? 'ok' : 'no')}>
                <strong>{ready ? t('readyToIssue') : t('notReady')}</strong>
              </div>
              {cert ? (
                <Link className="btn primary center" to={'/certificate/' + cert.id}>
                  {t('viewCert')} · {cert.id}
                </Link>
              ) : (
                <button className="btn primary" disabled={!ready} onClick={() => issueCertificate(r.id)}>
                  {t('issueCert')}
                </button>
              )}
            </article>
          )
        })}
      </div>
    </>
  )
}
