import { Link, useNavigate } from 'react-router-dom'
import { users } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { LangButton } from '../App.jsx'

export default function Login() {
  const { t, L } = useLang()
  const { login, reset } = useStore()
  const navigate = useNavigate()

  return (
    <div className="login">
      <div className="login-card">
        <div className="login-top">
          <span className="logo big">ت</span>
          <LangButton />
        </div>
        <h1>{t('appName')}</h1>
        <p className="muted">{t('tagline')}</p>
        <h2>{t('loginTitle')}</h2>
        <div className="user-list">
          {users.map((u) => (
            <button
              key={u.id}
              className="user-pick"
              onClick={() => {
                login(u.id)
                navigate('/')
              }}
            >
              <span className="avatar">{L(u.name).replace('د. ', '').charAt(0)}</span>
              <span>
                <strong>{L(u.name)}</strong>
                <small>{t('role_' + u.role)}</small>
              </span>
            </button>
          ))}
        </div>
        <p className="hint">{t('loginHint')}</p>
        <div className="login-foot">
          <Link to="/verify">{t('verifyLink')}</Link>
          <button className="link" onClick={reset}>
            {t('resetDemo')}
          </button>
        </div>
      </div>
    </div>
  )
}
