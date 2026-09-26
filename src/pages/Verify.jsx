import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { companies, majors } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { LangButton } from '../App.jsx'
import { gradeLabel } from '../lib/verify.js'
import { decodeCert, publicKeyFingerprint, verifyCert } from '../lib/signing.js'

// Public page opened by the QR code on a certificate. It checks the university's
// digital signature, so it works on any device and detects any edited field.
export default function Verify() {
  const { t, L } = useLang()
  const { state } = useStore()
  const { certId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [input, setInput] = useState(certId || '')
  const [result, setResult] = useState({ key: null, ok: null })

  const d = params.get('d')
  const fromLink = d && decodeCert(d)
  const local = certId && state.certificates.find((c) => c.id === certId.trim())
  const cert = fromLink && fromLink.id === certId ? fromLink : local
  const sig = params.get('s') || local?.sig
  const key = cert ? `${certId}|${d}|${sig}` : null
  const valid = result.key === key ? result.ok : null

  useEffect(() => {
    let alive = true
    if (cert && sig) verifyCert(cert, sig).then((ok) => alive && setResult({ key, ok }))
    return () => {
      alive = false
    }
    // key captures everything the check depends on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return (
    <div className="login">
      <div className="login-card wide">
        <div className="login-top">
          <Link to="/">← {t('back')}</Link>
          <LangButton />
        </div>
        <h1>{t('verifyTitle')}</h1>
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/verify/' + input.trim())
          }}
        >
          <input placeholder="TR-2026-0001" value={input} onChange={(e) => setInput(e.target.value)} aria-label={t('certNumber')} />
          <button className="btn primary">{t('verify')}</button>
        </form>

        {certId && !cert && <div className="elig no">✕ {t('certInvalid')}</div>}
        {cert && (
          <div className={'cert' + (valid === false ? ' forged' : '')}>
            {valid === null && <div className="elig warn">{t('v_checking')}</div>}
            {valid === true && <div className="elig ok big-verdict">✓ {t('v_valid')}</div>}
            {valid === false && (
              <div className="elig no big-verdict">
                <strong>⚠ {t('v_forged')}</strong>
                <div>{t('v_forgedDetail')}</div>
              </div>
            )}
            <h2>{t('universityName')}</h2>
            <dl className="cert-grid">
              <dt>{t('student')}</dt>
              <dd>{L(cert.studentName)}</dd>
              <dt>{t('uniId')}</dt>
              <dd>{cert.uniId}</dd>
              <dt>{t('major')}</dt>
              <dd>{L(majors[cert.major])}</dd>
              <dt>{t('company')}</dt>
              <dd>{L(companies[cert.companyId])}</dd>
              <dt>{t('duration')}</dt>
              <dd>
                {cert.durationMonths} {t('months')}
              </dd>
              <dt>{t('hours')}</dt>
              <dd>
                {cert.hours} {t('v_hoursNote')}
              </dd>
              <dt>{t('result')}</dt>
              <dd className={valid === false ? 'bad' : ''}>
                {L(gradeLabel(cert.score))} ({cert.score}%)
              </dd>
              <dt>{t('certNumber')}</dt>
              <dd>{cert.id}</dd>
              <dt>{t('issuedOn')}</dt>
              <dd>{cert.issuedOn}</dd>
              <dt>{t('cert_fingerprint')}</dt>
              <dd>
                <code>{cert.fingerprint?.slice(0, 24)}…</code>
              </dd>
              <dt>{t('v_key')}</dt>
              <dd>
                <code>{publicKeyFingerprint}</code>
              </dd>
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}
