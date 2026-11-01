# Goatis

A satirical website about Goatis, built with Vue 3 + Vite and hosted on Firebase.

## Pages

| Route        | Page                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| `/`          | Homepage                                                                                     |
| `/api`       | The Channel: live channel stats and uploads from the [YouTube Data API v3](https://developers.google.com/youtube/v3) |
| `/portfolio` | Portfolio                                                                                    |

## Develop

Create `.env.local` (not committed) with a YouTube Data API key:

```
VITE_YOUTUBE_API_KEY=your-key
```

Restrict the key in the Google Cloud console to the YouTube Data API v3 and to the site's domains
(`goatislop.web.app`, `goatislop.firebaseapp.com`, `localhost:5173`), since it is visible in the built site.

```bash
npm install
npm run dev
```

## Deploy to Firebase Hosting

The Firebase project is `goatislop` (set in `.firebaserc`; the web SDK config is in `src/firebase.js`).

```bash
npx firebase login
npm run deploy
```

`npm run deploy` builds into `dist/` (the key from `.env.local` is baked in at build time) and runs
`firebase deploy --only hosting`. `firebase.json` rewrites every route to `index.html`, so links like `/portfolio`
work when opened directly.

## goatis.net archive proxy (not deployed)

`functions/` holds a Cloud Function that proxies the goatis.net transcript archive (it has no public API and no CORS)
and serves `/api/v1/stats`, `/videos`, `/search` and `/random`. It needs the Blaze plan, so it isn't deployed.
To enable it: upgrade to Blaze, add
`{ "source": "/api/v1/**", "function": { "functionId": "api", "region": "europe-west1" } }` before the catch-all
rewrite in `firebase.json`, and run `npm run deploy:functions`. Locally, `npm run emulators` runs it and the Vite dev
server proxies `/api/v1` to it.
