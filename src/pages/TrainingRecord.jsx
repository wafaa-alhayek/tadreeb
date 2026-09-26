import { useState } from 'react'
import { companies, opportunities, users } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'

export function LogStatus({ status }) {
  const { t } = useLang()
  return <span className={'badge l-' + status}>{t('log_' + status)}</span>
}

export default function TrainingRecord() {
  const { t, L } = useLang()
  const { state, userId, addLog } = useStore()
  const record = state.records.find((r) => r.studentId === userId)
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), hours: 6, tasks: '', skills: '' })

  if (!record)
    return (
      <>
        <h1>{t('nav_record')}</h1>
        <p className="empty">{t('noRecord')}</p>
      </>
    )

  const op = opportunities.find((o) => o.id === record.oppId)
  const sup = users.find((u) => u.id === record.supervisorId)
  const done = record.logs.filter((l) => l.status === 'approved').reduce((n, l) => n + l.hours, 0)
  const pct = Math.min(100, Math.round((done / record.requiredHours) * 100))

  const submit = (e) => {
    e.preventDefault()
    if (!form.tasks.trim()) return
    addLog(record.id, { ...form, hours: Number(form.hours) })
    setForm({ ...form, tasks: '', skills: '' })
  }

  return (
    <>
      <h1>{t('nav_record')}</h1>
      <section className="card record-head">
        <div>
          <h3>{L(op.title)}</h3>
          <p className="muted">{L(companies[op.companyId])}</p>
        </div>
        <dl className="facts">
          <div>
            <dt>{t('supervisor')}</dt>
            <dd>{L(sup.name)}</dd>
          </div>
          <div>
            <dt>{t('period')}</dt>
            <dd>
              {record.start} → {record.end}
            </dd>
          </div>
        </dl>
        <div className="progress-wrap">
          <div className="row between">
            <span>{t('hoursProgress')}</span>
            <span>
              {done} {t('of')} {record.requiredHours}
            </span>
          </div>
          <div className="progress">
            <div style={{ inlineSize: pct + '%' }} />
          </div>
        </div>
      </section>

      <div className="two-col">
        <form className="card form" onSubmit={submit}>
          <h3>{t('addLog')}</h3>
          <label>
            {t('date')}
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <label>
            {t('hours')}
            <input type="number" min="1" max="12" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
          </label>
          <label>
            {t('tasks')}
            <textarea rows="3" value={form.tasks} onChange={(e) => setForm({ ...form, tasks: e.target.value })} required />
          </label>
          <label>
            {t('skills')}
            <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          </label>
          <button className="btn primary">{t('save')}</button>
        </form>

        <section className="card">
          <h3>{t('dailyLog')}</h3>
          {record.logs.length === 0 && <p className="empty">{t('noLogs')}</p>}
          <ul className="logs">
            {record.logs.map((l) => (
              <li key={l.id}>
                <div className="row between">
                  <strong>
                    {l.date} · {l.hours} {t('hours')}
                  </strong>
                  <LogStatus status={l.status} />
                </div>
                <p>{l.tasks}</p>
                {l.skills && <small className="muted">{l.skills}</small>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
