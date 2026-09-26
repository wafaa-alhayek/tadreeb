# تدريب · Tadreeb

منصة ويب لإدارة التدريب الميداني لطلاب الجامعة — من الإعلان عن الفرصة والتقديم، إلى المتابعة والتقييم والاعتماد وإصدار شهادة إلكترونية قابلة للتحقق عبر QR.

A web platform for managing university field training — from posting opportunities and applying, through tracking, evaluation and approval, to issuing a QR-verifiable certificate.

**Live demo:** https://wafaa-alhayek.github.io/tadreeb/

🎤 **Presenting?** Follow the Arabic demo script: [`docs/demo-script-ar.md`](docs/demo-script-ar.md)

## Current status — clickable prototype for presentation

Front-end only, with demo data saved in the browser. Arabic (RTL) / English (LTR). Switch accounts from the dropdown in the top bar; reset the demo from the login screen.

Three students at three stages of the same training, so every role sees the start, middle and end:

| | 👨‍🎓 Student | 🏫 College (supervisor & officer) | 🏢 Training provider |
|---|---|---|---|
| **Start** | Eligibility check with reasons · apply · track status | Supervisor sets **eligibility rules per major** (with live impact preview) · officer reviews & assigns | Accepts or declines the incoming student |
| **Middle** | Check in with rotating code · log hours only for attended days · weekly reports | Approves provider-confirmed logs & weekly reports · records field visits · **verification center** | Rotating attendance code · confirms or disputes logs |
| **End** | Final report · rates the provider · completion checklist & grade | Approves final report, academic evaluation · issues **digitally signed** certificate | Evaluates the student |

### Verification — how a claimed hour becomes a counted hour

1. **Attendance** — check-in/out with a code that rotates every 30 s (+ location check), shown at the provider's entrance.
2. **Automatic checks** — claimed hours vs. actual attendance, days off, no attendance, outside location, >10 h/day, duplicate text, late entries.
3. **Provider confirms**, then **academic supervisor approves**. Hours count only when all three agree, and never more than the recorded attendance.
4. **Tamper-evident audit trail** — every action is hash-chained (SHA-256); editing any past entry is detected.
5. **Signed certificates** — ECDSA P-256 signature over the certificate data + record fingerprint; the QR verifies on any phone and exposes any edited field.

> Demo shortcuts: the signing key lives in the browser and GPS is simulated. In production the key stays on the university's server.

## Run locally

```bash
npm install
npm run dev
```

## Project structure

```
src/
  data.js        demo data, eligibility check, seed generation (relative to today)
  lib/verify.js  verification engine: attendance codes, log checks, hours, completion, audit chain
  lib/signing.js certificate signing & verification (Web Crypto ECDSA)
  lib/sha256.js  synchronous SHA-256 for the hash chain
  components.jsx shared UI: trust chain, flags, hours card, checklist, audit trail
  store.jsx      app state & actions (every record change is written to the audit trail)
  i18n.jsx       Arabic / English strings, RTL switching
  App.jsx        layout, navigation per role, routes
  pages/         one file per screen
```

## Roadmap

- [x] Clickable prototype (student, officer, supervisor, verify page)
- [x] Completion checks, weighted final grade, certificate with QR verification
- [x] Realistic dashboard data, role switcher, Arabic demo script
- [x] Training provider role, three-stage journeys, hours verification, audit trail, signed certificates
- [x] Eligibility rules per major, owned by the academic supervisor
- [ ] Training courses axis (course management, registration, attendance, trainers)
- [ ] Remaining roles: department head, trainer, system admin, senior management
- [ ] Richer dashboard: stats by college, department, major, semester
- [ ] Notifications, Excel/PDF export, document uploads
- [ ] Real backend: database, authentication, file storage, server-side signing key
