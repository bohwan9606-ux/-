// ─────────────────────────────────────────────
// 새 미니게임 공통 틀
// 각 미니게임은 HG.MiniGame 을 이어받아 defaults() 와 async play() 만 쓰면 됨.
//   play() 는 성공하면 별('★★★' 등), 실패하면 null 을 돌려줌.
// p 공통: { title, intro:[], outro:[], lose:[], exp, bg, music, help }
// 개발자 모드가 켜져 있으면 F8 = 바로 성공
// ─────────────────────────────────────────────
HG.MiniGame = class extends Phaser.Scene {
  defaults() { return {}; }
  init(d) {
    d = d || {};
    this.onEnd = d.onEnd;
    this.p = Object.assign({ title: '', intro: [], outro: [], lose: ['아쉽다! 다시 도전해 보자.'], exp: 40, bg: 'village', music: 'mission', help: '' }, this.defaults(), d.p || {});
    this.over = false; this._devResolve = null; this.devWon = false; this.playing = false;
  }
  create() {
    const p = this.p;
    this.keys = new HG.Keys(this); this.dlg = new HG.UI.Dialog(this, this.keys);
    if (p.bg) HG.miniBg(this, p.bg);
    this.titleTxt = HG.UI.text(this, HG.W / 2, 3, p.title, { depth: 901, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
    this.helpTxt = HG.UI.text(this, HG.W / 2, HG.H - 13, p.help, { depth: 901, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
    this.hudL = HG.UI.text(this, 5, 3, '', { depth: 901, small: true, color: '#e9e2d0', stroke: '#1a1410' });
    this.hudR = HG.UI.text(this, HG.W - 5, 3, '', { depth: 901, small: true, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(1, 0);
    HG.Sound.play(p.music);
    this.cameras.main.fadeIn(250);
    if (HG.dev.on) HG.UI.text(this, HG.W - 4, HG.H - 24, 'F8 바로 성공', { depth: 901, small: true, color: '#d684aa', stroke: '#1a1410' }).setOrigin(1, 0);
    this.setup && this.setup();
    this.run().catch(e => console.error(e));
  }
  async run() {
    const p = this.p;
    const dev = new Promise(r => { this._devResolve = r; });
    const game = (async () => { if (p.intro.length) await this.dlg.say(...p.intro); this.playing = true; return this.play(); })();
    const stars = await Promise.race([game, dev]);
    if (this.over) return;
    this.over = true;
    this.time.removeAllEvents();
    this.keys.stack = [];
    if (this.devWon) {
      HG.miniExp(this, p.exp);
      await this.end('win');
    } else if (stars) {
      HG.Sound.play('victory');
      const g = HG.miniExp(this, p.exp);
      const out = p.outro.length ? p.outro : ['성공!'];
      await this.dlg.say(...out.map((l, i) => i === 0 ? `${l}  ${stars}` : l), HG.expMsg(g, p.exp));
      await this.end('win');
    } else {
      HG.Sound.sfx('wrong');
      await this.dlg.say(...p.lose);
      await this.end('lose');
    }
  }
  // 개발자: 바로 성공
  devWin() { if (this._devResolve && !this.over) { HG.UI.toast && HG.UI.toast(this, '개발자: 바로 성공'); this.devWon = true; this._devResolve('★★★'); } }
  async end(r) {
    HG.Sound.stop();
    this.cameras.main.fadeOut(250);
    await HG.UI.wait(this, 260);
    HG.Save.save();
    const cb = this.onEnd; this.onEnd = null; if (cb) cb(r);
  }

  // ── 도우미 ──
  flash(text, color, y) {
    const t = HG.UI.text(this, HG.W / 2, y || 60, text, { depth: 950, color: color || '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0).setScale(2);
    return new Promise(r => this.tweens.add({ targets: t, y: (y || 60) - 20, alpha: 0, duration: 700, onComplete: () => { t.destroy(); r(); } }));
  }
  countdown() { return HG.Mini.countdown(this); }
  // 방향키·스페이스 입력을 받는 처리기 등록 (끝나면 off())
  input2(fn) { const h = this.keys.push(a => { if (!this.over) fn(a); }); return () => this.keys.pop(h); }
  // 초시계: 남은 시간을 hudL 에 표시, 0이 되면 onZero
  timer(sec, onZero, label) {
    this.left = sec;
    const ev = this.time.addEvent({ delay: 100, loop: true, callback: () => {
      this.left = Math.max(0, this.left - 0.1);
      this.hudL.setText((label || '남은 시간 ') + Math.ceil(this.left));
      if (this.left <= 0) { ev.remove(); onZero(); }
    } });
    this.hudL.setText((label || '남은 시간 ') + sec);
    return ev;
  }
  stars(miss, a, b) { return miss <= a ? '★★★' : miss <= b ? '★★☆' : '★☆☆'; }
  bell(freq) {
    if (!HG.Sound.on()) return; HG.Sound.resume();
    HG.Sound.tone(freq, 1.4, 'sine', 0.45); HG.Sound.tone(freq * 2.76, 0.6, 'sine', 0.12); HG.Sound.tone(freq * 0.5, 1.8, 'triangle', 0.2);
  }
};

// 새 미니게임 등록소 (개발자 메뉴의 「미니게임 바로 해 보기」에 쓰임)
HG.MINIS = [];
HG.registerMini = (cls) => { const o = new cls(); cls.KEY = o.sys.settings.key; cls.LABEL = o.defaults().name || cls.KEY; HG.MINIS.push(cls); return cls; };
