import { useState } from 'react'
import { baseline, userById } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { Flags, IntegrityResult } from '../components.jsx'
import { attendedHours, checkIntegrity, hoursSummary, logFlags, logStage } from '../lib/verify.js'

const FLAG_KEYS = ['f_exceeds', 'f_no_attendance', 'f_weekend', 'f_geo', 'f_duplicate', 'f_late', 'f_over_limit']

export default function VerificationCenter() {
  const { t, L } = useLang()
  const { state, simulateTamper, undoTamper } = useStore()
  const [results, setResults] = useState(null)
  const fmt = (n) => Math.round(n).toLocaleString('en-US')

  // University-wide baseline + the live demo records
  const live = state.records.map(hoursSummary).reduce(
    (a, h) => ({ claimed: a.claimed + h.claimed, counted: a.counted + h.counted, pending: a.pending + h.pending, cut: a.cut + h.cut }),
    { claimed: 0, counted: 0, pending: 0, cut: 0 },
  )
  const total = {
    claimed: baseline.hours.claimed + live.claimed,
    counted: baseline.hours.counted + live.counted,
    pending: baseline.hours.pending + live.pending,
    cut: baseline.hours.cut + live.cut,
  }
  const pct = ((total.counted / total.claimed) * 100).toFixed(1)

  const flagged = state.records.flatMap((r) =>
    r.logs.map((l) => ({ r, l, flags: logFlags(r, l) })).filter((x) => x.flags.length),
  )
  const counts = FLAG_KEYS.map((k) => ({ k, n: flagged.filter((x) => x.flags.some((f) => f.key === k)).length })).filter((x) => x.n)
  const maxCount = Math.max(1, ...counts.map((c) => c.n))

  const scanAll = () =>
    setResults(state.records.map((r) => ({ r, res: checkIntegrity(r) })))
  const allOk = results?.every((x) => x.res.ok)

  return (
    <>
      <div className="row between wrap">
        <div>
          <h1>🛡 {t('vc_title')}</h1>
          <p className="muted">{t('vc_sub')}</p>
        </div>
        <span className="chip">{t('vc_liveNote')}</span>
      </div>

      <div className="stats four">
        <div className="stat hero">
          <span className="num">{pct}%</span>
          <span>{t('vc_verifiedPct')}</span>
        </div>
        <div className="stat">
          <span className="num">{fmt(total.counted)}</span>
          <span className="muted">{t('hv_counted')}</span>
        </div>
        <div className="stat">
          <span className="num">{fmt(total.pending)}</span>
          <span className="muted">{t('hv_pending')}</span>
        </div>
        <div className="stat">
          <span className="num bad">{fmt(total.cut)}</span>
          <span className="muted">{t('hv_cut')}</span>
        </div>
      </div>

      <div className="two-col even">
        <section className="card">
          <h3>{t('vc_flagsByType')}</h3>
          <ul className="bars">
            {counts.map(({ k, n }) => (
              <li key={k} title={`${t(k.replace('f_', 'fs_'))}: ${n}`}>
                <span>{t(k.replace('f_', 'fs_'))}</span>
                <div className="bar">
                  <div className="warnbar" style={{ inlineSize: (n / maxCount) * 100 + '%' }} />
                </div>
                <span className="num-sm">{n}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3>🔗 {t('vc_integrityTitle')}</h3>
          <p className="muted small">{t('audit_hint')}</p>
          <div className="actions">
            <button className="btn primary" onClick={scanAll}>
              {t('vc_scanAll')}
            </button>
            {state.tamperBackup ? (
              <button
                className="btn"
                onClick={() => {
                  undoTamper()
                  setResults(null)
                }}
              >
                {t('vc_undo')}
              </button>
            ) : (
              <button
                className="btn danger"
                onClick={() => {
                  simulateTamper('r-yazan')
                  setResults(null)
                }}
              >
                {t('vc_tamper')}
              </button>
            )}
          </div>
          {!state.tamperBackup && <small className="gap-top">{t('vc_tamperHint')}</small>}
          {state.tamperBackup && !results && <div className="elig warn gap-top">{t('vc_tampered')}</div>}
          {results && allOk && (
            <div className="elig ok gap-top">
              ✓ {t('vc_allOk', { n: results.length, m: results.reduce((a, x) => a + x.res.entries, 0) })}
            </div>
          )}
          {results &&
            !allOk &&
            results
              .filter((x) => !x.res.ok)
              .map(({ r, res }) => (
                <div key={r.id} className="gap-top">
                  <strong>{L(userById(r.studentId).name)}</strong>
                  <IntegrityResult result={res} />
                </div>
              ))}
        </section>
      </div>

      <section className="card gap-top">
        <h3>{t('vc_table')}</h3>
        <div className="table-wrap flat">
          <table>
            <thead>
              <tr>
                <th>{t('student')}</th>
                <th>{t('date')}</th>
                <th>{t('vc_claimed')}</th>
                <th>{t('vc_attended')}</th>
                <th>{t('vc_flags')}</th>
                <th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {flagged.map(({ r, l, flags }) => (
                <tr key={l.id}>
                  <td>{L(userById(r.studentId).name)}</td>
                  <td>{l.date}</td>
                  <td>{l.hours}</td>
                  <td>{attendedHours(r, l.date) || '—'}</td>
                  <td>
                    <Flags flags={flags} />
                  </td>
                  <td>
                    <span className={'badge ls-' + logStage(l)}>{t('ls_' + logStage(l))}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
