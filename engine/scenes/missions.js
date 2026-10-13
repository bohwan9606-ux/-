// 지도·바다 미니게임: 거점 지키기(방어), 바닷길 항해
(function () {
  const P = HG.KMap.P;
  const { big, countdown, finish } = HG.Mini;
  // ─────────────────────────────────────────────
  // ② 낙동강 방어선 지키기
  // ─────────────────────────────────────────────
  // p: { mapKey, view, posts:[[이름,경도,위도]], time, hud, intro:[], done, outro:[], river:[[경,위]...], riverName,
  //      places:[[이름,경도,위도]], spawn:'top'|'edges', exp }  기본값은 낙동강 방어선
  HG.DEFENSE_DEFAULT = {
    mapKey: 'kmap_se', view: 'se', time: 35, hud: '국제 연합군 도착까지', done: '방어선을 지켰다!', spawn: 'top', exp: 0,
    posts: [['마산', 128.57, 35.21], ['왜관', 128.40, 35.99], ['영천', 128.94, 35.97], ['포항', 129.36, 36.03]],
    river: [[128.42, 35.12], [128.45, 35.6], [128.38, 36.0], [128.5, 36.35]], riverName: '낙동강',
    places: [['부산', 129.07, 35.18]],
    intro: ['할아버지: 국군은 낙동강까지 밀려났지만, 이곳에서 끝까지 버텼단다.', '전쟁의 혼란을 틈타 「시간 괴물」들이 몰려오고 있어! 거점을 골라 스페이스로 막아 내자.', '국제 연합군이 도착할 때까지 35초만 버티면 돼!'],
    outro: ['국제 연합군이 도착했다!', '국군과 국제 연합군은 낙동강 방어선을 지켜 내고 반격을 준비했다.']
  };
  HG.DefenseScene = class extends Phaser.Scene {
    constructor() { super('Defense'); }
    init(d) { this.onEnd = d.onEnd; this.p = Object.assign({}, HG.DEFENSE_DEFAULT, d.p || {}); }
    create() {
      const pp = this.p;
      this.keys = new HG.Keys(this); this.dlg = new HG.UI.Dialog(this, this.keys);
      const v = HG.KMap.build(this, pp.mapKey, pp.view, HG.W, HG.H);
      this.add.image(0, 0, pp.mapKey).setOrigin(0).setDepth(-10);
      if (pp.river) {
        const g = this.add.graphics().setDepth(1);
        g.lineStyle(3, 0x3a6aa8).beginPath();
        pp.river.forEach(([lo, la], i) => { const [x, y] = P(v, lo, la); if (i) g.lineTo(x, y); else g.moveTo(x, y); });
        g.strokePath();
        const mid = pp.river[Math.floor(pp.river.length / 2)];
        const [rx, ry] = P(v, mid[0], mid[1]);
        HG.UI.text(this, rx - 4, ry, pp.riverName, { depth: 2, small: true, color: '#e9e2d0', stroke: '#24487a' }).setOrigin(1, 0);
      }
      (pp.places || []).forEach(([nm, lo, la]) => {
        const [bx, by] = P(v, lo, la);
        this.add.rectangle(bx, by, 4, 4, 0xe9e2d0).setDepth(2);
        HG.UI.text(this, bx + 4, by - 2, nm, { depth: 2, small: true, color: '#e9e2d0', stroke: '#1a1410' });
      });
      this.posts = pp.posts.map(([nm, lo, la]) => {
        const [x, y] = P(v, lo, la);
        const img = this.add.image(x, y, 'post').setOrigin(0.3, 1).setDepth(10);
        const label = HG.UI.text(this, x, y + 1, nm, { depth: 11, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
        const hearts = [0, 1, 2].map(k => this.add.image(x - 8 + k * 8, y - 22, 'i_heart').setDepth(12));
        return { nm, x, y, hp: 3, img, hearts };
      });
      this.cur = Math.floor(this.posts.length / 2); this.ring = this.add.graphics().setDepth(20);
      this.mons = []; this.spawnT = 0; this.left = pp.time; this.on = false; this.over = false; this.cool = 0;
      this.hud = HG.UI.text(this, HG.W - 6, 4, '', { depth: 900, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(1, 0);
      HG.UI.text(this, HG.W / 2, HG.H - 14, '← → 거점 고르기 · 스페이스 막아 내기', { depth: 900, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
      this.keys.push(a => {
        if (!this.on || this.over) return;
        if (a === 'left') { this.cur = (this.cur + this.posts.length - 1) % this.posts.length; HG.Sound.sfx('cursor'); }
        if (a === 'right') { this.cur = (this.cur + 1) % this.posts.length; HG.Sound.sfx('cursor'); }
        if (a === 'ok') this.pulse();
      });
      this.drawRing(); this.upd(); HG.Sound.play('mission'); this.cameras.main.fadeIn(250);
      this.run();
    }
    upd() { this.hud.setText(this.p.hud + ' ' + Math.ceil(this.left) + '초'); }
    drawRing() { const p = this.posts[this.cur]; this.ring.clear(); this.ring.lineStyle(2, 0xdcbc48).strokeCircle(p.x, p.y - 8, 13); }
    async run() {
      await this.dlg.say(...this.p.intro);
      await countdown(this); this.on = true;
    }
    spawn() {
      const t = HG.pick(this.posts.filter(p => p.hp > 0)) || this.posts[0];
      let x, y;
      if (this.p.spawn === 'edges') {
        const side = HG.rand(0, 2);
        if (side === 0) { x = HG.rand(20, HG.W - 20); y = -10; } else if (side === 1) { x = -10; y = HG.rand(20, HG.H - 40); } else { x = HG.W + 10; y = HG.rand(20, HG.H - 40); }
      } else {
        const fromLeft = t.x < 90 && Math.random() < 0.6;
        x = fromLeft ? -10 : HG.rand(20, HG.W - 20); y = fromLeft ? HG.rand(t.y - 30, t.y + 10) : -10;
      }
      const m = this.add.image(x, y, 'tmon0').setDepth(15);
      m.t = t; m.speed = 26 + (this.p.time - this.left) * 1.1;
      this.mons.push(m);
    }
    pulse() {
      if (this.cool > 0) return;
      this.cool = 0.35;
      const p = this.posts[this.cur];
      HG.Sound.sfx('buff');
      const c = this.add.circle(p.x, p.y - 8, 6).setStrokeStyle(3, 0xe3d49a).setDepth(19);
      this.tweens.add({ targets: c, radius: 34, alpha: 0, duration: 300, onUpdate: () => c.setRadius(c.radius), onComplete: () => c.destroy() });
      this.mons = this.mons.filter(m => {
        if (Math.hypot(m.x - p.x, m.y - (p.y - 8)) < 34) {
          this.tweens.add({ targets: m, alpha: 0, scale: 0.3, y: m.y - 10, duration: 250, onComplete: () => m.destroy() });
          return false;
        }
        return true;
      });
    }
    update(time, delta) {
      if (!this.on || this.over) return;
      const dt = delta / 1000;
      this.left -= dt; this.cool -= dt;
      if (this.left <= 0) { this.left = 0; this.upd(); return this.end(); }
      this.upd(); this.drawRing();
      this.spawnT -= dt; if (this.spawnT <= 0) { this.spawnT = Math.max(0.42, 1.0 - (this.p.time - this.left) * 0.02); this.spawn(); if (this.p.time - this.left > this.p.time * 0.5 && Math.random() < 0.3) this.spawn(); }
      this.mons = this.mons.filter(m => {
        if (!this.on) return false;
        const tx = m.t.x, ty = m.t.y - 8;
        const a = Math.atan2(ty - m.y, tx - m.x);
        m.x += Math.cos(a) * m.speed * dt; m.y += Math.sin(a) * m.speed * dt;
        m.setTexture('tmon' + (Math.floor(time / 250) % 2));
        if (Math.hypot(tx - m.x, ty - m.y) < 6) {
          if (m.t.hp > 0) { m.t.hp--; m.t.hearts[m.t.hp].setVisible(false); HG.Sound.sfx('bump'); this.cameras.main.shake(120, 0.006); }
          m.destroy();
          if (m.t.hp <= 0 && !this.over) this.broken(m.t);
          return false;
        }
        return true;
      });
      if (!this.on) this.mons = [];
    }
    // 거점 하나가 무너지면 처음부터 다시
    async broken(post) {
      if (!this.on) return;
      this.on = false;
      const old = this.mons.slice(); this.time.delayedCall(0, () => old.forEach(m => m.destroy()));
      HG.Sound.sfx('wrong');
      await this.dlg.say(`${post.nm} 방어선이 뚫렸다! 시간 괴물이 몰려들어 왔어.`, '할아버지: 괜찮아, 다시 해 보자! 괴물이 가까이 올 때 그 거점을 골라 스페이스!');
      this.posts.forEach(p => { p.hp = 3; p.hearts.forEach(h => h.setVisible(true)); });
      this.left = this.p.time; this.spawnT = 0; this.upd();
      await countdown(this); this.on = true;
    }
    async end() {
      this.over = true;
      this.mons.forEach(m => this.tweens.add({ targets: m, alpha: 0, duration: 400, onComplete: () => m.destroy() }));
      HG.Sound.play('victory');
      await big(this, this.p.done, 900);
      const left = this.posts.reduce((a, p) => a + p.hp, 0), max = this.posts.length * 3;
      const stars = left >= max * 0.8 ? '★★★' : left >= max * 0.5 ? '★★☆' : '★☆☆';
      const g = this.p.exp ? HG.miniExp(this, this.p.exp) : 0;
      const o = this.p.outro.slice(); o[0] = `${o[0]} 남은 하트 ${left}/${max}  ${stars}`;
      if (this.p.exp) o.push(HG.expMsg(g, this.p.exp));
      await this.dlg.say(...o);
      await finish(this, 'win');
    }
  };

  // ─────────────────────────────────────────────
  // ③ 인천 상륙 작전 (바다 위를 거슬러 올라가기)
  // ─────────────────────────────────────────────
  // p: { from, to, intro:[], tide, done, outro:[], exp }  기본값은 인천 상륙 작전
  HG.LANDING_DEFAULT = {
    from: '부산', to: '인천', done: '인천 도착!', tide: '밀물이 들어왔다! 지금이다!', exp: 0,
    intro: ['할아버지: 1950년 9월 15일, 국군과 국제 연합군은 바다를 돌아 인천에 몰래 내리는 작전을 펼쳤단다.', '인천 앞바다는 물이 빠지면 배가 다니기 어려워서, 밀물 때를 맞춰야 했어. 암초와 소용돌이를 피해 인천으로 가자!'],
    outro: ['무사히 인천에 도착했다! 작전 성공!']
  };
  HG.LandingScene = class extends Phaser.Scene {
    constructor() { super('Landing'); }
    init(d) { this.onEnd = d.onEnd; this.p = Object.assign({}, HG.LANDING_DEFAULT, d.p || {}); }
    create() {
      this.keys = new HG.Keys(this); this.dlg = new HG.UI.Dialog(this, this.keys);
      const key = 'sea_bg';
      if (!this.textures.exists(key)) {
        const { c, ctx } = HG.Pixel.canvas(HG.W, HG.H + 16);
        ctx.fillStyle = HG.PAL.U; ctx.fillRect(0, 0, HG.W, HG.H + 16);
        ctx.fillStyle = HG.PAL.u;
        for (let y = 2; y < HG.H + 16; y += 8) for (let x = (y * 5) % 13; x < HG.W; x += 13) ctx.fillRect(x, y, 4, 1);
        this.textures.addCanvas(key, c);
      }
      this.sea = [0, 1].map(i => this.add.image(0, i * -(HG.H + 16), 'sea_bg').setOrigin(0).setDepth(-10));
      this.ship = this.add.image(160, 150, 'ship').setDepth(50);
      this.obs = []; this.spawnT = 0; this.prog = 0; this.on = false; this.over = false; this.hit = 0; this.slow = 0; this.hp = 3;
      this.hpTxt = HG.UI.text(this, HG.W / 2, 30, '', { depth: 901, small: true, color: '#bf4436', stroke: '#1a1410' }).setOrigin(0.5, 0);
      this.bar = this.add.graphics().setDepth(900);
      HG.UI.text(this, 8, 4, this.p.from, { depth: 901, small: true, color: '#e9e2d0', stroke: '#1a1410' });
      HG.UI.text(this, HG.W - 8, 4, this.p.to, { depth: 901, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(1, 0);
      this.tide = HG.UI.text(this, HG.W / 2, 18, '', { depth: 901, small: true, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
      HG.UI.text(this, HG.W / 2, HG.H - 14, '← → 로 배를 움직여 암초와 소용돌이를 피하자', { depth: 900, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
      this.drawBar(); HG.Sound.play('mission'); this.cameras.main.fadeIn(250);
      this.run();
    }
    drawBar() {
      this.bar.clear(); this.bar.fillStyle(0x1a1410).fillRect(36, 7, 248, 6); this.bar.fillStyle(0xdcbc48).fillRect(37, 8, Math.floor(246 * this.prog), 4);
      this.bar.fillStyle(0xe9e2d0).fillRect(36 + Math.floor(246 * this.prog), 5, 3, 10);
    }
    async run() {
      await this.dlg.say(...this.p.intro);
      await countdown(this); this.on = true;
    }
    update(time, delta) {
      if (!this.on || this.over) return;
      const dt = delta / 1000;
      this.slow -= dt;
      const speed = this.slow > 0 ? 50 : 118;
      this.prog = Math.min(1, this.prog + dt * (this.slow > 0 ? 0.012 : 0.03));
      this.hpTxt.setText('배 ' + '♥'.repeat(this.hp) + '♡'.repeat(3 - this.hp));
      this.drawBar();
      this.tide.setText(this.prog > 0.82 ? (this.p.tide || '') : '');
      this.sea.forEach(s => { s.y += speed * dt; if (s.y >= HG.H + 16) s.y -= 2 * (HG.H + 16); });
      const d = this.keys.held();
      if (d === 'left' || d === 'right') this.ship.x = HG.clamp(this.ship.x + (d === 'left' ? -1 : 1) * 130 * dt, 20, HG.W - 20);
      this.ship.angle = d === 'left' ? -8 : d === 'right' ? 8 : 0;
      this.spawnT -= dt;
      if (this.spawnT <= 0 && this.prog < 0.9) {
        this.spawnT = Math.max(0.3, 0.45 - this.prog * 0.15);
        const o = this.add.image(HG.rand(20, HG.W - 20), -14, Math.random() < 0.6 ? 'reef' : 'whirl').setDepth(40);
        if (o.texture.key === 'whirl') o.vx = HG.pick([-1, 1]) * HG.rand(20, 40);
        this.obs.push(o);
      }
      this.obs = this.obs.filter(o => {
        o.y += speed * dt; if (o.texture.key === 'whirl') { o.angle += 180 * dt; o.x += (o.vx || 0) * dt; if (o.x < 14 || o.x > HG.W - 14) o.vx = -(o.vx || 0); }
        if (this.slow <= 0 && Math.abs(o.x - this.ship.x) < 12 && Math.abs(o.y - this.ship.y) < 16) {
          this.slow = 1.0; this.hit++; this.hp--; HG.Sound.sfx('bighit'); this.cameras.main.shake(200, 0.01);
          this.tweens.add({ targets: this.ship, alpha: 0.4, yoyo: true, repeat: 3, duration: 100 });
          if (this.hp <= 0) this.wreck();
        }
        if (o.y > HG.H + 20) { o.destroy(); return false; }
        return true;
      });
      if (this.prog >= 1) this.end();
    }
    // 세 번 부딪히면 처음부터
    async wreck() {
      if (!this.on) return;
      this.on = false;
      HG.Sound.sfx('wrong');
      await this.dlg.say('배가 세 번이나 부딪혀 크게 부서졌다!', '다시 출발하자. 소용돌이는 옆으로도 움직이니 조심해!');
      this.obs.forEach(o => o.destroy()); this.obs = [];
      this.prog = 0; this.hp = 3; this.slow = 0; this.ship.x = 160; this.ship.setAlpha(1); this.drawBar();
      await countdown(this); this.on = true;
    }
    async end() {
      this.over = true;
      HG.Sound.play('victory');
      await big(this, this.p.done, 900);
      const g = this.p.exp ? HG.miniExp(this, this.p.exp) : 0;
      const o = [(this.hit <= 2 ? '거의 부딪히지 않았다! ' : '조금 부딪혔지만 괜찮아! ') + this.p.outro[0], ...this.p.outro.slice(1)];
      if (this.p.exp) o.push(HG.expMsg(g, this.p.exp));
      await this.dlg.say(...o);
      await finish(this, 'win');
    }
  };

})();
