import { useState } from 'react'
import { academicCriteria, companies, majors, oppById, students, userById } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { Checklist, CriteriaForm, HoursCard, LogList, StageChip } from '../components.jsx'
import { todayStr, trainingStage } from '../lib/verify.js'

function Head({ record }) {
  const { t, L } = useLang()
  const op = oppById(record.oppId)
  const s = students[record.studentId]
  return (
    <div className="row between wrap">
      <div>
        <h3>{L(userById(record.studentId).name)}</h3>
        <p className="muted">
          {L(op.title)} · {L(companies[op.companyId])}
        </p>
        <small>
          {t('uniId')}: {s.uniId} · {L(majors[s.major])} · {t('gpa')}: {s.gpa}
        </small>
      </div>
      <StageChip record={record} />
    </div>
  )
}

function VisitForm({ record }) {
  const { t } = useLang()
  const { addVisit } = useStore()
  const [open, setOpen] = useState(false)
  const [v, setV] = useState({ date: todayStr(), status: 'excellent', notes: '', recommendations: '' })
  if (!open)
    return (
      <button className="btn" onClick={() => setOpen(true)}>
        + {t('sv_addVisit')}
      </button>
    )
  return (
    <form
      className="form inset"
      onSubmit={(e) => {
        e.preventDefault()
        addVisit(record.id, v)
        setOpen(false)
      }}
    >
      <label>
        {t('visit_date')}
        <input type="date" value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} />
      </label>
      <label>
        {t('visit_status')}
        <select value={v.status} onChange={(e) => setV({ ...v, status: e.target.value })}>
          {['excellent', 'good', 'attention'].map((s) => (
            <option key={s} value={s}>
              {t('visit_' + s)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t('visit_notes')}
        <textarea rows="2" value={v.notes} onChange={(e) => setV({ ...v, notes: e.target.value })} required />
      </label>
      <label>
        {t('visit_recs')}
        <input value={v.recommendations} onChange={(e) => setV({ ...v, recommendations: e.target.value })} />
      </label>
      <div className="actions">
        <button className="btn primary">{t('save')}</button>
        <button type="button" className="btn" onClick={() => setOpen(false)}>
          {t('cancel')}
        </button>
      </div>
    </form>
  )
}

function FinalReportReview({ record }) {
  const { t } = useLang()
  const { reviewReport } = useStore()
  const [grade, setGrade] = useState(90)
  const rep = record.reports.find((r) => r.type === 'final')
  if (!rep) return <p className="empty">{t('sv_noFinal')}</p>
  return (
    <div className="stack-sm">
      <p className="quote">{rep.text}</p>
      {rep.status === 'pending' ? (
        <div className="actions">
          <label className="inline">
            {t('sv_reportGrade')}
            <input type="number" min="0" max="100" value={grade} onChange={(e) => setGrade(e.target.value)} />
          </label>
          <button className="btn primary" onClick={() => reviewReport(record.id, rep.id, 'approved', Number(grade))}>
            {t('sv_approveFinal')}
          </button>
          <button className="btn" onClick={() => reviewReport(record.id, rep.id, 'returned')}>
            {t('returnLog')}
          </button>
        </div>
      ) : (
        <span className={'badge r-' + rep.status}>
          {t('rep_' + rep.status)}
          {record.scores.report != null && ` · ${record.scores.report}%`}
        </span>
      )}
    </div>
  )
}

export default function SupervisorStudents() {
  const { t, L } = useLang()
  const { state, userId, reviewLogAcademic, reviewReport, evaluateAcademic } = useStore()
  const mine = state.records.filter((r) => r.supervisorId === userId)
  const isNew = (r) => trainingStage(r) === 'new' || (trainingStage(r) === 'active' && r.logs.length === 0)
  const newOnes = mine.filter(isNew)
  const active = mine.filter((r) => trainingStage(r) === 'active' && !isNew(r))
  const final = mine.filter((r) => ['final', 'done'].includes(trainingStage(r)))

  return (
    <>
      <h1>{t('nav_students')}</h1>

      <h2>🆕 {t('sv_newStudent')}</h2>
      {newOnes.length === 0 && <p className="empty">—</p>}
      <div className="grid">
        {newOnes.map((r) => (
          <article key={r.id} className="card opp">
            <Head record={r} />
            {trainingStage(r) === 'new' && <div className="elig warn">⏳ {t('sv_waitingCompany')}</div>}
            <div>
              <h4>{t('plan')}</h4>
              <p className="small">{t('planText')}</p>
            </div>
            <small>
              {t('companySup')}: {L(userById(r.companySupId).name)}
            </small>
          </article>
        ))}
      </div>

      <h2>📅 {t('stage_active')}</h2>
      <div className="stack">
        {active.map((r) => {
          const toApprove = r.logs.filter((l) => l.company === 'confirmed' && l.academic === 'pending')
          const waitingCompany = r.logs.filter((l) => l.company === 'pending').length
          const weekly = r.reports.filter((x) => x.type === 'weekly' && x.status === 'pending')
          return (
            <section key={r.id} className="card">
              <Head record={r} />
              <div className="two-col even gap-top">
                <div className="stack">
                  <HoursCard record={r} compact />
                  <div>
                    <h4>
                      {t('sv_visits')} ({r.visits.length}/{r.visitsRequired})
                    </h4>
                    <ul className="logs">
                      {r.visits.map((v, i) => (
                        <li key={i}>
                          <div className="row between">
                            <strong>{v.date}</strong>
                            <span className="badge ls-verified">{t('visit_' + v.status)}</span>
                          </div>
                          <p className="small">{v.notes}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="gap-top">
                      <VisitForm record={r} />
                    </div>
                  </div>
                </div>
                <div className="stack">
                  <div>
                    <h4>
                      {t('sv_logsToApprove')} ({toApprove.length})
                    </h4>
                    {waitingCompany > 0 && <small>⏳ {t('sv_awaitingCompanyN', { n: waitingCompany })}</small>}
                    {toApprove.length === 0 && <p className="empty">{t('co_nothing')}</p>}
                    <LogList
                      record={r}
                      logs={toApprove}
                      showVerified={0}
                      actions={(l) => (
                        <div className="actions">
                          <button className="btn primary" onClick={() => reviewLogAcademic(r.id, l.id, 'approved')}>
                            {t('approve')}
                          </button>
                          <button className="btn" onClick={() => reviewLogAcademic(r.id, l.id, 'returned')}>
                            {t('returnLog')}
                          </button>
                        </div>
                      )}
                    />
                  </div>
                  <div>
                    <h4>
                      {t('sv_weekly')} ({weekly.length})
                    </h4>
                    {weekly.length === 0 && <p className="empty">{t('co_nothing')}</p>}
                    <ul className="logs">
                      {weekly.map((rep) => (
                        <li key={rep.id}>
                          <strong>{t('rep_week', { n: rep.week })}</strong>
                          <p>{rep.text}</p>
                          <div className="actions">
                            <button className="btn primary" onClick={() => reviewReport(r.id, rep.id, 'approved')}>
                              {t('approve')}
                            </button>
                            <button className="btn" onClick={() => reviewReport(r.id, rep.id, 'returned')}>
                              {t('returnLog')}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <h2>🎓 {t('stage_final')}</h2>
      <div className="stack">
        {final.map((r) => (
          <section key={r.id} className="card">
            <Head record={r} />
            <div className="two-col even gap-top">
              <div className="stack">
                <div>
                  <h4>📘 {t('sv_finalReport')}</h4>
                  <FinalReportReview record={r} />
                </div>
                <div>
                  <h4>{t('sv_evalTitle')}</h4>
                  {r.scores.academic != null ? (
                    <div className="elig ok">✓ {t('eval_done', { score: r.scores.academic })}</div>
                  ) : (
                    <CriteriaForm criteria={academicCriteria} onSubmit={(vals) => evaluateAcademic(r.id, vals)} />
                  )}
                </div>
              </div>
              <div>
                <h4>{t('myChecklist')}</h4>
                <Checklist record={r} />
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
