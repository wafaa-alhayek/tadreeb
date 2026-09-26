import { useState } from 'react'
import { companies, oppById, userById } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { AuditTrail, Checklist, HoursCard, LogList, StageChip, Stars, Tabs } from '../components.jsx'
import { attendanceOn, attendedHours, isValidCode, logStage, todayStr, trainingStage } from '../lib/verify.js'

function AttendanceCard({ record }) {
  const { t } = useLang()
  const { scanAttendance } = useStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const today = attendanceOn(record, todayStr())
  const ended = record.end < todayStr()

  const submit = (e) => {
    e.preventDefault()
    if (!isValidCode(code, record.companyId)) return setError(true)
    setError(false)
    setCode('')
    scanAttendance(record.id)
  }

  return (
    <section className="card attend">
      <h3>📍 {t('att_title')}</h3>
      {ended ? (
        <p className="muted">{t('att_ended')}</p>
      ) : (
        <>
          <p className={today ? 'good' : 'muted'}>
            {!today && t('att_notYet')}
            {today && t('att_in', { time: today.in })}
            {today?.out && ' · ' + t('att_out', { time: today.out, hours: attendedHours(record, todayStr()) })}
          </p>
          {today?.out ? (
            <div className="elig ok">✓ {t('att_done')}</div>
          ) : (
            <form className="code-form" onSubmit={submit}>
              <label>
                {t('att_codeLabel')}
                <input
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="code-input"
                />
              </label>
              <button className="btn primary" disabled={code.length !== 6}>
                {today ? t('att_checkout') : t('att_checkin')}
              </button>
              {error && <div className="elig no">✕ {t('att_invalid')}</div>}
              <small>🛰 {t('att_location')}</small>
              <small>📷 {t('att_scanHint')}</small>
            </form>
          )}
        </>
      )}
    </section>
  )
}

function LogForm({ record }) {
  const { t } = useLang()
  const { addLog } = useStore()
  const days = record.attendance
    .filter((a) => a.out && !record.logs.some((l) => l.date === a.date))
    .map((a) => a.date)
    .sort()
    .reverse()
  const [date, setDate] = useState(days[0] || '')
  const [hours, setHours] = useState(days[0] ? Math.floor(attendedHours(record, days[0]) * 2) / 2 : 6)
  const [tasks, setTasks] = useState('')
  const [skills, setSkills] = useState('')

  if (!days.length) return <p className="empty">{t('log_noDays')}</p>
  const day = days.includes(date) ? date : days[0]
  const attended = attendedHours(record, day)

  const submit = (e) => {
    e.preventDefault()
    if (!tasks.trim()) return
    addLog(record.id, { date: day, hours: Number(hours), tasks, skills })
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>
        {t('log_day')}
        <select
          value={day}
          onChange={(e) => {
            setDate(e.target.value)
            setHours(Math.floor(attendedHours(record, e.target.value) * 2) / 2)
          }}
        >
          {days.map((d) => (
            <option key={d} value={d}>
              {t('log_attendedN', { date: d, h: attendedHours(record, d) })}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t('hours')}
        <input type="number" step="0.5" min="0.5" max="14" value={hours} onChange={(e) => setHours(e.target.value)} />
      </label>
      {Number(hours) > attended + 0.25 && <div className="elig warn">{t('log_warnExceeds', { h: attended })}</div>}
      <label>
        {t('tasks')}
        <textarea rows="3" value={tasks} onChange={(e) => setTasks(e.target.value)} required />
      </label>
      <label>
        {t('skills')}
        <input value={skills} onChange={(e) => setSkills(e.target.value)} />
      </label>
      <button className="btn primary">{t('save')}</button>
      <small>{t('log_onlyAttended')}</small>
    </form>
  )
}

function ReportsTab({ record }) {
  const { t } = useLang()
  const { submitReport, rateCompany } = useStore()
  const [weekly, setWeekly] = useState('')
  const [final, setFinal] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const stage = trainingStage(record)
  const weeklies = record.reports.filter((r) => r.type === 'weekly').slice().reverse()
  const finalRep = record.reports.find((r) => r.type === 'final')

  return (
    <div className="two-col">
      <div className="stack">
        {stage === 'final' && (
          <section className="card form">
            <h3>📘 {t('rep_final')}</h3>
            {finalRep && finalRep.status !== 'returned' ? (
              <>
                <p>{finalRep.text}</p>
                <span className={'badge r-' + finalRep.status}>{t('rep_' + finalRep.status)}</span>
              </>
            ) : (
              <>
                <textarea rows="5" placeholder={t('rep_finalPlaceholder')} value={final} onChange={(e) => setFinal(e.target.value)} />
                <button className="btn primary" disabled={!final.trim()} onClick={() => submitReport(record.id, 'final', final)}>
                  {t('rep_submit')}
                </button>
              </>
            )}
          </section>
        )}
        {stage === 'final' && (
          <section className="card form">
            <h3>🏢 {t('rateCompany')}</h3>
            {record.companyRating ? (
              <div className="elig ok">✓ {t('rated', { rating: record.companyRating.rating })}</div>
            ) : (
              <>
                <Stars value={rating} onChange={setRating} label={t('rateCompany')} />
                <textarea rows="2" placeholder={t('rateComment')} value={comment} onChange={(e) => setComment(e.target.value)} />
                <button className="btn primary" disabled={!rating} onClick={() => rateCompany(record.id, rating, comment)}>
                  {t('rateSubmit')}
                </button>
              </>
            )}
          </section>
        )}
        {stage === 'active' && (
          <section className="card form">
            <h3>
              {t('rep_weekly')} — {t('rep_week', { n: weeklies.length + 1 })}
            </h3>
            <textarea rows="4" placeholder={t('rep_placeholder')} value={weekly} onChange={(e) => setWeekly(e.target.value)} />
            <button
              className="btn primary"
              disabled={!weekly.trim()}
              onClick={() => {
                submitReport(record.id, 'weekly', weekly)
                setWeekly('')
              }}
            >
              {t('rep_submit')}
            </button>
          </section>
        )}
        <section className="card">
          <h3>{t('myChecklist')}</h3>
          <Checklist record={record} />
        </section>
      </div>
      <section className="card">
        <h3>{t('sv_weekly')}</h3>
        {weeklies.length === 0 && <p className="empty">—</p>}
        <ul className="logs">
          {weeklies.map((r) => (
            <li key={r.id}>
              <div className="row between">
                <strong>{t('rep_week', { n: r.week })}</strong>
                <span className={'badge r-' + r.status}>{t('rep_' + r.status)}</span>
              </div>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default function TrainingRecord() {
  const { t, L } = useLang()
  const { state, userId } = useStore()
  const [tab, setTab] = useState('tab_overview')
  const record = state.records.find((r) => r.studentId === userId)

  if (!record)
    return (
      <>
        <h1>{t('nav_record')}</h1>
        <p className="empty">{t('noRecord')}</p>
      </>
    )

  const op = oppById(record.oppId)
  const stage = trainingStage(record)
  const pendingLogs = record.logs.filter((l) => logStage(l).startsWith('awaiting')).length

  return (
    <>
      <div className="row between wrap">
        <h1>{t('nav_record')}</h1>
        <StageChip record={record} />
      </div>
      <section className="card record-head">
        <div>
          <h3>{L(op.title)}</h3>
          <p className="muted">{L(companies[op.companyId])}</p>
        </div>
        <dl className="facts">
          <div>
            <dt>{t('supervisor')}</dt>
            <dd>{L(userById(record.supervisorId).name)}</dd>
          </div>
          <div>
            <dt>{t('companySup')}</dt>
            <dd>{L(userById(record.companySupId).name)}</dd>
          </div>
          <div>
            <dt>{t('period')}</dt>
            <dd>
              {record.start} → {record.end}
            </dd>
          </div>
        </dl>
      </section>

      {stage === 'new' ? (
        <div className="stack">
          <div className="elig warn banner">⏳ {t('pendingCompanyBanner', { company: L(companies[op.companyId]) })}</div>
          <section className="card">
            <h3>{t('plan')}</h3>
            <p>{t('planText')}</p>
          </section>
          <AuditTrail record={record} />
        </div>
      ) : (
        <>
          <Tabs tabs={[['tab_overview'], ['tab_logs', pendingLogs], ['tab_reports'], ['tab_audit']]} value={tab} onChange={setTab} />
          {tab === 'tab_overview' && (
            <div className="two-col">
              <AttendanceCard record={record} />
              <div className="stack">
                <HoursCard record={record} />
                {stage === 'final' && (
                  <section className="card">
                    <h3>{t('myChecklist')}</h3>
                    <Checklist record={record} />
                  </section>
                )}
              </div>
            </div>
          )}
          {tab === 'tab_logs' && (
            <div className="two-col">
              <section className="card">
                <h3>{t('addLog')}</h3>
                <LogForm key={record.logs.length + ':' + record.attendance.length} record={record} />
              </section>
              <section className="card">
                <h3>{t('dailyLog')}</h3>
                {record.logs.length === 0 && <p className="empty">{t('noLogs')}</p>}
                <LogList record={record} />
              </section>
            </div>
          )}
          {tab === 'tab_reports' && <ReportsTab record={record} />}
          {tab === 'tab_audit' && <AuditTrail record={record} />}
        </>
      )}
    </>
  )
}
