import { useState } from 'react'
import { Link } from 'react-router-dom'
import { companies, oppById, userById } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { Checklist, isComplete, StageChip } from '../components.jsx'
import { trainingStage } from '../lib/verify.js'

export default function Completion() {
  const { t, L } = useLang()
  const { state, issueCertificate } = useStore()
  const [busy, setBusy] = useState(null)
  const records = state.records.filter((r) => trainingStage(r) !== 'new')

  return (
    <>
      <h1>{t('nav_completion')}</h1>
      <p className="muted note">{t('weightsNote')}</p>
      <div className="grid">
        {records.map((r) => {
          const op = oppById(r.oppId)
          const ready = isComplete(r)
          const cert = state.certificates.find((c) => c.recordId === r.id)
          return (
            <article key={r.id} className="card opp">
              <div className="row between">
                <div>
                  <h3>{L(userById(r.studentId).name)}</h3>
                  <p className="muted">
                    {L(op.title)} · {L(companies[op.companyId])}
                  </p>
                </div>
                <StageChip record={r} />
              </div>
              <Checklist record={r} />
              <div className={'elig ' + (ready ? 'ok' : 'no')}>
                <strong>{ready ? t('readyToIssue') : t('notReady')}</strong>
              </div>
              {cert ? (
                <Link className="btn primary center" to={'/certificate/' + cert.id}>
                  {t('viewCert')} · {cert.id}
                </Link>
              ) : (
                <button
                  className="btn primary"
                  disabled={!ready || busy === r.id}
                  onClick={async () => {
                    setBusy(r.id)
                    await issueCertificate(r.id)
                    setBusy(null)
                  }}
                >
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
