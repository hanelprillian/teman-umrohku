# Teman Umrohku — React Native (Expo)

Native offline-first build so the guide still opens when the network is bad (unlike PWA add-to-homescreen, which often needs a fetch first).

## Setup

```bash
cd mobile
npm install
npm start
```

Then press `i` (iOS simulator) or `a` (Android) / scan the QR with Expo Go.

## What’s shared vs adapted

| Source (web) | Mobile |
| --- | --- |
| `src/content/*` | Copied as-is → `mobile/src/content/` |
| `progress-store` / `settings-store` | Same API; persist via AsyncStorage |
| Home / session / settings / doa UX | Ported to RN screens (same flows) |

Also ported: immersive slides + swipe/lock pad, counter panel/focus/undo toast, splash, onboarding, dalil badges.
