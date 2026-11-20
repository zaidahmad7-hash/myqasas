// ─────────────────────────────────────────────────────────────
//  MyQasas — illustration library
//  Each entry returns the picture for one scene (SVG / HTML).
//  Animation classes (see style.css):
//    pop fade rise draw unroll sink fillup  → play once (use --d for delay)
//    twinkle floaty spin ripple glow flow   → loop gently
//  Add data-step="1" (2, 3…) to hold an element back until the
//  narration reaches the matching ^1 (^2, ^3…) marker.
// ─────────────────────────────────────────────────────────────
(function () {
  const G = {
    gold: '#e3c27a', goldDeep: '#c99b3f', green: '#2e6b4f', greenDk: '#1f3a2d',
    leaf: '#4f9a72', mint: '#8fd3b8', mintLt: '#d6f2e7', cream: '#f8f1e1',
    wood: '#7a5a3c', woodDk: '#5b412b', sand: '#c49a62'
  };
  const T = (en, ur) => (window.MQ_LANG === 'ur' ? ur : en);
  const d = (s) => `style="--d:${s}s"`;
  const svg = (inner, vb = '0 0 320 300') =>
    `<svg class="svg" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  // eight-pointed star (two overlapping squares)
  function star8(cx, cy, r) {
    const pts = [];
    for (let k = 0; k < 16; k++) {
      const a = (Math.PI / 8) * k - Math.PI / 2;
      const rr = k % 2 === 0 ? r : r * 0.765;
      pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }
  // little four-point sparkle
  const spark = (x, y, s, delay, col = G.gold) =>
    `<path class="twinkle" ${d(delay)} fill="${col}" d="M${x},${y - s} Q${x + s * 0.18},${y - s * 0.18} ${x + s},${y} Q${x + s * 0.18},${y + s * 0.18} ${x},${y + s} Q${x - s * 0.18},${y + s * 0.18} ${x - s},${y} Q${x - s * 0.18},${y - s * 0.18} ${x},${y - s}Z"/>`;

  const palm = (x, y, s, delay, step) => `
    <g class="pop" ${step ? `data-step="${step}"` : ''} ${d(delay)}>
      <path d="M${x},${y} C${x + 3 * s},${y - 20 * s} ${x - 2 * s},${y - 40 * s} ${x + 2 * s},${y - 58 * s}" stroke="${G.wood}" stroke-width="${5 * s}" fill="none" stroke-linecap="round"/>
      <g fill="${G.leaf}" transform="translate(${x + 2 * s},${y - 58 * s}) scale(${s})">
        <path d="M0,0 C-14,-10 -28,-6 -36,6 C-24,-2 -12,-2 0,0Z"/>
        <path d="M0,0 C14,-10 28,-6 36,6 C24,-2 12,-2 0,0Z"/>
        <path d="M0,0 C-8,-14 -20,-18 -30,-14 C-18,-12 -8,-8 0,0Z"/>
        <path d="M0,0 C8,-14 20,-18 30,-14 C18,-12 8,-8 0,0Z"/>
        <path d="M0,0 C-2,-12 2,-22 8,-26 C4,-16 2,-8 0,0Z"/>
      </g>
    </g>`;

  const dome = (x, y, s, delay, step) => `
    <g transform="translate(${x},${y}) scale(${s})"><g class="pop" ${step ? `data-step="${step}"` : ''} ${d(delay)}>
      <path d="M-20,0 A20,20 0 0 1 20,0 Z" fill="#f6f1e4"/>
      <rect x="-22" y="0" width="44" height="5" rx="2" fill="#e6dcc6"/>
      <path d="M-4,0 V-7 A4,4 0 0 1 4,-7 V0Z" fill="${G.green}"/>
      <circle cx="0" cy="-22" r="2" fill="${G.gold}"/>
    </g></g>`;

  const AR_KAWTHAR = ['إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ', 'فَصَلِّ لِرَبِّكَ وَٱنْحَرْ', 'إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ'];

  const cupSVG = (extraStars, uid) => svg(`
    <circle class="glow" cx="160" cy="165" r="92" fill="${G.gold}" opacity=".10"/>
    <clipPath id="bowl-${uid}"><path d="M116,122 H204 Q202,192 160,198 Q118,192 116,122Z"/></clipPath>
    <rect class="fillup" ${d(1.3)} x="110" y="112" width="100" height="90" fill="${G.mint}" clip-path="url(#bowl-${uid})"/>
    <path class="draw" ${d(0.2)} pathLength="1" d="M160,8 C148,40 172,74 160,120" stroke="${G.mint}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M116,122 H204 Q202,192 160,198 Q118,192 116,122Z" fill="none" stroke="${G.gold}" stroke-width="4" stroke-linejoin="round"/>
    <line x1="116" y1="134" x2="204" y2="134" stroke="${G.gold}" stroke-width="2" opacity=".6"/>
    <path d="M160,198 V236 M132,240 H188" stroke="${G.gold}" stroke-width="4" stroke-linecap="round"/>
    ${spark(70, 90, 7, 0.4)}${spark(250, 70, 6, 1.1)}${spark(268, 190, 5, 0.7)}${spark(52, 210, 5, 1.6)}
    ${extraStars ? `${spark(96, 40, 5, 0.2)}${spark(230, 30, 7, 0.9)}${spark(282, 120, 4, 1.4)}${spark(36, 140, 6, 0.5)}
      <g class="pop" data-step="1" ${d(0)}>${spark(118, 70, 9, 0.1)}${spark(206, 92, 8, 0.3)}${spark(160, 262, 7, 0.5)}</g>` : ''}
  `);

  window.ART = {
    // ten word tiles, three verses
    tiles: () => {
      const rows = [
        ['إِنَّآ', 'أَعْطَيْنَٰكَ', 'ٱلْكَوْثَرَ'],
        ['فَصَلِّ', 'لِرَبِّكَ', 'وَٱنْحَرْ'],
        ['إِنَّ', 'شَانِئَكَ', 'هُوَ', 'ٱلْأَبْتَرُ']
      ];
      let n = 0;
      const html = rows.map((r) => `<div class="tile-row">${r.map((w) => {
        n++;
        return `<span class="tile pop" ${d(0.25 + n * 0.16)}><b>${w}</b><i>${n.toLocaleString('ar-EG')}</i></span>`;
      }).join('')}</div>`).join('');
      return `<div class="tiles">${html}<div class="pill fade" ${d(2.2)}>${T('10 words · 3 verses', '۱۰ الفاظ · ۳ آیات')}</div></div>`;
    },

    prayermat: () => {
      let fr = '', di = '';
      for (let x = 104; x <= 216; x += 7) {
        fr += `<line x1="${x}" y1="40" x2="${x}" y2="31"/><line x1="${x}" y1="250" x2="${x}" y2="259"/>`;
      }
      for (let x = 122; x <= 198; x += 15) di += `<rect x="${x}" y="186" width="8" height="8" transform="rotate(45 ${x + 4} 190)"/>`;
      return svg(`
        <g class="pop" ${d(0.1)}>
          <g stroke="${G.gold}" stroke-width="1.6">${fr}</g>
          <rect x="100" y="40" width="120" height="210" rx="5" fill="${G.green}"/>
          <rect x="110" y="52" width="100" height="186" rx="3" fill="none" stroke="${G.gold}" stroke-width="1.6"/>
          <path d="M128,150 V104 Q160,62 192,104 V150Z" fill="#245640" stroke="${G.gold}" stroke-width="1.6"/>
          <polygon points="${star8(160, 108, 10)}" fill="${G.gold}"/>
          <g fill="none" stroke="${G.gold}" stroke-width="1.4">${di}</g>
          <line x1="118" y1="214" x2="202" y2="214" stroke="${G.gold}" stroke-width="1" opacity=".6"/>
        </g>
        <text class="pop q" data-step="1" ${d(0)} x="262" y="118" text-anchor="middle" font-size="96" fill="${G.goldDeep}">?</text>
      `);
    },

    masjid: () => {
      let pillars = '';
      for (let k = 0; k < 6; k++) {
        const x = 40 + k * 46;
        let tex = '';
        for (let y = 138; y < 240; y += 16) tex += `<line x1="${x}" y1="${y}" x2="${x + 12}" y2="${y - 6}"/>`;
        pillars += `<g class="rise" ${d(0.15 + k * 0.1)}><rect x="${x}" y="122" width="12" height="124" rx="5" fill="${G.wood}"/><g stroke="${G.woodDk}" stroke-width="1.3">${tex}</g></g>`;
      }
      let fronds = '';
      for (let x = 34; x < 290; x += 9) fronds += `<line x1="${x}" y1="124" x2="${x + 8}" y2="108"/>`;
      return svg(`
        <circle class="fade glow" ${d(0)} cx="236" cy="78" r="50" fill="#f3d48a" opacity=".35"/>
        <circle class="fade" ${d(0.1)} cx="236" cy="78" r="24" fill="#e9b84f"/>
        ${pillars}
        <g class="fade" ${d(0.9)}>
          <rect x="26" y="106" width="268" height="20" rx="4" fill="#3f7f56"/>
          <g stroke="#2a5c3e" stroke-width="2">${fronds}</g>
        </g>
        <rect class="fade" ${d(0)} x="20" y="244" width="280" height="10" rx="4" fill="${G.sand}"/>
      `);
    },

    moon: () => svg(`
      <circle class="glow" cx="160" cy="130" r="88" fill="${G.gold}" opacity=".07"/>
      <mask id="m-moon"><rect width="320" height="300" fill="#fff"/><circle cx="186" cy="110" r="48" fill="#000"/></mask>
      <circle class="pop" ${d(0.1)} cx="160" cy="130" r="56" fill="${G.gold}" mask="url(#m-moon)"/>
      ${spark(70, 60, 6, 0.2)}${spark(256, 70, 5, 0.9)}${spark(240, 200, 7, 0.5)}${spark(60, 190, 4, 1.3)}${spark(120, 30, 4, 1.7)}${spark(286, 140, 4, 0.3)}
    `),

    sunrise: () => {
      let rays = '';
      for (let k = 0; k < 16; k++) {
        const a = (Math.PI / 8) * k;
        rays += `<line x1="${(160 + 66 * Math.cos(a)).toFixed(1)}" y1="${(140 + 66 * Math.sin(a)).toFixed(1)}" x2="${(160 + 96 * Math.cos(a)).toFixed(1)}" y2="${(140 + 96 * Math.sin(a)).toFixed(1)}"/>`;
      }
      return svg(`
        <circle class="glow" cx="160" cy="140" r="118" fill="${G.gold}" opacity=".08"/>
        <circle class="fade" ${d(0)} cx="160" cy="140" r="100" fill="${G.gold}" opacity=".10"/>
        <g class="spin" style="transform-origin:160px 140px"><g class="fade" ${d(0.4)} stroke="${G.gold}" stroke-width="2" stroke-linecap="round" opacity=".8">${rays}</g></g>
        <circle class="pop" ${d(0.1)} cx="160" cy="140" r="46" fill="#f2c45c"/>
        ${spark(64, 70, 6, 0.6)}${spark(262, 230, 6, 1.2)}${spark(270, 64, 4, 0.2)}
      `);
    },

    scroll: () => svg(`
      <g class="fade" ${d(0)} fill="#fff" opacity=".35">
        <polygon points="70,0 96,0 110,60 84,60"/><polygon points="130,0 150,0 156,60 136,60"/>
        <polygon points="176,0 196,0 190,60 170,60"/><polygon points="226,0 250,0 236,60 212,60"/>
      </g>
      <g class="unroll" ${d(0.2)}>
        <rect x="58" y="56" width="204" height="176" fill="#fdf8ea" stroke="#c9a35f" stroke-width="2"/>
        <rect x="70" y="68" width="180" height="152" fill="none" stroke="#d9c08a" stroke-width="1"/>
      </g>
      <rect x="46" y="46" width="228" height="14" rx="7" fill="#b98b4e"/>
      <rect class="rod" ${d(0.2)} x="46" y="228" width="228" height="14" rx="7" fill="#b98b4e"/>
      ${AR_KAWTHAR.map((l, i) => `<text class="fade ar" data-step="1" ${d(i * 0.45)} x="160" y="${112 + i * 44}" text-anchor="middle" font-size="25" fill="#2a2a22">${l}</text>`).join('')}
    `),

    ripple: () => svg(`
      ${[0, 1.1, 2.2].map((t) => `<ellipse class="ripple" ${d(t)} cx="160" cy="196" rx="120" ry="30" fill="none" stroke="${G.gold}" stroke-width="1.5"/>`).join('')}
      <ellipse cx="160" cy="196" rx="34" ry="8" fill="${G.gold}" opacity=".25"/>
      <text class="pop ar glowtext" ${d(0.3)} x="160" y="170" text-anchor="middle" font-size="76" fill="${G.gold}">ٱلْكَوْثَر</text>
    `),

    river: () => {
      const p = 'M150,6 C236,30 232,92 160,112 C88,132 80,178 160,198 C240,218 232,268 150,296';
      return svg(`
        <path class="draw" ${d(0.1)} pathLength="1" d="${p}" stroke="${G.mint}" stroke-width="36" fill="none" stroke-linecap="round" style="--dur:1.8s"/>
        <path class="flow fade" ${d(1.6)} d="${p}" stroke="${G.mintLt}" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="14 22"/>
        ${palm(48, 128, 1, 0.0, 1)}${palm(276, 76, 0.9, 0.2, 1)}${palm(272, 222, 1, 0.35, 1)}${palm(52, 262, 0.85, 0.5, 1)}
        ${dome(96, 70, 1.35, 0.15, 1)}${dome(252, 148, 1.25, 0.3, 1)}${dome(90, 200, 1.2, 0.45, 1)}${dome(232, 276, 1.1, 0.6, 1)}
        ${spark(200, 40, 5, 0.3)}${spark(120, 160, 4, 1.0)}${spark(220, 110, 4, 1.6)}
      `);
    },

    trio: () => {
      const ring = (x) => `<circle cx="${x}" cy="0" r="42" fill="#fffaf0" stroke="${G.gold}" stroke-width="2"/>`;
      return svg(`
        <g transform="translate(0,130)">
          <g class="pop" data-step="1" ${d(0)}>${ring(58)}
            <path transform="translate(58,2)" d="M0,-26 C12,-10 19,0 19,8 A19,19 0 0 1 -19,8 C-19,0 -12,-10 0,-26Z" fill="#fff" stroke="#9cc9b9" stroke-width="2"/>
            <text x="58" y="66" text-anchor="middle" class="lbl">${T('milk', 'دودھ')}</text></g>
          <g class="pop" data-step="2" ${d(0)}>${ring(160)}
            <g transform="translate(160,6)"><rect x="-13" y="-10" width="26" height="30" rx="7" fill="#b07a3a"/><rect x="-6" y="-20" width="12" height="11" fill="#8a5c28"/><rect x="-8" y="-24" width="16" height="5" rx="2" fill="${G.goldDeep}"/></g>
            <g class="floaty" stroke="#b07a3a" stroke-width="1.8" fill="none" stroke-linecap="round"><path d="M152,-24 q-5,-6 0,-12 q5,-6 0,-12"/><path d="M162,-26 q-5,-6 0,-12 q5,-6 0,-12"/><path d="M172,-24 q-5,-6 0,-12 q5,-6 0,-12"/></g>
            <text x="160" y="66" text-anchor="middle" class="lbl">${T('musk', 'مشک')}</text></g>
          <g class="pop" data-step="3" ${d(0)}>${ring(262)}
            <g transform="translate(262,2)" stroke="${G.goldDeep}" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M-13,-10 H13 Q12,8 0,10 Q-12,8 -13,-10Z" fill="${G.mint}"/><path d="M0,10 V19 M-8,20 H8"/></g>
            ${spark(240, -22, 4, 0.2, G.goldDeep)}${spark(284, -18, 5, 0.8, G.goldDeep)}${spark(262, -30, 3, 1.3, G.goldDeep)}
            <text x="262" y="66" text-anchor="middle" class="lbl">${T('stars', 'ستارے')}</text></g>
        </g>
      `);
    },

    cup: () => cupSVG(false, 'a'),
    cupstars: () => cupSVG(true, 'b'),

    abtar: () => svg(`
      <circle class="glow" cx="160" cy="150" r="96" fill="${G.gold}" opacity=".06"/>
      <text class="pop ar glowtext" ${d(0.3)} x="160" y="168" text-anchor="middle" font-size="82" fill="${G.gold}">ٱلْأَبْتَر</text>
      <line class="draw" ${d(1)} pathLength="1" x1="90" y1="206" x2="230" y2="206" stroke="${G.gold}" stroke-width="2" opacity=".6"/>
    `),

    branch: () => {
      const leaves = (pts) => pts.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="5" transform="rotate(${r} ${x} ${y})" fill="${G.leaf}"/>`).join('');
      return svg(`
        <g class="fade" ${d(0.1)}>
          <path d="M24,152 C80,140 118,162 160,150" stroke="${G.sand}" stroke-width="6" fill="none" stroke-linecap="round"/>
          ${leaves([[56, 138, -40], [84, 156, 30], [114, 144, -35], [140, 158, 35]])}
        </g>
        <g class="fade" ${d(0.3)}><g class="sink" data-step="1" ${d(0.5)}>
          <path d="M160,150 C200,138 246,162 296,146" stroke="${G.sand}" stroke-width="6" fill="none" stroke-linecap="round"/>
          ${leaves([[184, 136, -40], [212, 156, 30], [244, 144, -35], [272, 156, 35]])}
        </g></g>
        <line class="draw" data-step="1" ${d(0)} pathLength="1" x1="168" y1="110" x2="152" y2="192" stroke="${G.gold}" stroke-width="3" stroke-linecap="round"/>
        <text class="fade ar" ${d(0.8)} x="160" y="250" text-anchor="middle" font-size="38" fill="${G.gold}" opacity=".75">ٱلْأَبْتَر</text>
      `);
    },

    ayah3: () => `<div class="ar-hero">
        <div class="orn fade" ${d(0)}>✦</div>
        <div class="ar-big pop" ${d(0.2)}>${AR_KAWTHAR[2]}</div>
        <div class="orn fade" ${d(0.6)}>✦</div>
      </div>`,

    globe: () => {
      const pins = [[118, 92], [196, 78], [228, 150], [130, 176], [178, 206]];
      const pin = ([x, y], i) => `<g transform="translate(${x},${y})"><g class="pop" data-step="1" ${d(0.1 + i * 0.35)}>
          <circle r="12" fill="${G.cream}" stroke="${G.gold}" stroke-width="2"/>
          <path d="M-3,6 V-2 Q0,-8 3,-2 V6Z M-1,-9 h2 v3 h-2z" fill="${G.green}"/></g></g>`;
      return `${svg(`
        <circle cx="160" cy="140" r="110" fill="#fff" opacity=".45"/>
        <clipPath id="globe-c"><circle cx="160" cy="140" r="100"/></clipPath>
        <circle cx="160" cy="140" r="100" fill="${G.green}"/>
        <g clip-path="url(#globe-c)"><g class="drift" fill="${G.leaf}">
          <path d="M70,80 C100,60 140,70 150,96 C140,120 100,118 84,104Z"/><path d="M180,60 C220,52 250,74 246,98 C224,110 196,96 180,60Z"/>
          <path d="M110,150 C140,140 170,160 160,196 C140,220 112,206 106,180Z"/><path d="M200,140 C232,132 262,150 254,180 C236,194 206,180 200,140Z"/>
          <path d="M300,80 C330,60 370,70 380,96 C370,120 330,118 314,104Z"/><path d="M-60,150 C-30,140 0,160 -10,196 C-30,220 -58,206 -64,180Z"/>
        </g>
        <g fill="none" stroke="${G.mint}" stroke-width="1" opacity=".35">
          <ellipse cx="160" cy="140" rx="100" ry="34"/><ellipse cx="160" cy="140" rx="100" ry="70"/>
          <ellipse cx="160" cy="140" rx="40" ry="100"/><ellipse cx="160" cy="140" rx="76" ry="100"/><line x1="160" y1="40" x2="160" y2="240"/>
        </g></g>
        ${pins.map(pin).join('')}
      `, '0 0 320 260')}
      <div class="chips">${(window.MQ_LANG === 'ur' ? ['فجر', 'ظہر', 'عصر', 'مغرب', 'عشاء'] : ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']).map((p, i) => `<span class="chip lit" data-step="1" ${d(0.2 + i * 0.4)}>${p}</span>`).join('')}</div>`;
    },

    path: () => {
      const pp = 'M10,150 C60,96 104,196 160,150 C216,104 260,200 310,140';
      const badge = (x, y, n, lbl, s) => `<g class="pop" data-step="${s}" ${d(0)}>
          <polygon points="${star8(x, y, 34)}" fill="#f3d48a" stroke="${G.goldDeep}" stroke-width="1.5"/>
          <circle cx="${x}" cy="${y}" r="21" fill="${G.greenDk}"/>
          <text x="${x}" y="${y + 9}" text-anchor="middle" font-size="26" fill="#f3d48a" class="ar">${n}</text>
          <text x="${x}" y="${y + 62}" text-anchor="middle" class="lbl big">${lbl}</text></g>`;
      return svg(`
        <path class="draw" ${d(0.1)} pathLength="1" d="${pp}" stroke="${G.mint}" stroke-width="18" fill="none" stroke-linecap="round" style="--dur:1.4s"/>
        <path class="fade" ${d(1.2)} d="${pp}" stroke="#fff" stroke-width="2.5" fill="none" stroke-dasharray="8 10" opacity=".8"/>
        ${badge(58, 128, '١', T('gift', 'تحفہ'), 1)}${badge(160, 150, '٢', T('command', 'حکم'), 2)}${badge(262, 150, '٣', T('promise', 'وعدہ'), 3)}
      `);
    }
  };
})();
