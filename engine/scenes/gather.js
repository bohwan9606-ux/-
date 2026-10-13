// 줍기 장면 — 돌아다니며 좋은 것은 줍고 나쁜 것은 피하기. dig 표시가 있는 것은 스페이스 연타로 캐기
// p: { bg, need, time, intro:[], help, unit, items:[{tex, label, n, w, bad, dig, digTex}], win:[], lose:[], reward:{item,n}, exp, music, done }
// 기본값은 구석기 채집
HG.GATHER_DEFAULT = {
  bg: 'forest', need: 8, time: 35, unit: '먹을거리', music: 'field', exp: 30, done: '채집 성공!',
  help: '방향키 이동 · 뿌리 앞에서 스페이스 연타로 캐기',
  intro: ['채집하는 사람: 숲에서 먹을 것을 8개 모아 오렴. 열매, 도토리, 먹는 버섯을 주우면 돼.',
    '빨간 바탕에 흰 점이 있는 버섯은 독버섯이야! 절대 줍지 마.',
    '잎만 삐죽 나온 곳은 뿌리야. 그 앞에서 스페이스를 여러 번 누르면 캘 수 있어. (2개로 쳐 줄게)'],
  items: [
    { tex: 'g_berry', label: '열매', n: 1, w: 30 }, { tex: 'g_acorn', label: '도토리', n: 1, w: 20 },
    { tex: 'g_mush', label: '버섯', n: 1, w: 15 }, { tex: 'g_poison', label: '독버섯!', n: -1, w: 17, bad: true },
    { tex: 'g_root', label: '뿌리를 캤다!', n: 2, w: 18, dig: true, digTex: 'g_rootout' }
  ],
  win: ['먹을거리를 넉넉히 모았다! 열매 3개를 나눠 받았다.'],
  lose: ['조금 모자라! 채집하는 사람: 괜찮아, 다시 해 보자!'],
  reward: { item: 'berry', n: 3 }
};

HG.GatherScene = class extends Phaser.Scene {
  constructor() { super('Gather'); }
  init(data) { this.onEnd = data.onEnd; this.p = Object.assign({}, HG.GATHER_DEFAULT, data.p || {}); this.p.time = Math.round(this.p.time * 0.85); }

  create() {
    const p = this.p;
    this.keys = new HG.Keys(this);
    this.dlg = new HG.UI.Dialog(this, this.keys);
    HG.miniBg(this, p.bg);
    this.need = p.need; this.got = 0; this.timeLeft = p.time; this.started = false; this.over = false; this.stun = 0;
    this.items = []; this.spawnT = 0;
    this.player = this.add.sprite(160, 120, HG.heroKey(), 0).setOrigin(0.5, 1);
    this.pdir = 'down';
    this.hudTxt = HG.UI.text(this, 6, 4, '', { depth: 901, color: '#e9e2d0', stroke: '#1a1410' });
    this.cntTxt = HG.UI.text(this, HG.W - 6, 4, '', { depth: 901, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(1, 0);
    HG.UI.text(this, HG.W / 2, HG.H - 14, p.help, { depth: 901, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
    this.updateHud();
    this.keys.push(act => { if (act === 'ok' && this.started && !this.over) this.dig(); });
    HG.Sound.play(p.music);
    this.cameras.main.fadeIn(250);
    this.intro();
  }

  async intro() {
    await this.dlg.say(...this.p.intro);
    for (const n of ['3', '2', '1']) { await this.bigText(n, 450); HG.Sound.sfx('cursor'); }
    HG.Sound.sfx('select'); this.bigText('시작!', 500);
    this.started = true;
    for (let i = 0; i < 4; i++) this.spawn();
  }

  bigText(s, ms) {
    return new Promise(r => {
      const t = HG.UI.text(this, HG.W / 2, 70, s, { depth: 950, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0).setScale(2);
      this.tweens.add({ targets: t, scale: 3, alpha: 0, duration: ms, onComplete: () => { t.destroy(); r(); } });
    });
  }
  updateHud() {
    this.hudTxt.setText('남은 시간 ' + Math.ceil(this.timeLeft));
    this.cntTxt.setText(this.p.unit + ' ' + this.got + ' / ' + this.need);
  }

  spawn() {
    if (this.items.length >= 7) return;
    const list = this.p.items;
    let r = Math.random() * list.reduce((a, it) => a + (it.w || 10), 0);
    let def = list[0];
    for (const it of list) { if ((r -= (it.w || 10)) < 0) { def = it; break; } }
    let x, y, tries = 0;
    do { x = HG.rand(36, HG.W - 36); y = HG.rand(36, HG.H - 36); tries++; }
    while (tries < 20 && (Math.hypot(x - this.player.x, y - this.player.y) < 30 || this.items.some(it => Math.hypot(it.x - x, it.y - y) < 22)));
    const img = this.add.image(x, y, def.tex).setDepth(y);
    img.def = def; img.digs = 0; img.life = def.bad ? 10 : 7;
    if (def.bad) { const a = Math.random() * Math.PI * 2; img.vx = Math.cos(a) * 22; img.vy = Math.sin(a) * 22; }
    img.setScale(0); this.tweens.add({ targets: img, scale: 1, duration: 200, ease: 'Back.out' });
    this.items.push(img);
  }

  dig() {
    const near = this.items.find(it => it.def.dig && Math.hypot(it.x - this.player.x, it.y - (this.player.y - 6)) < 18);
    if (!near) return;
    near.digs++;
    HG.Sound.sfx('hit');
    this.tweens.add({ targets: near, x: near.x + 1, yoyo: true, duration: 40 });
    for (let i = 0; i < 3; i++) {
      const d = this.add.rectangle(near.x, near.y + 4, 2, 2, 0x5e4229).setDepth(500);
      this.tweens.add({ targets: d, x: d.x + HG.rand(-10, 10), y: d.y - HG.rand(4, 10), alpha: 0, duration: 300, onComplete: () => d.destroy() });
    }
    if (near.digs >= 4) { if (near.def.digTex) near.setTexture(near.def.digTex); this.collect(near, near.def.n, near.def.label + ' +' + near.def.n); }
  }

  collect(it, n, label) {
    this.items = this.items.filter(o => o !== it);
    this.got = Math.max(0, this.got + n);
    const t = HG.UI.text(this, it.x, it.y - 16, label, { depth: 990, small: true, color: n > 0 ? '#e3d49a' : '#bf4436', stroke: '#1a1410' }).setOrigin(0.5, 0);
    this.tweens.add({ targets: t, y: t.y - 10, alpha: 0, duration: 800, onComplete: () => t.destroy() });
    this.tweens.add({ targets: it, y: it.y - 10, alpha: 0, duration: 300, onComplete: () => it.destroy() });
    this.updateHud();
    if (this.got >= this.need) this.end(true);
  }

  update(time, delta) {
    if (!this.started || this.over) return;
    const dt = delta / 1000;
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.updateHud(); this.end(false); return; }
    this.updateHud();
    this.spawnT -= dt;
    if (this.spawnT <= 0) { this.spawnT = 0.75; this.spawn(); }
    this.items.forEach(it => { if (!it.vx) return; it.x += it.vx * dt; it.y += it.vy * dt; if (it.x < 30 || it.x > HG.W - 30) it.vx *= -1; if (it.y < 30 || it.y > HG.H - 30) it.vy *= -1; it.setDepth(it.y); });
    this.items.slice().forEach(it => { it.life -= dt; if (it.life <= 0) { this.items = this.items.filter(o => o !== it); this.tweens.add({ targets: it, alpha: 0, duration: 300, onComplete: () => it.destroy() }); } });

    if (this.stun > 0) { this.stun -= dt; this.player.setAlpha(Math.floor(time / 80) % 2 ? 0.4 : 1); return; }
    this.player.setAlpha(1);
    const d = this.keys.held();
    if (d) {
      const [dx, dy] = HG.DIRS[d]; this.pdir = d;
      this.player.x = HG.clamp(this.player.x + dx * 85 * dt, 24, HG.W - 24);
      this.player.y = HG.clamp(this.player.y + dy * 85 * dt, 34, HG.H - 20);
      HG.setFace(this.player, d, Math.floor(time / 150) % 2 === 0, Math.floor(time / 300) % 2 === 0);
    } else HG.setFace(this.player, this.pdir);
    this.player.setDepth(this.player.y);
    for (const it of this.items.slice()) {
      if (it.def.dig) continue;
      if (Math.abs(it.x - this.player.x) < 10 && Math.abs(it.y - (this.player.y - 6)) < 10) {
        if (it.def.bad) {
          HG.Sound.sfx('wrong'); this.stun = 1.3; this.cameras.main.shake(200, 0.01);
          this.collect(it, it.def.n, it.def.label + ' ' + it.def.n);
        } else { HG.Sound.sfx('item'); this.collect(it, it.def.n, it.def.label + ' +' + it.def.n); }
      }
    }
  }

  async end(success) {
    if (this.over) return;
    this.over = true;
    const s = HG.state, p = this.p;
    this.items.forEach(it => it.destroy()); this.items = [];
    if (success) {
      HG.Sound.play('victory');
      await this.bigText(p.done, 800);
      if (p.reward) s.bag[p.reward.item] = (s.bag[p.reward.item] || 0) + p.reward.n;
      const g = HG.miniExp(this, p.exp);
      await this.dlg.say(...p.win, HG.expMsg(g, p.exp));
      this.result = 'win';
    } else {
      HG.Sound.stop();
      await this.bigText('시간 끝!', 800);
      await this.dlg.say(`${p.unit} ${this.got}개를 모았다.`, ...p.lose);
      this.result = 'lose';
    }
    HG.Sound.stop();
    this.cameras.main.fadeOut(250);
    await HG.UI.wait(this, 260);
    HG.Save.save();
    const cb = this.onEnd; this.onEnd = null; if (cb) cb(this.result);
  }
};
