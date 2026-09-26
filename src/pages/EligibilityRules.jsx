import { useState } from 'react'
import { checkEligibility, courses, majors, students, userById } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'
import { fmtTime } from '../lib/verify.js'

// One major's rules: edit a draft, preview its effect on that major's students, then save
function MajorRules({ major }) {
  const { t, L } = useLang()
  const { state, updateRules } = useStore()
  const saved = state.rules[major]
  const [draft, setDraft] = useState(saved)
  const [justSaved, setJustSaved] = useState(false)
  const set = (patch) => {
    setDraft({ ...draft, ...patch })
    setJustSaved(false)
  }
  const dirty = ['minHours', 'minGpa', 'blockIncomplete'].some((k) => draft[k] !== saved[k]) ||
    draft.courses.join() !== saved.courses.join()

  // Preview against an opportunity open to this major, using the draft rules
  const anyOpp = { requirements: { majors: [major] } }
  const cohort = Object.keys(students)
    .filter((id) => students[id].major === major)
    .map((id) => ({ id, ...checkEligibility(id, anyOpp, { ...state.rules, [major]: draft }) }))
  const eligible = cohort.filter((c) => c.ok).length

  return (
    <section className="card rules">
      <div className="row between wrap">
        <h3>{L(majors[major])}</h3>
        <small>{t('rules_updated', { name: L(userById(saved.updatedBy).name), at: fmtTime(saved.updatedAt) })}</small>
      </div>
      <div className="two-col even">
        <div className="form">
          <label>
            {t('rules_minHours')}
            <input type="number" min="0" max="160" value={draft.minHours} onChange={(e) => set({ minHours: Number(e.target.value) })} />
          </label>
          <label>
            {t('rules_minGpa')}
            <input type="number" min="0" max="4" step="0.1" value={draft.minGpa} onChange={(e) => set({ minGpa: Number(e.target.value) })} />
          </label>
          <fieldset className="checks">
            <legend>{t('rules_courses')}</legend>
            {Object.entries(courses[major]).map(([code, name]) => (
              <label key={code} className="check">
                <input
                  type="checkbox"
                  checked={draft.courses.includes(code)}
                  onChange={(e) =>
                    set({ courses: e.target.checked ? [...draft.courses, code] : draft.courses.filter((c) => c !== code) })
                  }
                />
                <span>
                  {L(name)} <code>{code}</code>
                </span>
              </label>
            ))}
          </fieldset>
          <label className="check">
            <input type="checkbox" checked={draft.blockIncomplete} onChange={(e) => set({ blockIncomplete: e.target.checked })} />
            <span>{t('rules_block')}</span>
          </label>
          <button
            className="btn primary"
            disabled={!dirty}
            onClick={() => {
              updateRules(major, draft)
              setJustSaved(true)
            }}
          >
            {t('rules_save')}
          </button>
          {justSaved && <div className="elig ok">✓ {t('rules_saved')}</div>}
        </div>
        <div>
          <h4>
            {t('rules_preview')} — {t('rules_eligibleN', { n: eligible, total: cohort.length })}
          </h4>
          <ul className="logs">
            {cohort.map((c) => (
              <li key={c.id} className={c.ok ? '' : 'flagged'}>
                <div className="row between">
                  <strong>{L(userById(c.id).name)}</strong>
                  <span className={'badge ' + (c.ok ? 'ls-verified' : 'ls-rejected')}>{c.ok ? t('eligible') : t('notEligible')}</span>
                </div>
                <small>
                  {students[c.id].completedHours} {t('hoursUnit')} · {t('gpa')} {students[c.id].gpa} · {students[c.id].passedCourses.join(', ')}
                </small>
                {c.reasons.map((r, i) => (
                  <small key={i} className="bad">
                    {t(r.key, r.vars)}
                  </small>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function EligibilityRules() {
  const { t, L } = useLang()
  const { state } = useStore()
  return (
    <>
      <h1>{t('rules_title')}</h1>
      <p className="muted note">{t('rules_sub')}</p>
      <div className="stack">
        {Object.keys(majors).map((m) => (
          <MajorRules key={m} major={m} />
        ))}
        {state.rulesLog.length > 0 && (
          <section className="card">
            <h3>{t('rules_log')}</h3>
            <ol className="audit">
              {state.rulesLog.map((e, i) => (
                <li key={i}>
                  <span className="when">{fmtTime(e.at)}</span>
                  <span className="who">{L(userById(e.actor).name)}</span>
                  <span className="what">
                    {L(majors[e.major])}: {e.before.minHours}→{e.after.minHours} {t('hoursUnit')} · {t('gpa')} {e.before.minGpa}→{e.after.minGpa} ·{' '}
                    {e.after.courses.join(', ') || '—'}
                  </span>
                  <span />
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </>
  )
}
