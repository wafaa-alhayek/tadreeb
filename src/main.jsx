import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LangProvider } from './i18n.jsx'
import { StoreProvider } from './store.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <LangProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </LangProvider>
    </HashRouter>
  </StrictMode>,
)
