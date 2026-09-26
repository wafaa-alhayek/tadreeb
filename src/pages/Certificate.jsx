import { Link, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { companies, majors } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { gradeLabel } from '../lib/verify.js'
import { verifyUrl } from '../lib/signing.js'

export default function Certificate() {
  const { t, L } = useLang()
  const { state } = useStore()
  const { id } = useParams()
  const cert = state.certificates.find((c) => c.id === id)

  if (!cert) return <p className="empty">{t('certInvalid')}</p>
  if (!cert.sig) return <p className="empty">{t('v_checking')}</p>

  const url = verifyUrl(cert)
  const forged = verifyUrl(cert, { score: 99 })
  const hashPath = (u) => u.slice(u.indexOf('#') + 1)

  return (
    <>
      <div className="row between wrap no-print">
        <h1>{t('nav_certificate')}</h1>
        <div className="actions">
          <Link className="btn danger" to={hashPath(forged)} title={t('cert_tamperHint')}>
            {t('cert_tamperTest')}
          </Link>
          <button className="btn" onClick={() => window.print()}>
            {t('print')}
          </button>
        </div>
      </div>
      <div className="certificate">
        <div className="cert-head">
          <span className="logo big">ت</span>
          <div>
            <strong>{t('universityName')}</strong>
            <small>{t('tagline')}</small>
          </div>
        </div>
        <h2 className="cert-title">{t('certTitle')}</h2>
        <p>{t('certIntro')}</p>
        <p className="cert-name">{L(cert.studentName)}</p>
        <p className="muted">
          {t('uniId')}: {cert.uniId} · {t('major')}: {L(majors[cert.major])}
        </p>
        <p>{t('certCompleted')}</p>
        <p className="cert-company">{L(companies[cert.companyId])}</p>
        <p>
          {t('certHours', { h: cert.hours, m: cert.durationMonths })}{' '}
          <strong>
            {L(gradeLabel(cert.score))} ({cert.score}%)
          </strong>
        </p>
        <div className="cert-foot">
          <dl>
            <dt>{t('certNumber')}</dt>
            <dd>{cert.id}</dd>
            <dt>{t('issuedOn')}</dt>
            <dd>{cert.issuedOn}</dd>
            <dt>{t('cert_fingerprint')}</dt>
            <dd>
              <code>{cert.fingerprint.slice(0, 16)}…</code>
            </dd>
            <dt>🔏</dt>
            <dd className="signed">{t('cert_signed')}</dd>
          </dl>
          <a className="qr" href={url} target="_blank" rel="noreferrer">
            <QRCodeSVG value={url} size={140} level="L" marginSize={2} />
            <small>{t('scanToVerify')}</small>
          </a>
        </div>
      </div>
    </>
  )
}
