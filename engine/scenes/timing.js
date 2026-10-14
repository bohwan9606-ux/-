// 타이밍 장면 — 움직이는 바늘이 초록 칸에 왔을 때 스페이스 (청자 굽기, 쇠 두드리기 등)
// mode 'mash' 는 연타 힘겨루기 (씨름 등)
// p: { mode, title, intro:[], rounds, art, artFrames, icon, act, speed, zone, outro:[], exp, bg, music,
//      npc, foeName, mashTime }
HG.TimingScene = class extends Phaser.Scene {
  constructor() { super('Timing'); }
  init(d) {
    this.onEnd = d.onEnd;
    this.p = Object.assign({ mode: 'timing', title: '타이밍', rounds: 4, speed: 1.2, zone: 34, exp: 30, bg: 'village', music: 'mission', intro: [], outro: [], act: '스페이스!' }, d.p || {});
  }
  create() {
    this.events.once("shutdown", () => { if (HG.Touch) HG.Touch.mashOff(); });
    const p = this.p;
    this.keys = new HG.Keys(this); this.dlg = new HG.UI.Dialog(this, this.keys);
    HG.miniBg(this, p.bg);
    this.title = HG.UI.text(this, HG.W / 2, 4, p.title, { depth: 901, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
    HG.Sound.play(p.music);
    this.cameras.main.fadeIn(250);
    (p.mode === 'mash' ? this.runMash() : this.runTiming()).catch(e => console.error(e));
  }

  async runTiming() {
    const p = this.p;
    if (p.art) this.art = this.add.image(160, 96, p.art + '0').setOrigin(0.5, 1).setScale(2).setDepth(10);
    else if (p.icon) this.art = this.add.image(160, 70, p.icon).setScale(3).setDepth(10);
    if (p.npc) this.add.sprite(70, 100, p.npc, 4).setOrigin(0.5, 1).setScale(2).setDepth(11);
    this.add.sprite(250, 100, HG.heroKey(), 4).setOrigin(0.5, 1).setScale(2).setDepth(11).setFlipX(true);
    await this.dlg.say(...p.intro);
    const bx = 60, bw = 200, by = 122;
    const g = this.add.graphics().setDepth(100);
    const prog = HG.UI.text(this, HG.W / 2, 150, '', { depth: 101, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
    HG.UI.text(this, HG.W / 2, HG.H - 14, '바늘이 초록 칸에 오면 스페이스!', { depth: 101, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
    let ok = 0, miss = 0;
    while (ok < p.rounds) {
      // 난이도 낮춤(약 10 → 6): 초록 칸 넓게, 라운드마다 덜 좁아짐
      const zw = Math.max(16, Math.round(p.zone * 0.95) - ok * 2);
      const zx = bx + HG.rand(20, bw - zw - 20);
      prog.setText(`${p.act}  ${ok} / ${p.rounds}`);
      const hit = await new Promise(res => {
        let t = 0, dir = 1, x = bx; const sp = (p.speed * 0.95 + ok * 0.12) * bw;   // 바늘 속도 느리게
        const draw = () => {
          g.clear();
          g.fillStyle(0x1a1410).fillRect(bx - 2, by - 2, bw + 4, 14);
          g.fillStyle(0x7d776c).fillRect(bx, by, bw, 10);
          g.fillStyle(0x6fa04a).fillRect(zx, by, zw, 10);
          g.fillStyle(0xdcbc48).fillRect(zx + zw / 2 - 2, by, 4, 10);
          g.fillStyle(0xe9e2d0).fillRect(Math.round(x) - 1, by - 4, 3, 18);
        };
        const ev = this.time.addEvent({ delay: 16, loop: true, callback: () => {
          x += dir * sp * 0.016; if (x > bx + bw) { x = bx + bw; dir = -1; } if (x < bx) { x = bx; dir = 1; } draw();
        } });
        const openedAt = Date.now();
        const h = this.keys.push(a => {
          if (a !== 'ok' || Date.now() - openedAt < 250) return;
          this.keys.pop(h); ev.remove();
          res(x >= zx && x <= zx + zw ? (Math.abs(x - (zx + zw / 2)) < 4 ? 2 : 1) : 0);
        });
        draw();
      });
      if (hit) {
        ok++; HG.Sound.sfx(hit === 2 ? 'levelup' : 'correct');
        this.flash(hit === 2 ? '아주 좋아!' : '좋아!', '#e3d49a');
        if (this.art && p.art) this.art.setTexture(p.art + Math.min(ok, (p.artFrames || p.rounds)));
        if (this.art) this.tweens.add({ targets: this.art, scaleY: this.art.scaleY * 1.08, yoyo: true, duration: 100 });
      } else {
        miss++; HG.Sound.sfx('wrong'); this.cameras.main.shake(120, 0.006); this.flash('앗, 빗나갔다!', '#bf4436');
        if (miss >= 6) { await HG.UI.wait(this, 450); await this.dlg.say('여섯 번이나 빗나갔다! 처음부터 다시 해 보자.'); ok = 0; miss = 0; if (this.art && p.art) this.art.setTexture(p.art + '0'); continue; }
      }
      await HG.UI.wait(this, 450);
    }
    g.clear(); prog.setText('');
    await this.finishWin(miss <= 1 ? '★★★' : miss <= 3 ? '★★☆' : '★☆☆');
  }

  async runMash() {
    const p = this.p;
    const me = this.add.sprite(140, 110, HG.heroKey(), 4).setOrigin(0.5, 1).setScale(3).setDepth(11);
    const foe = this.add.sprite(180, 110, p.npc || 'p_farmer', 4).setOrigin(0.5, 1).setScale(3).setDepth(11).setFlipX(true);
    await this.dlg.say(...p.intro);
    const g = this.add.graphics().setDepth(100);
    const tl = HG.UI.text(this, HG.W / 2, 148, '', { depth: 101, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
    HG.UI.text(this, HG.W / 2, HG.H - 14, HG.Touch && HG.Touch.on ? '화면 아무 곳이나 빠르게 톡톡!' : '스페이스를 빠르게 연타!', { depth: 101, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
    let wins = 0, round = 0;
    while (wins < 2 && round < 3) {
      round++;
      await this.flash(`${round}판!`, '#e3d49a', true);
      const r = await new Promise(res => {
        let v = 0.5, left = p.mashTime || 10;
        const cpu = 0.10 + round * 0.015;   // 상대 힘 약하게 (난이도 약 10 → 6)
        const draw = () => {
          g.clear();
          g.fillStyle(0x1a1410).fillRect(58, 126, 204, 14);
          g.fillStyle(0xbf4436).fillRect(60, 128, 200, 10);
          g.fillStyle(0x3a6aa8).fillRect(60, 128, Math.round(200 * v), 10);
          g.fillStyle(0xe9e2d0).fillRect(159, 124, 2, 18);
          me.x = 120 + v * 40; foe.x = me.x + 36;
          tl.setText(Math.ceil(left) + '초');
        };
        const ev = this.time.addEvent({ delay: 16, loop: true, callback: () => {
          left -= 0.016; v -= cpu * 0.016; draw();
          if (v <= 0 || v >= 1 || left <= 0) { ev.remove(); this.keys.pop(h); if (HG.Touch) HG.Touch.mashOff(); res(v >= 0.5); }
        } });
        const h = this.keys.push(a => { if (a === 'ok') { v += 0.033; HG.Sound.sfx('talk'); } });
        if (HG.Touch) HG.Touch.mashOn();
      });
      g.clear(); tl.setText('');
      if (r) { wins++; HG.Sound.sfx('correct'); this.tweens.add({ targets: foe, angle: 80, duration: 300, yoyo: true }); await this.flash('이겼다!', '#e3d49a', true); }
      else { HG.Sound.sfx('wrong'); this.tweens.add({ targets: me, angle: -80, duration: 300, yoyo: true }); await this.flash('졌다…', '#bf4436', true); }
    }
    if (wins >= 2) await this.finishWin(round === 2 ? '★★★' : '★★☆');
    else {
      await this.dlg.say(`${p.foeName || '상대'}: 하하, 내가 이겼구나! 다시 도전하렴.`);
      await this.end('lose');
    }
  }

  flash(text, color, wait) {
    const t = HG.UI.text(this, HG.W / 2, 60, text, { depth: 950, color, stroke: '#1a1410' }).setOrigin(0.5, 0).setScale(2);
    const pr = new Promise(r => this.tweens.add({ targets: t, y: 40, alpha: 0, duration: 700, onComplete: () => { t.destroy(); r(); } }));
    return wait ? pr : null;
  }

  async finishWin(stars) {
    const p = this.p;
    HG.Sound.play('victory');
    const g = HG.miniExp(this, p.exp);
    await this.dlg.say(...p.outro.map((l, i) => i === 0 ? `${l}  ${stars}` : l), HG.expMsg(g, p.exp));
    await this.end('win');
  }
  async end(r) {
    HG.Sound.stop();
    this.cameras.main.fadeOut(250);
    await HG.UI.wait(this, 260);
    HG.Save.save();
    const cb = this.onEnd; this.onEnd = null; if (cb) cb(r);
  }
};
