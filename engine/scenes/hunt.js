// 사냥 장면 — 방향키로 움직이며 창을 던져 매머드 잡기 (여럿이 힘을 모아야 잡을 수 있음)
HG.HuntScene = class extends Phaser.Scene {
  constructor() { super('Hunt'); }
  init(data) { this.onEnd = data.onEnd; }

  create() {
    this.keys = new HG.Keys(this);
    this.buildBg();
    this.need = 5; this.hits = 0; this.timeLeft = 38; this.over = false; this.started = false;
    this.cool = 0; this.stun = 0;

    this.player = this.add.sprite(160, 150, HG.heroKey(), 0);
    this.pdir = 'up'; HG.setFace(this.player, 'up');
    this.mam = this.add.sprite(160, 80, 'mammoth0').setDepth(80);
    this.mam.state = 'wander'; this.mam.vx = 20; this.mam.vy = 10; this.mam.t = 0; this.mam.nextCharge = 6;
    this.hunters = [[24, 60, 'right'], [296, 60, 'left'], [24, 140, 'right'], [296, 140, 'left']].map(([x, y, d]) => {
      const h = this.add.sprite(x, y, 'npc_hunter', 0); HG.setFace(h, d); h.setDepth(y); return h;
    });
    this.spears = [];

    // 위쪽 정보
    this.hud = this.add.graphics().setDepth(900);
    this.hudTxt = HG.UI.text(this, 6, 4, '', { depth: 901, color: '#e9e2d0', stroke: '#1a1410' });
    this.hitTxt = HG.UI.text(this, HG.W - 6, 4, '', { depth: 901, color: '#fff4a8', stroke: '#1a1410' }); this.hitTxt.setOrigin(1, 0);
    this.help = HG.UI.text(this, HG.W / 2, HG.H - 14, '방향키 이동 · 스페이스 창 던지기', { depth: 901, small: true, color: '#e9e2d0', stroke: '#1a1410' }); this.help.setOrigin(0.5, 0);
    this.updateHud();

    this.dlg = new HG.UI.Dialog(this, this.keys);
    this.keys.push(act => { if (act === 'ok' && this.started && !this.over) this.throwSpear(); });
    HG.Sound.play('hunt');
    this.cameras.main.fadeIn(250);
    this.intro();
  }

  buildBg() {
    const key = 'hunt_bg';
    if (!this.textures.exists(key)) {
      const { c, ctx } = HG.Pixel.canvas(HG.W, HG.H);
      for (let y = 0; y < 12; y++) for (let x = 0; x < 20; x++) {
        let t = 't_grass';
        if (y === 0 || x === 0 || x === 19) t = 't_tree';
        else if ((x * 7 + y * 13) % 17 === 0) t = 't_grass2';
        ctx.drawImage(this.textures.get(t).getSourceImage(), x * 16, y * 16);
      }
      this.textures.addCanvas(key, c);
    }
    this.add.image(0, 0, key).setOrigin(0).setDepth(-10);
  }

  async intro() {
    await this.dlg.say('사냥꾼 대장: 저기 매머드다! 덩치가 커서 혼자서는 절대 못 잡아.',
      '우리가 사방에서 몰아 줄 테니, 창을 던져서 5번 맞혀라! 시간은 38초다.',
      '매머드가 몸을 떨면 달려든다는 신호야. 재빨리 피해!');
    for (const n of ['3', '2', '1']) { await this.bigText(n, 500); HG.Sound.sfx('cursor'); }
    HG.Sound.sfx('select'); this.bigText('시작!', 600);
    this.started = true;
  }

  bigText(s, ms) {
    return new Promise(r => {
      const t = HG.UI.text(this, HG.W / 2, 70, s, { depth: 950, color: '#fff4a8', stroke: '#1a1410' }).setOrigin(0.5, 0).setScale(2);
      this.tweens.add({ targets: t, scale: 3, alpha: 0, duration: ms, onComplete: () => { t.destroy(); r(); } });
    });
  }

  updateHud() {
    this.hudTxt.setText('남은 시간 ' + Math.ceil(this.timeLeft));
    this.hitTxt.setText('맞힌 수 ' + '●'.repeat(this.hits) + '○'.repeat(Math.max(0, this.need - this.hits)));
  }

  throwSpear() {
    if (this.cool > 0 || this.stun > 0) return;
    this.cool = 0.6;
    HG.Sound.sfx('throw');
    const [dx, dy] = HG.DIRS[this.pdir];
    const s = this.add.image(this.player.x, this.player.y, 'thrown').setDepth(500);
    s.rotation = Math.atan2(dy, dx);
    s.vx = dx * 230; s.vy = dy * 230; s.life = 0.6;
    this.spears.push(s);
  }

  update(time, delta) {
    if (!this.started || this.over) return;
    const dt = delta / 1000;
    this.timeLeft -= dt; this.cool -= dt;
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.updateHud(); this.end(false); return; }
    this.updateHud();

    // 주인공
    if (this.stun > 0) { this.stun -= dt; this.player.setAlpha(Math.floor(time / 80) % 2 ? 0.4 : 1); }
    else {
      this.player.setAlpha(1);
      const d = this.keys.held();
      if (d) {
        const [dx, dy] = HG.DIRS[d];
        this.pdir = d;
        this.player.x = HG.clamp(this.player.x + dx * 80 * dt, 26, HG.W - 26);
        this.player.y = HG.clamp(this.player.y + dy * 80 * dt, 26, HG.H - 20);
        HG.setFace(this.player, d, Math.floor(time / 150) % 2 === 0, Math.floor(time / 300) % 2 === 0);
      } else HG.setFace(this.player, this.pdir);
    }
    this.player.setDepth(this.player.y);

    // 매머드
    const m = this.mam;
    m.t += dt;
    m.inv = (m.inv || 0) - dt;
    m.setAlpha(m.inv > 0 ? (Math.floor(time / 70) % 2 ? 0.4 : 1) : 1);
    if (m.state === 'wander') {
      if (m.t > 0.9) { m.t = 0; const a = Math.random() * Math.PI * 2; m.vx = Math.cos(a) * 45; m.vy = Math.sin(a) * 32; }
      m.nextCharge -= dt;
      if (m.nextCharge <= 0) { m.state = 'warn'; m.t = 0; m.vx = 0; m.vy = 0; HG.Sound.sfx('stomp'); this.bang = this.add.image(m.x, m.y - 22, 'bang').setDepth(999); }
    } else if (m.state === 'warn') {
      m.x += Math.sin(time / 20) * 0.8;
      if (m.t > 0.7) {
        if (this.bang) { this.bang.destroy(); this.bang = null; }
        const a = Math.atan2(this.player.y - m.y, this.player.x - m.x);
        m.vx = Math.cos(a) * 140; m.vy = Math.sin(a) * 140; m.state = 'charge'; m.t = 0;
      }
    } else if (m.state === 'charge') {
      if (m.t > 0.9) { m.state = 'wander'; m.t = 0; m.nextCharge = 4 + Math.random() * 3; }
    } else if (m.state === 'flee') {
      if (m.t > 0.9) { m.state = 'wander'; m.t = 0; }
    }
    m.x += m.vx * dt; m.y += m.vy * dt;
    // 사냥꾼들이 막아서 안쪽으로 되돌림
    if (m.x < 50 || m.x > HG.W - 50) { m.vx = -m.vx; m.x = HG.clamp(m.x, 50, HG.W - 50); this.shout(m.x < 160 ? 0 : 1); }
    if (m.y < 44 || m.y > HG.H - 30) { m.vy = -m.vy; m.y = HG.clamp(m.y, 44, HG.H - 30); }
    if (Math.abs(m.vx) > 1) m.setFlipX(m.vx < 0);
    m.setTexture('mammoth' + (Math.floor(time / (m.state === 'charge' ? 90 : 220)) % 2));
    m.setDepth(m.y + 8);

    // 매머드와 부딪힘
    if (this.stun <= 0 && m.state === 'charge' && Math.abs(m.x - this.player.x) < 20 && Math.abs(m.y - this.player.y) < 16) {
      this.stun = 1.2; HG.Sound.sfx('bighit'); this.cameras.main.shake(250, 0.015);
      const a = Math.atan2(this.player.y - m.y, this.player.x - m.x);
      this.player.x = HG.clamp(this.player.x + Math.cos(a) * 24, 26, HG.W - 26);
      this.player.y = HG.clamp(this.player.y + Math.sin(a) * 24, 26, HG.H - 20);
    }

    // 창
    this.spears = this.spears.filter(s => {
      s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
      if (m.inv <= 0 && Math.abs(s.x - m.x) < 18 && Math.abs(s.y - (m.y + 2)) < 13) {
        s.destroy(); this.onHit(); return false;
      }
      if (s.life <= 0) { s.destroy(); return false; }
      return true;
    });
  }

  shout(i) {
    if (this._shoutAt && this.time.now - this._shoutAt < 1500) return;
    this._shoutAt = this.time.now;
    const h = this.hunters[i * 2 + (Math.random() < 0.5 ? 0 : 1)];
    const t = HG.UI.text(this, h.x, h.y - 22, HG.pick(['몰아라!', '이쪽은 막았다!', '우워어!', '지금이야!']), { depth: 990, small: true, color: '#1a1410' }).setOrigin(0.5, 0);
    t.setBackgroundColor('#e9e2d0');
    this.tweens.add({ targets: t, y: t.y - 6, alpha: 0, delay: 600, duration: 400, onComplete: () => t.destroy() });
  }

  onHit() {
    const m = this.mam;
    this.hits++;
    HG.Sound.sfx('hit');
    m.setTint(0xff8080); this.time.delayedCall(150, () => m.clearTint());
    const a = Math.atan2(m.y - this.player.y, m.x - this.player.x);
    m.vx = Math.cos(a) * 115; m.vy = Math.sin(a) * 85; m.state = 'flee'; m.t = 0; m.inv = 1.3;
    if (this.bang) { this.bang.destroy(); this.bang = null; }
    this.updateHud();
    if (this.hits >= this.need) this.end(true);
  }

  async end(success) {
    this.over = true;
    this.spears.forEach(s => s.destroy()); this.spears = [];
    const s = HG.state;
    s.stats.hunts++;
    if (success) {
      HG.Sound.play('victory');
      this.tweens.add({ targets: this.mam, angle: 90, alpha: 0.5, duration: 500 });
      await this.bigText('사냥 성공!', 900);
      const meat = 3;
      s.bag.meat = (s.bag.meat || 0) + meat;
      s.flags.huntWin = (s.flags.huntWin || 0) + 1;
      const lines = [`모두 힘을 합쳐 매머드를 잡았다! 고기 ${meat}개를 나눠 받았다.`];
      const ups = [];
      const lv0 = s.party.map(m => m.level);
      const g = HG.miniExp(this, 40);
      s.party.forEach((m, i) => { if (m.level > lv0[i]) ups.push(`${HG.monName(m)} Lv${m.level}`); });
      if (s.party.length) lines.push(HG.expMsg(g, 40));
      if (ups.length) { HG.Sound.sfx('levelup'); lines.push('레벨 업! ' + ups.join(', ')); }
      await this.dlg.say(...lines);
      this.result = 'win';
    } else {
      HG.Sound.stop();
      this.tweens.add({ targets: this.mam, x: this.mam.x > 160 ? 400 : -80, duration: 900 });
      await this.bigText('시간 끝!', 900);
      const lines = ['매머드가 숲으로 도망쳤다…'];
      if (this.hits >= 2) { s.bag.meat = (s.bag.meat || 0) + 1; lines.push('그래도 사냥꾼들이 작은 짐승을 잡아 고기 1개를 나눠 주었다.'); }
      lines.push('사냥꾼 대장: 괜찮아, 다음엔 꼭 잡자!');
      await this.dlg.say(...lines);
      this.result = 'lose';
    }
    HG.Sound.stop();
    this.cameras.main.fadeOut(250);
    await HG.UI.wait(this, 260);
    HG.Save.save();
    const cb = this.onEnd; this.onEnd = null; if (cb) cb(this.result);
  }
};
