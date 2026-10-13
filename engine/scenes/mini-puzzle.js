// ─────────────────────────────────────────────
// 새 미니게임 ②: 생각하는 것 (덮개돌 밀기 · 물길 퍼즐 · 지도 조각 · 태극기 완성 · 거울 글자)
// ─────────────────────────────────────────────
(function () {
  const Px = () => HG.Pixel;
  const tex = (S, key, w, h, fn) => { if (!S.textures.exists(key)) Px().draw(S, key, w, h, (p, ctx) => { fn(p, ctx); Px().outline(ctx, w, h); }); };
  const D4 = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  // ════════════════════════════════════════
  // 덮개돌 밀기 (창고지기) — 통나무 위로 큰 돌을 밀어 받침돌 위에 올리기
  // p: { levels:[[문자열]], tiles:{wall, floor} }  '#'벽 '.'바닥 'P'나 'S'돌 'G'받침돌
  // ════════════════════════════════════════
  HG.registerMini(HG.PushScene = class extends HG.MiniGame {
    constructor() { super('Push'); }
    defaults() {
      return { title: '덮개돌 옮기기', name: '덮개돌 밀기 퍼즐', bg: null, music: 'village', help: '방향키 밀기 · X 처음부터',
        wall: 't_tree', floor: 't_grass', par: [4, 19, 20, 24],
        levels: [
          ['#########', '#.......#', '#.P.S..G#', '#.......#', '#########'],
          ['#########', '#...#...#', '#.S...S.#', '#.#G#G#.#', '#...P...#', '#########'],
          ['########', '#..G...#', '#.S.##.#', '#.P..S.#', '#..#..G#', '########'],
          ['##########', '#G.....#.#', '#.S.#..S.#', '#..P#.G..#', '#.S......#', '#.G#.....#', '##########']
        ],
        intro: ['덮개돌은 아주 무거워서 당길 수는 없고, 뒤에서 밀기만 할 수 있어.', '돌을 받침돌(□) 위로 모두 밀어 올리면 고인돌 완성! 막히면 X를 눌러 처음부터 다시 해.'] };
    }
    setup() {
      tex(this, 'mg_rock', 16, 16, p => { Px().ellipse(p, 8, 9, 7, 5, 'g'); Px().ellipse(p, 7, 7, 4, 2, 'l'); p(11, 11, 'G'); p(4, 10, 'G'); });
      tex(this, 'mg_goal', 16, 16, p => { Px().rect(p, 2, 6, 4, 8, 'G'); Px().rect(p, 10, 6, 4, 8, 'G'); Px().rect(p, 3, 7, 2, 1, 'l'); Px().rect(p, 11, 7, 2, 1, 'l'); });
      tex(this, 'mg_log', 16, 6, p => { Px().rect(p, 0, 1, 16, 4, 'b'); Px().rect(p, 0, 1, 16, 1, 'n'); });
      this.add.rectangle(0, 0, HG.W, HG.H, 0x2c5a2a).setOrigin(0).setDepth(-20);
      this.lv = 0; this.moves = 0; this.total = 0; this.objs = [];
      this.loadLevel();
    }
    loadLevel() {
      this.objs.forEach(o => o.destroy()); this.objs = [];
      const rows = this.p.levels[this.lv];
      this.rows = rows; this.H = rows.length; this.W = rows[0].length;
      this.S = Math.min(24, Math.floor(150 / this.H), Math.floor(300 / this.W)); this.OX = Math.floor((HG.W - this.W * this.S) / 2); this.OY = Math.floor(18 + (150 - this.H * this.S) / 2);
      this.stones = []; this.goals = [];
      rows.forEach((r, y) => [...r].forEach((c, x) => {
        const sc = this.S / 16; const img = this.add.image(this.cx(x), this.cy(y), c === '#' ? this.p.wall : this.p.floor).setScale(sc).setDepth(1); this.objs.push(img);
        if (c === 'G') { this.goals.push([x, y]); this.objs.push(this.add.image(this.cx(x), this.cy(y), 'mg_goal').setScale(sc).setDepth(2)); }
        if (c === 'S') { const s = this.add.image(this.cx(x), this.cy(y), 'mg_rock').setScale(sc).setDepth(5); s.gx = x; s.gy = y; this.stones.push(s); this.objs.push(s); }
        if (c === 'P') { this.ppos = [x, y]; }
      }));
      this.me = this.add.sprite(this.cx(this.ppos[0]), this.cy(this.ppos[1]) + 8, HG.heroKey(), 0).setOrigin(0.5, 1).setDepth(6); this.objs.push(this.me);
      this.moves = 0; this.upd();
    }
    cx(x) { return this.OX + x * this.S + this.S / 2; }
    cy(y) { return this.OY + y * this.S + this.S / 2; }
    upd() { this.hudR.setText(`고인돌 ${this.lv + 1} / ${this.p.levels.length}   이동 ${this.moves}`); }
    wall(x, y) { return (this.rows[y] || '')[x] === '#' || (this.rows[y] || '')[x] === undefined; }
    stoneAt(x, y) { return this.stones.find(s => s.gx === x && s.gy === y); }
    solved() { return this.stones.every(s => this.goals.some(g => g[0] === s.gx && g[1] === s.gy)); }
    async play() {
      return new Promise(res => {
        let busy = false;
        const facing = { up: 2, down: 0, left: 4, right: 4 };
        this.input2(async a => {
          if (busy) return;
          if (a === 'cancel') { HG.Sound.sfx('cursor'); this.total += this.moves; this.loadLevel(); return; }
          if (!D4[a]) return;
          const [dx, dy] = D4[a];
          this.me.setFrame(facing[a]).setFlipX(a === 'left');
          const nx = this.ppos[0] + dx, ny = this.ppos[1] + dy;
          if (this.wall(nx, ny)) return;
          const st = this.stoneAt(nx, ny);
          if (st) {
            const bx = nx + dx, by = ny + dy;
            if (this.wall(bx, by) || this.stoneAt(bx, by)) { HG.Sound.sfx('cursor'); return; }
            st.gx = bx; st.gy = by;
            const log = this.add.image(st.x, st.y + 10, 'mg_log').setScale(1.5).setDepth(4);
            this.tweens.add({ targets: st, x: this.cx(bx), y: this.cy(by), duration: 140 });
            this.tweens.add({ targets: log, x: this.cx(bx), y: this.cy(by) + 10, alpha: 0, duration: 260, onComplete: () => log.destroy() });
            HG.Sound.sfx('talk');
            const on = this.goals.some(g => g[0] === bx && g[1] === by);
            st.setTint(on ? 0xe3d49a : 0xffffff);
          }
          this.ppos = [nx, ny]; this.moves++; this.upd();
          busy = true;
          await new Promise(r => this.tweens.add({ targets: this.me, x: this.cx(nx), y: this.cy(ny) + 8, duration: 140, onComplete: r }));
          busy = false;
          if (this.solved()) {
            busy = true; HG.Sound.sfx('levelup');
            this.total += this.moves;
            await this.flash('고인돌 완성!');
            this.lv++;
            if (this.lv >= this.p.levels.length) { const par = this.p.par.reduce((a, b) => a + b, 0); res(this.total <= par * 1.3 ? '★★★' : this.total <= par * 2 ? '★★☆' : '★☆☆'); return; }
            this.loadLevel(); busy = false;
          }
        });
      });
    }
  });

  // ════════════════════════════════════════
  // 물길 퍼즐 — 물길 조각을 돌려 둑의 물이 끝까지 흐르게 하기
  // p: { cols, rows, time, target(오른쪽에 있는 그림) }
  // ════════════════════════════════════════
  const N = 1, E = 2, S = 4, W = 8;
  const rot = m => ((m << 1) | (m >> 3)) & 15;
  HG.registerMini(HG.PipesScene = class extends HG.MiniGame {
    constructor() { super('Pipes'); }
    defaults() { return { title: '물길 퍼즐', name: '물길 퍼즐', cols: 7, rows: 5, time: 80, bg: 'grass', music: 'mission', target: 'tmon0', help: '방향키 고르기 · 스페이스 물길 돌리기', intro: ['왼쪽 둑에 물이 가득 찼어! 물길 조각을 돌려서 물이 오른쪽 끝까지 흐르게 해 보자.', '물길이 이어지면 저절로 물이 흘러가!'] }; }
    setup() {
      const p = this.p; this.C = p.rows > 4 ? 22 : 24;
      this.OX = Math.floor((HG.W - p.cols * this.C) / 2); this.OY = 30;
      // 길 만들기 (왼쪽 → 오른쪽)
      let path;
      for (let tries = 0; tries < 200; tries++) { path = this.walk(); if (path && path.length >= p.cols + 2) break; }
      this.cells = []; for (let y = 0; y < p.rows; y++) { this.cells.push([]); for (let x = 0; x < p.cols; x++) this.cells[y].push(HG.pick([N | S, E | S, N | E, W | S, N | W, E | W])); }
      this.r0 = path[0][1]; this.r1 = path[path.length - 1][1];
      path.forEach(([x, y], i) => {
        const prev = i ? path[i - 1] : [x - 1, y], next = i < path.length - 1 ? path[i + 1] : [x + 1, y];
        const dir = (a, b) => b[0] > a[0] ? E : b[0] < a[0] ? W : b[1] > a[1] ? S : N;
        const into = { [E]: W, [W]: E, [S]: N, [N]: S }[dir(prev, [x, y])];
        this.cells[y][x] = into | dir([x, y], next);
      });
      this.solution = this.cells.map(r => r.slice());
      // 돌려서 섞기
      this.cells.forEach(r => r.forEach((m, i) => { let k = HG.rand(0, 3); while (k--) m = rot(m); r[i] = m; }));
      this.g = this.add.graphics().setDepth(5);
      this.cur = [0, this.r0]; this.turns = 0; this.flow = [];
      this.add.rectangle(this.OX - 20, this.OY + this.r0 * this.C + this.C / 2, 18, 22, 0x3a6aa8).setDepth(4).setStrokeStyle(1, 0x1a1410);
      HG.UI.text(this, this.OX - 20, this.OY - 14, '둑', { depth: 6, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
      this.tgt = this.add.image(this.OX + p.cols * this.C + 18, this.OY + this.r1 * this.C + this.C / 2, p.target).setScale(p.target.startsWith('tmon') ? 0.9 : 1.5).setDepth(6);
      if (p.npc) this.add.sprite(36, 170, p.npc, 0).setOrigin(0.5, 1).setScale(1.5).setDepth(6);
      this.draw();
    }
    walk() {
      const { cols, rows } = this.p;
      const y0 = HG.rand(0, rows - 1);
      const path = [[0, y0]], seen = new Set(['0,' + y0]);
      const go = () => {
        const [x, y] = path[path.length - 1];
        if (x === cols - 1 && Math.random() < 0.6) return true;
        const opts = HG.shuffle([[1, 0], [1, 0], [0, 1], [0, -1]]);
        for (const [dx, dy] of opts) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= cols || ny < 0 || ny >= rows || seen.has(nx + ',' + ny)) continue;
          seen.add(nx + ',' + ny); path.push([nx, ny]);
          if (go()) return true;
          path.pop();
        }
        return x === cols - 1;
      };
      return go() ? path : null;
    }
    trace() {
      // 왼쪽에서 들어온 물이 어디까지 흐르는지
      const out = []; let x = 0, y = this.r0, from = W;
      for (let k = 0; k < 60; k++) {
        if (x < 0 || y < 0 || x >= this.p.cols || y >= this.p.rows) break;
        const m = this.cells[y][x];
        if (!(m & from)) break;
        out.push([x, y]);
        const to = m & ~from;
        if (to === E && x === this.p.cols - 1) return { out, done: y === this.r1 };
        if (to === E) { x++; from = W; } else if (to === W) { x--; from = E; } else if (to === S) { y++; from = N; } else { y--; from = S; }
      }
      return { out, done: false };
    }
    draw() {
      const g = this.g; g.clear();
      const { out } = this.trace(); const wet = new Set(out.map(c => c.join(',')));
      for (let y = 0; y < this.p.rows; y++) for (let x = 0; x < this.p.cols; x++) {
        const X = this.OX + x * this.C, Y = this.OY + y * this.C, m = this.cells[y][x], c = this.C / 2;
        g.fillStyle(0x4a8a3a).fillRect(X, Y, this.C, this.C);
        g.lineStyle(1, 0x2c5a2a).strokeRect(X, Y, this.C, this.C);
        const col = wet.has(x + ',' + y) ? 0x7fb0c8 : 0x94704a;
        g.fillStyle(0x3f2b1c).fillRect(X + c - 5, Y + c - 5, 10, 10);
        g.fillStyle(col).fillRect(X + c - 4, Y + c - 4, 8, 8);
        if (m & N) { g.fillStyle(0x3f2b1c).fillRect(X + c - 5, Y, 10, c); g.fillStyle(col).fillRect(X + c - 4, Y, 8, c); }
        if (m & S) { g.fillStyle(0x3f2b1c).fillRect(X + c - 5, Y + c, 10, c); g.fillStyle(col).fillRect(X + c - 4, Y + c, 8, c); }
        if (m & W) { g.fillStyle(0x3f2b1c).fillRect(X, Y + c - 5, c, 10); g.fillStyle(col).fillRect(X, Y + c - 4, c, 8); }
        if (m & E) { g.fillStyle(0x3f2b1c).fillRect(X + c, Y + c - 5, c, 10); g.fillStyle(col).fillRect(X + c, Y + c - 4, c, 8); }
      }
      const [cx, cy] = this.cur;
      g.lineStyle(2, 0xdcbc48).strokeRect(this.OX + cx * this.C + 1, this.OY + cy * this.C + 1, this.C - 2, this.C - 2);
      this.hudR.setText(`돌린 횟수 ${this.turns}`);
    }
    async play() {
      return new Promise(res => {
        const tev = this.timer(this.p.time, () => res(null));
        this.input2(a => {
          if (D4[a]) { const [dx, dy] = D4[a]; this.cur = [HG.clamp(this.cur[0] + dx, 0, this.p.cols - 1), HG.clamp(this.cur[1] + dy, 0, this.p.rows - 1)]; HG.Sound.sfx('cursor'); this.draw(); }
          if (a === 'ok') {
            const [x, y] = this.cur; this.cells[y][x] = rot(this.cells[y][x]); this.turns++; HG.Sound.sfx('talk'); this.draw();
            if (this.trace().done) {
              tev.remove(); this.keys.stack = [];
              HG.Sound.sfx('levelup');
              this.tweens.add({ targets: this.tgt, x: this.tgt.x + 60, angle: 360, alpha: 0, duration: 900 });
              this.time.delayedCall(1000, () => res(this.left > this.p.time * 0.6 ? '★★★' : this.left > this.p.time * 0.3 ? '★★☆' : '★☆☆'));
            }
          }
        });
      });
    }
  });

  // ════════════════════════════════════════
  // 지도 조각 맞추기 — 3×3 밀기 퍼즐
  // p: { shuffle }
  // ════════════════════════════════════════
  HG.registerMini(HG.SlideScene = class extends HG.MiniGame {
    constructor() { super('Slide'); }
    defaults() { return { title: '지도 조각 맞추기', name: '지도 조각 퍼즐', shuffle: 70, bg: 'palace', music: 'village', help: '방향키로 빈칸 옆 조각 밀기', intro: ['지도 조각이 뒤섞여 버렸어! 빈칸 옆의 조각을 밀어서 오른쪽 그림처럼 맞춰 보자.', '방향키를 누르면 그 방향으로 조각이 빈칸에 미끄러져 들어가.'] }; }
    setup() {
      // 지도 그림 (90×90)
      if (!this.textures.exists('mg_mapimg')) {
        const { c, ctx } = HG.Pixel.canvas(90, 90);
        const pp = (x, y, ch) => { const col = HG.PAL[ch]; if (!col) return; ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); };
        const P = (lo, la) => [4 + (lo - 124.1) * 12.6, 2 + (43.1 - la) * 8.6];
        HG.Pixel.rect(pp, 0, 0, 90, 90, 'Y');
        HG.Pixel.poly(pp, HG.KMap.OUT.map(([lo, la]) => P(lo, la)), 'f');
        // 백두대간 산줄기
        [[128.1, 41.9], [128.4, 40.8], [128.0, 39.6], [128.5, 38.3], [128.8, 37.3], [128.5, 36.3], [127.7, 35.4]].forEach(([lo, la]) => { const [x, y] = P(lo, la); pp(x, y, 'b'); pp(x + 1, y, 'b'); pp(x, y - 1, 'B'); });
        // 강
        [[[126.6, 37.6], [127.4, 37.5], [128.0, 37.3]], [[128.3, 35.1], [128.5, 35.8], [128.6, 36.5]], [[124.6, 40.2], [125.8, 41.0], [127.2, 41.6]]].forEach(line => line.forEach(([lo, la]) => { const [x, y] = P(lo, la); pp(x, y, 'u'); pp(x + 1, y, 'u'); }));
        [[127.0, 37.55], [125.75, 39.03], [129.07, 35.18]].forEach(([lo, la]) => { const [x, y] = P(lo, la); HG.Pixel.rect(pp, x - 1, y - 1, 3, 3, 'r'); });
        for (let i = 0; i <= 90; i += 30) { HG.Pixel.rect(pp, i, 0, 1, 90, 'n'); HG.Pixel.rect(pp, 0, i, 90, 1, 'n'); }
        const t = this.textures.addCanvas('mg_mapimg', c);
        for (let i = 0; i < 9; i++) t.add('t' + i, 0, (i % 3) * 30, Math.floor(i / 3) * 30, 30, 30);
      }
      this.TS = 46; this.OX = 52; this.OY = 24;
      this.add.rectangle(this.OX - 3, this.OY - 3, this.TS * 3 + 6, this.TS * 3 + 6, 0x1a1410).setOrigin(0).setDepth(2);
      this.add.image(250, 72, 'mg_mapimg', '__BASE').setScale(0.9).setDepth(3);
      HG.UI.text(this, 250, 116, '완성 그림', { depth: 3, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
      if (this.p.npc) this.add.sprite(250, 170, this.p.npc, 0).setOrigin(0.5, 1).setScale(1.5).setDepth(6);
      // 판: board[칸] = 조각 번호, 8 = 빈칸
      this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      let last = -1;
      for (let i = 0; i < this.p.shuffle; i++) { const opts = this.neighbors(this.board.indexOf(8)).filter(n => n !== last); const pick = HG.pick(opts); last = this.board.indexOf(8); this.swap(pick); }
      if (this.solved()) this.swap(this.neighbors(this.board.indexOf(8))[0]);
      this.tiles = [];
      for (let k = 0; k < 8; k++) this.tiles[k] = this.add.image(0, 0, 'mg_mapimg', 't' + k).setOrigin(0).setScale(this.TS / 30 * 0.97).setDepth(5);
      this.moves = 0; this.place(true);
    }
    neighbors(i) { const x = i % 3, y = Math.floor(i / 3), o = []; if (x > 0) o.push(i - 1); if (x < 2) o.push(i + 1); if (y > 0) o.push(i - 3); if (y < 2) o.push(i + 3); return o; }
    swap(i) { const b = this.board.indexOf(8); [this.board[i], this.board[b]] = [this.board[b], this.board[i]]; }
    solved() { return this.board.every((v, i) => v === i); }
    place(now) {
      this.board.forEach((k, i) => { if (k === 8) return; const t = this.tiles[k], x = this.OX + (i % 3) * this.TS, y = this.OY + Math.floor(i / 3) * this.TS; if (now) t.setPosition(x, y); else this.tweens.add({ targets: t, x, y, duration: 110 }); });
      this.hudR.setText(`움직인 횟수 ${this.moves}`);
    }
    async play() {
      return new Promise(res => {
        this.input2(a => {
          if (!D4[a]) return;
          const b = this.board.indexOf(8), bx = b % 3, by = Math.floor(b / 3);
          const [dx, dy] = D4[a]; const sx = bx - dx, sy = by - dy;   // 빈칸 반대쪽 조각이 들어옴
          if (sx < 0 || sx > 2 || sy < 0 || sy > 2) { HG.Sound.sfx('cursor'); return; }
          this.swap(sy * 3 + sx); this.moves++; HG.Sound.sfx('talk'); this.place();
          if (this.solved()) {
            this.keys.stack = []; HG.Sound.sfx('levelup');
            const full = this.add.image(this.OX, this.OY, 'mg_mapimg', '__BASE').setOrigin(0).setScale(this.TS * 3 / 90).setDepth(6).setAlpha(0);
            this.tweens.add({ targets: full, alpha: 1, duration: 500 });
            this.time.delayedCall(900, () => res(this.moves <= 60 ? '★★★' : this.moves <= 110 ? '★★☆' : '★☆☆'));
          }
        });
      });
    }
  });

  // ════════════════════════════════════════
  // 태극기 완성 — 가운데 태극을 바로 세우고 네 귀퉁이에 4괘 놓기
  // ════════════════════════════════════════
  const GWAE = [null, { n: '건', m: '하늘', bars: [1, 1, 1] }, { n: '곤', m: '땅', bars: [0, 0, 0] }, { n: '감', m: '물', bars: [0, 1, 0] }, { n: '리', m: '불', bars: [1, 0, 1] }];
  HG.registerMini(HG.FlagScene = class extends HG.MiniGame {
    constructor() { super('Flag'); }
    defaults() {
      return { title: '태극기 완성', name: '태극기 완성', bg: 'village', music: 'village', help: '방향키 자리 고르기 · 스페이스 바꾸기/돌리기',
        intro: ['태극기를 완성해 보자! 가운데 태극은 빨강이 위, 파랑이 아래로 오게 돌려야 해.', '네 귀퉁이에는 4괘가 들어가. 왼쪽 위는 하늘(건 ☰), 오른쪽 아래는 땅(곤 ☷), 오른쪽 위는 물(감 ☵), 왼쪽 아래는 불(리 ☲)이야.', '자리를 골라 스페이스를 누르면 괘가 차례로 바뀌어. 모두 맞게 놓으면 완성!'] };
    }
    setup() {
      this.FX = 160; this.FY = 76;
      this.add.rectangle(this.FX, this.FY, 150, 100, 0xe9e2d0).setStrokeStyle(2, 0x1a1410).setDepth(3);
      this.slots = [
        { x: this.FX, y: this.FY, center: true, v: 1, ok: 0 },
        { x: this.FX - 38, y: this.FY - 25, ang: -56.31, v: 0, ok: 1 },
        { x: this.FX + 38, y: this.FY - 25, ang: 56.31, v: 0, ok: 3 },
        { x: this.FX - 38, y: this.FY + 25, ang: 56.31, v: 0, ok: 4 },
        { x: this.FX + 38, y: this.FY + 25, ang: -56.31, v: 0, ok: 2 }
      ];
      this.slots.forEach(s => { s.g = this.add.graphics().setDepth(5).setPosition(s.x, s.y); });
      this.cursor = this.add.graphics().setDepth(8);
      this.legend = HG.UI.text(this, HG.W / 2, 132, '건(하늘) ☰    곤(땅) ☷    감(물) ☵    리(불) ☲', { depth: 9, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
      if (this.p.npc) this.add.sprite(34, 150, this.p.npc, 0).setOrigin(0.5, 1).setScale(2).setDepth(6);
      this.ci = 0; this.presses = 0; this.drawAll();
    }
    drawSlot(s) {
      const g = s.g; g.clear();
      if (s.center) {
        // 국기 제작법: 지름은 왼쪽 위→오른쪽 아래 대각선 위, 왼쪽 작은 반원은 대각선 아래(빨강), 오른쪽은 위(파랑)
        g.setAngle(33.69 + s.v * 180);   // 0: 빨강이 위(정답) · 1: 파랑이 위
        g.fillStyle(0x3a6aa8).fillCircle(0, 0, 25);
        g.fillStyle(0xbf4436); g.beginPath(); g.slice(0, 0, 25, Math.PI, Math.PI * 2, false); g.fillPath();
        g.fillStyle(0xbf4436).fillCircle(-12.5, 0, 12.5);
        g.fillStyle(0x3a6aa8).fillCircle(12.5, 0, 12.5);
        return;
      }
      g.setAngle(s.ang);
      if (!s.v) { g.lineStyle(1, 0xb3ac9c).strokeRect(-13, -9, 26, 18); return; }
      GWAE[s.v].bars.forEach((solid, i) => {
        const y = -8 + i * 6;
        g.fillStyle(0x1a1410);
        if (solid) g.fillRect(-12, y, 24, 4); else { g.fillRect(-12, y, 10.5, 4); g.fillRect(1.5, y, 10.5, 4); }
      });
    }
    drawAll() {
      this.slots.forEach(s => this.drawSlot(s));
      const s = this.slots[this.ci], r = s.center ? 29 : 16;
      this.cursor.clear().lineStyle(2, 0xdcbc48).strokeRect(s.x - r, s.y - r, r * 2, r * 2);
      const name = s.center ? (s.v ? '태극: 파랑이 위' : '태극: 빨강이 위') : (s.v ? `${GWAE[s.v].n}(${GWAE[s.v].m})` : '빈칸');
      this.hudR.setText(name);
    }
    correct() { return this.slots.every(s => s.v === s.ok); }
    async play() {
      return new Promise(res => {
        this.time.delayedCall(60000, () => { if (!this.over) { this.legend.setText('힌트: 왼쪽 위 ☰ · 오른쪽 위 ☵ · 왼쪽 아래 ☲ · 오른쪽 아래 ☷'); this.legend.setColor('#e3d49a'); } });
        this.input2(a => {
          if (D4[a]) {
            const [dx, dy] = D4[a], cur = this.slots[this.ci];
            let best = -1, bd = 1e9;
            this.slots.forEach((s, i) => { if (i === this.ci) return; const vx = s.x - cur.x, vy = s.y - cur.y; if (vx * dx + vy * dy <= 0) return; const d = Math.abs(vx) + Math.abs(vy) + (dx ? Math.abs(vy) : Math.abs(vx)) * 2; if (d < bd) { bd = d; best = i; } });
            if (best >= 0) { this.ci = best; HG.Sound.sfx('cursor'); this.drawAll(); }
          }
          if (a === 'ok') {
            const s = this.slots[this.ci]; this.presses++;
            if (s.center) s.v = (s.v + 1) % 2; else s.v = (s.v + 1) % 5;
            HG.Sound.sfx('talk'); this.drawAll();
            const wrong = this.slots.filter(t => t.v !== t.ok).length;
            const filled = this.slots.every(t => t.center || t.v);
            if (filled && wrong) { this.flash(`${wrong}군데가 아직 달라요!`, '#bf4436', 112); HG.Sound.sfx('wrong'); }
            if (this.correct()) {
              this.keys.stack = []; this.cursor.clear(); HG.Sound.sfx('levelup');
              this.tweens.add({ targets: this.slots.map(s => s.g), scale: 1.15, yoyo: true, duration: 200 });
              this.time.delayedCall(800, () => res(this.presses <= 22 ? '★★★' : this.presses <= 40 ? '★★☆' : '★☆☆'));
            }
          }
        });
      });
    }
  });

  // ════════════════════════════════════════
  // 거울 글자 찾기 — 찍으면 바르게 나오는 활자(좌우가 뒤집힌 것) 고르기
  // p: { chars:[], rounds }
  // ════════════════════════════════════════
  HG.registerMini(HG.MirrorScene = class extends HG.MiniGame {
    constructor() { super('Mirror'); }
    defaults() { return { title: '거울 글자 찾기', name: '거울 글자 찾기', chars: ['직', '지', '책', '글', '꿈', '봄', '길', '빛', '돌', '쇠', '곰', '팥'], rounds: 8, lives: 3, bg: 'palace', music: 'village', help: '← → 활자 고르기 · 스페이스 찍기', intro: ['활자는 도장처럼 좌우가 뒤집혀 있어야 종이에 바르게 찍혀!', '종이에 찍을 글자를 보고, 알맞은 활자를 골라 보자.'] }; }
    setup() {
      this.add.rectangle(160, 48, 60, 46, 0xe9e2d0).setStrokeStyle(2, 0x94704a).setDepth(3);
      HG.UI.text(this, 160, 20, '찍을 글자', { depth: 4, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
      this.target = HG.UI.text(this, 160, 49, '', { depth: 4, color: '#1a1410' }).setOrigin(0.5, 0.5).setScale(2);
      this.blocks = [0, 1, 2, 3].map(i => {
        const x = 70 + i * 60, y = 118;
        const r = this.add.rectangle(x, y, 40, 40, 0x4e4a43).setStrokeStyle(2, 0x1a1410).setDepth(5);
        const t = HG.UI.text(this, x, y, '', { depth: 6, color: '#dcbc48' }).setOrigin(0.5, 0.5).setScale(2);
        return { r, t, x, y };
      });
      this.cur = this.add.graphics().setDepth(7);
      if (this.p.npc) this.add.sprite(36, 80, this.p.npc, 0).setOrigin(0.5, 1).setScale(1.5).setDepth(6);
      this.ci = 0; this.miss = 0;
    }
    drawCur() { const b = this.blocks[this.ci]; this.cur.clear().lineStyle(2, 0xe3d49a).strokeRect(b.x - 23, b.y - 23, 46, 46); }
    async play() {
      const chars = HG.shuffle(this.p.chars).slice(0, this.p.rounds);
      for (let r = 0; r < chars.length; r++) {
        const ch = chars[r];
        this.hudR.setText(`${r + 1} / ${chars.length}   ${'♥'.repeat(Math.max(0, this.p.lives - this.miss))}`);
        this.target.setText(ch);
        const kinds = HG.shuffle(['mirror', 'normal', 'flipY', 'rot']);
        this.blocks.forEach((b, i) => { b.kind = kinds[i]; b.t.setText(ch).setFlipX(kinds[i] === 'mirror' || kinds[i] === 'rot').setFlipY(kinds[i] === 'flipY' || kinds[i] === 'rot'); });
        this.drawCur();
        while (true) {
          const pick = await new Promise(res => { const off = this.input2(a => { if (a === 'left' || a === 'right') { this.ci = (this.ci + (a === 'left' ? 3 : 1)) % 4; HG.Sound.sfx('cursor'); this.drawCur(); } if (a === 'ok') { off(); res(this.ci); } }); });
          const b = this.blocks[pick];
          // 찍는 연출
          const ghost = HG.UI.text(this, b.x, b.y, ch, { depth: 9, color: '#1a1410' }).setOrigin(0.5, 0.5).setScale(2).setAlpha(0);
          await new Promise(rr => this.tweens.add({ targets: b.r, y: 60, duration: 180, yoyo: true, onComplete: rr }));
          ghost.setPosition(160, 49).setAlpha(1);
          // 찍힌 모양 = 활자를 좌우로 뒤집은 모양
          ghost.setFlipX(!(b.kind === 'mirror' || b.kind === 'rot')).setFlipY(b.kind === 'flipY' || b.kind === 'rot');
          this.target.setAlpha(0.15);
          await HG.UI.wait(this, 450);
          if (b.kind === 'mirror') { HG.Sound.sfx('correct'); await this.flash('바르게 찍혔다!', '#e3d49a', 80); ghost.destroy(); this.target.setAlpha(1); break; }
          this.miss++; HG.Sound.sfx('wrong'); this.cameras.main.shake(120, 0.006);
          await this.flash('찍어 보니 글자가 뒤집혔어!', '#bf4436', 80);
          ghost.destroy(); this.target.setAlpha(1);
          this.hudR.setText(`${r + 1} / ${chars.length}   ${'♥'.repeat(Math.max(0, this.p.lives - this.miss))}`);
          if (this.miss >= this.p.lives) return null;
        }
      }
      return this.stars(this.miss, 0, 1);
    }
  });
})();
