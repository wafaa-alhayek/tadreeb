# تدريب · Tadreeb

منصة ويب لإدارة التدريب الميداني لطلاب الجامعة — من الإعلان عن الفرصة والتقديم، إلى المتابعة والتقييم والاعتماد وإصدار شهادة إلكترونية قابلة للتحقق عبر QR.

A web platform for managing university field training — from posting opportunities and applying, through tracking, evaluation and approval, to issuing a QR-verifiable certificate.

**Live demo:** https://wafaa-alhayek.github.io/tadreeb/

🎤 **Presenting?** Follow the Arabic demo script: [`docs/demo-script-ar.md`](docs/demo-script-ar.md)

## Current status — clickable prototype for presentation

Front-end only, with demo data saved in the browser (`localStorage`). Arabic (RTL) / English (LTR) toggle.

| Role | What works |
|---|---|
| 👨‍🎓 Student | Browse opportunities · automatic eligibility check with reasons · apply · track application status · training record with daily log & hours progress |
| 👨‍💼 Training officer | Dashboard with university-wide stats & charts · review applications (review → accept / reject / request changes → assign + academic supervisor) · completion checklist → issue certificate |
| 👨‍🏫 Academic supervisor | See assigned students · approve / return daily logs |
| 🌐 Public | Certificate with QR code → public verification page (works on any phone) |

Switch between demo accounts from the dropdown in the top bar. Reset the demo from the login screen.

## Run locally

```bash
npm install
npm run dev
```

## Project structure

```
src/
  data.js        demo data + eligibility rules
  store.jsx      app state & actions (apply, review, assign, logs)
  i18n.jsx       Arabic / English strings, RTL switching
  App.jsx        layout, navigation per role, routes
  pages/         one file per screen
```

## Roadmap

- [x] Clickable prototype (student, officer, supervisor, verify page)
- [x] Completion checks, weighted final grade, certificate with QR verification
- [x] Realistic dashboard data, role switcher, Arabic demo script
- [ ] Remaining roles: college/department, training provider & its supervisor, senior management
- [ ] Document uploads with applications
- [ ] Attendance (incl. QR check-in)
- [ ] Weekly / mid-term / final reports with approve / return
- [ ] Field visits by academic supervisor
- [ ] Evaluations (provider → student, supervisor → student, student → provider) with weighted grading
- [ ] Richer dashboard: stats by college, department, major, semester
- [ ] Real backend: database, authentication, file storage (certificate verification by server lookup instead of data in the QR link)
