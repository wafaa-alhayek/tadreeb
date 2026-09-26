import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
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

const navByRole = {
  student: [
    ['/opportunities', 'nav_opportunities'],
    ['/applications', 'nav_applications'],
    ['/record', 'nav_record'],
  ],
  officer: [
    ['/dashboard', 'nav_dashboard'],
    ['/review', 'nav_review'],
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

export default function App() {
  const { t, L } = useLang()
  const { userId, logout } = useStore()
  const user = users.find((u) => u.id === userId)

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
        </nav>
        <div className="userbox">
          <div className="who">
            <span>{L(user.name)}</span>
            <small>{t('role_' + user.role)}</small>
          </div>
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
          <Route path="/verify/:certId?" element={<Verify />} />
          <Route path="*" element={<Navigate to={homeByRole[user.role]} replace />} />
        </Routes>
      </main>
    </div>
  )
}
