// ─────────────────────────────────────────────────────────────
//  MyQasas — story library
//
//  Each story is a list of scenes. A scene has:
//    bg    : background — night | deep | dusk | dawn | cream | sage
//    art   : illustration name (see art.js)
//    pos   : where the words sit — 'top' (default) or 'bottom'
//    lines : the words, one entry per line. Inside a line:
//              *word*   → highlighted word(s)
//              ^1 ^2 …  → the picture moves on to its next step here
//            Start a line with ~ for a small plain lead-in line.
//            Use { t: '…', s: 'big' } for a large closing word.
//  Narration reads the lines out loud; "ﷺ" is read as
//  "peace be upon him".
//
//  A recitation scene uses  type: 'recite'  with the ayahs.
// ─────────────────────────────────────────────────────────────

window.STORIES = [
  {
    id: 'kawthar',
    section: 'Surahs',
    num: 108,
    title: 'Al-Kawthar',
    ar: 'ٱلْكَوْثَر',
    tagline: 'The river of abundance',
    meta: 'Surah 108 · 3 verses',
    mins: 2,
    scenes: [
      { bg: 'night', art: 'tiles',
        lines: ['The *shortest* surah in the Quran', 'has just *ten words.*'] },

      { bg: 'cream', art: 'prayermat',
        lines: ['We recite it in *salah* again and again.', '^1But do we know its *story?*'] },

      { bg: 'sage', art: 'masjid',
        lines: ['~One day in Madinah,', 'the *Prophet* ﷺ was sitting with his *companions* in the masjid.'] },

      { bg: 'night', art: 'moon', pos: 'bottom',
        lines: ['He dozed off for a *moment…*'] },

      { bg: 'dawn', art: 'sunrise', pos: 'bottom',
        lines: ['then lifted his head, *smiling.*'] },

      { bg: 'cream', art: 'scroll',
        lines: ['~They asked what made him smile.', 'He said: “A surah has just been *revealed* to me.”', '^1And he recited *Al-Kawthar.*'] },

      { bg: 'deep', art: 'ripple',
        lines: ['~Then he asked them:', '“Do you know what *al-Kawthar* is?”'] },

      { bg: 'sage', art: 'river',
        lines: ['~They said: Allah and His Messenger know best.', '“It is a *river* my Lord has promised me,', '^1full of *abundant good.*”'] },

      { bg: 'cream', art: 'trio',
        lines: ['~He described its pool:', '^1Its water is *whiter than milk.*', '^2Its scent is *finer than musk.*', '^3Its cups are as many as the *stars.*'] },

      { bg: 'night', art: 'cup', pos: 'bottom',
        lines: ['And whoever drinks from it', 'will *never* be *thirsty* again.'] },

      { type: 'recite', bg: 'deep',
        intro: '*Listen* to it.',
        surahLabel: 'Surah Al-Kawthar · 108',
        reciter: 'Mishary Alafasy',
        ayahs: [
          { n: 1, ar: ['إِنَّآ', 'أَعْطَيْنَٰكَ', 'ٱلْكَوْثَرَ'], en: 'Indeed, We have given you al-Kawthar.' },
          { n: 2, ar: ['فَصَلِّ', 'لِرَبِّكَ', 'وَٱنْحَرْ'], en: 'So pray to your Lord, and sacrifice.' },
          { n: 3, ar: ['إِنَّ', 'شَانِئَكَ', 'هُوَ', 'ٱلْأَبْتَرُ'], en: 'Indeed, it is your enemy who is cut off.' }
        ],
        audio: (n) => `https://everyayah.com/data/Alafasy_128kbps/108${String(n).padStart(3, '0')}.mp3`
      },

      { bg: 'dusk', art: 'abtar',
        lines: ['~But why does it end with the word', '*al-abtar?*'] },

      { bg: 'dusk', art: 'branch',
        lines: ['When his young *sons* passed away, his enemies *mocked* him.', '^1They called him *abtar* — cut off, with no one to carry his name.'] },

      { bg: 'night', art: 'ayah3', pos: 'bottom',
        lines: ['~Allah answered them:', '“It is your *enemy* who is cut off.”'] },

      { bg: 'sage', art: 'globe',
        lines: ['~Today,', 'his name is called in the *adhan*', '^1five times a day, all over the *world.*'] },

      { bg: 'cream', art: 'path',
        lines: ['So next time you recite *Al-Kawthar,* remember:', '^1a *gift,* ^2a *command,* ^3and a *promise.*'] },

      { bg: 'night', art: 'cupstars', pos: 'bottom',
        lines: ['May Allah let us *drink* from Al-Kawthar,', 'and never be *thirsty* again.', { t: '^1*Ameen.*', s: 'big' }] }
    ],
    sources: [
      ['Sahih Muslim 400', 'The Prophet ﷺ dozed, woke smiling, recited the surah and explained al-Kawthar.'],
      ['Sahih al-Bukhari 6579', 'Whiter than milk, finer than musk, cups like the stars, never thirsty again.'],
      ['Tafsir Ibn Kathir, Surah 108', 'The mockery of the Prophet ﷺ as “abtar” after his sons died.'],
      ['Quran 94:4', '“And We raised high for you your mention.”']
    ]
  },

  // ── Coming soon (shown dimmed on the home screen) ──
  { id: 'fil', section: 'Surahs', num: 105, title: 'Al-Fil', ar: 'ٱلْفِيل', tagline: 'The year of the elephant', soon: true },
  { id: 'kursi', section: 'Ayat', title: 'Ayat al-Kursi', ar: 'آيَةُ ٱلْكُرْسِيّ', tagline: 'The greatest verse', meta: 'Al-Baqarah 2:255', soon: true },
  { id: 'yunus', section: 'Duas', title: 'The du‘a of Yunus', ar: 'لَا إِلَٰهَ إِلَّا أَنتَ', tagline: 'A call from the belly of the whale', meta: 'Al-Anbiya 21:87', soon: true }
];
