// 만들기 장면 — 재료(단계)를 알맞은 순서로 골라 무언가를 완성하기
// p: { title, speaker, npc, intro:[], steps:[{name, icon, act, hint}], stageKey, outro:[], bg, music, exp }
// 기본값은 구석기 막집 짓기
HG.BUILD_DEFAULT = {
  title: '막집 짓기', speaker: '막집 짓는 사람', npc: 'npc_builder', stageKey: 'build', bg: 'grass', music: 'village', exp: 30,
  intro: ['막집 짓는 사람: 우리는 먹을 것을 찾아 옮겨 다니니까, 금방 짓고 금방 걷을 수 있는 막집을 지어.', '막집 짓는 사람: 재료는 여기 다 있어. 무엇부터 해야 할지 순서대로 골라 보렴!'],
  steps: [
    { name: '긴 나뭇가지', icon: 'm_stick', act: '나뭇가지를 세우자', hint: '막집을 지으려면 먼저 긴 나뭇가지를 세워서 뼈대를 만들어야 해.' },
    { name: '풀줄기 끈', icon: 'm_rope', act: '위쪽을 꽁꽁 묶자', hint: '나뭇가지가 쓰러지지 않게 위쪽을 묶어 줘야지.' },
    { name: '짐승 가죽', icon: 'm_hide', act: '가죽을 덮자', hint: '이제 비바람을 막아 줄 덮개가 필요해.' },
    { name: '돌', icon: 'm_stone', act: '돌로 가죽을 누르자', hint: '바람에 가죽이 날아가지 않게 아래쪽을 눌러 줘야 해.' }
  ],
  outro: ['막집이 완성되었다!', '막집 짓는 사람: 나뭇가지 뼈대에 가죽을 덮은 막집은 금방 짓고 금방 걷을 수 있어. 옮겨 다니며 사는 우리에게 딱 맞지!']
};
// 미니게임 배경 (16x16 타일로 그림). kind: grass / cave / palace / sea / field / village
HG.miniBg = function (scene, kind) {
  const key = 'minibg_' + kind;
  if (!scene.textures.exists(key)) {
    const { c, ctx } = HG.Pixel.canvas(HG.W, HG.H);
    for (let y = 0; y < 12; y++) for (let x = 0; x < 20; x++) {
      let t = (x * 5 + y) % 9 === 0 ? 't_grass2' : 't_grass';
      if (kind === 'grass' && (y === 0 || (y === 1 && x % 4 === 1))) t = 't_tree';
      if (kind === 'forest' && (y === 0 || x === 0 || x === 19 || y === 11 || ((x === 1 || x === 18) && y % 3 === 0))) t = 't_tree';
      if (kind === 'cave') t = y < 2 ? 't_cliff' : 't_cavefloor';
      if (kind === 'palace') t = y < 2 ? 't_wall' : 't_stonefloor';
      if (kind === 'village') t = y < 1 ? 't_tree' : (y < 2 ? 't_grass' : 't_path');
      if (kind === 'field') t = (y < 1) ? 't_tree' : ((x + y) % 2 ? 't_paddy' : 't_paddy');
      if (kind === 'sea') t = y < 6 ? 't_sand' : 't_water0';
      if (!scene.textures.exists(t)) t = 't_grass';
      ctx.drawImage(scene.textures.get(t).getSourceImage(), x * 16, y * 16);
    }
    scene.textures.addCanvas(key, c);
  }
  return scene.add.image(0, 0, key).setOrigin(0).setDepth(-10);
};

HG.BuildScene = class extends Phaser.Scene {
  constructor() { super('Build'); }
  init(data) { this.onEnd = data.onEnd; this.p = Object.assign({}, HG.BUILD_DEFAULT, data.p || {}); }

  create() {
    this.keys = new HG.Keys(this);
    this.dlg = new HG.UI.Dialog(this, this.keys);
    const p = this.p;
    HG.miniBg(this, p.bg);
    this.site = this.add.image(160, 98, p.stageKey + '0').setOrigin(0.5, 1).setScale(2).setDepth(10);
    this.add.sprite(86, 100, p.npc, 4).setOrigin(0.5, 1).setScale(2).setDepth(11);
    const me = this.add.sprite(236, 100, HG.heroKey(), 4).setOrigin(0.5, 1).setScale(2).setDepth(11).setFlipX(true);
    this.stepTxt = HG.UI.text(this, HG.W / 2, 4, '', { depth: 901, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
    HG.Sound.play(p.music);
    this.cameras.main.fadeIn(250);
    this.run();
  }

  async run() {
    const p = this.p, n = p.steps.length;
    await this.dlg.say(...p.intro);
    const order = p.steps.map((st, i) => i);
    const cards = HG.shuffle(order);
    let wrong = 0;
    for (let step = 0; step < n; step++) {
      this.stepTxt.setText(`${p.title} ${step + 1} / ${n}  —  무엇을 할까?`);
      while (true) {
        const pick = await this.chooseCard(cards.map(k => p.steps[k]));
        const k = cards[pick];
        if (k === step) { HG.Sound.sfx('correct'); break; }
        HG.Sound.sfx('wrong'); this.cameras.main.shake(150, 0.006);
        const nm = p.steps[k].name;
        wrong++;
        if (wrong >= 3) {
          await this.dlg.say(`${p.speaker}: 순서가 세 번이나 틀렸어! 처음부터 다시 해 보자.`, '(힌트) ' + p.steps[0].hint);
          wrong = 0; step = -1; this.site.setTexture(p.stageKey + '0'); break;
        }
        await this.dlg.say(`${p.speaker}: 음, ${nm}${HG.josa(nm, '은', '는')} 아직이야. ` + p.steps[step].hint + `  (실수 ${wrong}/3)`);
      }
      if (step < 0) continue;
      await this.mash(p.steps[step].act);
      this.site.setTexture(p.stageKey + (step + 1));
      HG.Sound.sfx('stomp');
      this.tweens.add({ targets: this.site, scaleY: 2.1, yoyo: true, duration: 120 });
      for (let i = 0; i < 8; i++) {
        const d = this.add.rectangle(160 + HG.rand(-40, 40), 96, 3, 3, 0x94704a).setDepth(20);
        this.tweens.add({ targets: d, y: d.y - HG.rand(8, 20), alpha: 0, duration: 450, onComplete: () => d.destroy() });
      }
      await HG.UI.wait(this, 350);
    }
    this.stepTxt.setText(p.title + ' 완성!');
    HG.Sound.play('victory');
    HG.state.party.forEach(m => HG.gainExp(m, p.exp));
    await this.dlg.say(...p.outro, `동료들이 경험치를 ${p.exp}씩 얻었다!`);
    HG.Sound.stop();
    this.cameras.main.fadeOut(250);
    await HG.UI.wait(this, 260);
    HG.Save.save();
    const cb = this.onEnd; this.onEnd = null; if (cb) cb('win');
  }

  // 재료 카드 고르기 (← → 와 스페이스)
  chooseCard(mats) {
    return new Promise(res => {
      const objs = [];
      objs.push(HG.UI.box(this, 0, 120, HG.W, 60, 100));
      const cw = 72, x0 = (HG.W - cw * mats.length) / 2;
      mats.forEach((m, i) => {
        const x = x0 + i * cw;
        objs.push(this.add.image(x + cw / 2, 140, m.icon).setScale(1.5).setDepth(101));
        objs.push(HG.UI.text(this, x + cw / 2, 154, m.name, { depth: 101, small: true }).setOrigin(0.5, 0));
      });
      const frame = this.add.graphics().setDepth(102); objs.push(frame);
      let i = -1; const openedAt = Date.now();
      const hint = HG.UI.text(this, HG.W / 2, 108, '← → 로 재료를 고르고 스페이스', { depth: 101, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0); objs.push(hint);
      const draw = () => { frame.clear(); if (i >= 0) frame.lineStyle(2, 0xbf4436).strokeRect(x0 + i * cw + 4, 125, cw - 8, 46); };
      const h = this.keys.push(act => {
        if (act === 'left') { i = i < 0 ? 0 : (i + mats.length - 1) % mats.length; HG.Sound.sfx('cursor'); draw(); }
        else if (act === 'right') { i = i < 0 ? 0 : (i + 1) % mats.length; HG.Sound.sfx('cursor'); draw(); }
        else if (act === 'ok') {
          if (Date.now() - openedAt < 300) return;
          if (i < 0) { HG.Sound.sfx('wrong'); this.tweens.add({ targets: hint, alpha: 0.3, yoyo: true, duration: 150, repeat: 2 }); return; }
          this.keys.pop(h); objs.forEach(o => o.destroy()); res(i);
        }
      });
    });
  }

  // 스페이스 연타로 게이지 채우기 (실패 없음)
  mash(label) {
    return new Promise(res => {
      const objs = [];
      objs.push(HG.UI.box(this, 60, 128, 200, 40, 100));
      objs.push(HG.UI.text(this, HG.W / 2, 134, `스페이스 연타! ${label}`, { depth: 101 }).setOrigin(0.5, 0));
      const bar = this.add.graphics().setDepth(101); objs.push(bar);
      let v = 0; const need = 12;
      const decay = this.time.addEvent({ delay: 100, loop: true, callback: () => { v = Math.max(0, v - 0.35); draw(); } });
      const draw = () => { bar.clear(); bar.fillStyle(0x1a1410).fillRect(80, 152, 160, 8); bar.fillStyle(0xdcbc48).fillRect(81, 153, Math.floor(158 * v / need), 6); };
      draw();
      const h = this.keys.push(act => {
        if (act !== 'ok') return;
        v++; HG.Sound.sfx('hit'); draw();
        this.tweens.add({ targets: this.site, x: 160 + (v % 2 ? 2 : -2), yoyo: true, duration: 50 });
        if (v >= need) { decay.remove(); this.keys.pop(h); objs.forEach(o => o.destroy()); res(); }
      });
    });
  }
};
