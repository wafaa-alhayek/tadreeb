// Building blocks shared by the student, provider, supervisor and officer screens.
import { useState } from 'react'
import { userById } from './data.js'
import { useLang } from './i18n.jsx'
import {
  attendanceOn, attendanceRate, checkCompletion, checkIntegrity, countedHours, finalScore,
  fmtTime, gradeLabel, hoursSummary, logFlags, logStage, trainingStage,
} from './lib/verify.js'

export function StatusBadge({ status }) {
  const { t } = useLang()
  return <span className={'badge s-' + status}>{t('status_' + status)}</span>
}

export function StageChip({ record }) {
  const { t } = useLang()
  const stage = trainingStage(record)
  return <span className={'chip stage-' + stage}>{t('stage_' + stage)}</span>
}

export function Tabs({ tabs, value, onChange }) {
  const { t } = useLang()
  return (
    <div className="tabs" role="tablist">
      {tabs.map(([key, count]) => (
        <button key={key} role="tab" aria-selected={value === key} className={value === key ? 'on' : ''} onClick={() => onChange(key)}>
          {t(key)}
          {count > 0 && <span className="count">{count}</span>}
        </button>
      ))}
    </div>
  )
}

// ---------- hours & logs ----------

// The three parties that must agree before an hour counts
export function TrustChain({ record, log }) {
  const { t } = useLang()
  const att = attendanceOn(record, log.date)
  const attOk = att && att.out && att.geo === 'inside' && !logFlags(record, log).some((f) => f.key === 'f_exceeds')
  const steps = [
    ['tc_attendance', !att ? 'no' : attOk ? 'ok' : 'warn'],
    ['tc_company', log.company === 'confirmed' ? 'ok' : log.company === 'disputed' ? 'no' : 'wait'],
    ['tc_academic', log.academic === 'approved' ? 'ok' : log.academic === 'returned' ? 'no' : 'wait'],
  ]
  return (
    <ol className="trust">
      {steps.map(([k, s]) => (
        <li key={k} className={s}>
          <span className="dot" aria-hidden="true">{s === 'ok' ? '✓' : s === 'no' ? '✕' : s === 'warn' ? '!' : '…'}</span>
          {t(k)}
        </li>
      ))}
    </ol>
  )
}

export function Flags({ flags }) {
  const { t } = useLang()
  if (!flags.length) return null
  return (
    <ul className="flags">
      {flags.map((f) => (
        <li key={f.key} className={f.severity}>
          <span aria-hidden="true">{f.severity === 'high' ? '⚠' : 'ℹ'}</span> {t(f.key, f.vars)}
        </li>
      ))}
    </ul>
  )
}

export function LogItem({ record, log, actions }) {
  const { t } = useLang()
  const stage = logStage(log)
  const counted = countedHours(record, log)
  const flags = logFlags(record, log)
  return (
    <li className={'log ' + (flags.some((f) => f.severity === 'high') ? 'flagged' : '')}>
      <div className="row between wrap">
        <strong>
          {log.date} · {log.hours} {t('hoursUnit')}
        </strong>
        <span className={'badge ls-' + stage}>{t('ls_' + stage)}</span>
      </div>
      <p>{log.tasks}</p>
      {log.skills && <small>{log.skills}</small>}
      <TrustChain record={record} log={log} />
      <Flags flags={flags} />
      {stage === 'verified' && counted < log.hours && <p className="trimmed">{t('counted_of', { c: counted, h: log.hours })}</p>}
      {log.disputeReason && (
        <p className="trimmed">
          {t('disputeReasonLabel')}: {log.disputeReason}
        </p>
      )}
      {actions && actions(log)}
    </li>
  )
}

// Logs needing attention first, then the latest verified ones; older verified logs fold into a count
export function LogList({ record, logs = record.logs, actions, showVerified = 3 }) {
  const { t } = useLang()
  const open = logs.filter((l) => logStage(l) !== 'verified' || logFlags(record, l).length)
  const clean = logs.filter((l) => !open.includes(l))
  const hidden = clean.length - showVerified
  return (
    <ul className="logs">
      {[...open, ...clean.slice(0, showVerified)].map((l) => (
        <LogItem key={l.id} record={record} log={l} actions={actions} />
      ))}
      {hidden > 0 && <li className="more">{t('approvedCount', { n: hidden })}</li>}
    </ul>
  )
}

export function HoursCard({ record, compact }) {
  const { t } = useLang()
  const h = hoursSummary(record)
  const rate = attendanceRate(record)
  const pct = (x) => Math.min(100, (x / h.required) * 100) + '%'
  return (
    <section className={'card hours' + (compact ? ' compact' : '')}>
      <div className="row between wrap">
        <h3>{t('hv_title')}</h3>
        {rate != null && (
          <span className="muted">
            {t('att_rate')}: <strong className={rate >= 90 ? 'good' : 'bad'}>{rate}%</strong>
          </span>
        )}
      </div>
      <div className="big-hours">
        <strong>{h.counted}</strong>
        <span>
          / {h.required} {t('hoursUnit')}
        </span>
      </div>
      <div className="stack-bar" role="img" aria-label={`${h.counted} / ${h.required}`}>
        <div className="seg counted" style={{ inlineSize: pct(h.counted) }} title={`${t('hv_counted')}: ${h.counted}`} />
        <div className="seg pending" style={{ inlineSize: pct(h.pending) }} title={`${t('hv_pending')}: ${h.pending}`} />
      </div>
      <ul className="legend">
        <li><i className="counted" />{t('hv_counted')} <b>{h.counted}</b></li>
        <li><i className="pending" />{t('hv_pending')} <b>{h.pending}</b></li>
        <li><i className="cut" />{t('hv_cut')} <b>{h.cut}</b></li>
        <li className="muted">{t('hv_claimed')} <b>{h.claimed}</b></li>
      </ul>
      {!compact && <p className="rule">🔒 {t('hv_rule')}</p>}
    </section>
  )
}

// ---------- completion ----------

export function Checklist({ record }) {
  const { t, L } = useLang()
  const checks = checkCompletion(record)
  const score = finalScore(record)
  return (
    <>
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
    </>
  )
}

export const isComplete = (record) => checkCompletion(record).every((c) => c.ok)

// ---------- evaluation inputs ----------

export function Stars({ value, onChange, label }) {
  return (
    <div className="stars" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={String(n)}
          className={n <= value ? 'on' : ''}
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export function CriteriaForm({ criteria, onSubmit }) {
  const { t } = useLang()
  const [vals, setVals] = useState({})
  const done = criteria.every((c) => vals[c])
  const avg = done ? Math.round((criteria.reduce((a, c) => a + vals[c], 0) / criteria.length) * 20) : null
  return (
    <div className="criteria">
      {criteria.map((c) => (
        <div key={c} className="row between">
          <span>{t(c)}</span>
          <Stars value={vals[c] || 0} label={t(c)} onChange={(n) => setVals({ ...vals, [c]: n })} />
        </div>
      ))}
      <button className="btn primary" disabled={!done} onClick={() => onSubmit(vals)}>
        {t('eval_submit')} {avg != null && `· ${avg}%`}
      </button>
    </div>
  )
}

// ---------- audit trail ----------

export function IntegrityResult({ result }) {
  const { t } = useLang()
  if (result.ok)
    return <div className="elig ok">✓ {t('audit_ok', { n: result.entries })}</div>
  return (
    <div className="elig no">
      <strong>⚠ {t('audit_broken')}</strong>
      {result.issues.map((i, k) => (
        <div key={k}>{i.type === 'chain' ? t('issue_chain', { i: i.index, at: fmtTime(i.at) }) : t('issue_mismatch', i)}</div>
      ))}
    </div>
  )
}

export function AuditTrail({ record }) {
  const { t, L } = useLang()
  const [all, setAll] = useState(false)
  const [check, setCheck] = useState(null)
  const entries = [...record.audit].reverse()
  const shown = all ? entries : entries.slice(0, 8)
  return (
    <section className="card">
      <div className="row between wrap">
        <h3>🔗 {t('audit_title')}</h3>
        <button className="btn" onClick={() => setCheck(checkIntegrity(record))}>
          {t('audit_check')}
        </button>
      </div>
      <p className="muted small">{t('audit_hint')}</p>
      {check && <IntegrityResult result={check} />}
      <ol className="audit">
        {shown.map((e) => (
          <li key={e.hash}>
            <span className="when">{fmtTime(e.at)}</span>
            <span className="who">{L(userById(e.actor)?.name) || e.actor}</span>
            <span className="what">{t('a_' + e.action, e.detail)}</span>
            <code className="hash" title={e.hash}>
              #{e.hash.slice(0, 10)}
            </code>
          </li>
        ))}
      </ol>
      {!all && entries.length > 8 && (
        <button className="link" onClick={() => setAll(true)}>
          {t('audit_showAll', { n: entries.length })}
        </button>
      )}
    </section>
  )
}
