// ─────────────────────────────────────────────
// 새 미니게임 ①: 몸으로 하는 것 (작살 낚시 · 종소리 리듬 · 한글 조합 · 성벽 쌓기 · 낱말 분류)
// ─────────────────────────────────────────────
(function () {
  const Px = () => HG.Pixel;
  const tex = (S, key, w, h, fn) => { if (!S.textures.exists(key)) Px().draw(S, key, w, h, (p, ctx) => { fn(p, ctx); Px().outline(ctx, w, h); }); };

  // ── 한글 자모 ──
  const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
  const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split('');
  const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  HG.Hangul = {
    split(ch) { const c = ch.charCodeAt(0) - 0xAC00; if (c < 0 || c > 11171) return [ch]; const jo = c % 28, ju = Math.floor(c / 28) % 21, ch0 = Math.floor(c / 588); return [CHO[ch0], JUNG[ju]].concat(jo ? [JONG[jo]] : []); },
    join(parts) { if (parts.length === 1) return parts[0]; const a = CHO.indexOf(parts[0]), b = JUNG.indexOf(parts[1]), c = parts[2] ? JONG.indexOf(parts[2]) : 0; return String.fromCharCode(0xAC00 + (a * 21 + b) * 28 + c); },
    first(word) { return HG.Hangul.split(word[0])[0]; }
  };

  // ════════════════════════════════════════
  // 작살 낚시 — 배 위에서 좌우로 움직이며 스페이스로 작살 던지기
  // p: { need, time, fish:[텍스처], bad }
  // ════════════════════════════════════════
  HG.registerMini(HG.HarpoonScene = class extends HG.MiniGame {
    constructor() { super('Harpoon'); }
    defaults() { return { title: '작살 낚시', name: '작살 낚시', need: 8, time: 40, bg: 'sea', music: 'field', help: '← → 움직이기 · 스페이스 작살 던지기', intro: ['물고기가 지나갈 때 작살을 던져 8마리를 잡아 보자!', '보라색 시간 괴물은 맞히면 작살이 엉켜 버려!'] }; }
    setup() {
      tex(this, 'mg_boat', 32, 8, p => { Px().rect(p, 1, 2, 30, 4, 'b'); Px().rect(p, 3, 6, 26, 2, 'B'); Px().rect(p, 2, 2, 28, 1, 'n'); });
      this.add.rectangle(0, 92, HG.W, HG.H - 92, 0x25416a, 0.35).setOrigin(0).setDepth(-5);
      this.px = 160;
      this.boat = this.add.image(160, 96, 'mg_boat').setDepth(20);
      this.me = this.add.sprite(160, 93, HG.heroKey(), 0).setOrigin(0.5, 1).setDepth(21);
      this.line = this.add.graphics().setDepth(19);
      this.fish = []; this.got = 0; this.harp = null; this.on = false; this.stun = 0;
      this.hudR.setText(`잡은 물고기 0 / ${this.p.need}`);
    }
    spawn() {
      const bad = Math.random() < 0.3;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const y = HG.rand(112, 160);
      const s = this.add.image(dir > 0 ? -12 : HG.W + 12, y, bad ? 'tmon0' : HG.pick(this.p.fish || ['gd_fish'])).setDepth(10);
      if (bad) s.setScale(0.5); else s.setScale(1.4).setFlipX(dir < 0);
      s.vx = dir * HG.rand(38, 66) * (bad ? 0.8 : 1); s.bad = bad; s.base = y; s.ph = Math.random() * 6;
      this.fish.push(s);
    }
    async play() {
      await this.countdown();
      this.on = true;
      return new Promise(res => {
        this.finish = res;
        this.timer(this.p.time, () => { this.on = false; res(null); });
        this.input2(a => { if (a === 'ok' && this.on && !this.harp && this.stun <= 0) { this.harp = { y: 98, dir: 1, x: this.px }; HG.Sound.sfx('select'); } });
        this.spawnT = 0;
      });
    }
    update(t, dt) {
      if (!this.on) return;
      const d = dt / 1000;
      this.stun -= d;
      const h = this.keys.held();
      if (!this.harp && this.stun <= 0) { if (h === 'left') this.px -= 90 * d; if (h === 'right') this.px += 90 * d; }
      this.px = HG.clamp(this.px, 20, 300); this.boat.x = this.px; this.me.x = this.px;
      this.spawnT -= d; if (this.spawnT <= 0) { this.spawn(); this.spawnT = HG.rand(5, 11) / 10; }
      this.fish.forEach(f => { f.x += f.vx * d; f.ph += d * 3; f.y = f.base + Math.sin(f.ph) * 3; });
      this.fish = this.fish.filter(f => { if (f.x < -20 || f.x > HG.W + 20) { f.destroy(); return false; } return true; });
      this.line.clear();
      if (this.harp) {
        const H = this.harp;
        H.y += H.dir * 240 * d;
        if (H.dir > 0) {
          const hit = this.fish.find(f => Math.abs(f.x - H.x) < 10 && Math.abs(f.y - H.y) < 8);
          if (hit) {
            hit.destroy(); this.fish.splice(this.fish.indexOf(hit), 1); H.dir = -1;
            if (hit.bad) { this.stun = 1.2; HG.Sound.sfx('wrong'); this.cameras.main.shake(150, 0.006); this.flash('작살이 엉켰다!', '#bf4436'); }
            else { this.got++; HG.Sound.sfx('correct'); this.flash('잡았다!'); this.hudR.setText(`잡은 물고기 ${this.got} / ${this.p.need}`); if (this.got >= this.p.need) { this.on = false; this.finish(this.stars(this.p.time - this.left > this.p.time * 0.7 ? 3 : 0, 0, 2)); } }
          }
          if (H.y > 172) H.dir = -1;
        }
        if (H.dir < 0 && H.y <= 98) this.harp = null;
        else {
          this.line.lineStyle(1, 0xe9e2d0).lineBetween(H.x, 92, H.x, H.y);
          this.line.fillStyle(0xb3ac9c).fillTriangle(H.x - 2, H.y - 3, H.x + 2, H.y - 3, H.x, H.y + 3);
        }
      }
    }
  });

  // ════════════════════════════════════════
  // 종소리 리듬 — 떨어지는 음표가 선에 닿을 때 방향키
  // p: { notes, speed, pass }
  // ════════════════════════════════════════
  HG.registerMini(HG.RhythmScene = class extends HG.MiniGame {
    constructor() { super('Rhythm'); }
    defaults() { return { title: '종소리 리듬', name: '종소리 리듬', notes: 32, speed: 96, pass: 0.7, bg: 'palace', music: null, art: 'mon_bell', help: '음표가 노란 선에 닿을 때 ← ↓ ↑ → 누르기', intro: ['음표가 내려와서 노란 선에 닿는 순간, 같은 방향키를 눌러!', '박자를 잘 맞추면 맑은 종소리가 울려 퍼질 거야.'] }; }
    setup() {
      const cols = ['u', 'e', 'y', 'r'];
      cols.forEach((c, i) => tex(this, 'mg_note' + i, 18, 8, p => { Px().rect(p, 1, 1, 16, 6, c); Px().rect(p, 2, 1, 14, 1, 'w'); }));
      this.LX = [130, 156, 182, 208]; this.HY = 148;
      const g = this.add.graphics().setDepth(5);
      g.fillStyle(0x12100e, 0.6).fillRect(116, 18, 106, 150);
      this.LX.forEach(x => g.lineStyle(1, 0x7d776c).lineBetween(x, 18, x, 168));
      g.fillStyle(0xdcbc48).fillRect(116, this.HY - 1, 106, 2);
      ['←', '↓', '↑', '→'].forEach((s, i) => HG.UI.text(this, this.LX[i], 154, s, { depth: 6, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0));
      if (this.p.art) this.bellImg = this.add.image(62, 90, this.p.art).setScale(2.5).setDepth(6);
      if (this.p.npc) this.add.sprite(265, 140, this.p.npc, 0).setOrigin(0.5, 1).setScale(2).setDepth(6);
      this.notes = []; this.hits = 0; this.on = false;
      this.FREQ = [262, 294, 330, 392];
    }
    async play() {
      // 박자표: 0.5초 간격 기본, 가끔 쉬거나 빨라짐
      const chart = []; let t = 1.5, last = 0;
      for (let i = 0; i < this.p.notes; i++) {
        let lane = HG.rand(0, 3); if (lane === last && Math.random() < 0.5) lane = (lane + 1) % 4; last = lane;
        chart.push({ t, lane });
        t += HG.pick([0.375, 0.5, 0.5, 0.75, 0.5, 0.25, 0.375]);
        if (i > this.p.notes * 0.6 && Math.random() < 0.25) { chart.push({ t, lane: (lane + 2) % 4 }); i++; t += 0.5; }
      }
      this.total = chart.length;
      await this.countdown();
      this.on = true; this.clock = 0; this.chart = chart; this.judged = 0;
      this.hudR.setText(`0 / ${this.total}`);
      return new Promise(res => {
        this.finish = () => { this.on = false; const r = this.hits / this.total; res(r >= this.p.pass ? (r >= 0.9 ? '★★★' : r >= 0.75 ? '★★☆' : '★☆☆') : null); };
        const LANE = { left: 0, down: 1, up: 2, right: 3 };
        this.input2(a => {
          if (!this.on || !(a in LANE)) return;
          const lane = LANE[a];
          const n = this.notes.filter(n => n.lane === lane && !n.done).sort((x, y) => Math.abs(x.s.y - this.HY) - Math.abs(y.s.y - this.HY))[0];
          if (n && Math.abs(n.s.y - this.HY) < 11) {
            n.done = true; this.hits++; this.judged++;
            const good = Math.abs(n.s.y - this.HY) < 6;
            this.bell(this.FREQ[lane] * (good ? 1 : 1));
            this.pop(n.s, good ? '아주 좋아!' : '좋아!');
            if (this.bellImg) this.tweens.add({ targets: this.bellImg, angle: lane < 2 ? -12 : 12, yoyo: true, duration: 120 });
          } else { HG.Sound.sfx('cursor'); }
          this.hudR.setText(`${this.hits} / ${this.total}`);
        });
      });
    }
    pop(s, txt) {
      const t = HG.UI.text(this, s.x, this.HY - 16, txt, { depth: 30, small: true, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
      this.tweens.add({ targets: t, y: t.y - 10, alpha: 0, duration: 500, onComplete: () => t.destroy() });
      s.destroy();
    }
    update(t, dt) {
      if (!this.on) return;
      const d = dt / 1000; this.clock += d;
      const travel = (this.HY - 18) / this.p.speed;
      while (this.chart.length && this.chart[0].t - travel <= this.clock) {
        const c = this.chart.shift();
        const s = this.add.image(this.LX[c.lane], 18, 'mg_note' + c.lane).setDepth(10);
        this.notes.push({ s, lane: c.lane, done: false });
      }
      this.notes.forEach(n => { if (!n.done) { n.s.y += this.p.speed * d; if (n.s.y > this.HY + 12) { n.done = true; this.judged++; n.s.setAlpha(0.3); this.tweens.add({ targets: n.s, alpha: 0, duration: 300, onComplete: () => n.s.destroy() }); } } });
      this.notes = this.notes.filter(n => !n.done || n.s.active);
      if (!this.chart.length && this.notes.every(n => n.done) && this.judged >= this.total) this.finish();
    }
  });

  // ════════════════════════════════════════
  // 한글 조합 — 떨어지는 자음·모음을 순서대로 받아 낱말 만들기
  // p: { words:[], count, time }
  // ════════════════════════════════════════
  HG.registerMini(HG.HangulScene = class extends HG.MiniGame {
    constructor() { super('Hangul'); }
    defaults() { return { title: '한글 조합', name: '한글 조합', words: ['나라', '하늘', '바다', '사람', '나무', '한글', '구름', '노을', '바람'], count: 3, time: 60, bg: 'palace', music: 'village', help: '← → 움직이기 · 필요한 자음·모음만 받기', intro: ['위에서 자음과 모음이 떨어져. 낱말에 필요한 글자를 차례대로 받아 봐!', '노랗게 빛나는 글자가 다음에 받아야 할 글자야. 다른 글자를 받으면 잠깐 어지러워져.'] }; }
    setup() {
      this.words = HG.shuffle(this.p.words).slice(0, this.p.count);
      this.wi = 0; this.drops = []; this.on = false; this.stun = 0; this.px = 160;
      this.me = this.add.sprite(160, 166, HG.heroKey(), 2).setOrigin(0.5, 1).setDepth(20);
      tex(this, 'mg_basket', 20, 10, p => { Px().rect(p, 1, 1, 18, 8, 'n'); for (let x = 2; x < 18; x += 3) Px().rect(p, x, 2, 1, 6, 'b'); });
      this.basket = this.add.image(160, 146, 'mg_basket').setDepth(21);
      this.board = this.add.graphics().setDepth(30);
      this.wordTxt = HG.UI.text(this, HG.W / 2, 20, '', { depth: 31, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0).setScale(2);
      this.eqTxt = HG.UI.text(this, HG.W / 2, 50, '', { depth: 31, small: true, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
      this.nextTxt = HG.UI.text(this, 6, 18, '', { depth: 31, small: true, color: '#e3d49a', stroke: '#1a1410' });
      this.loadWord();
    }
    loadWord() {
      const w = this.words[this.wi];
      this.seq = []; [...w].forEach((ch, ci) => HG.Hangul.split(ch).forEach(j => this.seq.push({ j, ci })));
      this.k = 0; this.showWord();
    }
    showWord() {
      const w = this.words[this.wi];
      const done = this.seq.slice(0, this.k);
      const out = [...w].map((ch, ci) => { const parts = done.filter(s => s.ci === ci).map(s => s.j); return parts.length ? HG.Hangul.join(parts) : '□'; }).join('');
      this.wordTxt.setText(out);
      const cur = this.seq[this.k];
      if (cur) {
        const parts = this.seq.filter(s => s.ci === cur.ci).map(s => s.j);
        this.eqTxt.setText(`「${w}」 만들기 :  ${parts.join(' + ')} = ${[...w][cur.ci]}`);
        this.nextTxt.setText('다음 글자: ' + cur.j);
      }
      this.hudR.setText(`낱말 ${this.wi} / ${this.words.length}`);
    }
    async play() {
      await this.countdown();
      this.on = true; this.spawnT = 0;
      return new Promise(res => {
        this.finish = res;
        this.timer(this.p.time, () => { this.on = false; res(null); });
      });
    }
    spawn() {
      const cur = this.seq[this.k]; if (!cur) return;
      const pool = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅎㅏㅓㅗㅜㅡㅣ'.split('');
      const j = Math.random() < 0.34 ? cur.j : HG.pick(pool.filter(x => x !== cur.j));
      const x = HG.rand(24, 296);
      const t = HG.UI.text(this, x, 64, j, { depth: 15, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0.5).setScale(1.5);
      t.j = j; t.vy = HG.rand(36, 50) + this.wi * 6;
      this.drops.push(t);
    }
    update(t, dt) {
      if (!this.on) return;
      const d = dt / 1000;
      this.stun -= d;
      const h = this.keys.held();
      if (this.stun <= 0) { if (h === 'left') this.px -= 120 * d; if (h === 'right') this.px += 120 * d; }
      this.px = HG.clamp(this.px, 14, 306); this.me.x = this.px; this.basket.x = this.px;
      this.me.setAlpha(this.stun > 0 ? 0.5 : 1);
      this.spawnT -= d; if (this.spawnT <= 0) { this.spawn(); this.spawnT = 0.65; }
      const cur = this.seq[this.k];
      this.drops.forEach(s => { s.y += s.vy * d; s.setColor(cur && s.j === cur.j ? '#e3d49a' : '#e9e2d0'); });
      let clearAll = false;
      this.drops = this.drops.filter(s => {
        if (clearAll) return true;
        if (Math.abs(s.x - this.px) < 14 && Math.abs(s.y - 144) < 8) {
          if (cur && s.j === cur.j) {
            HG.Sound.sfx('correct'); this.k++;
            if (this.k >= this.seq.length) {
              this.wi++; this.flash(`「${this.words[this.wi - 1]}」 완성!`, '#e3d49a', 80); HG.Sound.sfx('levelup');
              clearAll = true; s.destroy();
              if (this.wi >= this.words.length) { this.on = false; this.hudR.setText(`낱말 ${this.wi} / ${this.words.length}`); this.finish(this.left > this.p.time * 0.45 ? '★★★' : this.left > this.p.time * 0.2 ? '★★☆' : '★☆☆'); return false; }
              this.loadWord(); return false;
            }
            this.showWord();
          } else if (this.stun <= 0) { HG.Sound.sfx('wrong'); this.stun = 1.0; this.left = Math.max(0.5, this.left - 2); this.flash('다른 글자! -2초', '#bf4436', 90); }
          s.destroy(); return false;
        }
        if (s.y > 176) { s.destroy(); return false; }
        return true;
      });
      if (clearAll) { this.drops.forEach(o => o.destroy()); this.drops = []; }
    }
  });

  // ════════════════════════════════════════
  // 성벽 쌓기 — 떨어지는 돌 블록으로 한 줄을 꽉 채우기 (테트리스형)
  // p: { goal, time }
  // ════════════════════════════════════════
  const SHAPES = {
    I: [[0, 0], [1, 0], [2, 0], [3, 0]], O: [[0, 0], [1, 0], [0, 1], [1, 1]], T: [[0, 0], [1, 0], [2, 0], [1, 1]],
    L: [[0, 0], [0, 1], [0, 2], [1, 2]], J: [[1, 0], [1, 1], [1, 2], [0, 2]]
  };
  HG.registerMini(HG.WallScene = class extends HG.MiniGame {
    constructor() { super('Wall'); }
    defaults() { return { title: '성벽 쌓기', name: '성벽 쌓기', goal: 5, time: 150, bg: 'village', music: 'mission', help: '← → 옮기기 · ↑ 돌리기 · ↓ 빨리 · 스페이스 바로 내리기', intro: ['돌을 빈틈없이 쌓아 가로 한 줄을 꽉 채우면 성벽 한 층이 완성돼!', '5층을 쌓아 보자. 꼭대기까지 차면 무너져서 다시 쌓아야 해.'] }; }
    setup() {
      this.CW = 8; this.CH = 12; this.C = 12; this.OX = 112; this.OY = 18;
      tex(this, 'mg_stone', 12, 12, p => { Px().rect(p, 0, 0, 12, 12, 'g'); Px().rect(p, 1, 1, 10, 1, 'l'); Px().rect(p, 1, 1, 1, 10, 'l'); Px().rect(p, 2, 10, 9, 1, 'G'); });
      tex(this, 'mg_stone2', 12, 12, p => { Px().rect(p, 0, 0, 12, 12, 'n'); Px().rect(p, 1, 1, 10, 1, 'Y'); Px().rect(p, 2, 10, 9, 1, 'b'); });
      const g = this.add.graphics().setDepth(4);
      g.fillStyle(0x12100e, 0.75).fillRect(this.OX - 2, this.OY - 2, this.CW * this.C + 4, this.CH * this.C + 4);
      g.lineStyle(1, 0x7d776c).strokeRect(this.OX - 2, this.OY - 2, this.CW * this.C + 4, this.CH * this.C + 4);
      this.grid = []; for (let y = 0; y < this.CH; y++) this.grid.push(new Array(this.CW).fill(0));
      this.cells = this.add.group();
      this.lines = 0; this.on = false;
      // 왼쪽: 쌓여 가는 화성 그림
      this.add.rectangle(56, 160, 70, 2, 0x3f2b1c).setDepth(4);
      this.fort = this.add.graphics().setDepth(5);
      if (this.p.npc) this.add.sprite(266, 150, this.p.npc, 0).setOrigin(0.5, 1).setScale(2).setDepth(6);
      this.drawFort();
    }
    drawFort() {
      const g = this.fort; g.clear();
      for (let i = 0; i < this.lines; i++) { g.fillStyle(i % 2 ? 0x7d776c : 0xb3ac9c).fillRect(24, 150 - i * 12, 64, 11); g.lineStyle(1, 0x1a1410).strokeRect(24, 150 - i * 12, 64, 11); }
      if (this.lines >= this.p.goal) { g.fillStyle(0x7d2a22).fillRect(40, 150 - this.lines * 12 - 10, 32, 10); }
      this.hudR.setText(`성벽 ${this.lines} / ${this.p.goal}층`);
    }
    newPiece() {
      const k = HG.pick(Object.keys(SHAPES));
      this.piece = { cells: SHAPES[k].map(c => c.slice()), x: 3, y: 0 };
      if (!this.fits(this.piece.cells, 3, 0)) {
        // 꼭대기까지 참 → 무너짐
        HG.Sound.sfx('wrong'); this.cameras.main.shake(300, 0.01); this.flash('와르르! 다시 쌓자', '#bf4436');
        this.grid.forEach(r => r.fill(0)); this.left = Math.max(1, this.left - 10);
      }
      this.fall = 0;
    }
    fits(cells, x, y) { return cells.every(([cx, cy]) => { const X = x + cx, Y = y + cy; return X >= 0 && X < this.CW && Y < this.CH && (Y < 0 || !this.grid[Y][X]); }); }
    rotate() {
      const c = this.piece.cells.map(([x, y]) => [-y, x]);
      const mx = Math.min(...c.map(v => v[0])), my = Math.min(...c.map(v => v[1]));
      const n = c.map(([x, y]) => [x - mx, y - my]);
      for (const k of [0, -1, 1, -2]) if (this.fits(n, this.piece.x + k, this.piece.y)) { this.piece.cells = n; this.piece.x += k; HG.Sound.sfx('cursor'); return; }
    }
    lock() {
      this.piece.cells.forEach(([cx, cy]) => { const Y = this.piece.y + cy; if (Y >= 0) this.grid[Y][this.piece.x + cx] = 1 + (Math.random() < 0.3 ? 1 : 0); });
      HG.Sound.sfx('talk');
      let cleared = 0;
      for (let y = this.CH - 1; y >= 0; y--) if (this.grid[y].every(v => v)) { this.grid.splice(y, 1); this.grid.unshift(new Array(this.CW).fill(0)); cleared++; y++; }
      if (cleared) { this.lines += cleared; HG.Sound.sfx('levelup'); this.flash(cleared > 1 ? `${cleared}층 한꺼번에!` : '한 층 완성!'); this.drawFort(); }
      if (this.lines >= this.p.goal) { this.on = false; this.finish(this.left > this.p.time * 0.5 ? '★★★' : this.left > this.p.time * 0.25 ? '★★☆' : '★☆☆'); return; }
      this.newPiece();
    }
    draw() {
      this.cells.clear(true, true);
      const put = (x, y, k) => { if (y >= 0) this.cells.add(this.add.image(this.OX + x * this.C, this.OY + y * this.C, k).setOrigin(0).setDepth(6)); };
      this.grid.forEach((r, y) => r.forEach((v, x) => v && put(x, y, v === 2 ? 'mg_stone2' : 'mg_stone')));
      if (this.piece && this.on) this.piece.cells.forEach(([cx, cy]) => put(this.piece.x + cx, this.piece.y + cy, 'mg_stone2'));
    }
    async play() {
      await this.countdown();
      this.on = true; this.newPiece();
      return new Promise(res => {
        this.finish = res;
        this.timer(this.p.time, () => { this.on = false; res(null); });
        this.input2(a => {
          if (!this.on) return;
          const P = this.piece;
          if (a === 'left' && this.fits(P.cells, P.x - 1, P.y)) P.x--;
          if (a === 'right' && this.fits(P.cells, P.x + 1, P.y)) P.x++;
          if (a === 'up') this.rotate();
          if (a === 'down') { if (this.fits(P.cells, P.x, P.y + 1)) P.y++; else this.lock(); }
          if (a === 'ok') { while (this.fits(P.cells, P.x, P.y + 1)) P.y++; this.lock(); }
          this.draw();
        });
        this.draw();
      });
    }
    update(t, dt) {
      if (!this.on) return;
      this.fall += dt / 1000;
      const spd = Math.max(0.28, 0.66 - this.lines * 0.07);
      if (this.keys.isHeld('down') ? this.fall > 0.06 : this.fall > spd) {
        this.fall = 0;
        if (this.fits(this.piece.cells, this.piece.x, this.piece.y + 1)) this.piece.y++; else this.lock();
        this.draw();
      }
    }
  });

  // ════════════════════════════════════════
  // 낱말 분류 — 떨어지는 낱말 카드를 왼쪽·오른쪽 상자로 보내기
  // p: { need, lives, left:{name, test}, right:{name}, words:[] }  기본: 가나다순 (ㄱ~ㅅ / ㅇ~ㅎ)
  // ════════════════════════════════════════
  HG.registerMini(HG.SortScene = class extends HG.MiniGame {
    constructor() { super('Sort'); }
    defaults() {
      return { title: '낱말 분류', name: '낱말 분류', need: 15, lives: 3, bg: 'palace', music: 'village', help: '← 왼쪽 상자 · → 오른쪽 상자',
        leftName: 'ㄱ ~ ㅅ', rightName: 'ㅇ ~ ㅎ', leftSet: 'ㄱㄴㄷㄹㅁㅂㅅ',
        words: ['가방', '나무', '다리', '라면', '마을', '바다', '사과', '아이', '자두', '차례', '토끼', '파도', '하늘', '고래', '누나', '도토리', '모래', '보리', '소나무', '오이', '주머니', '치마', '코끼리', '하마', '바람', '구름', '이슬', '호박', '노을', '우물'],
        intro: ['사전은 낱말을 가나다 차례로 늘어놓아야 찾기 쉬워. 낱말 카드를 첫 글자의 자음에 따라 나눠 보자!', '첫 자음이 ㄱ~ㅅ 이면 ← 왼쪽 상자, ㅇ~ㅎ 이면 → 오른쪽 상자야. 세 번 틀리면 다시!'] };
    }
    setup() {
      tex(this, 'mg_box', 48, 28, p => { Px().rect(p, 1, 6, 46, 21, 'n'); Px().rect(p, 0, 4, 48, 3, 'b'); Px().rect(p, 2, 9, 44, 1, 'b'); });
      tex(this, 'mg_card', 44, 18, p => { Px().rect(p, 0, 0, 44, 18, 'w'); Px().rect(p, 0, 15, 44, 3, 'l'); });
      this.add.image(52, 150, 'mg_box').setScale(1.4).setDepth(5); this.add.image(268, 150, 'mg_box').setScale(1.4).setDepth(5);
      HG.UI.text(this, 52, 120, this.p.leftName, { depth: 6, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
      HG.UI.text(this, 268, 120, this.p.rightName, { depth: 6, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
      if (this.p.npc) this.add.sprite(160, 168, this.p.npc, 0).setOrigin(0.5, 1).setScale(1.5).setDepth(6);
      this.ok = 0; this.miss = 0; this.on = false; this.card = null; this.queue = HG.shuffle(this.p.words);
      this.upd();
    }
    upd() { this.hudR.setText(`맞힘 ${this.ok} / ${this.p.need}   ${'♥'.repeat(Math.max(0, this.p.lives - this.miss))}`); }
    deal() {
      if (!this.queue.length) this.queue = HG.shuffle(this.p.words);
      const w = this.queue.pop();
      const c = this.add.container(160, 26).setDepth(20);
      c.add(this.add.image(0, 0, 'mg_card'));
      c.add(HG.UI.text(this, 0, -6, w, { color: '#1a1410' }).setOrigin(0.5, 0));
      c.word = w; c.vy = 22 + this.ok * 2.2;
      this.card = c;
    }
    send(dir) {
      const c = this.card; if (!c || c.flying) return;
      c.flying = true;
      const isLeft = this.p.leftSet.includes(HG.Hangul.first(c.word));
      const right = (dir === 'left') === isLeft;
      this.tweens.add({ targets: c, x: dir === 'left' ? 52 : 268, y: 140, scale: 0.6, duration: 260, onComplete: () => {
        c.destroy();
        if (right) { this.ok++; HG.Sound.sfx('correct'); }
        else { this.miss++; HG.Sound.sfx('wrong'); this.cameras.main.shake(120, 0.006); this.flash(`「${c.word}」은 ${HG.Hangul.first(c.word)}(으)로 시작!`, '#bf4436', 70); }
        this.upd(); this.card = null;
        if (this.ok >= this.p.need) { this.on = false; this.finish(this.stars(this.miss, 0, 1)); }
        else if (this.miss >= this.p.lives) { this.on = false; this.finish(null); }
        else this.time.delayedCall(right ? 150 : 900, () => this.on && this.deal());
      } });
    }
    async play() {
      await this.countdown();
      this.on = true; this.deal();
      return new Promise(res => {
        this.finish = res;
        this.input2(a => { if (this.on && (a === 'left' || a === 'right')) this.send(a); });
      });
    }
    update(t, dt) {
      if (!this.on || !this.card || this.card.flying) return;
      this.card.y += this.card.vy * dt / 1000;
      if (this.card.y > 112) { const c = this.card; this.send(this.p.leftSet.includes(HG.Hangul.first(c.word)) ? 'right' : 'left'); }
    }
  });
})();
