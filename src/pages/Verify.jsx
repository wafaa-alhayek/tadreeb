import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { companies, majors } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { LangButton } from '../App.jsx'

// Public page opened by the QR code on a certificate
export default function Verify() {
  const { t, L } = useLang()
  const { state } = useStore()
  const { certId } = useParams()
  const navigate = useNavigate()
  const [input, setInput] = useState(certId || '')
  const cert = certId && state.certificates.find((c) => c.id === certId.trim())

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
          <input
            placeholder="TR-2026-0001"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label={t('certNumber')}
          />
          <button className="btn primary">{t('verify')}</button>
        </form>

        {certId && !cert && <div className="elig no">✕ {t('certInvalid')}</div>}
        {cert && (
          <div className="cert">
            <div className="elig ok">✓ {t('certValid')}</div>
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
                {cert.durationMonths} {t('months')} · {cert.hours} {t('hours')}
              </dd>
              <dt>{t('result')}</dt>
              <dd>{L(cert.result)}</dd>
              <dt>{t('certNumber')}</dt>
              <dd>{cert.id}</dd>
              <dt>{t('issuedOn')}</dt>
              <dd>{cert.issuedOn}</dd>
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}
