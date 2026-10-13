// 잠입 장면 — 순찰하는 시간 괴물의 눈(앞 3칸)을 피해 목적지까지 몰래 가기
// p: { title, intro:[], map:[문자열], guards:[{path:[[x,y],...]}], start:[x,y], goal:[x,y], goalLabel, outro:[], exp }
// 지도 글자: '#' 담(막힘)  'H' 집(막힘)  'T' 나무(막힘)  '.' 길  ',' 풀
HG.StealthScene = class extends Phaser.Scene {
  constructor() { super('Stealth'); }
  init(d) { this.onEnd = d.onEnd; this.p = Object.assign({ exp: 40, outro: [], goalLabel: '목적지' }, d.p || {}); }
  create() {
    const p = this.p;
    this.keys = new HG.Keys(this); this.dlg = new HG.UI.Dialog(this, this.keys);
    const rows = p.map; this.rows = rows;
    const w = rows[0].length, h = rows.length;
    this.ox = Math.floor((HG.W - w * 16) / 2); this.oy = 18;
    const key = 'stealth_' + (p.key || 'map');
    if (!this.textures.exists(key)) {
      const { c, ctx } = HG.Pixel.canvas(w * 16, h * 16);
      const T = { '#': 't_wall', 'H': 't_wall', 'T': 't_tree', '.': 't_sandpath', ',': 't_grass' };
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) ctx.drawImage(this.textures.get(T[rows[y][x]] || 't_grass').getSourceImage(), x * 16, y * 16);
      this.textures.addCanvas(key, c);
    }
    this.add.rectangle(0, 0, HG.W, HG.H, 0x12100e).setOrigin(0).setDepth(-20);
    this.add.image(this.ox, this.oy, key).setOrigin(0).setDepth(-10);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (rows[y][x] === 'H') this.add.image(this.ox + x * 16 - 8, this.oy + y * 16 - 16, 'o_chogajip').setOrigin(0).setDepth(y * 16 + 16).setScale(0.75);
    this.goal = this.add.image(this.cx(p.goal[0]), this.cy(p.goal[1]), 'node').setDepth(5);
    HG.UI.text(this, this.cx(p.goal[0]), this.cy(p.goal[1]) - 18, p.goalLabel, { depth: 6, small: true, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
    this.vision = this.add.graphics().setDepth(4);
    this.guards = p.guards.map(gd => {
      const s = this.add.image(0, 0, 'tmon0').setDepth(50);
      return { s, path: gd.path, i: 0, x: gd.path[0][0], y: gd.path[0][1], dir: 'down', t: 0 };
    });
    this.px = p.start[0]; this.py = p.start[1]; this.pdir = 'up';
    this.player = this.add.sprite(0, 0, HG.heroKey(), 2).setOrigin(0.5, 1).setDepth(60);
    this.place();
    this.title = HG.UI.text(this, HG.W / 2, 2, p.title, { depth: 901, small: true, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
    this.caught = 0; this.on = false; this.moving = false;
    HG.Sound.play('mission'); this.cameras.main.fadeIn(250);
    this.run();
  }
  cx(x) { return this.ox + x * 16 + 8; }
  cy(y) { return this.oy + y * 16 + 8; }
  solid(x, y) { const r = this.rows[y]; if (!r || x < 0 || x >= r.length) return true; return '#HT'.includes(r[x]); }
  place() { this.player.x = this.cx(this.px); this.player.y = this.cy(this.py) + 7; this.guards.forEach(g => { g.s.x = this.cx(g.x); g.s.y = this.cy(g.y); }); this.drawVision(); }
  seen(g) {
    const [dx, dy] = HG.DIRS[g.dir];
    const cells = [];
    for (let k = 1; k <= 3; k++) { const x = g.x + dx * k, y = g.y + dy * k; if (this.solid(x, y)) break; cells.push([x, y]); }
    return cells;
  }
  drawVision() {
    const v = this.vision; v.clear(); v.fillStyle(0xbf4436, 0.35);
    this.guards.forEach(g => this.seen(g).forEach(([x, y]) => v.fillRect(this.ox + x * 16, this.oy + y * 16, 16, 16)));
  }
  async run() {
    await this.dlg.say(...this.p.intro, '빨간 칸은 시간 괴물의 눈이야. 그 칸에 들어가면 들켜서 처음으로 돌아가!');
    this.on = true;
  }
  update(time, delta) {
    if (!this.on) return;
    const dt = delta / 1000;
    this.guards.forEach(g => {
      g.t += dt; g.s.setTexture('tmon' + (Math.floor(time / 300) % 2));
      if (g.t >= 0.5) {
        g.t = 0; g.i = (g.i + 1) % g.path.length;
        const [nx, ny] = g.path[g.i];
        g.dir = nx > g.x ? 'right' : nx < g.x ? 'left' : ny > g.y ? 'down' : ny < g.y ? 'up' : g.dir;
        g.x = nx; g.y = ny;
        this.tweens.add({ targets: g.s, x: this.cx(nx), y: this.cy(ny), duration: 300 });
        this.drawVision();
        this.check();
      }
    });
    if (this.moving) return;
    const d = this.keys.held();
    if (!d) return;
    const [dx, dy] = HG.DIRS[d];
    this.pdir = d; HG.setFace(this.player, d);
    const nx = this.px + dx, ny = this.py + dy;
    if (this.solid(nx, ny) || this.guards.some(g => g.x === nx && g.y === ny)) return;
    this.moving = true; this.px = nx; this.py = ny;
    HG.setFace(this.player, d, true, (this.alt = !this.alt));
    this.tweens.add({ targets: this.player, x: this.cx(nx), y: this.cy(ny) + 7, duration: 180, onComplete: () => {
      HG.setFace(this.player, d); this.moving = false; this.check();
      if (nx === this.p.goal[0] && ny === this.p.goal[1]) this.win();
    } });
  }
  check() {
    if (!this.on) return;
    if (this.guards.some(g => this.seen(g).some(([x, y]) => x === this.px && y === this.py) || (g.x === this.px && g.y === this.py))) {
      this.on = false; this.caught++;
      HG.Sound.sfx('encounter'); this.cameras.main.shake(250, 0.012);
      this.time.delayedCall(300, async () => {
        await this.dlg.say('앗, 들켰다! 처음부터 다시 몰래 가 보자.');
        this.px = this.p.start[0]; this.py = this.p.start[1]; this.place();
        this.on = true;
      });
    }
  }
  async win() {
    this.on = false;
    HG.Sound.play('victory');
    HG.state.party.forEach(m => HG.gainExp(m, this.p.exp));
    const stars = this.caught === 0 ? '★★★' : this.caught <= 2 ? '★★☆' : '★☆☆';
    await this.dlg.say(...this.p.outro.map((l, i) => i === 0 ? `${l}  ${stars}` : l), `동료들이 경험치를 ${this.p.exp}씩 얻었다!`);
    HG.Sound.stop(); this.cameras.main.fadeOut(250); await HG.UI.wait(this, 260); HG.Save.save();
    const cb = this.onEnd; this.onEnd = null; if (cb) cb('win');
  }
};
