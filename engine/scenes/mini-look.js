// ─────────────────────────────────────────────
// 새 미니게임 ③: 보고 기억하는 것 (다른 곳 찾기 · 짝 맞추기 · 무늬 따라 파기 · 연표 줄 세우기)
// ─────────────────────────────────────────────
(function () {
  const Px = () => HG.Pixel;
  const tex = (S, key, w, h, fn) => { if (!S.textures.exists(key)) Px().draw(S, key, w, h, (p, ctx) => { fn(p, ctx); Px().outline(ctx, w, h); }); };
  const D4 = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  // ════════════════════════════════════════
  // 다른 곳 찾기 — 다보탑·석가탑 그림 두 장에서 시간 괴물이 바꿔 놓은 곳 찾기
  // p: { count, time }
  // ════════════════════════════════════════
  const SPOTS = {
    sun: [100, 14], cloud: [30, 16], top: [36, 30], tier: [36, 60], tree: [104, 70], bird: [66, 20], tmon: [56, 90], stair: [82, 86], lantern: [62, 80]
  };
  function drawSpot(p, diff) {
    const R = Px().rect, E = Px().ellipse;
    R(p, 0, 0, 120, 100, 'c'); R(p, 0, 74, 120, 26, 'f'); R(p, 0, 74, 120, 1, 'e');
    if (!diff.sun) E(p, 100, 14, 6, 6, 'y');
    E(p, 26, 16, 8, 3, 'w'); E(p, 34, 14, 6, 3, 'w');
    if (diff.cloud) { E(p, 76, 30, 7, 3, 'w'); E(p, 82, 28, 5, 2, 'w'); }
    if (diff.bird) { p(64, 20, 'k'); p(65, 19, 'k'); p(66, 20, 'k'); p(67, 19, 'k'); p(68, 20, 'k'); }
    // 석가탑 (왼쪽, 3층)
    R(p, 22, 78, 28, 6, 'g'); R(p, 24, 72, 24, 6, 'l');
    [[26, 62, 20], [28, 50, 16], [30, 40, 12]].forEach(([x, y, w], i) => {
      R(p, x, y, w, 9, diff.tier && i === 1 ? 'n' : 'l'); R(p, x + 1, y + 1, 1, 7, 'g');
      R(p, x - 4, y - 2, w + 8, 3, 'g');
    });
    if (!diff.top) { R(p, 35, 28, 2, 10, 'G'); E(p, 36, 31, 2, 1, 'y'); E(p, 36, 35, 2, 1, 'y'); }
    // 다보탑 (오른쪽)
    R(p, 70, 76, 30, 6, 'g'); R(p, 74, 64, 22, 12, 'l'); R(p, 76, 66, 2, 10, 'g'); R(p, 92, 66, 2, 10, 'g');
    if (!diff.stair) for (let i = 0; i < 4; i++) R(p, 80 + i, 82 + i * 2, 10 - i * 2, 2, 'g');
    R(p, 72, 60, 26, 4, 'g'); R(p, 77, 50, 16, 10, 'l'); R(p, 75, 47, 20, 3, 'g'); R(p, 80, 40, 10, 7, 'l'); E(p, 85, 38, 7, 2, 'g'); R(p, 84, 30, 2, 7, 'G');
    // 석등
    if (!diff.lantern) { R(p, 60, 72, 4, 8, 'l'); R(p, 58, 68, 8, 5, 'g'); p(62, 70, 'y'); }
    // 나무
    R(p, 103, 66, 3, 12, 'b'); E(p, 104, 62, 9, 8, diff.tree ? 'o' : 'e'); E(p, 101, 60, 3, 2, diff.tree ? 'y' : 'f');
    if (diff.tmon) { E(p, 56, 90, 4, 3, 'p'); p(54, 89, 'Y'); p(57, 89, 'Y'); }
  }
  HG.registerMini(HG.SpotScene = class extends HG.MiniGame {
    constructor() { super('Spot'); }
    defaults() { return { title: '다른 곳 찾기', name: '다른 곳 찾기', count: 6, time: 60, bg: null, music: 'village', help: '방향키 돋보기 움직이기 · 스페이스 찾기', intro: ['시간 괴물이 오른쪽 그림을 몰래 바꿔 놓았어! 왼쪽 그림과 다른 곳 6군데를 찾아 줘.', '돋보기를 다른 곳에 놓고 스페이스! 아무 데나 누르면 시간이 줄어들어.'] }; }
    setup() {
      this.add.rectangle(0, 0, HG.W, HG.H, 0x2c2620).setOrigin(0).setDepth(-20);
      this.diffs = HG.shuffle(Object.keys(SPOTS)).slice(0, this.p.count);
      const dset = {}; this.diffs.forEach(k => dset[k] = true);
      const kB = 'mg_spotB_' + this.diffs.slice().sort().join('_');
      tex(this, 'mg_spotA', 120, 100, p => drawSpot(p, {}));
      tex(this, kB, 120, 100, p => drawSpot(p, dset));
      this.SC = 1.25; this.AX = 6; this.BX = 164; this.Y = 24;
      this.add.image(this.AX, this.Y, 'mg_spotA').setOrigin(0).setScale(this.SC).setDepth(2);
      this.add.image(this.BX, this.Y, kB).setOrigin(0).setScale(this.SC).setDepth(2);
      this.lens = this.add.graphics().setDepth(10);
      this.on = false; this.cx = 60; this.cy = 50; this.found = []; this.marks = this.add.graphics().setDepth(9);
      this.drawLens(); this.hudR.setText(`찾은 곳 0 / ${this.p.count}`);
    }
    drawLens() {
      const g = this.lens; g.clear();
      [this.AX, this.BX].forEach((ox, i) => { const x = ox + this.cx * this.SC, y = this.Y + this.cy * this.SC; g.lineStyle(2, i ? 0xdcbc48 : 0x7d776c).strokeCircle(x, y, 9); g.lineStyle(2, 0x3f2b1c).lineBetween(x + 6, y + 6, x + 11, y + 11); });
    }
    async play() {
      this.on = true;
      return new Promise(res => {
        this.finish = res;
        this.timer(this.p.time, () => { this.on = false; res(null); });
        this.input2(a => {
          if (a !== 'ok' || !this.on) return;
          const hit = this.diffs.find(k => !this.found.includes(k) && Math.hypot(SPOTS[k][0] - this.cx, SPOTS[k][1] - this.cy) < 11);
          if (hit) {
            this.found.push(hit); HG.Sound.sfx('correct');
            [this.AX, this.BX].forEach(ox => this.marks.lineStyle(2, 0xbf4436).strokeCircle(ox + SPOTS[hit][0] * this.SC, this.Y + SPOTS[hit][1] * this.SC, 10));
            this.hudR.setText(`찾은 곳 ${this.found.length} / ${this.p.count}`);
            if (this.found.length >= this.p.count) { this.on = false; res(this.left > this.p.time * 0.5 ? '★★★' : this.left > this.p.time * 0.25 ? '★★☆' : '★☆☆'); }
          } else { HG.Sound.sfx('wrong'); this.left = Math.max(0.5, this.left - 4); this.cameras.main.shake(100, 0.004); }
        });
      });
    }
    update(t, dt) {
      if (!this.on) return;
      const h = this.keys.held(); if (!h) return;
      const [dx, dy] = D4[h], sp = 60 * dt / 1000;
      this.cx = HG.clamp(this.cx + dx * sp, 2, 118); this.cy = HG.clamp(this.cy + dy * sp, 2, 98);
      this.drawLens();
    }
  });

  // ════════════════════════════════════════
  // 짝 맞추기 — 유물 그림 카드와 이름 카드 짝 찾기 (4×4)
  // p: { items:[유물 id] }
  // ════════════════════════════════════════
  HG.registerMini(HG.MemoryScene = class extends HG.MiniGame {
    constructor() { super('Memory'); }
    defaults() { return { title: '기록 짝 맞추기', name: '기록 짝 맞추기', items: ['handaxe', 'combpot', 'bronzemirror', 'goldcrown', 'dabotap', 'celadon', 'tripitaka', 'metaltype', 'halfmoon', 'ironarmor', 'incense', 'bell'], bg: 'palace', music: 'village', help: '방향키 고르기 · 스페이스 뒤집기', intro: ['경판을 차곡차곡 정리하듯, 우리 기록도 정리해 보자!', '카드를 두 장씩 뒤집어서 유물 그림과 그 이름을 짝지어 줘.'] }; }
    setup() {
      tex(this, 'mg_cardback', 54, 34, p => { Px().rect(p, 0, 0, 54, 34, 'b'); Px().rect(p, 2, 2, 50, 30, 'n'); for (let x = 6; x < 50; x += 6) Px().rect(p, x, 6, 2, 22, 'b'); });
      tex(this, 'mg_cardface', 54, 34, p => { Px().rect(p, 0, 0, 54, 34, 'Y'); Px().rect(p, 0, 31, 54, 3, 'n'); });
      const ids = HG.shuffle(this.p.items.filter(id => HG.ARTIFACTS[id])).slice(0, 8);
      const deck = HG.shuffle(ids.flatMap(id => [{ id, pic: true }, { id, pic: false }]));
      this.cards = deck.map((c, i) => {
        const x = 47 + (i % 4) * 58 + 27, y = 22 + Math.floor(i / 4) * 36 + 17;
        const back = this.add.image(x, y, 'mg_cardback').setDepth(5);
        const face = this.add.container(x, y).setDepth(5).setVisible(false);
        face.add(this.add.image(0, 0, 'mg_cardface'));
        if (c.pic) face.add(this.add.image(0, 0, 'mon_' + c.id).setScale(0.95));
        else face.add(HG.UI.text(this, 0, 0, HG.ARTIFACTS[c.id].name, { small: true, color: '#1a1410', wrap: 50, align: 'center' }).setOrigin(0.5, 0.5));
        return Object.assign(c, { back, face, x, y, open: false, done: false });
      });
      this.cur = this.add.graphics().setDepth(8);
      this.ci = 0; this.tries = 0; this.pairs = 0; this.maxTries = this.p.maxTries || 22; this.drawCur();
    }
    drawCur() { const c = this.cards[this.ci]; this.cur.clear().lineStyle(2, 0xe3d49a).strokeRect(c.x - 29, c.y - 19, 58, 38); this.hudR.setText(`짝 ${this.pairs} / 8   남은 시도 ${this.maxTries - this.tries}`); }
    show(c, on) { c.open = on; c.back.setVisible(!on); c.face.setVisible(on); }
    async play() {
      return new Promise(res => {
        let first = null, busy = false;
        this.input2(a => {
          if (busy) return;
          if (D4[a]) { const [dx, dy] = D4[a]; const x = (this.ci % 4 + dx + 4) % 4, y = (Math.floor(this.ci / 4) + dy + 4) % 4; this.ci = y * 4 + x; HG.Sound.sfx('cursor'); this.drawCur(); return; }
          if (a !== 'ok') return;
          const c = this.cards[this.ci]; if (c.open || c.done) return;
          this.show(c, true); HG.Sound.sfx('talk');
          if (!first) { first = c; return; }
          this.tries++; const f = first; first = null;
          if (f.id === c.id) {
            f.done = c.done = true; this.pairs++; HG.Sound.sfx('correct');
            this.flash(HG.ARTIFACTS[c.id].name, '#e3d49a', 70);
            this.drawCur();
            if (this.pairs >= 8) { this.keys.stack = []; this.time.delayedCall(700, () => res(this.tries <= 12 ? '★★★' : this.tries <= 17 ? '★★☆' : '★☆☆')); }
          } else {
            busy = true; this.drawCur();
            if (this.tries >= this.maxTries) { this.keys.stack = []; this.time.delayedCall(800, () => res(null)); return; }
            this.time.delayedCall(800, () => { this.show(f, false); this.show(c, false); busy = false; });
          }
        });
      });
    }
  });

  // ════════════════════════════════════════
  // 무늬 따라 파기 — 연필 밑그림을 따라 칸을 빠짐없이 파기 (상감)
  // p: { patterns:[{name, lines:[[ [x,y],... ]]}], time }
  // ════════════════════════════════════════
  HG.registerMini(HG.TraceScene = class extends HG.MiniGame {
    constructor() { super('Trace'); }
    defaults() {
      return { title: '상감 무늬 파기', name: '무늬 따라 파기', time: 70, maxCracks: 8, bg: 'village', music: 'village', help: '방향키로 밑그림 위를 따라 파기',
        patterns: [
          { name: '구름', lines: [[[3, 10], [3, 5], [5, 3], [10, 3], [12, 5], [12, 8], [10, 10], [8, 10], [7, 8], [8, 7], [9, 8]], [[3, 10], [20, 10]], [[17, 10], [17, 6], [19, 4], [21, 4]]] },
          { name: '학', lines: [[[5, 2], [7, 2], [7, 6], [9, 8], [16, 8], [19, 5], [21, 2]], [[9, 8], [10, 12]], [[16, 8], [15, 12]], [[12, 8], [14, 5], [17, 2]]] }
        ],
        intro: ['고려청자에 무늬를 파 볼 차례야. 연필로 그린 밑그림 위를 방향키로 따라가며 파 줘.', '밑그림 밖으로 나가려 하면 그릇에 금이 가! 무늬를 빠짐없이 파면 흰 흙을 메워 완성!'] };
    }
    setup() {
      this.C = 8; this.OX = 64; this.OY = 30; this.GW = 24; this.GH = 14;
      const g = this.add.graphics().setDepth(2);
      g.fillStyle(0x1a1410).fillEllipse(160, 86, 210, 134);
      g.fillStyle(0x86a890).fillEllipse(160, 86, 206, 130);
      g.fillStyle(0x9cc0a6).fillEllipse(140, 70, 120, 60);
      this.layer = this.add.graphics().setDepth(4);
      this.pi = 0; this.cracks = 0;
      this.crackG = this.add.graphics().setDepth(6);
      this.loadPattern();
    }
    loadPattern() {
      const pat = this.p.patterns[this.pi];
      this.cells = new Set(); this.done = new Set();
      pat.lines.forEach(line => { for (let i = 1; i < line.length; i++) { let [x, y] = line[i - 1]; const [x1, y1] = line[i]; this.cells.add(x + ',' + y); while (x !== x1 || y !== y1) { if (x !== x1) x += Math.sign(x1 - x); else y += Math.sign(y1 - y); this.cells.add(x + ',' + y); } } });
      this.pos = pat.lines[0][0].slice(); this.done.add(this.pos.join(','));
      this.draw();
    }
    draw() {
      const g = this.layer; g.clear();
      this.cells.forEach(k => { const [x, y] = k.split(',').map(Number); const X = this.OX + x * this.C, Y = this.OY + y * this.C;
        if (this.done.has(k)) { g.fillStyle(0xe9e2d0).fillRect(X + 1, Y + 1, this.C - 2, this.C - 2); }
        else { g.fillStyle(0x4e4a43).fillRect(X + 3, Y + 3, 2, 2); } });
      const X = this.OX + this.pos[0] * this.C, Y = this.OY + this.pos[1] * this.C;
      g.lineStyle(2, 0xdcbc48).strokeRect(X - 1, Y - 1, this.C + 2, this.C + 2);
      this.hudR.setText(`${this.p.patterns[this.pi].name} 무늬 ${Math.round(this.done.size / this.cells.size * 100)}%   금 ${this.cracks}/${this.p.maxCracks}`);
    }
    crack() {
      this.cracks++; HG.Sound.sfx('wrong'); this.cameras.main.shake(100, 0.004);
      const x = HG.rand(80, 240), y = HG.rand(40, 130);
      this.crackG.lineStyle(1, 0x3f2b1c).lineBetween(x, y, x + HG.rand(-8, 8), y + 6).lineBetween(x + 2, y + 3, x + 8, y + 5);
    }
    async play() {
      return new Promise(res => {
        this.timer(this.p.time, () => res(null));
        this.input2(async a => {
          if (!D4[a] || this.busy) return;
          const [dx, dy] = D4[a], nx = this.pos[0] + dx, ny = this.pos[1] + dy, k = nx + ',' + ny;
          if (!this.cells.has(k)) { this.crack(); this.draw(); if (this.cracks >= this.p.maxCracks) { this.keys.stack = []; HG.Sound.sfx('bighit'); this.cameras.main.shake(300, 0.012); res(null); } return; }
          this.pos = [nx, ny]; if (!this.done.has(k)) { this.done.add(k); HG.Sound.sfx('talk'); }
          this.draw();
          if (this.done.size >= this.cells.size) {
            this.busy = true; HG.Sound.sfx('levelup'); await this.flash(`${this.p.patterns[this.pi].name} 무늬 완성!`);
            this.pi++;
            if (this.pi >= this.p.patterns.length) { this.keys.stack = []; res(this.stars(this.cracks, 2, 6)); return; }
            this.loadPattern(); this.busy = false;
          }
        });
      });
    }
  });

  // ════════════════════════════════════════
  // 연표 줄 세우기 — 사건 카드를 시간 순서에 맞는 자리에 끼워 넣기
  // p: { events:[{t, y}] }
  // ════════════════════════════════════════
  HG.registerMini(HG.TimelineScene = class extends HG.MiniGame {
    constructor() { super('Timeline'); }
    defaults() {
      return { title: '연표 줄 세우기', name: '연표 줄 세우기', bg: 'palace', music: 'village', help: '← → 끼울 자리 고르기 · 스페이스 넣기',
        events: [{ t: '3·1 운동', y: 1919 }, { t: '광복', y: 1945 }, { t: '대한민국 정부 수립', y: 1948 }, { t: '6·25 전쟁 시작', y: 1950 }, { t: '4·19 혁명', y: 1960 }, { t: '5·18 민주화 운동', y: 1980 }, { t: '6월 민주 항쟁', y: 1987 }], lives: 3,
        intro: ['사건 카드가 하나씩 나와. 연표의 알맞은 자리에 끼워 넣어 줘!', '왼쪽이 옛날, 오른쪽이 나중이야.'] };
    }
    setup() {
      tex(this, 'mg_tcard2', 42, 44, p => { Px().rect(p, 0, 0, 42, 44, 'Y'); Px().rect(p, 0, 0, 42, 3, 'r'); Px().rect(p, 0, 41, 42, 3, 'n'); });
      this.add.rectangle(160, 120, 300, 2, 0xe9e2d0).setDepth(2);
      HG.UI.text(this, 12, 128, '옛날', { depth: 3, small: true, color: '#e9e2d0', stroke: '#1a1410' });
      HG.UI.text(this, 308, 128, '나중', { depth: 3, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(1, 0);
      this.caret = this.add.graphics().setDepth(9);
      this.placed = []; this.miss = 0;
    }
    makeCard(ev, x, y) {
      const c = this.add.container(x, y).setDepth(6);
      c.add(this.add.image(0, 0, 'mg_tcard2'));
      c.add(HG.UI.text(this, 0, 0, ev.t, { small: true, color: '#1a1410', wrap: 38, align: 'center' }).setOrigin(0.5, 0.5));
      c.yr = HG.UI.text(this, 0, 25, '', { small: true, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0); c.add(c.yr);
      c.ev = ev; return c;
    }
    layout(gap) {
      const n = this.placed.length + (gap >= 0 ? 1 : 0), w = 44, x0 = 160 - (n - 1) * w / 2;
      let k = 0;
      this.placed.forEach((c, i) => { if (i === gap) k++; this.tweens.add({ targets: c, x: x0 + k * w, y: 98, duration: 150 }); k++; });
      return i => x0 + i * w;
    }
    async play() {
      const evs = HG.shuffle(this.p.events);
      const first = this.makeCard(evs[0], 160, 98); first.yr.setText(evs[0].y + '년'); this.placed.push(first);
      for (let k = 1; k < evs.length; k++) {
        const ev = evs[k];
        const card = this.makeCard(ev, 160, 42);
        this.hudR.setText(`${k} / ${evs.length - 1}   ${'♥'.repeat(Math.max(0, this.p.lives - this.miss))}`);
        let gap = Math.floor(this.placed.length / 2) + (this.placed.length % 2);
        const showGap = () => { const pos = this.layout(gap); this.caret.clear().fillStyle(0xdcbc48).fillTriangle(pos(gap) - 4, 70, pos(gap) + 4, 70, pos(gap), 76); this.tweens.add({ targets: card, x: pos(gap), duration: 120 }); };
        showGap();
        const pick = await new Promise(res => { const off = this.input2(a => { if (a === 'left' && gap > 0) { gap--; HG.Sound.sfx('cursor'); showGap(); } if (a === 'right' && gap < this.placed.length) { gap++; HG.Sound.sfx('cursor'); showGap(); } if (a === 'ok') { off(); res(gap); } }); });
        const right = this.placed.filter(c => c.ev.y <= ev.y).length;
        const okGap = (this.placed[pick - 1] ? this.placed[pick - 1].ev.y <= ev.y : true) && (this.placed[pick] ? this.placed[pick].ev.y >= ev.y : true);
        const at = okGap ? pick : right;
        if (okGap) { HG.Sound.sfx('correct'); this.flash('딩동댕!', '#e3d49a', 64); }
        else { this.miss++; HG.Sound.sfx('wrong'); this.cameras.main.shake(120, 0.005); this.flash(ev.y < (this.placed[pick] || this.placed[pick - 1]).ev.y ? '더 앞이야!' : '더 뒤야!', '#bf4436', 64); await HG.UI.wait(this, 500); }
        if (this.miss >= this.p.lives) { this.flash('세 번 틀렸어!', '#bf4436', 64); await HG.UI.wait(this, 600); return null; }
        this.placed.splice(at, 0, card);
        card.yr.setText(ev.y + '년');
        this.caret.clear(); this.layout(-1);
        await HG.UI.wait(this, 450);
      }
      return this.stars(this.miss, 0, 1);
    }
  });
})();
