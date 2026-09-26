import { createContext, useContext, useEffect, useState } from 'react'
import { initialState, opportunities } from './data.js'

const KEY = 'tadreeb-state-v1'
const StoreContext = createContext(null)

const today = () => new Date().toISOString().slice(0, 10)
const uid = () => Math.random().toString(36).slice(2, 9)

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* storage unavailable */
  }
  return initialState
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const [userId, setUserId] = useState(() => {
    try {
      return sessionStorage.getItem('tadreeb-user')
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable */
    }
  }, [state])

  useEffect(() => {
    try {
      if (userId) sessionStorage.setItem('tadreeb-user', userId)
      else sessionStorage.removeItem('tadreeb-user')
    } catch {
      /* storage unavailable */
    }
  }, [userId])

  const actions = {
    login: setUserId,
    logout: () => setUserId(null),
    reset: () => setState(initialState),

    apply: (studentId, oppId) =>
      setState((s) => ({
        ...s,
        applications: [
          ...s.applications,
          { id: uid(), studentId, oppId, status: 'submitted', createdAt: today() },
        ],
      })),

    setStatus: (appId, status) =>
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) => (a.id === appId ? { ...a, status } : a)),
      })),

    // Assigning opens the student's Training Record
    assign: (appId, supervisorId) =>
      setState((s) => {
        const app = s.applications.find((a) => a.id === appId)
        const opp = opportunities.find((o) => o.id === app.oppId)
        const start = new Date()
        const end = new Date(start)
        end.setMonth(end.getMonth() + opp.durationMonths)
        return {
          ...s,
          applications: s.applications.map((a) =>
            a.id === appId ? { ...a, status: 'assigned' } : a,
          ),
          records: [
            ...s.records,
            {
              id: uid(),
              studentId: app.studentId,
              oppId: app.oppId,
              supervisorId,
              start: start.toISOString().slice(0, 10),
              end: end.toISOString().slice(0, 10),
              requiredHours: opp.durationMonths * 120,
              logs: [],
            },
          ],
        }
      }),

    addLog: (recordId, log) =>
      setState((s) => ({
        ...s,
        records: s.records.map((r) =>
          r.id === recordId
            ? { ...r, logs: [{ id: uid(), status: 'pending', ...log }, ...r.logs] }
            : r,
        ),
      })),

    setLogStatus: (recordId, logId, status) =>
      setState((s) => ({
        ...s,
        records: s.records.map((r) =>
          r.id === recordId
            ? { ...r, logs: r.logs.map((l) => (l.id === logId ? { ...l, status } : l)) }
            : r,
        ),
      })),
  }

  return (
    <StoreContext.Provider value={{ state, userId, ...actions }}>{children}</StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
