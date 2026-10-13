// 연출 장면 — 시간 여행, 인장 받기, 다음 시대, 첫 동료 고르기
HG.CutsceneScene = class extends Phaser.Scene {
  constructor() { super('Cutscene'); }
  init(data) { this.kind = data.kind; this.data1 = data.data || {}; this.onEnd = data.onEnd; }
  create() {
    this.keys = new HG.Keys(this);
    this.dlg = new HG.UI.Dialog(this, this.keys);
    const run = { warp: () => this.warp(), stamp: () => this.stamp(), nextEra: () => this.nextEra(), starter: () => this.starter() }[this.kind];
    run().then(r => { const cb = this.onEnd; this.onEnd = null; if (cb) cb(r); });
  }
  waitKey() { return new Promise(res => { const h = this.keys.push(a => { if (a === 'ok' || a === 'cancel') { this.keys.pop(h); HG.Sound.sfx('cursor'); res(); } }); }); }

  // 시간 터널
  async warp() {
    this.add.rectangle(0, 0, HG.W, HG.H, 0x000000).setOrigin(0);
    HG.Sound.stop(); HG.Sound.sfx('warp');
    const cols = [0x9a5ac0, 0x3a78c8, 0x8ad0f0, 0xf8d848, 0xf08a2a, 0xe890c0];
    const rings = [];
    const ev = this.time.addEvent({ delay: 90, loop: true, callback: () => {
      const r = this.add.rectangle(HG.W / 2, HG.H / 2, 8, 5, 0, 0).setStrokeStyle(3, HG.pick(cols));
      rings.push(r);
      this.tweens.add({ targets: r, scaleX: 50, scaleY: 50, alpha: 0.2, duration: 1100, ease: 'Quad.in', onComplete: () => r.destroy() });
    } });
    const hero = this.add.sprite(HG.W / 2, HG.H / 2, HG.heroKey(), 0).setDepth(10);
    this.tweens.add({ targets: hero, angle: 720, duration: 2200 });
    this.time.delayedCall(800, () => HG.Sound.sfx('warp'));
    await HG.UI.wait(this, 2300);
    ev.remove();
    this.cameras.main.flash(400, 255, 255, 255);
    await HG.UI.wait(this, 450);
  }

  // 인장 받기 + 칭호 + 시간 조각
  async stamp() {
    const d = this.data1;
    this.add.rectangle(0, 0, HG.W, HG.H, 0x1a1410, 0.85).setOrigin(0);
    HG.Sound.stop();
    const g = this.add.graphics().setDepth(5);
    const cx = HG.W / 2, cy = 70;
    g.fillStyle(0xd04a3a).fillCircle(cx, cy, 38);
    g.fillStyle(0xe9e2d0).fillCircle(cx, cy, 33);
    g.fillStyle(0xd04a3a).fillCircle(cx, cy, 30);
    const icon = this.add.image(cx, cy, d.icon).setScale(1.4).setDepth(6).setTintFill(0xe9e2d0);
    const label = HG.UI.text(this, cx, cy + 40, d.name, { depth: 7, color: '#fff4a8', stroke: '#1a1410' }).setOrigin(0.5, 0);
    const objs = [g, icon];
    objs.forEach(o => { o.setScale(o === icon ? 5 : 3.5); o.setAlpha(0); });
    label.setAlpha(0);
    this.tweens.add({ targets: g, scale: 1, alpha: 1, duration: 350, ease: 'Quad.in' });
    this.tweens.add({ targets: icon, scale: 1.4, alpha: 1, duration: 350, ease: 'Quad.in' });
    await HG.UI.wait(this, 360);
    HG.Sound.sfx('stomp'); this.cameras.main.shake(250, 0.02);
    HG.Sound.sfx('stamp');
    for (let i = 0; i < 16; i++) {
      const p = this.add.rectangle(cx, cy, 3, 3, HG.pick([0xf8d848, 0xf08a2a, 0xe9e2d0])).setDepth(8);
      const a = i / 16 * Math.PI * 2;
      this.tweens.add({ targets: p, x: cx + Math.cos(a) * 80, y: cy + Math.sin(a) * 60, alpha: 0, duration: 800, onComplete: () => p.destroy() });
    }
    this.tweens.add({ targets: label, alpha: 1, duration: 400 });
    await HG.UI.wait(this, 900);
    HG.Sound.play('victory');
    await this.dlg.say(`${d.name}${HG.josa(d.name, '을', '를')} 받았다!`, `칭호 「${d.title}」를 얻었다!`, '그리고… 반짝이는 시간 조각 1개를 되찾았다!');
  }

  // 다음 시대로 (연표가 움직이고, 아직 준비 중이면 알려 줌)
  async nextEra() {
    this.add.rectangle(0, 0, HG.W, HG.H, 0x1a1410).setOrigin(0);
    HG.UI.text(this, HG.W / 2, 20, '시간 여행 준비 중…', { color: '#fff4a8' }).setOrigin(0.5, 0);
    const s = HG.state, cur = HG.eraIndex(s.era);
    const x0 = 24, w = (HG.W - x0 * 2) / HG.ERAS.length, y = 90;
    const g = this.add.graphics();
    g.fillStyle(0x6b4a2b).fillRect(x0, y + 5, w * HG.ERAS.length, 3);
    HG.ERAS.forEach((e, i) => {
      const cx = x0 + w * i + w / 2;
      g.fillStyle(0xe9e2d0).fillCircle(cx, y + 6, 6);
      g.fillStyle(s.stamps.includes(e.id) ? 0xf8d848 : 0x8a8478).fillCircle(cx, y + 6, 5);
      HG.UI.text(this, cx, y + (i % 2 ? 16 : -20), e.short, { small: true, color: '#e9e2d0' }).setOrigin(0.5, 0);
    });
    const hero = this.add.sprite(x0 + w * cur + w / 2, y - 38, HG.heroKey(), 4);
    await HG.UI.wait(this, 600);
    const next = HG.ERAS[cur + 1];
    HG.Sound.sfx('warp');
    await new Promise(r => this.tweens.add({ targets: hero, x: hero.x + w * 0.6, duration: 900, onComplete: r }));
    if (next && next.stage && HG.stages[next.stage]) return 'go';
    this.cameras.main.shake(300, 0.01); HG.Sound.sfx('bump');
    await new Promise(r => this.tweens.add({ targets: hero, x: hero.x - w * 0.6, duration: 400, onComplete: r }));
    await this.dlg.say('할아버지: 이런, 아직 ' + (next ? next.name : '다음') + ' 시대로 가는 길이 열리지 않았구나.', '시간 조각이 조금 더 모이면 갈 수 있을 거야. (다음 업데이트를 기다려 주세요!)', '그동안 구석기 시대에서 도감을 채우고 매머드 사냥도 더 해 보렴.');
    return 'notyet';
  }

  // 첫 동료 고르기
  async starter() {
    this.add.rectangle(0, 0, HG.W, HG.H, 0x1a1410, 0.8).setOrigin(0);
    HG.UI.text(this, HG.W / 2, 8, '첫 동료를 고르세요', { color: '#fff4a8', stroke: '#1a1410' }).setOrigin(0.5, 0);
    const ids = ['handaxe', 'spear', 'ember'];
    const blurbs = { handaxe: '단단하고 튼튼해요.\n방어가 높아요.', spear: '빠르고 날카로워요.\n먼저 공격해요.', ember: '뜨거운 불의 힘!\n회복도 할 수 있어요.' };
    const cards = ids.map((id, i) => {
      const x = 14 + i * 100, y = 30;
      const bg = this.add.rectangle(x, y, 92, 100, 0xe9e2d0).setOrigin(0).setStrokeStyle(2, 0x6b4a2b);
      const img = this.add.image(x + 46, y + 38, 'mon_' + id).setScale(1.5);
      const nm = HG.UI.text(this, x + 46, y + 64, HG.ARTIFACTS[id].name, {}).setOrigin(0.5, 0);
      const ty = HG.UI.text(this, x + 46, y + 80, '속성: ' + HG.ARTIFACTS[id].type, { small: true, color: '#6b4a2b' }).setOrigin(0.5, 0);
      return { bg, img, x, y };
    });
    const info = HG.UI.text(this, HG.W / 2, 138, '', { small: true, color: '#e9e2d0', align: 'center', lineSpacing: 4 }).setOrigin(0.5, 0);
    const help = HG.UI.text(this, HG.W / 2, 166, '← → 고르기 · 스페이스 결정', { small: true, color: '#c9c2b0' }).setOrigin(0.5, 0);
    let i = 0, tw = null;
    const draw = () => {
      cards.forEach((c, k) => { c.bg.setStrokeStyle(k === i ? 3 : 2, k === i ? 0xd04a3a : 0x6b4a2b); c.img.y = c.y + 38; });
      if (tw) tw.remove();
      tw = this.tweens.add({ targets: cards[i].img, y: cards[i].y + 34, yoyo: true, repeat: -1, duration: 300 });
      info.setText(blurbs[ids[i]]);
    };
    draw();
    while (true) {
      i = await new Promise(res => {
        const h = this.keys.push(act => {
          if (act === 'left') { i = (i + 2) % 3; HG.Sound.sfx('cursor'); draw(); }
          else if (act === 'right') { i = (i + 1) % 3; HG.Sound.sfx('cursor'); draw(); }
          else if (act === 'ok') { this.keys.pop(h); HG.Sound.sfx('select'); res(i); }
        });
      });
      const name = HG.ARTIFACTS[ids[i]].name;
      const yes = await this.dlg.choose(`${name}${HG.josa(name, '을', '를')} 첫 동료로 할까?`, ['좋아!', '다시 고를래'], 1);
      if (yes === 0) return ids[i];
    }
  }
};
