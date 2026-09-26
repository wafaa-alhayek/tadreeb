# تدريب · Tadreeb

منصة ويب لإدارة التدريب الميداني لطلاب الجامعة — من الإعلان عن الفرصة والتقديم، إلى المتابعة والتقييم والاعتماد وإصدار شهادة إلكترونية قابلة للتحقق عبر QR.

A web platform for managing university field training — from posting opportunities and applying, through tracking, evaluation and approval, to issuing a QR-verifiable certificate.

**Live demo:** https://wafaa-alhayek.github.io/tadreeb/

## Current status — Phase 1: clickable prototype

Front-end only, with demo data saved in the browser (`localStorage`). Arabic (RTL) / English (LTR) toggle.

| Role | What works |
|---|---|
| 👨‍🎓 Student | Browse opportunities · automatic eligibility check with reasons · apply · track application status · training record with daily log & hours progress |
| 👨‍💼 Training officer | Dashboard stats · review applications (review → accept / reject / request changes → assign + academic supervisor) |
| 👨‍🏫 Academic supervisor | See assigned students · approve / return daily logs |
| 🌐 Public | Verify a certificate by number (`/#/verify/TR-2026-0001`) |

**Try the full flow:** log in as *Amal* → apply → log out → *Sara* (officer) → review, accept, assign → *Amal* → add a daily log → *Dr. Mohammad* → approve it.

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

- [x] Phase 1 — clickable prototype (student, officer, supervisor, verify page)
- [ ] Remaining roles: college/department, training provider & its supervisor, senior management
- [ ] Document uploads with applications
- [ ] Attendance (incl. QR check-in)
- [ ] Weekly / mid-term / final reports with approve / return
- [ ] Field visits by academic supervisor
- [ ] Evaluations (provider → student, supervisor → student, student → provider) with weighted grading
- [ ] Completion checks + certificate generation with QR code (PDF)
- [ ] Richer dashboard: stats by college, department, major, semester
- [ ] Real backend: database, authentication, file storage
