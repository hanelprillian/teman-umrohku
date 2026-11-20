# Panduan Umroh

PWA panduan umroh langkah demi langkah (Ihram → Tawaf → Maqam Ibrahim → Zamzam → Sa'i → Tahallul), lengkap dengan counter putaran, doa (Arab, Latin, arti), dan dalilnya. Bisa dipakai offline setelah dibuka sekali.

## Menjalankan

```bash
npm install
npm run dev       # development (service worker tidak aktif)
npm run build     # static export ke out/ + generate out/sw.js
npm run preview   # sajikan out/ di http://localhost:3000
```

Ikon di-generate dari `scripts/generate-icons.mjs` (`node scripts/generate-icons.mjs`).

## Struktur

- `src/content/` — seluruh konten manasik (sesi, langkah, doa, dalil). Revisi konten cukup di sini.
- `src/components/session-runner.tsx` — alur langkah per sesi + counter.
- `src/lib/progress-store.ts` — progres tersimpan di `localStorage`.
- `src/lib/settings-store.ts` — ukuran huruf, tema, tampil Latin/arti.
- `scripts/generate-sw.mjs` — service worker untuk mode offline (precache semua file hasil build).

## Install di iPhone

Deploy folder `out/` ke hosting statis ber-HTTPS (Vercel, Cloudflare Pages, Netlify), buka di Safari → Share → **Add to Home Screen**.

## React Native (offline native)

Branch `rn/teman-umrohku` → folder [`mobile/`](./mobile/) (Expo). Konten & store sama dengan web; app native supaya tetap bisa dibuka saat jaringan jelek (tanpa mengandalkan A2HS/PWA).

```bash
cd mobile && npm install && npm start
```

## Catatan konten

Konten masih perlu ditinjau ustadz/pembimbing sebelum dipakai. Setiap doa diberi label status dalil: Al-Qur'an, Shahih, Hasan, Atsar Sahabat, atau Diperselisihkan.
