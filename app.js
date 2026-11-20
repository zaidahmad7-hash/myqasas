// ─────────────────────────────────────────────────────────────
//  MyQasas — app + story player
// ─────────────────────────────────────────────────────────────
(() => {
  const $ = (s) => document.querySelector(s);
  const store = {
    get(k, d) { try { const v = localStorage.getItem('mq_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('mq_' + k, JSON.stringify(v)); } catch (e) {} }
  };
  const settings = {
    narrate: store.get('narrate', true),
    voiceName: store.get('voice', ''),
    rate: store.get('rate', 1)
  };
  const SILENT = 'data:audio/wav;base64,UklGRmQGAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  const LIGHT_BGS = ['cream', 'sage'];

  // ───────── narration voice ─────────
  const synth = window.speechSynthesis || null;
  let voices = [];
  const NOVELTY = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Ralph|Kathy|Deranged|Hysterical|Pipe|Grandma|Grandpa|Eddy|Flo|Reed|Rocko|Sandy|Shelley/i;
  function loadVoices() {
    if (!synth) return;
    voices = synth.getVoices().filter((v) => /^en([-_]|$)/i.test(v.lang) && !NOVELTY.test(v.name));
    fillVoiceSelect();
  }
  function voiceScore(v) {
    return (/premium/i.test(v.name) ? 8 : 0) + (/enhanced/i.test(v.name) ? 6 : 0) +
      (/Daniel|Arthur|Serena|Martha|Oliver|Jamie|Stephanie/i.test(v.name) ? 3 : 0) +
      (/Samantha|Google UK English|Moira|Karen|Tessa/i.test(v.name) ? 2 : 0) +
      (/en[-_]GB/i.test(v.lang) ? 1 : 0);
  }
  function pickVoice() {
    if (!voices.length) return null;
    return voices.find((v) => v.name === settings.voiceName) ||
      voices.slice().sort((a, b) => voiceScore(b) - voiceScore(a))[0];
  }
  if (synth) {
    loadVoices();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', loadVoices);
    else synth.onvoiceschanged = loadVoices;
  }

  // ───────── recitation audio (one element, unlocked on first tap) ─────────
  const audio = new Audio();
  audio.preload = 'auto';
  let audioDead = false;
  function unlockAudio() {
    try {
      audio.muted = true; audio.src = SILENT;
      const p = audio.play();
      const done = () => { audio.pause(); audio.muted = false; };
      if (p && p.then) p.then(done, done); else done();
    } catch (e) { audio.muted = false; }
  }

  // ───────── player state ─────────
  let story = null, cur = 0, run = 0, timers = [], paused = false, reciteAt = 0;
  const stage = $('#stage'), sceneHost = $('#scene-host'), bgHost = $('#bg-host');
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  function stopAll() {
    run++; clearTimers();
    if (synth && (synth.speaking || synth.pending)) synth.cancel();
    try { audio.pause(); } catch (e) {}
    audio.ontimeupdate = audio.onended = audio.onerror = audio.onplaying = null;
  }

  // parse one line of story text into words
  function parseLine(line) {
    let t = typeof line === 'string' ? line : line.t;
    let cls = typeof line === 'string' ? '' : (line.s || '');
    if (t.startsWith('~')) { cls += ' lead'; t = t.slice(1); }
    const out = []; let acc = false, step = null;
    t.split(/\s+/).filter(Boolean).forEach((raw) => {
      let w = raw;
      const m = w.match(/^\^(\d)/);
      if (m) { step = +m[1]; w = w.slice(2); if (!w) return; }
      if (w.startsWith('*')) { acc = true; w = w.slice(1); }
      const thisAcc = acc;
      if (w.includes('*')) { w = w.replace(/\*/g, ''); acc = false; }
      out.push({ text: w, acc: thisAcc, step }); step = null;
    });
    return { cls: cls.trim(), tokens: out };
  }
  const saw = (t) => t.replace(/ﷺ/g, '<i class="saw">ﷺ</i>');
  const sayOf = (w) => w === 'ﷺ' ? 'peace be upon him,' : (w === '—' ? ',' : w);

  // backgrounds cross-fade
  function setBg(bg) {
    const light = LIGHT_BGS.includes(bg);
    stage.classList.toggle('light', light);
    const last = bgHost.lastElementChild;
    if (last && last.dataset.bg === bg) return;
    const l = document.createElement('div');
    l.className = 'bgl bg-' + bg; l.dataset.bg = bg;
    bgHost.appendChild(l);
    requestAnimationFrame(() => requestAnimationFrame(() => l.classList.add('on')));
    setTimeout(() => { while (bgHost.children.length > 1 && bgHost.firstElementChild !== l) bgHost.firstElementChild.remove(); }, 1000);
  }
  function mountScene(el) {
    const old = [...sceneHost.children];
    old.forEach((o) => { o.classList.add('leave'); setTimeout(() => o.remove(), 460); });
    sceneHost.appendChild(el);
  }

  // progress bars
  function buildBars() {
    $('#bars').innerHTML = story.scenes.map(() => '<div class="bar"><i></i></div>').join('');
  }
  function setProgress(f) {
    const bars = $('#bars').children;
    for (let i = 0; i < bars.length; i++) {
      bars[i].classList.toggle('done', i < cur);
      bars[i].firstChild.style.width = i < cur ? '100%' : i === cur ? Math.round(Math.min(1, f) * 100) + '%' : '0%';
    }
  }

  // ───────── play one scene ─────────
  function playScene(i, opts = {}) {
    stopAll();
    paused = false; stage.classList.remove('is-paused');
    cur = i; setProgress(0);
    const sc = story.scenes[i];
    setBg(sc.bg);
    if (sc.type === 'recite') return recite(sc, opts.ayah || 0);

    const el = document.createElement('div');
    el.className = 'scene pos-' + (sc.pos || 'top');
    const words = document.createElement('div'); words.className = 'words';
    sc.lines.forEach((line) => {
      const p = parseLine(line);
      const ln = document.createElement('div'); ln.className = 'line ' + p.cls;
      p.tokens.forEach((tok) => {
        const s = document.createElement('span');
        s.className = 'w' + (tok.acc ? ' acc' : '') + (tok.text === 'ﷺ' ? ' saw' : '');
        s.textContent = tok.text;
        s.dataset.say = sayOf(tok.text);
        if (tok.step) s.dataset.step = tok.step;
        ln.appendChild(s); ln.appendChild(document.createTextNode(' '));
      });
      words.appendChild(ln);
    });
    const art = document.createElement('div'); art.className = 'art';
    art.innerHTML = (window.ART[sc.art] || (() => ''))();
    el.appendChild(words); el.appendChild(art);
    mountScene(el);
    narrate(el, art);
  }

  // reveal words in time with the voice (or a gentle timer when the voice is off)
  function narrate(el, art) {
    const id = run;
    const words = [...el.querySelectorAll('.w')];
    let shown = 0, spoken = false, finished = false, boundary = false;
    const check = () => {
      if (id !== run || finished || paused) return;
      if (shown >= words.length && spoken) {
        finished = true;
        later(() => { if (id === run && !paused) next(); }, 1300);
      }
    };
    const show = (n) => {
      if (id !== run) return;
      while (shown <= n && shown < words.length) {
        const w = words[shown];
        w.classList.add('on');
        if (w.dataset.step) for (let s = 1; s <= +w.dataset.step; s++) art.classList.add('st' + s);
        shown++;
      }
      setProgress(shown / words.length);
      check();
    };
    // timer pacing
    const rate = settings.rate;
    const pace = (w) => {
      const t = w.dataset.say;
      let ms = (120 + t.replace(/[^A-Za-z]/g, '').length * 55) / rate;
      if (/[.!?…”]$/.test(t)) ms += 320 / rate; else if (/[,:;—]$/.test(t)) ms += 180 / rate;
      return ms;
    };
    let t = 450; const sched = words.map((w) => { const s = t; t += pace(w); return s; });
    sched.forEach((s, i) => later(() => { if (!boundary) show(i); }, s));

    const v = settings.narrate && synth ? pickVoice() : null;
    if (settings.narrate && synth) {
      let pos = 0;
      const starts = words.map((w) => { const s = pos; pos += w.dataset.say.length + 1; return s; });
      const u = new SpeechSynthesisUtterance(words.map((w) => w.dataset.say).join(' '));
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
      u.rate = rate; u.pitch = 1;
      u.onboundary = (e) => {
        if (id !== run || (e.name && e.name !== 'word')) return;
        boundary = true;
        let k = 0; while (k + 1 < starts.length && starts[k + 1] <= e.charIndex) k++;
        show(k);
      };
      u.onend = () => { if (id !== run) return; spoken = true; show(words.length - 1); };
      u.onerror = () => { if (id !== run) return; spoken = true; check(); };
      synth.speak(u);
      later(() => { if (id === run && !spoken) { spoken = true; show(words.length - 1); } }, t * 2 + 5000);
    } else {
      spoken = true;
    }
  }

  // ───────── recitation scene ─────────
  function recite(sc, startAyah) {
    const id = run;
    const el = document.createElement('div');
    el.className = 'recite';
    el.innerHTML = `
      <div class="r-intro"><div class="line"></div></div>
      <div class="r-card">
        <span class="c c1">✦</span><span class="c c2">✦</span><span class="c c3">✦</span><span class="c c4">✦</span>
        <div class="r-label">${sc.surahLabel}</div>
        <div class="r-body"><div class="r-ar"></div><div class="r-div"></div><div class="r-en"></div><div class="r-vn"></div></div>
        <div class="r-note"></div>
        <div class="r-foot">Recitation · ${sc.reciter}</div>
      </div>`;
    const introLine = el.querySelector('.r-intro .line');
    parseLine(sc.intro).tokens.forEach((tok) => {
      const s = document.createElement('span'); s.className = 'w' + (tok.acc ? ' acc' : ''); s.textContent = tok.text;
      introLine.appendChild(s); introLine.appendChild(document.createTextNode(' '));
    });
    mountScene(el);
    const len = sc.ayahs.length;
    const body = el.querySelector('.r-body');

    // load first ayah while the intro shows
    if (!audioDead) { audio.src = sc.audio(sc.ayahs[startAyah].n); try { audio.load(); } catch (e) {} }

    if (startAyah === 0) {
      [...introLine.children].forEach((w, i) => later(() => w.classList.add('on'), 200 + i * 260));
      if (settings.narrate && synth) {
        const u = new SpeechSynthesisUtterance(sc.intro.replace(/\*/g, ''));
        const v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; }
        u.rate = settings.rate; synth.speak(u);
      }
      later(() => { el.classList.add('carded'); later(() => playAyah(0, true), 700); }, 2100);
    } else {
      el.classList.add('carded'); later(() => playAyah(startAyah, true), 300);
    }

    function playAyah(k, first) {
      if (id !== run) return;
      reciteAt = k;
      const a = sc.ayahs[k];
      const fill = () => {
        el.querySelector('.r-ar').innerHTML = a.ar.map((w) => `<span class="aw">${w}</span>`).join(' ');
        el.querySelector('.r-en').innerHTML = a.en.split(' ').map((w) => `<span class="nw">${w}</span>`).join(' ');
        el.querySelector('.r-vn').textContent = `Verse ${a.n} · Meaning`;
        body.classList.remove('swap');
      };
      if (first) fill(); else { body.classList.add('swap'); later(fill, 450); }
      setProgress(k / len);
      later(() => start(k), first ? 0 : 500);
    }

    function start(k) {
      if (id !== run) return;
      const ws = [...el.querySelectorAll('.aw')];
      const weights = sc.ayahs[k].ar.map((w) => w.replace(/[ً-ٰٟۖ-ۭ]/g, '').length + 1);
      const total = weights.reduce((x, y) => x + y, 0);
      let ended = false, fellBack = false, started = false;
      const finishAyah = () => {
        if (ended || id !== run) return; ended = true;
        ws.forEach((w) => w.classList.add('on'));
        later(() => {
          if (id !== run) return;
          if (k + 1 < len) playAyah(k + 1, false);
          else { setProgress(1); later(() => { if (id === run && !paused) next(); }, 900); }
        }, 1100);
      };
      const fallback = () => {
        if (fellBack || ended || id !== run) return; fellBack = true; audioDead = true;
        try { audio.pause(); } catch (e) {}
        el.querySelector('.r-note').textContent = 'Recitation plays when you’re online';
        ws.forEach((w, i) => later(() => { if (id === run) w.classList.add('on'); }, 400 + i * 750));
        later(finishAyah, 400 + ws.length * 750 + 900);
      };
      if (audioDead) return fallback();

      const tick = () => {
        if (id !== run || ended || fellBack) return;
        const dur = audio.duration;
        if (dur && isFinite(dur)) {
          const lead = 0.3, tail = 0.45;
          const f = (audio.currentTime - lead) / Math.max(0.6, dur - lead - tail);
          let cum = 0;
          ws.forEach((w, i) => { if (f >= cum - 0.02) w.classList.add('on'); cum += weights[i] / total; });
          setProgress((k + Math.max(0, Math.min(1, f))) / len);
        }
        requestAnimationFrame(tick);
      };
      audio.onplaying = () => { started = true; };
      audio.onended = finishAyah;
      audio.onerror = fallback;
      if (!audio.src || audio.src.indexOf(sc.audio(sc.ayahs[k].n)) === -1) audio.src = sc.audio(sc.ayahs[k].n);
      audio.muted = false;
      try { audio.currentTime = 0; } catch (e) {}
      const p = audio.play();
      if (p && p.catch) p.catch(fallback);
      requestAnimationFrame(tick);
      later(() => { if (!started) fallback(); }, 7000);
      // preload the next ayah's file in the browser cache
      if (k + 1 < len) { try { fetch(sc.audio(sc.ayahs[k + 1].n), { mode: 'no-cors' }).catch(() => {}); } catch (e) {} }
    }
  }

  // ───────── navigation ─────────
  function next() {
    if (cur + 1 < story.scenes.length) playScene(cur + 1);
    else showEnd();
  }
  function prev() { playScene(Math.max(0, cur - 1)); }
  function pause() {
    if (paused) return;
    stopAll(); paused = true; stage.classList.add('is-paused');
  }
  function resume() {
    const sc = story.scenes[cur];
    playScene(cur, sc.type === 'recite' ? { ayah: reciteAt } : {});
  }
  const inPlay = () => story && $('#cover').classList.contains('hide') && $('#endcard').classList.contains('hide');
  $('#tap-prev').addEventListener('click', () => { if (inPlay()) prev(); });
  $('#tap-next').addEventListener('click', () => { if (inPlay()) next(); });
  $('#tap-mid').addEventListener('click', () => { if (!inPlay()) return; paused ? resume() : pause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && inPlay()) pause(); });

  // ───────── open / close a story ─────────
  function openStory(id) {
    story = window.STORIES.find((s) => s.id === id);
    if (!story) return;
    stopAll(); sceneHost.innerHTML = ''; bgHost.innerHTML = '';
    setBg('deep'); buildBars(); cur = 0; setProgress(0);
    $('#hud-title').textContent = story.title;
    $('#cover-ar').textContent = story.ar;
    $('#cover-meta').textContent = story.meta || '';
    $('#cover-title').textContent = story.title;
    $('#cover-tag').textContent = story.tagline;
    $('#cover').classList.remove('hide');
    $('#endcard').classList.add('hide');
    stage.classList.remove('is-paused'); paused = false;
    updateVoiceUI();
    show('player');
  }
  function closeStory() {
    stopAll(); paused = false;
    sceneHost.innerHTML = '';
    show('lib'); renderLib();
  }
  function startStory() {
    unlockAudio(); audioDead = false;
    $('#cover').classList.add('hide');
    $('#endcard').classList.add('hide');
    playScene(0);
  }
  function showEnd() {
    stopAll();
    setProgress(1);
    store.set('done_' + story.id, true);
    $('#end-sources').innerHTML = (story.sources || []).map(([a, b]) => `<li><b>${saw(a)}</b><span>${saw(b)}</span></li>`).join('');
    $('#endcard').classList.remove('hide');
  }
  $('#btn-play').addEventListener('click', startStory);
  $('#btn-replay').addEventListener('click', startStory);
  $('#btn-back').addEventListener('click', closeStory);
  $('#btn-close').addEventListener('click', closeStory);

  // narration on/off inside the player
  const ICON_ON = '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';
  function updateVoiceUI() {
    $('#btn-voice').innerHTML = settings.narrate ? ICON_ON : ICON_OFF;
    $('#cover-voice').innerHTML = `Narration: <b>${settings.narrate ? 'On' : 'Off'}</b>`;
    $('#set-narrate').checked = settings.narrate;
  }
  function toggleNarrate() {
    settings.narrate = !settings.narrate; store.set('narrate', settings.narrate); updateVoiceUI();
  }
  $('#btn-voice').addEventListener('click', () => {
    toggleNarrate();
    if (inPlay() && !paused) {
      const sc = story.scenes[cur];
      if (sc.type !== 'recite') playScene(cur);
    }
  });
  $('#cover-voice').addEventListener('click', toggleNarrate);

  // ───────── home screen ─────────
  function renderLib() {
    const order = ['Surahs', 'Ayat', 'Duas'];
    const groups = {};
    window.STORIES.forEach((s) => (groups[s.section] = groups[s.section] || []).push(s));
    const secs = Object.keys(groups).sort((a, b) => order.indexOf(a) - order.indexOf(b));
    $('#lib-list').innerHTML = secs.map((sec) => `
      <div class="sec"><h2>${sec}</h2>
      ${groups[sec].map((s) => `
        <button class="card ${s.soon ? 'soon' : ''}" data-id="${s.id}" ${s.soon ? 'disabled' : ''}>
          <div class="badge"><span>${s.ar}</span></div>
          <div class="info">
            <div class="meta">${s.meta || (s.num ? 'Surah ' + s.num : '')}</div>
            <div class="title">${s.title}</div>
            <div class="tag">${s.tagline}</div>
            ${!s.soon && store.get('done_' + s.id, false) ? '<div class="done">✓ Watched</div>' : ''}
          </div>
          <div class="go">${s.soon ? 'Soon' : '<svg viewBox="0 0 24 24" width="17" height="17"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>'}</div>
        </button>`).join('')}
      </div>`).join('');
    document.querySelectorAll('#lib-list .card:not(.soon)').forEach((c) =>
      c.addEventListener('click', () => openStory(c.dataset.id)));
  }
  function show(v) {
    document.querySelectorAll('.view').forEach((x) => x.classList.remove('active'));
    $('#view-' + v).classList.add('active');
  }

  // ───────── settings ─────────
  function fillVoiceSelect() {
    const sel = $('#set-voice');
    if (!sel) return;
    const best = pickVoice();
    sel.innerHTML = `<option value="">Automatic${best ? ' (' + best.name + ')' : ''}</option>` +
      voices.slice().sort((a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name))
        .map((v) => `<option value="${v.name}">${v.name} · ${v.lang}</option>`).join('');
    sel.value = voices.some((v) => v.name === settings.voiceName) ? settings.voiceName : '';
  }
  function markRate() {
    document.querySelectorAll('#set-rate button').forEach((b) => b.classList.toggle('on', +b.dataset.r === settings.rate));
  }
  $('#btn-settings').addEventListener('click', () => { loadVoices(); updateVoiceUI(); markRate(); $('#sheet').classList.add('open'); });
  $('#btn-sheet-done').addEventListener('click', () => $('#sheet').classList.remove('open'));
  $('#sheet').addEventListener('click', (e) => { if (e.target.id === 'sheet') $('#sheet').classList.remove('open'); });
  $('#set-narrate').addEventListener('change', (e) => { settings.narrate = e.target.checked; store.set('narrate', settings.narrate); updateVoiceUI(); });
  $('#set-voice').addEventListener('change', (e) => { settings.voiceName = e.target.value; store.set('voice', settings.voiceName); fillVoiceSelect(); });
  $('#set-rate').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    settings.rate = +b.dataset.r; store.set('rate', settings.rate); markRate();
  });
  $('#btn-test').addEventListener('click', () => {
    if (!synth) return alert('This browser has no built-in voice.');
    synth.cancel();
    const u = new SpeechSynthesisUtterance('One day in Madinah, the Prophet, peace be upon him, was sitting with his companions in the masjid.');
    const v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = settings.rate; synth.speak(u);
  });

  // ───────── start ─────────
  renderLib();
  updateVoiceUI();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
  // test hook
  window.MQ = { openStory, startStory, playScene, pause, next, freeze: stopAll, get cur() { return cur; } };
})();
