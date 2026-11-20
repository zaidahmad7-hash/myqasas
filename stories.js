// ─────────────────────────────────────────────────────────────
//  MyQasas — story library
//
//  Each story is a list of scenes. A scene has:
//    bg    : background — night | deep | dusk | dawn | cream | sage
//    art   : illustration name (see art.js)
//    pos   : where the words sit — 'top' (default) or 'bottom'
//    lines : the English words, one entry per line. Inside a line:
//              *word*   → highlighted word(s)
//              ^1 ^2 …  → the picture moves on to its next step here
//            Start a line with ~ for a small plain lead-in line.
//            Use { t: '…', s: 'big' } for a large closing word.
//    ur    : the same lines in Urdu (same markers)
//    urSay : what the voice reads for each Urdu line, written in Hindi
//            (Devanagari) script, because iPhones have a Hindi voice but no
//            Urdu one. Spoken, it sounds the same. One entry per Urdu line.
//  English narration reads the lines; "ﷺ" is read as "peace be upon him".
//
//  A recitation scene uses  type: 'recite'  with the ayahs.
// ─────────────────────────────────────────────────────────────

window.STORIES = [
  {
    id: 'kawthar',
    section: 'Surahs',
    num: 108,
    title: 'Al-Kawthar',
    urTitle: 'سورۃ الکوثر',
    ar: 'ٱلْكَوْثَر',
    tagline: 'The river of abundance',
    urTagline: 'خیرِ کثیر کی نہر',
    meta: 'Surah 108 · 3 verses',
    urMeta: 'سورت ۱۰۸ · ۳ آیات',
    mins: 2,
    scenes: [
      { bg: 'night', art: 'tiles',
        lines: ['The *shortest* surah in the Quran', 'has just *ten words.*'],
        ur: ['قرآن کی *سب سے چھوٹی* سورت', 'صرف *دس لفظوں* کی ہے۔'],
        urSay: ['क़ुरआन की सबसे छोटी सूरत', 'सिर्फ़ दस लफ़्ज़ों की है।'] },

      { bg: 'cream', art: 'prayermat',
        lines: ['We recite it in *salah* again and again.', '^1But do we know its *story?*'],
        ur: ['ہم اسے *نماز* میں بار بار پڑھتے ہیں۔', '^1لیکن کیا ہم اس کی *کہانی* جانتے ہیں؟'],
        urSay: ['हम इसे नमाज़ में बार बार पढ़ते हैं।', 'लेकिन क्या हम इसकी कहानी जानते हैं?'] },

      { bg: 'sage', art: 'masjid',
        lines: ['~One day in Madinah,', 'the *Prophet* ﷺ was sitting with his *companions* in the masjid.'],
        ur: ['~ایک دن مدینہ میں،', '*نبی کریم* ﷺ مسجد میں اپنے *صحابہ* کے ساتھ تشریف فرما تھے۔'],
        urSay: ['एक दिन मदीना में,', 'नबी-ए-करीम, सल्लल्लाहु अलैहि वसल्लम, मस्जिद में अपने सहाबा के साथ तशरीफ़ फ़रमा थे।'] },

      { bg: 'night', art: 'moon', pos: 'bottom',
        lines: ['He dozed off for a *moment…*'],
        ur: ['آپ کو ایک *لمحے* کے لیے اونگھ آ گئی…'],
        urSay: ['आपको एक लम्हे के लिए ऊँघ आ गई…'] },

      { bg: 'dawn', art: 'sunrise', pos: 'bottom',
        lines: ['then lifted his head, *smiling.*'],
        ur: ['پھر آپ نے *مسکراتے* ہوئے سر اٹھایا۔'],
        urSay: ['फिर आपने मुस्कुराते हुए सर उठाया।'] },

      { bg: 'cream', art: 'scroll',
        lines: ['~They asked what made him smile.', 'He said: “A surah has just been *revealed* to me.”', '^1And he recited *Al-Kawthar.*'],
        ur: ['~صحابہ نے مسکرانے کی وجہ پوچھی۔', 'فرمایا: ”ابھی ابھی مجھ پر ایک سورت *نازل* ہوئی ہے۔“', '^1اور آپ نے *سورۃ الکوثر* کی تلاوت فرمائی۔'],
        urSay: ['सहाबा ने मुस्कुराने की वजह पूछी।', 'फ़रमाया: अभी अभी मुझ पर एक सूरत नाज़िल हुई है।', 'और आपने सूरतुल कौसर की तिलावत फ़रमाई।'] },

      { bg: 'deep', art: 'ripple',
        lines: ['~Then he asked them:', '“Do you know what *al-Kawthar* is?”'],
        ur: ['~پھر آپ نے پوچھا:', '”کیا تم جانتے ہو *کوثر* کیا ہے؟“'],
        urSay: ['फिर आपने पूछा:', 'क्या तुम जानते हो कौसर क्या है?'] },

      { bg: 'sage', art: 'river',
        lines: ['~They said: Allah and His Messenger know best.', '“It is a *river* my Lord has promised me,', '^1full of *abundant good.*”'],
        ur: ['~انہوں نے عرض کیا: اللہ اور اس کا رسول بہتر جانتے ہیں۔', '”یہ ایک *نہر* ہے جس کا میرے رب نے مجھ سے وعدہ کیا ہے،', '^1اس میں *خیرِ کثیر* ہے۔“'],
        urSay: ['उन्होंने अर्ज़ किया: अल्लाह और उसका रसूल बेहतर जानते हैं।', 'यह एक नहर है जिसका मेरे रब ने मुझसे वादा किया है,', 'इसमें ख़ैर-ए-कसीर है।'] },

      { bg: 'cream', art: 'trio',
        lines: ['~He described its pool:', '^1Its water is *whiter than milk.*', '^2Its scent is *finer than musk.*', '^3Its cups are as many as the *stars.*'],
        ur: ['~آپ نے اس کے حوض کا حال بتایا:', '^1اس کا پانی *دودھ سے زیادہ سفید*،', '^2اس کی خوشبو *مشک سے بہتر*،', '^3اور اس کے پیالے *ستاروں* جتنے۔'],
        urSay: ['आपने उसके हौज़ का हाल बताया:', 'उसका पानी दूध से ज़्यादा सफ़ेद,', 'उसकी ख़ुशबू मुश्क से बेहतर,', 'और उसके प्याले सितारों जितने।'] },

      { bg: 'night', art: 'cup', pos: 'bottom',
        lines: ['And whoever drinks from it', 'will *never* be *thirsty* again.'],
        ur: ['اور جو اس میں سے پی لے گا،', 'اسے *کبھی پیاس* نہیں لگے گی۔'],
        urSay: ['और जो इसमें से पी लेगा,', 'उसे कभी प्यास नहीं लगेगी।'] },

      { type: 'recite', bg: 'deep',
        intro: '*Listen* to it.',
        urIntro: 'اب اسے *سنیے*۔',
        urIntroSay: 'अब इसे सुनिए।',
        surahLabel: 'Surah Al-Kawthar · 108',
        urSurahLabel: 'سورۃ الکوثر · ۱۰۸',
        reciter: 'Mishary Alafasy',
        urReciter: 'مشاری العفاسی',
        ayahs: [
          { n: 1, ar: ['إِنَّآ', 'أَعْطَيْنَٰكَ', 'ٱلْكَوْثَرَ'], en: 'Indeed, We have given you al-Kawthar.', ur: 'بے شک ہم نے آپ کو کوثر عطا فرمائی۔' },
          { n: 2, ar: ['فَصَلِّ', 'لِرَبِّكَ', 'وَٱنْحَرْ'], en: 'So pray to your Lord, and sacrifice.', ur: 'پس اپنے رب کے لیے نماز پڑھیے اور قربانی کیجیے۔' },
          { n: 3, ar: ['إِنَّ', 'شَانِئَكَ', 'هُوَ', 'ٱلْأَبْتَرُ'], en: 'Indeed, it is your enemy who is cut off.', ur: 'بے شک آپ کا دشمن ہی جڑ کٹا ہے۔' }
        ],
        audio: (n) => `https://everyayah.com/data/Alafasy_128kbps/108${String(n).padStart(3, '0')}.mp3`
      },

      { bg: 'dusk', art: 'abtar',
        lines: ['~But why does it end with the word', '*al-abtar?*'],
        ur: ['~لیکن یہ سورت اس لفظ پر کیوں ختم ہوتی ہے:', '*اَلاَبتَر؟*'],
        urSay: ['लेकिन यह सूरत इस लफ़्ज़ पर क्यों ख़त्म होती है:', 'अल-अबतर?'] },

      { bg: 'dusk', art: 'branch',
        lines: ['When his young *sons* passed away, his enemies *mocked* him.', '^1They called him *abtar* — cut off, with no one to carry his name.'],
        ur: ['جب آپ کے *کم سن بیٹے* وفات پا گئے تو دشمنوں نے *طعنہ* دیا۔', '^1انہوں نے آپ کو *ابتر* کہا — یعنی جس کا نام لینے والا کوئی نہ رہے۔'],
        urSay: ['जब आपके कमसिन बेटे वफ़ात पा गए तो दुश्मनों ने ताना दिया।', 'उन्होंने आपको अबतर कहा, यानी जिसका नाम लेने वाला कोई न रहे।'] },

      { bg: 'night', art: 'ayah3', pos: 'bottom',
        lines: ['~Allah answered them:', '“It is your *enemy* who is cut off.”'],
        ur: ['~اللہ نے انہیں جواب دیا:', '”بے شک آپ کا *دشمن* ہی جڑ کٹا ہے۔“'],
        urSay: ['अल्लाह ने उन्हें जवाब दिया:', 'बेशक आपका दुश्मन ही जड़ कटा है।'] },

      { bg: 'sage', art: 'globe',
        lines: ['~Today,', 'his name is called in the *adhan*', '^1five times a day, all over the *world.*'],
        ur: ['~آج،', 'آپ کا نام *اذان* میں پکارا جاتا ہے،', '^1دن میں پانچ بار، *پوری دنیا* میں۔'],
        urSay: ['आज,', 'आपका नाम अज़ान में पुकारा जाता है,', 'दिन में पाँच बार, पूरी दुनिया में।'] },

      { bg: 'cream', art: 'path',
        lines: ['So next time you recite *Al-Kawthar,* remember:', '^1a *gift,* ^2a *command,* ^3and a *promise.*'],
        ur: ['تو اگلی بار جب آپ *سورۃ الکوثر* پڑھیں، یاد رکھیں:', '^1ایک *تحفہ،* ^2ایک *حکم،* ^3اور ایک *وعدہ۔*'],
        urSay: ['तो अगली बार जब आप सूरतुल कौसर पढ़ें, याद रखें:', 'एक तोहफ़ा, एक हुक्म, और एक वादा।'] },

      { bg: 'night', art: 'cupstars', pos: 'bottom',
        lines: ['May Allah let us *drink* from Al-Kawthar,', 'and never be *thirsty* again.', { t: '^1*Ameen.*', s: 'big' }],
        ur: ['اللہ ہمیں *حوضِ کوثر* سے پینا نصیب فرمائے،', 'اور ہمیں پھر کبھی *پیاس* نہ لگے۔', { t: '^1*آمین۔*', s: 'big' }],
        urSay: ['अल्लाह हमें हौज़-ए-कौसर से पीना नसीब फ़रमाए,', 'और हमें फिर कभी प्यास न लगे।', 'आमीन।'] }
    ],
    sources: [
      ['Sahih Muslim 400', 'The Prophet ﷺ dozed, woke smiling, recited the surah and explained al-Kawthar.'],
      ['Sahih al-Bukhari 6579', 'Whiter than milk, finer than musk, cups like the stars, never thirsty again.'],
      ['Tafsir Ibn Kathir, Surah 108', 'The mockery of the Prophet ﷺ as “abtar” after his sons died.'],
      ['Quran 94:4', '“And We raised high for you your mention.”']
    ],
    urSources: [
      ['صحیح مسلم ۴۰۰', 'نبی کریم ﷺ کو اونگھ آئی، مسکراتے ہوئے اٹھے، سورت تلاوت کی اور کوثر کی وضاحت فرمائی۔'],
      ['صحیح بخاری ۶۵۷۹', 'پانی دودھ سے زیادہ سفید، خوشبو مشک سے بہتر، پیالے ستاروں جیسے، پھر کبھی پیاس نہیں۔'],
      ['تفسیر ابن کثیر، سورۃ ۱۰۸', 'بیٹوں کی وفات کے بعد نبی کریم ﷺ کو ”ابتر“ کہہ کر طعنہ دیا جانا۔'],
      ['قرآن ۹۴:۴', '”اور ہم نے آپ کا ذکر بلند کر دیا۔“']
    ]
  },

  // ── Coming soon (shown dimmed on the home screen) ──
  { id: 'fil', section: 'Surahs', num: 105, title: 'Al-Fil', ar: 'ٱلْفِيل', tagline: 'The year of the elephant', soon: true },
  { id: 'kursi', section: 'Ayat', title: 'Ayat al-Kursi', ar: 'آيَةُ ٱلْكُرْسِيّ', tagline: 'The greatest verse', meta: 'Al-Baqarah 2:255', soon: true },
  { id: 'yunus', section: 'Duas', title: 'The du‘a of Yunus', ar: 'لَا إِلَٰهَ إِلَّا أَنتَ', tagline: 'A call from the belly of the whale', meta: 'Al-Anbiya 21:87', soon: true }
];
