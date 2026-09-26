import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { companies, userById } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { attendanceCode, attendanceOn, secondsLeft, todayStr } from '../lib/verify.js'

// The screen shown at the company entrance: a code that rotates every 30 seconds
export default function AttendanceCode() {
  const { t, L } = useLang()
  const { state, userId } = useStore()
  const companyId = userById(userId).companyId
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const code = attendanceCode(companyId, now)
  const left = secondsLeft(now)
  const today = state.records
    .filter((r) => r.companyId === companyId)
    .map((r) => ({ r, a: attendanceOn(r, todayStr()) }))
    .filter((x) => x.a)

  return (
    <>
      <h1>{t('code_title')}</h1>
      <div className="two-col even">
        <section className="card code-card">
          <p className="muted">{L(companies[companyId])}</p>
          <QRCodeSVG value={`TADREEB-ATTENDANCE:${companyId}:${code}`} size={200} level="M" marginSize={2} />
          <div className="big-code" aria-live="polite">
            {code.slice(0, 3)} {code.slice(3)}
          </div>
          <div className="countdown" aria-hidden="true">
            <div style={{ inlineSize: (left / 30) * 100 + '%' }} />
          </div>
          <small>{t('code_expires', { s: left })}</small>
          <p className="muted small">{t('code_hint')}</p>
        </section>
        <section className="card">
          <h3>{t('code_todayList')}</h3>
          {today.length === 0 && <p className="empty">{t('code_none')}</p>}
          <ul className="logs">
            {today.map(({ r, a }) => (
              <li key={r.id} className="row between">
                <strong>{L(userById(r.studentId).name)}</strong>
                <span className="badge ls-verified">
                  {t('co_present', { time: a.in })}
                  {a.out && ' · ' + t('co_left', { time: a.out })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
