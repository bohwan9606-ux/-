// 첫 화면 — 이어하기 / 새로 시작 / 저장 코드로 불러오기
HG.TitleScene = class extends Phaser.Scene {
  constructor() { super('Title'); }
  create() {
    this.keys = new HG.Keys(this);
    this.dlg = new HG.UI.Dialog(this, this.keys);
    // 배경: 밤하늘과 시간 소용돌이
    this.add.rectangle(0, 0, HG.W, HG.H, 0x24487a).setOrigin(0);
    for (let i = 0; i < 50; i++) {
      const s = this.add.rectangle(Math.random() * HG.W, Math.random() * 110, 1, 1, 0xe9e2d0);
      this.tweens.add({ targets: s, alpha: 0.2, yoyo: true, repeat: -1, duration: 500 + Math.random() * 1500 });
    }
    const ground = this.add.image(0, 0, 'bb_paleo').setOrigin(0).setY(40).setAlpha(1);
    this.add.rectangle(0, 0, HG.W, 110, 0x24487a).setOrigin(0);
    for (let i = 0; i < 40; i++) {
      const s = this.add.rectangle(Math.random() * HG.W, Math.random() * 100, 1, 1, 0xe9e2d0);
      this.tweens.add({ targets: s, alpha: 0.1, yoyo: true, repeat: -1, duration: 400 + Math.random() * 1500 });
    }
    const tm = this.add.image(250, 132, 'timemachine').setScale(1.5);
    this.tweens.add({ targets: tm, y: 128, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.inOut' });
    const mon = this.add.image(70, 140, 'mon_handaxe').setScale(1);
    this.tweens.add({ targets: mon, y: 136, yoyo: true, repeat: -1, duration: 600 });
    const mon2 = this.add.image(110, 146, 'mon_ember').setScale(1);
    const hero = this.add.sprite(180, 152, 'hero0_paleo', 0).setScale(2).setOrigin(0.5, 1);
    let hf = 0; this.time.addEvent({ delay: 400, loop: true, callback: () => { hf = (hf + 1) % 4; hero.setFrame([0, 1, 0, 1][hf]); hero.setFlipX(hf === 3); } });
    this.tweens.add({ targets: mon2, y: 141, yoyo: true, repeat: -1, duration: 500 });

    const title = HG.UI.text(this, HG.W / 2, 18, '시간 조각 대모험', { color: '#fff4a8', stroke: '#1a1410', depth: 10 }).setOrigin(0.5, 0).setScale(2);
    HG.UI.text(this, HG.W / 2, 50, '구석기부터 현대까지, 한국사 RPG', { color: '#e9e2d0', stroke: '#1a1410', depth: 10, small: true }).setOrigin(0.5, 0);
    this.tweens.add({ targets: title, y: 21, yoyo: true, repeat: -1, duration: 1200, ease: 'Sine.inOut' });

    this.press = HG.UI.text(this, HG.W / 2, 92, '아무 키나 누르세요', { color: '#e9e2d0', stroke: '#1a1410', depth: 10 }).setOrigin(0.5, 0);
    this.tweens.add({ targets: this.press, alpha: 0.2, yoyo: true, repeat: -1, duration: 600 });
    const startH = this.keys.push(() => { this.keys.pop(startH); this.press.destroy(); HG.Sound.resume(); HG.Sound.play('title'); this.menu(); });
    this.input.on('pointerdown', () => { if (this.press.active) { this.keys.pop(startH); this.press.destroy(); HG.Sound.resume(); HG.Sound.play('title'); this.menu(); } });
  }

  async menu() {
    while (true) {
      const has = HG.Save.has();
      const items = (has ? ['이어하기', '새로 시작'] : ['새로 시작']).concat(['저장 코드로 불러오기']);
      const i = await HG.UI.choice(this, this.keys, items, { x: HG.W / 2 - 60, y: 76, noCancel: true, depth: 50 });
      const pick = items[i];
      if (pick === '이어하기') {
        HG.state = HG.Save.load();
        if (HG.state) return HG.Save._lastTick = Date.now(), HG.Sound.stop(), HG.Era.startScene(this);
      }
      if (pick === '새로 시작') {
        if (has) {
          const c = await this.dlg.choose('전에 하던 기록이 지워져요. 정말 새로 시작할까요?', ['아니요', '네, 새로 시작'], 0);
          if (c !== 1) continue;
        }
        return this.newGame();
      }
      if (pick === '저장 코드로 불러오기') {
        const code = await new Promise(res => {
          HG.Keys.typing = true;
          const wrap = document.createElement('div');
          wrap.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:10;font-family:Galmuri11,sans-serif';
          wrap.innerHTML = '<div style="background:#e9e2d0;border:4px solid #6b4a2b;padding:20px;max-width:560px;width:90%;color:#1a1410"><div style="font-size:20px;margin-bottom:8px">저장 코드 붙여 넣기</div><textarea id="ta" style="width:100%;height:110px;font-size:11px;background:#fff;color:#1a1410;-webkit-text-fill-color:#1a1410;color-scheme:light"></textarea><div style="margin-top:8px;display:flex;gap:8px"><button id="ok" style="font-family:inherit;font-size:16px;padding:6px 14px">불러오기</button><button id="cl" style="font-family:inherit;font-size:16px;padding:6px 14px">닫기</button></div></div>';
          document.body.appendChild(wrap);
          const done = v => { wrap.remove(); setTimeout(() => { HG.Keys.typing = false; }, 50); res(v); };
          wrap.querySelector('#ok').onclick = () => done(wrap.querySelector('#ta').value);
          wrap.querySelector('#cl').onclick = () => done(null);
        });
        if (code && HG.Save.importCode(code)) { HG.UI.toast(this, '불러왔어요!'); HG.state = HG.Save.load(); return this.go(); }
        if (code) HG.UI.toast(this, '코드가 올바르지 않아요');
      }
    }
  }

  async newGame() {
    HG.state = HG.newState();
    const name = await HG.UI.prompt(this, '주인공 이름은?', '탐험가', 6);
    HG.state.player.name = name;
    // 모습 고르기
    const a = this.add.sprite(HG.W / 2 - 40, 120, 'hero0_modern', 0).setScale(3).setDepth(40);
    const b = this.add.sprite(HG.W / 2 + 40, 120, 'hero1_modern', 0).setScale(3).setDepth(40);
    const bg = this.add.rectangle(0, 0, HG.W, HG.H, 0x1a1410, 0.6).setOrigin(0).setDepth(39);
    const look = await HG.UI.choice(this, this.keys, ['이 모습 (왼쪽)', '이 모습 (오른쪽)'], {
      x: HG.W / 2 - 58, y: 30, noCancel: true, depth: 60,
      onMove: i => { a.setAlpha(i === 0 ? 1 : 0.35); b.setAlpha(i === 1 ? 1 : 0.35); }
    });
    HG.state.player.look = look;
    [a, b, bg].forEach(o => o.destroy());
    HG.state.player.map = 'lab'; HG.state.player.x = 5; HG.state.player.y = 5; HG.state.player.dir = 'up';
    HG.Save.save();
    this.go();
  }

  go() {
    HG.Save._lastTick = Date.now();
    HG.Sound.stop();
    this.cameras.main.fadeOut(300);
    this.time.delayedCall(320, () => this.scene.start('World', {}));
  }
};
