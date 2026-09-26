import { majors, oppById, providerCriteria, students, userById } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { CriteriaForm, HoursCard, LogList } from '../components.jsx'
import { attendanceOn, todayStr, trainingStage } from '../lib/verify.js'

function StudentHead({ record }) {
  const { t, L } = useLang()
  const s = students[record.studentId]
  return (
    <div className="row between wrap">
      <div>
        <h3>{L(userById(record.studentId).name)}</h3>
        <p className="muted">
          {L(oppById(record.oppId).title)} · {L(majors[s.major])}
        </p>
      </div>
      <small>
        {t('uniId')}: {s.uniId} · {t('gpa')}: {s.gpa}
      </small>
    </div>
  )
}

function TodayStatus({ record }) {
  const { t } = useLang()
  const a = attendanceOn(record, todayStr())
  if (!a) return <span className="badge ls-rejected">{t('co_absent')}</span>
  return (
    <span className="badge ls-verified">
      {t('co_present', { time: a.in })}
      {a.out && ' · ' + t('co_left', { time: a.out })}
    </span>
  )
}

export default function CompanyInterns() {
  const { t, L } = useLang()
  const { state, userId, companyAccept, companyReject, reviewLogCompany, evaluateProvider } = useStore()
  const mine = state.records.filter((r) => r.companySupId === userId)
  const by = (stage) => mine.filter((r) => trainingStage(r) === stage)

  return (
    <>
      <h1>{t('nav_interns')}</h1>

      <h2>🆕 {t('co_newTitle')}</h2>
      {by('new').length === 0 && <p className="empty">{t('co_nothing')}</p>}
      <div className="grid">
        {by('new').map((r) => (
          <article key={r.id} className="card opp">
            <StudentHead record={r} />
            <p className="muted small">
              {t('supervisor')}: {L(userById(r.supervisorId).name)}
            </p>
            <div className="actions">
              <button className="btn primary" onClick={() => companyAccept(r.id)}>
                {t('co_accept')}
              </button>
              <button className="btn danger" onClick={() => companyReject(r.id)}>
                {t('co_reject')}
              </button>
            </div>
          </article>
        ))}
      </div>

      <h2>📅 {t('co_activeTitle')}</h2>
      <div className="stack">
        {by('active').map((r) => {
          const pending = r.logs.filter((l) => l.company === 'pending')
          return (
            <section key={r.id} className="card">
              <StudentHead record={r} />
              <div className="row wrap gap-top">
                <TodayStatus record={r} />
              </div>
              <div className="two-col even gap-top">
                <HoursCard record={r} compact />
                <div>
                  <h4>
                    {t('co_logsToConfirm')} ({pending.length})
                  </h4>
                  {pending.length === 0 && <p className="empty">{t('co_nothing')}</p>}
                  <LogList
                    record={r}
                    logs={pending}
                    showVerified={0}
                    actions={(l) => (
                      <div className="actions">
                        <button className="btn primary" onClick={() => reviewLogCompany(r.id, l.id, 'confirmed')}>
                          {t('confirm')}
                        </button>
                        <button className="btn danger" onClick={() => reviewLogCompany(r.id, l.id, 'disputed', t('defaultDispute'))}>
                          {t('dispute')}
                        </button>
                      </div>
                    )}
                  />
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <h2>🎓 {t('co_finalTitle')}</h2>
      <div className="stack">
        {[...by('final'), ...by('done')].map((r) => (
          <section key={r.id} className="card">
            <StudentHead record={r} />
            <div className="two-col even gap-top">
              <HoursCard record={r} compact />
              <div>
                <h4>{t('eval_student')}</h4>
                {r.scores.provider != null ? (
                  <div className="elig ok">✓ {t('eval_done', { score: r.scores.provider })}</div>
                ) : (
                  <CriteriaForm criteria={providerCriteria} onSubmit={(vals) => evaluateProvider(r.id, vals)} />
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
