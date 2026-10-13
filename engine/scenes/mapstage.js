// 지도형 스테이지 (거상식) — 한반도 지도 위 거점을 오가며 미션을 하고, 마지막에 스승을 만남
// 스테이지 정의(type:'map'): { labels:[[글,경,위,색]], banners:[[나라,경,위,색]], nodes:[...], boss:{...}, tm:[경,위], intro:[], music }
// 거점: { id, name, lon, lat, who, desc, story:[], mission:{scene, p} 또는 talk: async ev=>'win', reward:{mon:[종류,레벨], item:[키,개수], text}, after:[] }
HG.MapStageScene = class extends Phaser.Scene {
  constructor() { super('MapStage'); }
  create() {
    const s = HG.state;
    this.goalTxt = null; this.who = null; this._ev = null; this.busy = false;
    this.st = HG.stages[s.era];
    const st = this.st;
    this.keys = new HG.Keys(this);
    this.busy = true;
    this.add.rectangle(0, 0, HG.W, HG.H, 0x12100e).setOrigin(0).setDepth(-20);
    this.v = HG.KMap.build(this, 'kmap_full', 'full', 140, HG.H);
    this.add.image(0, 0, 'kmap_full').setOrigin(0).setDepth(-10);
    const P = HG.KMap.P;
    (st.banners || []).forEach(([nm, lo, la, col]) => {
      const [x, y] = P(this.v, lo, la);
      this.add.circle(x, y, 13, col, 0.28).setDepth(-5);
      HG.UI.text(this, x, y - 6, nm, { depth: 3, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
    });
    (st.labels || []).forEach(([t, lo, la, col]) => {
      const [x, y] = P(this.v, lo, la);
      HG.UI.text(this, x, y, t, { depth: 3, small: true, color: col || '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
    });
    // 거점들
    this.nodes = st.nodes.map(n => Object.assign({ kind: 'node' }, n));
    this.nodes.push(Object.assign({ kind: 'boss' }, st.boss));
    this.nodes.push({ kind: 'tm', id: 'tm', name: '타임머신', lon: st.tm[0], lat: st.tm[1], desc: '동료 회복 · 박물관 · 저장 · 다음 시대' });
    this.nodes.forEach(n => {
      const [x, y] = P(this.v, n.lon, n.lat); n.x = x; n.y = y;
      n.img = this.add.image(x, y, 'node').setOrigin(0.25, 1).setDepth(10);
      n.lbl = HG.UI.text(this, x, y, n.name, { depth: 30, small: true, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 1).setVisible(false);
    });
    this.refreshIcons();
    // 주인공
    const at = this.nodes.find(n => n.id === s.flags[s.era + '_at']) || this.nodes.find(n => n.kind === 'tm');
    this.cur = at;
    this.hero = this.add.sprite(at.x, at.y - 2, HG.heroKey(), 0).setOrigin(0.5, 1).setDepth(20);
    this.ring = this.add.graphics().setDepth(9);
    // 오른쪽 상자
    HG.UI.box(this, 142, 4, 174, 172, 100);
    this.head = HG.UI.text(this, 229, 10, '', { depth: 101, color: '#7d2a22' }).setOrigin(0.5, 0);
    this.panel = HG.UI.text(this, 151, 30, '', { depth: 101, wrap: 158, lineSpacing: 5 });
    this.arrow = HG.UI.text(this, 302, 160, '▼', { depth: 101, small: true }).setVisible(false);
    this.tweens.add({ targets: this.arrow, y: 162, yoyo: true, repeat: -1, duration: 300 });
    this.goalTxt = HG.UI.text(this, 3, 3, '', { depth: 300, small: true, color: '#e3d49a', stroke: '#1a1410' });
    this.help = HG.UI.text(this, 70, HG.H - 12, '방향키 이동 · 스페이스 들어가기 · Esc 메뉴', { depth: 300, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
    this.keys.push(a => {
      if (this.busy) return;
      if (HG.DIRS[a]) this.moveDir(a);
      else if (a === 'ok') this.enter();
      else if (a === 'menu') this.openMenu();
    });
    this.events.on('resume', () => { this.keys.down = {}; HG.Sound.play(this.st.music || 'war'); });
    HG.Sound.play(st.music || 'war');
    this.cameras.main.fadeIn(350);
    this.start();
  }

  doneCount() { return this.st.nodes.filter(n => HG.state.flags[HG.state.era + '_node_' + n.id]).length; }
  isDone(n) { return !!HG.state.flags[HG.state.era + '_node_' + n.id]; }
  cleared() { return HG.state.stamps.includes(HG.state.era); }
  refreshIcons() {
    this.nodes.forEach(n => {
      if (n.kind === 'tm') n.img.setTexture('node_tm').setOrigin(0.5, 0.8);
      else if (n.kind === 'boss') n.img.setTexture(this.cleared() ? 'node_done' : this.doneCount() >= this.st.nodes.length ? 'node_boss' : 'node_lock').setOrigin(0.5, 1);
      else n.img.setTexture(this.isDone(n) ? 'node_done' : 'node');
    });
    const N = this.st.nodes.length, d = this.doneCount();
    this.goalTxt && this.goalTxt.setText(this.cleared() ? '목표: 타임머신으로' : d < N ? `목표: 거점 ${d}/${N}` : '목표: 스승을 만나자');
  }

  async start() {
    const s = HG.state, st = this.st;
    this.showNode();
    if (!s.flags[s.era + '_intro']) {
      this.head.setText(HG.ERAS.find(e => e.id === s.era).name);
      await this.say(...(st.intro || []));
      await HG.Era.showEvolutions(this.ev);
      s.flags[s.era + '_intro'] = true;
      HG.Save.save();
    } else await HG.Era.showEvolutions(this.ev);
    this.showNode();
    this.busy = false;
  }

  status(n) {
    if (n.kind === 'tm') return '';
    if (n.kind === 'boss') return this.cleared() ? '인정받음 ✔' : this.doneCount() >= this.st.nodes.length ? '도전할 수 있어요!' : `잠김 (거점 ${this.doneCount()}/${this.st.nodes.length} 완료 필요)`;
    return this.isDone(n) ? '완료 ✔ (다시 해 볼 수 있어요)' : '도전할 수 있어요!';
  }
  showNode() {
    const n = this.cur;
    this.head.setText(n.name);
    this.panel.setText([n.desc || '', '', this.status(n)].join('\n'));
    this.arrow.setVisible(false);
    this.ring.clear(); this.ring.lineStyle(2, 0xdcbc48).strokeCircle(n.x, n.y - 5, 9);
    // 이름표는 고른 거점만 (작은 지도에서 글자가 겹치지 않게)
    this.nodes.forEach(m => m.lbl.setVisible(m === n));
    const half = n.lbl.width / 2;
    n.lbl.setPosition(HG.clamp(n.x, half + 2, 140 - half), n.y - 16 < 12 ? n.y + 14 : n.y - 16);
    HG.state.flags[HG.state.era + '_at'] = n.id;
  }

  moveDir(dir) {
    const [dx, dy] = HG.DIRS[dir];
    let best = null, bd = 1e9;
    this.nodes.forEach(n => {
      if (n === this.cur) return;
      const vx = n.x - this.cur.x, vy = n.y - this.cur.y, d = Math.hypot(vx, vy);
      const cos = (vx * dx + vy * dy) / (d || 1);
      if (cos < 0.4) return;
      const score = d / (cos + 0.2);
      if (score < bd) { bd = score; best = n; }
    });
    if (!best) { HG.Sound.sfx('bump'); return; }
    this.busy = true;
    HG.Sound.sfx('cursor');
    const face = Math.abs(best.x - this.cur.x) > Math.abs(best.y - this.cur.y) ? (best.x > this.cur.x ? 'right' : 'left') : (best.y > this.cur.y ? 'down' : 'up');
    let t = 0;
    const walk = this.time.addEvent({ delay: 140, loop: true, callback: () => { t++; HG.setFace(this.hero, face, t % 2 === 1, t % 4 === 1); } });
    this.tweens.add({ targets: this.hero, x: best.x, y: best.y - 2, duration: Math.min(700, 120 + Math.hypot(best.x - this.cur.x, best.y - this.cur.y) * 9), onComplete: () => {
      walk.remove(); HG.setFace(this.hero, 'down'); this.cur = best; this.showNode(); this.busy = false;
    } });
  }

  async enter() {
    const n = this.cur, s = HG.state, ev = this.ev;
    this.busy = true;
    try {
      if (n.kind === 'tm') {
        const r = await HG.Era.timeMachine(ev, this.cleared());
        if (r === 'gone') return;
      } else if (n.kind === 'boss') await this.bossNode(n);
      else await this.missionNode(n);
    } catch (e) { console.error(e); }
    this.refreshIcons(); this.showNode();
    HG.Save.save();
    this.busy = false;
  }

  async missionNode(n) {
    const ev = this.ev, s = HG.state;
    const done = this.isDone(n);
    if (n.who) this.showWho(n.who);
    if (done && n.after) await this.say(...n.after);
    else await this.say(...n.story);
    const c = await ev.choose(done ? '한 번 더 해 볼까?' : '도전할까?', [done ? '다시 하기' : '도전한다!', '다음에'], 1);
    this.hideWho();
    if (c !== 0) return;
    let r;
    if (n.talk) { this.showWho(n.who); r = await n.talk(ev); this.hideWho(); }
    else r = await this.overlay(n.mission.scene, { p: n.mission.p });
    if (r !== 'win') { await this.say('아쉽다! 언제든 다시 도전할 수 있어.'); return; }
    if (!done) {
      s.flags[s.era + '_node_' + n.id] = true;
      const rw = n.reward || {};
      if (rw.mon) { const nm = HG.ARTIFACTS[rw.mon[0]].name; ev.addMon(rw.mon[0], rw.mon[1]); HG.Sound.sfx('levelup'); await this.say(`${nm}${HG.josa(nm, '이', '가')} 동료가 되었다!` + (rw.text ? ` (${rw.text})` : '')); }
      if (rw.item) { await ev.give(rw.item[0], rw.item[1]); }
      HG.Sound.sfx('stamp');
      const d = this.doneCount(), N = this.st.nodes.length;
      await this.say(`거점 「${n.name}」 완료! (${d}/${N})` + (d >= N ? '\n이제 스승을 만나러 가자!' : ''));
    }
  }

  async bossNode(b) {
    const ev = this.ev;
    if (this.cleared()) { this.showWho(b.who); await this.say(...(b.after || ['다시 만나 반갑구나.'])); this.hideWho(); return; }
    const d = this.doneCount(), N = this.st.nodes.length;
    if (d < N) { await this.say(`아직 문이 닫혀 있다. 먼저 거점을 모두 돌아보자. (${d}/${N})`); return; }
    this.showWho(b.who);
    await this.say(...b.story);
    const n = await ev.quiz(b.quiz, b.quizCount || 3);
    const boost = n >= 3 ? 2 : n >= 2 ? 1 : 0;
    if (!b.team) {
      // 배틀 없는 스승: 2문제 이상 맞히면 인정
      if (n < 2) { await this.say(`${b.name}: ${n}개를 맞혔구나. 조금만 더 알아보고 다시 오너라. 거점의 이야기를 떠올려 보렴!`); this.hideWho(); return; }
      await this.say(`${b.name}: ${n}개나 맞혔구나!`);
    } else await this.say(`${b.name}: ${n}개를 맞혔구나. ` + (boost ? '좋다, 이제 겨뤄 보자!' : '아쉽지만 힘으로 겨뤄 보자!'));
    this.hideWho();
    if (!b.team) {
      // 배틀 없이 인정받는 스승
    } else {
      const r = await ev.battle({ trainer: { name: b.name, sprite: b.who, scale: b.whoScale, team: b.team, lose: b.lose || [b.name + ': 훌륭하구나!'] }, bg: b.bg || 'bb_castle', music: 'boss', atkBoost: boost });
      if (r !== 'win') { ev.heal(); await this.say('눈앞이 캄캄해졌다… 하지만 타임머신이 동료들을 회복시켜 주었다. 다시 도전하자!'); return; }
    }
    this.showWho(b.who);
    await this.say(...b.win);
    this.hideWho();
    if (b.reward && b.reward.mon) { const sp = b.reward.mon[0], nm = HG.ARTIFACTS[sp].name; ev.addMon(sp, b.reward.mon[1]); HG.Sound.sfx('levelup'); await this.say(`${nm}${HG.josa(nm, '이', '가')} 동료가 되었다!` + (b.reward.text ? ` (${b.reward.text})` : '')); }
    await HG.Era.award(ev, b.stamp);
    if (b.final) { await this.say(...(b.finalLines || [])); await this.overlay('Credits', {}); return; }
    await this.say('할아버지(무전기): 시간 조각이 돌아왔구나! 타임머신으로 와서 다음 시대로 가자!');
  }

  showWho(key) {
    this.hideWho();
    if (!key) return;
    this.who = this.add.sprite(26, 176, key, 0).setOrigin(0.5, 1).setScale(2).setDepth(105);
  }
  hideWho() { if (this.who) { this.who.destroy(); this.who = null; } }

  // 오른쪽 상자에 글 쓰기
  say(...lines) {
    return lines.flat().reduce((pr, line) => pr.then(() => new Promise(res => {
      const text = HG.fill(line);
      let n = 0, done = false, skip = false;
      this.arrow.setVisible(false);
      const h = this.keys.push(a => { if (a !== 'ok' && a !== 'cancel') return; if (!done) skip = true; else { this.keys.pop(h); HG.Sound.sfx('cursor'); res(); } });
      const ev = this.time.addEvent({ delay: 16, loop: true, callback: () => {
        n = skip ? text.length : n + 1; this.panel.setText(text.slice(0, n));
        if (n % 3 === 0) HG.Sound.sfx('talk');
        if (n >= text.length) { ev.remove(); done = true; this.arrow.setVisible(true); }
      } });
    })), Promise.resolve());
  }

  overlay(key, data) {
    return new Promise(res => {
      this.scene.pause();
      this.scene.launch(key, Object.assign({}, data, { onEnd: r => { this.scene.stop(key); this.scene.resume(); this.cameras.main.fadeIn(200); res(r); } }));
      this.scene.bringToTop(key);
    });
  }
  async openMenu() {
    this.busy = true; HG.Sound.sfx('select');
    await this.overlay('Menu', { mode: 'main' });
    this.hero.setTexture(HG.heroKey()); HG.setFace(this.hero, 'down');
    this.busy = false;
  }

  get ev() {
    if (this._ev) return this._ev;
    const S = this;
    this._ev = {
      scene: S,
      get state() { return HG.state; },
      say: (...l) => S.say(...l),
      choose: async (q, opts, cancel, extra) => {
        S.panel.setText(HG.fill(q)); S.arrow.setVisible(false);
        const o = Object.assign({ x: 312, y: 172, alignRight: true, depth: 400, cancelIndex: cancel, noCancel: cancel === 'none' }, extra || {});
        return HG.UI.choice(S, S.keys, opts, o);
      },
      wait: ms => HG.UI.wait(S, ms),
      flag: k => HG.state.flags[k],
      setFlag: (k, v) => { HG.state.flags[k] = v === undefined ? true : v; },
      heal: () => { HG.state.party.forEach(m => { m.hp = HG.stat(m, 'hp'); }); HG.Sound.sfx('heal'); },
      give: async (item, n) => { HG.state.bag[item] = (HG.state.bag[item] || 0) + n; HG.Sound.sfx('item'); await S.say(`${HG.ITEMS[item].name} ${n}개를 얻었다!`); },
      addMon: (sp, lv, shiny) => HG.addToParty(HG.makeMon(sp, lv, { shiny })),
      battle: opts => S.overlay('Battle', { opts }),
      mini: (key, p) => S.overlay(key, { p }),
      cutscene: (kind, data) => S.overlay('Cutscene', { kind, data }),
      menu: mode => S.overlay('Menu', { mode }),
      quiz: async (pool, count) => {
        let ok = 0;
        const qs = HG.shuffle(pool).slice(0, count);
        for (let i = 0; i < qs.length; i++) {
          const q = qs[i], opts = HG.shuffle(q.options);
          const pick = await S.ev.choose(`[문제 ${i + 1}] ${q.q}`, opts, 'none', { noDefault: true });
          if (opts[pick] === q.options[0]) { ok++; HG.Score.markQuiz(q, true); HG.Sound.sfx('correct'); await S.say(HG.pick(['정답이다!', '옳지, 맞았다!', '훌륭하구나!'])); }
          else { HG.Sound.sfx('wrong'); await S.say(`정답은 '${q.options[0]}'이란다.`, q.why); }
        }
        return ok;
      }
    };
    return this._ev;
  }
};
