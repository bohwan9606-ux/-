// 배틀 장면 — 턴제 유물 배틀
// opts: { wild:{species,level,shiny} } 또는 { trainer:{name, sprite, team:[[종류,레벨]], intro:[..], lose:[..]} }
//       bg, music, atkBoost(퀴즈 보너스), allowLose
HG.BattleScene = class extends Phaser.Scene {
  constructor() { super('Battle'); }
  init(data) { this.opts = data.opts; this.onEnd = data.onEnd; }

  create() {
    const o = this.opts;
    this.keys = new HG.Keys(this);
    this.add.image(0, 0, o.bg || HG.stages[HG.state.era].battleBg || 'bb_paleo').setOrigin(0);
    HG.Sound.play(o.music || (o.trainer ? 'boss' : 'battle'));
    HG.Sound.sfx('encounter');
    HG.state.stats.battles++;

    // 상대 편
    if (o.wild) {
      this.foes = [HG.makeMon(o.wild.species, o.wild.level, { shiny: o.wild.shiny })];
      HG.state.dex.seen[o.wild.species] = true;
    } else {
      this.foes = o.trainer.team.map(([sp, lv]) => HG.makeMon(sp, lv));
    }
    this.foeIdx = 0;
    this.me = HG.state.party.find(m => m.hp > 0);
    this.participants = new Set();
    this.stages = { me: { atk: 0, def: 0 }, foe: { atk: 0, def: 0 } };

    // 그림
    this.foeSpr = this.add.image(232, 86, this.monTex(this.foe)).setOrigin(0.5, 1).setScale(2).setDepth(5);
    this.meSpr = this.add.image(82, 137, this.monTex(this.me)).setOrigin(0.5, 1).setScale(2).setFlipX(true).setDepth(5);
    this.foeHud = this.makeHud(6, 8, false);
    this.meHud = this.makeHud(184, 88, true);
    // 아래 글상자
    HG.UI.box(this, 0, 136, HG.W, 44, 100);
    this.txt = HG.UI.text(this, 10, 144, '', { depth: 101, wrap: 300 });
    this.arrow = HG.UI.text(this, HG.W - 14, 166, '▼', { depth: 101, small: true }).setVisible(false);

    this.run().catch(e => { console.error(e); this.finish('run'); });
  }

  get foe() { return this.foes[this.foeIdx]; }
  monTex(m) { return 'mon_' + m.species + (m.shiny ? '_s' : ''); }

  // ── 체력 표시창
  makeHud(x, y, mine) {
    const h = mine ? 46 : 32, w = 130;
    const g = HG.UI.box(this, x, y, w, h, 50);
    const name = HG.UI.text(this, x + 7, y + 4, '', { depth: 51 });
    const lv = HG.UI.text(this, x + w - 7, y + 5, '', { depth: 51, small: true }); lv.setOrigin(1, 0);
    const bar = this.add.graphics().setDepth(51);
    const hpTxt = mine ? HG.UI.text(this, x + w - 7, y + 29, '', { depth: 51, small: true }).setOrigin(1, 0) : null;
    const hud = { x, y, w, mine, g, name, lv, bar, hpTxt, shown: null, objs: [g, name, lv, bar] };
    if (hpTxt) hud.objs.push(hpTxt);
    return hud;
  }
  drawHud(hud, m, hpVal) {
    const max = HG.stat(m, 'hp');
    const hp = hpVal != null ? hpVal : m.hp;
    hud.name.setText(HG.monName(m));
    hud.lv.setText('Lv' + m.level);
    const bx = hud.x + 24, by = hud.y + 22, bw = hud.w - 32;
    const g = hud.bar; g.clear();
    g.fillStyle(0x1a1410).fillRect(bx - 18, by - 3, bw + 20, 9);
    g.fillStyle(0xe9e2d0).fillRect(bx, by, bw, 3);
    const r = Math.max(0, hp / max);
    const col = r > 0.5 ? 0x5aa83a : r > 0.2 ? 0xf8d848 : 0xd04a3a;
    g.fillStyle(col).fillRect(bx, by, Math.ceil(bw * r), 3);
    if (!hud.hpLabel) { hud.hpLabel = HG.UI.text(this, bx - 16, by - 4, 'HP', { depth: 52, small: true, color: '#f8d848' }); hud.objs.push(hud.hpLabel); }
    if (hud.mine) {
      hud.hpTxt.setText(Math.ceil(hp) + '/' + max);
      const e0 = HG.expFor(m.level), e1 = HG.expFor(m.level + 1);
      const er = HG.clamp((m.exp - e0) / (e1 - e0), 0, 1);
      g.fillStyle(0x24487a).fillRect(hud.x + 8, hud.y + 40, hud.w - 16, 2);
      g.fillStyle(0x8ad0f0).fillRect(hud.x + 8, hud.y + 40, Math.floor((hud.w - 16) * er), 2);
    }
  }
  tweenHp(hud, m, from) {
    return new Promise(res => {
      const o = { v: from };
      this.tweens.add({ targets: o, v: m.hp, duration: Math.min(700, 30 * Math.abs(from - m.hp) + 200), onUpdate: () => this.drawHud(hud, m, o.v), onComplete: () => { this.drawHud(hud, m); res(); } });
    });
  }

  // ── 글
  msg(text, auto) {
    return new Promise(res => {
      text = HG.fill(text);
      let shown = 0, done = false, skip = false;
      this.arrow.setVisible(false);
      const h = this.keys.push(act => {
        if (act !== 'ok' && act !== 'cancel') return;
        if (!done) skip = true; else { this.keys.pop(h); HG.Sound.sfx('cursor'); res(); }
      });
      const ev = this.time.addEvent({ delay: 13, loop: true, callback: () => {
        shown = skip ? text.length : shown + 1;
        this.txt.setText(text.slice(0, shown));
        if (shown >= text.length) {
          ev.remove(); done = true;
          if (auto) { this.time.delayedCall(auto, () => { this.keys.pop(h); res(); }); }
          else this.arrow.setVisible(true);
        }
      } });
    });
  }

  // ── 진행
  async run() {
    const o = this.opts;
    this.drawHud(this.foeHud, this.foe);
    this.meHud.objs.forEach(x => x.setVisible(false));
    this.meSpr.setVisible(false);
    if (o.wild) {
      this.foeSpr.setTint(0xd8a8ff);
      this.foeSpr.x = 360;
      this.tweens.add({ targets: this.foeSpr, x: 232, duration: 500, ease: 'Quad.out' });
      this.swirl = this.time.addEvent({ delay: 120, loop: true, callback: () => this.foeSpr.setTint(Math.random() < 0.5 ? 0xd8a8ff : 0xb890ff) });
      await this.msg(`앗! 시간 괴물에게 홀린 ${HG.monName(this.foe)}${HG.josa(HG.monName(this.foe), '이', '가')} 튀어나왔다!`);
      if (o.wild.shiny) await this.msg('어?! 반짝반짝 빛나는 희귀한 유물이다!');
    } else {
      this.foeSpr.setVisible(false);
      this.foeHud.objs.forEach(x => x.setVisible(false));
      const tr = this.add.sprite(232, 86, o.trainer.sprite, 0).setOrigin(0.5, 1).setScale(o.trainer.scale || 3).setDepth(6);
      tr.x = 360; this.tweens.add({ targets: tr, x: 232, duration: 500, ease: 'Quad.out' });
      await HG.UI.wait(this, 500);
      for (const line of (o.trainer.intro || [])) await this.msg(line);
      await this.msg(`${o.trainer.name}${HG.josa(o.trainer.name, '이', '가')} 겨루기를 걸어왔다!`);
      this.tweens.add({ targets: tr, x: 360, duration: 400 });
      await this.sendFoe();
    }
    await this.sendMe(true);
    if (o.atkBoost) {
      this.stages.me.atk = o.atkBoost;
      HG.Sound.sfx('buff');
      await this.msg(`퀴즈 보너스! 우리 편의 공격이 ${o.atkBoost === 2 ? '크게 ' : ''}올랐다!`);
    }

    // 턴 반복
    while (true) {
      const act = await this.chooseAction();
      const res = await this.doTurn(act);
      if (res) return this.finish(res);
    }
  }

  async sendFoe() {
    const f = this.foe;
    HG.state.dex.seen[f.species] = true;
    this.foeSpr.setTexture(this.monTex(f)).setVisible(true).setAlpha(1).setScale(0.2);
    this.foeSpr.y = 86;
    this.tweens.add({ targets: this.foeSpr, scale: 2, duration: 300, ease: 'Back.out' });
    this.stages.foe = { atk: 0, def: 0 };
    this.foeHud.objs.forEach(x => x.setVisible(true));
    this.drawHud(this.foeHud, f);
    await this.msg(`${this.opts.trainer.name}${HG.josa(this.opts.trainer.name, '은', '는')} ${HG.monName(f)}${HG.josa(HG.monName(f), '을', '를')}내보냈다!`);
  }

  async sendMe(first) {
    const m = this.me;
    this.participants.add(m);
    this.meSpr.setTexture(this.monTex(m)).setVisible(true).setAlpha(1).setScale(0.2);
    this.meSpr.y = 137;
    this.tweens.add({ targets: this.meSpr, scale: 2, duration: 300, ease: 'Back.out' });
    const boost = this.stages.me.atk;
    this.stages.me = { atk: this.opts.atkBoost || 0, def: 0 };
    this.meHud.objs.forEach(x => x.setVisible(true));
    this.drawHud(this.meHud, m);
    HG.Sound.sfx('select');
    await this.msg(`가자, ${HG.monName(m)}!`, first ? 500 : 400);
  }

  // ── 무엇을 할까?
  chooseAction() {
    return new Promise(res => {
      const m = this.me;
      this.txt.setText(`${HG.monName(m)}${HG.josa(HG.monName(m), '은', '는')}\n무엇을 할까?`);
      this.arrow.setVisible(false);
      const box = HG.UI.box(this, 176, 136, 144, 44, 110);
      const labels = ['싸우기', '동료', '가방', '도망'];
      const items = labels.map((l, i) => HG.UI.text(this, 192 + (i % 2) * 64, 145 + Math.floor(i / 2) * 15, l, { depth: 111 }));
      const cur = HG.UI.text(this, 0, 0, '▶', { depth: 111 });
      let i = this._lastCmd || 0;
      const draw = () => { cur.x = 182 + (i % 2) * 64; cur.y = 145 + Math.floor(i / 2) * 15; };
      draw();
      const close = () => { this.keys.pop(h); box.destroy(); items.forEach(t => t.destroy()); cur.destroy(); };
      const h = this.keys.push(async act => {
        if (act === 'left' || act === 'right') { i = i ^ 1; HG.Sound.sfx('cursor'); draw(); }
        else if (act === 'up' || act === 'down') { i = i ^ 2; HG.Sound.sfx('cursor'); draw(); }
        else if (act === 'ok') {
          HG.Sound.sfx('select'); this._lastCmd = i;
          if (i === 0) { const mv = await this.pickMove(); if (mv != null) { close(); res({ type: 'move', move: mv }); } }
          else if (i === 1) { const idx = await this.pickParty(false); if (idx != null) { close(); res({ type: 'switch', idx }); } }
          else if (i === 2) { const it = await this.pickItem(); if (it) { close(); res({ type: 'item', item: it.item, target: it.target }); } }
          else { close(); res({ type: 'run' }); }
        }
      });
    });
  }

  pickMove() {
    return new Promise(res => {
      const m = this.me, moves = m.moves;
      const box = HG.UI.box(this, 0, 136, HG.W, 44, 120);
      const info = HG.UI.box(this, 214, 136, 106, 44, 121);
      const items = moves.map((mv, i) => HG.UI.text(this, 18 + (i % 2) * 98, 145 + Math.floor(i / 2) * 15, mv, { depth: 122 }));
      const cur = HG.UI.text(this, 0, 0, '▶', { depth: 122 });
      const t1 = HG.UI.text(this, 222, 143, '', { depth: 122, small: true });
      const t2 = HG.UI.text(this, 222, 158, '', { depth: 122, small: true });
      let i = 0;
      const draw = () => {
        cur.x = 8 + (i % 2) * 98; cur.y = 145 + Math.floor(i / 2) * 15;
        const mv = HG.MOVES[moves[i]];
        t1.setText('속성: ' + mv.type).setColor(HG.TYPES[mv.type].color === '#e8dcb0' ? '#6b4a2b' : '#1a1410');
        t2.setText(mv.kind === 'dmg' ? '위력: ' + mv.power + (mv.acc < 100 ? '  명중 ' + mv.acc : '') : { buff: '내 능력 ↑', debuff: '상대 능력 ↓', heal: '회복' }[mv.kind]);
      };
      draw();
      const close = v => { this.keys.pop(h); [box, info, cur, t1, t2, ...items].forEach(o => o.destroy()); res(v); };
      const h = this.keys.push(act => {
        const n = moves.length;
        if (act === 'left' || act === 'right') { const j = i ^ 1; if (j < n) { i = j; HG.Sound.sfx('cursor'); draw(); } }
        else if (act === 'up' || act === 'down') { const j = i ^ 2; if (j < n) { i = j; HG.Sound.sfx('cursor'); draw(); } }
        else if (act === 'ok') { HG.Sound.sfx('select'); close(moves[i]); }
        else if (act === 'cancel' || act === 'menu') { HG.Sound.sfx('cancel'); close(null); }
      });
    });
  }

  // 동료 고르기 (forced: 기절해서 꼭 바꿔야 할 때)
  pickParty(forced) {
    return new Promise(res => {
      const P = HG.state.party;
      const objs = [];
      objs.push(HG.UI.box(this, 20, 8, 280, 128, 130));
      objs.push(HG.UI.text(this, 32, 14, forced ? '누구를 내보낼까?' : '누구와 바꿀까?', { depth: 131 }));
      P.forEach((m, i) => {
        const y = 32 + i * 17;
        objs.push(this.add.image(46, y + 6, this.monTex(m)).setScale(0.5).setDepth(131));
        objs.push(HG.UI.text(this, 60, y, HG.monName(m), { depth: 131, color: m.hp > 0 ? '#1a1410' : '#8a8478' }));
        objs.push(HG.UI.text(this, 170, y + 1, 'Lv' + m.level, { depth: 131, small: true }));
        objs.push(HG.UI.text(this, 210, y + 1, m.hp > 0 ? `${m.hp}/${HG.stat(m, 'hp')}` : '기절', { depth: 131, small: true, color: m.hp > 0 ? '#1a1410' : '#d04a3a' }));
        if (m === this.me) objs.push(HG.UI.text(this, 262, y + 1, '싸우는 중', { depth: 131, small: true, color: '#3a78c8' }));
      });
      const cur = HG.UI.text(this, 26, 32, '▶', { depth: 131 }); objs.push(cur);
      let i = Math.max(0, P.findIndex(m => m.hp > 0 && m !== this.me));
      const draw = () => { cur.y = 32 + i * 17; };
      draw();
      const close = v => { this.keys.pop(h); objs.forEach(o => o.destroy()); res(v); };
      const h = this.keys.push(async act => {
        if (act === 'up') { i = (i + P.length - 1) % P.length; HG.Sound.sfx('cursor'); draw(); }
        else if (act === 'down') { i = (i + 1) % P.length; HG.Sound.sfx('cursor'); draw(); }
        else if (act === 'ok') {
          const m = P[i];
          if (m.hp <= 0) { HG.Sound.sfx('wrong'); return; }
          if (m === this.me) { HG.Sound.sfx('wrong'); return; }
          HG.Sound.sfx('select'); close(i);
        } else if ((act === 'cancel' || act === 'menu') && !forced) { HG.Sound.sfx('cancel'); close(null); }
      });
    });
  }

  async pickItem() {
    const bag = HG.state.bag;
    const keys = Object.keys(bag).filter(k => bag[k] > 0);
    if (!keys.length) { await this.msg('가방이 비어 있다.'); this.txt.setText(''); return null; }
    const labels = keys.map(k => `${HG.ITEMS[k].name} ×${bag[k]}`);
    const i = await HG.UI.choice(this, this.keys, labels.concat(['그만두기']), { x: 176, y: 70, depth: 140 });
    if (i < 0 || i >= keys.length) return null;
    return { item: keys[i], target: this.me };
  }

  // ── 한 턴
  async doTurn(act) {
    const me = this.me, foe = this.foe;
    if (act.type === 'run') {
      if (this.opts.trainer) { await this.msg('겨루기에서는 도망칠 수 없다!'); return null; }
      HG.Sound.sfx('cancel');
      await this.msg('무사히 도망쳤다!');
      return 'run';
    }
    const foeMove = this.foeChoose();
    let first = 'me';
    if (act.type === 'move') {
      const a = HG.MOVES[act.move], b = HG.MOVES[foeMove];
      const sMe = HG.stat(me, 'spd') * (a.first ? 10 : 1), sFoe = HG.stat(foe, 'spd') * (b.first ? 10 : 1);
      first = sMe >= sFoe ? 'me' : 'foe';
    }
    const meTurn = async () => {
      if (act.type === 'switch') {
        await this.msg(`돌아와, ${HG.monName(me)}!`, 400);
        this.me = HG.state.party[act.idx];
        await this.sendMe();
      } else if (act.type === 'item') {
        const m = act.target, max = HG.stat(m, 'hp');
        HG.state.bag[act.item]--;
        const from = m.hp; m.hp = Math.min(max, m.hp + Math.ceil(max / 2));
        HG.Sound.sfx('heal');
        await this.msg(`${HG.ITEMS[act.item].name}${HG.josa(HG.ITEMS[act.item].name, '을', '를')} 먹였다!`, 300);
        await this.tweenHp(this.meHud, m, from);
      } else {
        await this.useMove('me', act.move);
      }
    };
    const foeTurn = async () => { if (this.foe.hp > 0 && this.me.hp > 0) await this.useMove('foe', foeMove); };
    if (first === 'me') { await meTurn(); if (await this.checkFaint()) return this.result; await foeTurn(); }
    else { await foeTurn(); if (await this.checkFaint()) return this.result; await meTurn(); }
    if (await this.checkFaint()) return this.result;
    return null;
  }

  foeChoose() {
    const f = this.foe, ms = f.moves;
    const healMv = ms.find(m => HG.MOVES[m].kind === 'heal');
    if (healMv && f.hp < HG.stat(f, 'hp') * 0.35 && Math.random() < 0.6) return healMv;
    const dmg = ms.filter(m => HG.MOVES[m].kind === 'dmg');
    if (dmg.length && Math.random() < (this.opts.trainer ? 0.8 : 0.65)) return HG.pick(dmg);
    return HG.pick(ms);
  }

  mult(stage) { return stage >= 0 ? 1 + 0.5 * stage : 1 / (1 + 0.5 * -stage); }

  async useMove(who, moveName) {
    const mv = HG.MOVES[moveName];
    const atk = who === 'me' ? this.me : this.foe;
    const def = who === 'me' ? this.foe : this.me;
    const aSpr = who === 'me' ? this.meSpr : this.foeSpr;
    const dSpr = who === 'me' ? this.foeSpr : this.meSpr;
    const dHud = who === 'me' ? this.foeHud : this.meHud;
    const aSt = this.stages[who], dSt = this.stages[who === 'me' ? 'foe' : 'me'];
    const prefix = who === 'me' ? '' : (this.opts.wild ? '상대 ' : '상대 ');
    await this.msg(`${prefix}${HG.monName(atk)}의 ${moveName}!`, 350);
    // 공격 동작
    const dx = who === 'me' ? 14 : -14;
    await new Promise(r => this.tweens.add({ targets: aSpr, x: aSpr.x + dx, y: aSpr.y - (who === 'me' ? 4 : -4), duration: 90, yoyo: true, onComplete: r }));

    if (mv.kind === 'buff') {
      if (aSt[mv.stat] >= 2) { await this.msg('더 이상 오르지 않는다!'); return; }
      aSt[mv.stat]++; HG.Sound.sfx('buff');
      this.sparkle(aSpr, 0xe3d49a);
      await this.msg(`${HG.monName(atk)}의 ${mv.stat === 'atk' ? '공격' : '방어'}이 올랐다!`);
      return;
    }
    if (mv.kind === 'debuff') {
      if (dSt[mv.stat] <= -2) { await this.msg('더 이상 떨어지지 않는다!'); return; }
      dSt[mv.stat]--; HG.Sound.sfx('debuff');
      this.sparkle(dSpr, 0x9a5ac0);
      await this.msg(`${HG.monName(def)}의 ${mv.stat === 'atk' ? '공격' : '방어'}이 떨어졌다!`);
      return;
    }
    if (mv.kind === 'heal') {
      const max = HG.stat(atk, 'hp');
      if (atk.hp >= max) { await this.msg('체력이 이미 가득하다!'); return; }
      const from = atk.hp; atk.hp = Math.min(max, atk.hp + Math.ceil(max * mv.amount));
      HG.Sound.sfx('heal'); this.sparkle(aSpr, 0x6fa04a);
      await this.tweenHp(who === 'me' ? this.meHud : this.foeHud, atk, from);
      await this.msg(`${HG.monName(atk)}의 체력이 회복되었다!`);
      return;
    }
    // 공격
    if (Math.random() * 100 >= mv.acc) { HG.Sound.sfx('miss'); await this.msg('하지만 빗나갔다!'); return; }
    const A = HG.stat(atk, 'atk') * this.mult(aSt.atk);
    const D = HG.stat(def, 'def') * this.mult(dSt.def);
    const stab = HG.ARTIFACTS[atk.species].type === mv.type ? 1.2 : 1;
    const tm = HG.typeMult(mv.type, HG.ARTIFACTS[def.species].type);
    const crit = Math.random() < (mv.crit ? 0.25 : 0.0625);
    let dmg = ((2 * atk.level / 5 + 2) * mv.power * A / D) / 22 + 2;
    dmg = Math.max(1, Math.floor(dmg * stab * tm * (crit ? 1.5 : 1) * (0.85 + Math.random() * 0.15)));
    if (who === 'foe' && HG.dev.god) dmg = 0;
    const from = def.hp; def.hp = Math.max(0, def.hp - dmg);
    HG.Sound.sfx(crit || tm > 1 ? 'bighit' : 'hit');
    this.hitFx(dSpr, mv.type);
    if (crit || tm > 1) this.cameras.main.shake(200, 0.012);
    await new Promise(r => this.tweens.add({ targets: dSpr, alpha: 0.2, duration: 70, yoyo: true, repeat: 2, onComplete: r }));
    await this.tweenHp(dHud, def, from);
    if (crit) await this.msg('급소에 맞았다!');
    if (tm > 1) await this.msg('효과가 굉장했다!');
    else if (tm < 1) await this.msg('효과가 별로인 듯하다…');
  }

  hitFx(spr, type) {
    const col = { '불': 0xf08a2a, '시간': 0x9a5ac0 }[type] || 0xe9e2d0;
    for (let i = 0; i < 7; i++) {
      const p = this.add.rectangle(spr.x, spr.y - 30, 3, 3, col).setDepth(20);
      const a = Math.random() * Math.PI * 2, r = 18 + Math.random() * 14;
      this.tweens.add({ targets: p, x: p.x + Math.cos(a) * r, y: p.y + Math.sin(a) * r, alpha: 0, duration: 380, onComplete: () => p.destroy() });
    }
  }
  sparkle(spr, col) {
    for (let i = 0; i < 6; i++) {
      const p = this.add.rectangle(spr.x - 20 + Math.random() * 40, spr.y - 10, 2, 2, col).setDepth(20);
      this.tweens.add({ targets: p, y: p.y - 40 - Math.random() * 10, alpha: 0, duration: 600, delay: i * 50, onComplete: () => p.destroy() });
    }
  }

  // ── 기절 확인. 끝났으면 this.result 에 결과
  async checkFaint() {
    if (this.foe.hp <= 0) {
      HG.Sound.sfx('faint');
      if (this.swirl) { this.swirl.remove(); this.swirl = null; }
      if (this.opts.wild) {
        // 야생: 쓰러지는 대신 정신을 차림
        this.foeSpr.clearTint();
        await new Promise(r => this.tweens.add({ targets: this.foeSpr, alpha: 0.3, duration: 150, yoyo: true, repeat: 2, onComplete: r }));
        await this.msg(`${HG.monName(this.foe)}에게서 시간 괴물이 빠져나갔다!`);
      } else {
        await new Promise(r => this.tweens.add({ targets: this.foeSpr, y: this.foeSpr.y + 30, alpha: 0, duration: 400, onComplete: r }));
        await this.msg(`상대 ${HG.monName(this.foe)}${HG.josa(HG.monName(this.foe), '은', '는')} 힘이 빠져 물러났다!`);
      }
      await this.giveExp(this.foe);
      if (this.opts.trainer && this.foeIdx < this.foes.length - 1) {
        this.foeIdx++;
        await this.sendFoe();
        return false;
      }
      this.result = 'win';
      HG.state.stats.wins++;
      if (this.opts.wild) await this.recruit(this.foe);
      else {
        HG.Sound.play('victory');
        const tr = this.add.sprite(360, 86, this.opts.trainer.sprite, 0).setOrigin(0.5, 1).setScale(this.opts.trainer.scale || 3).setDepth(6);
        this.tweens.add({ targets: tr, x: 232, duration: 400 });
        await HG.UI.wait(this, 400);
        for (const line of (this.opts.trainer.lose || [])) await this.msg(line);
      }
      return true;
    }
    if (this.me.hp <= 0) {
      HG.Sound.sfx('faint');
      await new Promise(r => this.tweens.add({ targets: this.meSpr, y: this.meSpr.y + 30, alpha: 0, duration: 400, onComplete: r }));
      await this.msg(`${HG.monName(this.me)}${HG.josa(HG.monName(this.me), '은', '는')} 지쳐서 쓰러졌다!`);
      const alive = HG.state.party.filter(m => m.hp > 0);
      if (!alive.length) {
        this.result = 'lose';
        if (this.opts.allowLose) { for (const line of (this.opts.trainer && this.opts.trainer.winLines || [])) await this.msg(line); }
        return true;
      }
      const idx = await this.pickParty(true);
      this.me = HG.state.party[idx];
      await this.sendMe();
      return false;
    }
    return false;
  }

  async giveExp(foe) {
    const gain = Math.floor(foe.level * 10 * (this.opts.trainer ? 1.5 : 1) + 5);
    for (const m of HG.state.party) {
      if (m.hp <= 0) continue;
      const g = this.participants.has(m) ? gain : Math.floor(gain / 2);
      if (m === this.me) await this.msg(`${HG.monName(m)}${HG.josa(HG.monName(m), '은', '는')} 경험치를 ${g} 얻었다!`, 250);
      await this.addExp(m, g, m === this.me);
    }
    if (HG.state.party.length > 1) await this.msg('함께 다니는 동료들도 경험치를 얻었다.', 300);
  }

  async addExp(m, g, show) {
    m.exp += g;
    while (m.level < 50 && m.exp >= HG.expFor(m.level + 1)) {
      const oldMax = HG.stat(m, 'hp');
      m.level++;
      m.hp += HG.stat(m, 'hp') - oldMax;
      if (show) this.drawHud(this.meHud, m);
      HG.Sound.sfx('levelup');
      await this.msg(`${HG.monName(m)}${HG.josa(HG.monName(m), '은', '는')} 레벨 ${m.level}이 되었다!`);
      const learn = HG.ARTIFACTS[m.species].learn.filter(l => l[0] === m.level).map(l => l[1]);
      for (const mv of learn) {
        if (m.moves.includes(mv)) continue;
        if (m.moves.length >= 4) {
          const old = m.moves.shift();
          await this.msg(`${old}${HG.josa(old, '을', '를')} 잊고…`);
        }
        m.moves.push(mv);
        HG.Sound.sfx('item');
        await this.msg(`새 기술 ${mv}${HG.josa(mv, '을', '를')} 배웠다!`);
      }
    }
    if (show) this.drawHud(this.meHud, m);
  }

  async recruit(foe) {
    HG.Sound.play('victory');
    const s = HG.state;
    const name = HG.monName(foe);
    this.foeSpr.setAlpha(1);
    this.tweens.add({ targets: this.foeSpr, y: this.foeSpr.y - 6, duration: 200, yoyo: true, repeat: 2 });
    const already = s.dex.caught[foe.species] && !(foe.shiny && !s.dex.caught[foe.species + '_s']);
    if (!already) {
      await this.msg(`${name}${HG.josa(name, '이', '가')} 정신을 차렸다! 고마운 듯 바라본다.`);
      foe.hp = HG.stat(foe, 'hp'); foe.exp = HG.expFor(foe.level);
      const where = HG.addToParty(foe);
      HG.Sound.sfx('levelup');
      await this.msg(`${name}${HG.josa(name, '이', '가')} 동료가 되었다!`);
      if (where === 'box') await this.msg('동료가 가득 차서 타임머신으로 보냈다.');
      await this.msg(`도감에 ${name}${HG.josa(name, '이', '가')} 기록되었다!`);
    } else {
      await this.msg(`${name}${HG.josa(name, '이', '가')} 정신을 차리고 집으로 돌아갔다.`);
      if (Math.random() < 0.35) {
        HG.state.bag.meat = (HG.state.bag.meat || 0) + 1;
        HG.Sound.sfx('item');
        await this.msg('고마움의 표시로 고기 1개를 두고 갔다!');
      }
    }
  }

  async finish(res) {
    HG.Sound.stop();
    this.cameras.main.fadeOut(250, 0, 0, 0);
    await HG.UI.wait(this, 260);
    HG.Save.save();
    const cb = this.onEnd; this.onEnd = null;
    if (cb) cb(res);
  }
};
