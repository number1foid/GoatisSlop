# 🐐 Goatis

A satirical website for **Goatis™ — Enterprise Grazing Solutions**, built with Vue 3 + Vite and hosted on Firebase.

## Pages

| Route        | Page                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `/`          | Homepage                                                             |
| `/api`       | Grazing Forecast: live weather from the [Open-Meteo](https://open-meteo.com) API (no key needed) |
| `/portfolio` | Portfolio of (fictional) Goatis case studies                        |

## Develop

```bash
npm install
npm run dev
```

## Deploy to Firebase Hosting

1. Create a Firebase project in the [Firebase console](https://console.firebase.google.com).
2. Put its project ID in `.firebaserc` (it's `goatis-slop` for now).
3. Log in and deploy:

```bash
npx firebase login
npm run deploy
```

`npm run deploy` builds into `dist/` and runs `firebase deploy --only hosting`. `firebase.json` rewrites every route to `index.html`, so links like `/portfolio` work when you open them directly.
