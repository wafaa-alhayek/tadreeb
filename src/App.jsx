import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { users } from './data.js'
import { useLang } from './i18n.jsx'
import { useStore } from './store.jsx'
import Login from './pages/Login.jsx'
import Opportunities from './pages/Opportunities.jsx'
import MyApplications from './pages/MyApplications.jsx'
import TrainingRecord from './pages/TrainingRecord.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ReviewApplications from './pages/ReviewApplications.jsx'
import SupervisorLogs from './pages/SupervisorLogs.jsx'
import Verify from './pages/Verify.jsx'
import Completion from './pages/Completion.jsx'
import Certificate from './pages/Certificate.jsx'

const navByRole = {
  student: [
    ['/opportunities', 'nav_opportunities'],
    ['/applications', 'nav_applications'],
    ['/record', 'nav_record'],
  ],
  officer: [
    ['/dashboard', 'nav_dashboard'],
    ['/review', 'nav_review'],
    ['/completion', 'nav_completion'],
  ],
  supervisor: [['/logs', 'nav_logs']],
}

const homeByRole = { student: '/opportunities', officer: '/dashboard', supervisor: '/logs' }

export function LangButton() {
  const { t, toggle } = useLang()
  return (
    <button className="btn ghost" onClick={toggle}>
      {t('switchLang')}
    </button>
  )
}

export const loginUsers = users.filter((u) => u.inLogin !== false)

// Lets the presenter jump between demo accounts without logging out
function RoleSwitcher() {
  const { t, L } = useLang()
  const { userId, login } = useStore()
  const navigate = useNavigate()
  return (
    <select
      className="switcher"
      value={userId}
      aria-label={t('switchTo')}
      title={t('switchTo')}
      onChange={(e) => {
        login(e.target.value)
        navigate('/')
      }}
    >
      {loginUsers.map((u) => (
        <option key={u.id} value={u.id}>
          {L(u.name)} — {t('role_' + u.role)}
        </option>
      ))}
    </select>
  )
}

export default function App() {
  const { t } = useLang()
  const { state, userId, logout } = useStore()
  const user = users.find((u) => u.id === userId)
  const myCert = state.certificates.find((c) => c.studentId === userId)

  if (!user)
    return (
      <Routes>
        <Route path="/verify/:certId?" element={<Verify />} />
        <Route path="*" element={<Login />} />
      </Routes>
    )

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="logo">ت</span>
          <div>
            <strong>{t('appName')}</strong>
            <small>{t('tagline')}</small>
          </div>
        </div>
        <nav className="nav">
          {navByRole[user.role].map(([to, key]) => (
            <NavLink key={to} to={to}>
              {t(key)}
            </NavLink>
          ))}
          {myCert && <NavLink to={'/certificate/' + myCert.id}>{t('nav_certificate')}</NavLink>}
        </nav>
        <div className="userbox">
          <RoleSwitcher />
          <LangButton />
          <button className="btn ghost" onClick={logout}>
            {t('logout')}
          </button>
        </div>
      </header>
      <main className="content">
        <Routes>
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/record" element={<TrainingRecord />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/review" element={<ReviewApplications />} />
          <Route path="/logs" element={<SupervisorLogs />} />
          <Route path="/completion" element={<Completion />} />
          <Route path="/certificate/:id" element={<Certificate />} />
          <Route path="/verify/:certId?" element={<Verify />} />
          <Route path="*" element={<Navigate to={homeByRole[user.role]} replace />} />
        </Routes>
      </main>
    </div>
  )
}
