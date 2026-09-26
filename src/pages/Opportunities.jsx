import { checkEligibility, companies, majors, opportunities } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.jsx'

export default function Opportunities() {
  const { t, L } = useLang()
  const { state, userId, apply } = useStore()

  return (
    <>
      <h1>{t('nav_opportunities')}</h1>
      <div className="grid">
        {opportunities.map((op) => {
          const elig = checkEligibility(userId, op)
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
                    {t('minHours')}: {op.requirements.minHours}
                  </li>
                  <li>
                    {t('majors')}: {op.requirements.majors.map((m) => L(majors[m])).join('، ')}
                  </li>
                  {op.requirements.courses.length > 0 && (
                    <li>
                      {t('courses')}: {op.requirements.courses.join(', ')}
                    </li>
                  )}
                </ul>
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
