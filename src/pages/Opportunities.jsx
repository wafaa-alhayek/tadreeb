import { checkEligibility, companies, courses, majors, opportunities, students, userById } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'

export default function Opportunities() {
  const { t, L } = useLang()
  const { state, userId, apply } = useStore()
  const major = students[userId].major
  const rules = state.rules[major]

  return (
    <>
      <h1>{t('nav_opportunities')}</h1>
      <div className="grid">
        {opportunities.map((op) => {
          const elig = checkEligibility(userId, op, state.rules)
          const applied = state.applications.some(
            (a) => a.studentId === userId && a.oppId === op.id,
          )
          return (
            <article key={op.id} className="card opp">
              <h3>{L(op.title)}</h3>
              <p className="muted">{L(companies[op.companyId])}</p>
              <dl className="facts">
                <div>
                  <dt>{t('seats')}</dt>
                  <dd>{op.seats}</dd>
                </div>
                <div>
                  <dt>{t('duration')}</dt>
                  <dd>
                    {op.durationMonths} {t('months')}
                  </dd>
                </div>
                <div>
                  <dt>{t('deadline')}</dt>
                  <dd>{op.deadline}</dd>
                </div>
              </dl>
              <details>
                <summary>{t('requirements')}</summary>
                <ul>
                  <li>
                    {t('majors')}: {op.requirements.majors.map((m) => L(majors[m])).join('، ')}
                  </li>
                  <li>
                    {t('minHours')}: {rules.minHours}
                  </li>
                  <li>
                    {t('rules_minGpa')}: {rules.minGpa}
                  </li>
                  {rules.courses.length > 0 && (
                    <li>
                      {t('courses')}: {rules.courses.map((c) => L(courses[major][c])).join('، ')}
                    </li>
                  )}
                </ul>
                <small>
                  {t('rules_setBy', { name: L(userById(rules.updatedBy).name), major: L(majors[major]) })}
                </small>
              </details>
              <div className={'elig ' + (elig.ok ? 'ok' : 'no')}>
                <strong>{elig.ok ? '✓ ' + t('eligible') : '✕ ' + t('notEligible')}</strong>
                {elig.reasons.map((r, i) => (
                  <div key={i}>{t(r.key, r.vars)}</div>
                ))}
              </div>
              <button
                className="btn primary"
                disabled={!elig.ok || applied}
                onClick={() => apply(userId, op.id)}
              >
                {applied ? t('applied') : t('apply')}
              </button>
            </article>
          )
        })}
      </div>
    </>
  )
}
