# MyQasas — Stories of the Quran

A small iPhone app (web app) that plays short, animated stories behind surahs, ayat and duas.
Each story plays scene by scene: the words appear as a voice reads them, the pictures move,
and a recitation card lights up each word of the ayah with Mishary Alafasy's recitation.

- **Tap the middle** to pause / resume. **Tap right** for the next scene, **left** for the previous.
- The speaker button turns the narration voice on or off.
- The ⚙︎ button on the home screen picks the voice and speed.
  For a warmer voice, download an *Enhanced* or *Premium* English voice on the iPhone
  (Settings → Accessibility → Spoken Content → Voices), then choose it in the app.
- **English or Urdu:** pick the language on the story's cover or in ⚙︎. Urdu text uses Nastaliq script.
  iPhones have no built-in Urdu voice, so the Hindi voice ("Lekha") reads the Urdu story from a Hindi-script copy
  (`urSay` in `stories.js`). Spoken, it sounds the same. If the phone ever has an Urdu voice, the app uses it instead.
- Recitation audio streams from everyayah.com, so it needs internet. Everything else works offline.

## Put it on your iPhone (one-time)
1. On github.com create a new **public** repository called `myqasas`.
2. **Add file → Upload files** → drag in everything from this folder (keep the `icons` and `fonts` folders) → **Commit**.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → **Save**.
4. After a minute your link is `https://zaidahmad7-hash.github.io/myqasas/`.
5. Open it in **Safari** on the iPhone → **Share** → **Add to Home Screen**.

## How a story is written
Stories live in `stories.js`. Each scene is one line of narration with one picture:

```js
{ bg: 'night', art: 'moon', pos: 'bottom', lines: ['He dozed off for a *moment…*'] },
```

- Add `ur: [...]` (Urdu lines) and `urSay: [...]` (the same lines in Hindi script, for the voice) to each scene.
- `*word*` highlights a word, `^1` moves the picture on to its next step, `~` makes a small lead-in line.
- Backgrounds: `night`, `deep`, `dusk`, `dawn`, `cream`, `sage`.
- Pictures live in `art.js` (tiles, prayermat, masjid, moon, sunrise, scroll, ripple, river, trio, cup,
  cupstars, abtar, branch, ayah3, globe, path) and can be reused across stories.
- Every story lists its sources at the end — please have stories checked by a trusted teacher before sharing.
