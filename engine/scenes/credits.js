// 엔딩 크레딧 — 현대로 돌아오고, 스승·유물·기록이 지나간 뒤 「한국사 박사」 칭호
HG.CREDITS_MAKER = '박봉두 선생님';
HG.CreditsScene = class extends Phaser.Scene {
  constructor() { super('Credits'); }
  init(d) { this.onEnd = d.onEnd; }
  create() {
    this.keys = new HG.Keys(this); this.dlg = new HG.UI.Dialog(this, this.keys);
    this.add.rectangle(0, 0, HG.W, HG.H, 0x12100e).setOrigin(0).setDepth(-20);
    this.run().catch(e => console.error(e));
  }
  async run() {
    const s = HG.state;
    // 1. 연구실로 돌아옴
    const bg = this.add.rectangle(0, 0, HG.W, HG.H, 0x2a2a3a).setOrigin(0).setDepth(0);
    const tm = this.add.image(160, 96, 'timemachine').setScale(2).setDepth(1);
    const me = this.add.sprite(110, 130, 'hero' + (s.player.look || 0) + '_modern', 0).setOrigin(0.5, 1).setScale(2).setDepth(2);
    const gp = this.add.sprite(210, 130, 'grandpa', 0).setOrigin(0.5, 1).setScale(2).setDepth(2);
    const rv = this.add.sprite(250, 130, 'rival_modern', 0).setOrigin(0.5, 1).setScale(2).setDepth(2);
    HG.Sound.play('peace');
    this.cameras.main.flash(800, 255, 255, 255);
    await this.dlg.say('번쩍! 타임머신이 원래의 연구실로 돌아왔다.', '할아버지: {name}야! 모든 시간 조각을 되찾았구나. 정말 장하다!', '하람: 구석기부터 지금까지… 진짜 긴 여행이었어. 우리 역사, 생각보다 훨씬 멋지더라!', '할아버지: 오늘 만난 사람들과 유물들을 잊지 말거라. 그 모두가 지금의 우리를 만들었단다.');
    [bg, tm, me, gp, rv].forEach(o => this.tweens.add({ targets: o, alpha: 0, duration: 600 }));
    await HG.UI.wait(this, 700);

    // 2. 크레딧 두루마리
    const lines = [];
    const add = (t, opt) => lines.push(Object.assign({ t }, opt || {}));
    add('시간 조각 대모험', { big: true, color: '#e3d49a' });
    add('구석기부터 현대까지, 한국사 RPG');
    add('');
    add('함께한 스승들', { color: '#e3d49a' });
    HG.ERAS.forEach(e => { const st = HG.stages[e.stage || e.id]; const nm = st && (st.teacher || (st.boss && st.boss.name)); if (nm) add(`${e.name}  —  ${nm}`); });
    add('');
    add('함께한 유물 동료', { color: '#e3d49a' });
    const caught = HG.dexList().filter(id => s.dex.caught[id]);
    for (let i = 0; i < caught.length; i += 3) lines.push({ mons: caught.slice(i, i + 3) });
    add('');
    add('나의 기록', { color: '#e3d49a' });
    const mins = Math.floor(s.stats.playMs / 60000);
    add(`도감 ${caught.length} / ${HG.dexList().length}`);
    add(`시대 인장 ${s.stamps.length}개`);
    add(`배틀 ${s.stats.battles}번 · 사냥 ${s.stats.hunts}번`);
    add(`플레이 시간 ${Math.floor(mins / 60)}시간 ${mins % 60}분`);
    add('');
    add('만든 사람', { color: '#e3d49a' });
    add(HG.CREDITS_MAKER);
    add('');
    add('그리고 끝까지 함께한 너, ' + s.player.name + '!', { color: '#e3d49a' });
    const cont = this.add.container(0, HG.H + 10).setDepth(10);
    let y = 0;
    lines.forEach(l => {
      if (l.mons) {
        l.mons.forEach((id, k) => {
          const x = HG.W / 2 + (k - (l.mons.length - 1) / 2) * 60;
          cont.add(this.add.image(x, y + 14, 'mon_' + id));
          cont.add(HG.UI.text(this, x, y + 30, HG.ARTIFACTS[id].name, { small: true, color: '#e9e2d0' }).setOrigin(0.5, 0));
        });
        y += 46;
      } else {
        const t = HG.UI.text(this, HG.W / 2, y, l.t, { color: l.color || '#e9e2d0', small: !l.big && !l.color }).setOrigin(0.5, 0);
        if (l.big) t.setScale(2);
        cont.add(t); y += l.big ? 28 : 16;
      }
    });
    const total = y + HG.H + 20;
    await new Promise(r => this.tweens.add({ targets: cont, y: -y - 10, duration: total * 28, onComplete: r }));

    // 3. 한국사 박사
    HG.giveTitle('한국사 박사');
    s.flags.gameClear = true;
    HG.Save.save();
    HG.Sound.sfx('stamp');
    const g = this.add.graphics().setDepth(20);
    g.fillStyle(0xbf4436).fillCircle(160, 70, 38); g.fillStyle(0xe9e2d0).fillCircle(160, 70, 33); g.fillStyle(0xbf4436).fillCircle(160, 70, 30);
    const tt = HG.UI.text(this, 160, 58, '한국사\n박사', { depth: 21, color: '#e9e2d0', align: 'center' }).setOrigin(0.5, 0);
    g.setScale(3).setAlpha(0); tt.setAlpha(0);
    this.tweens.add({ targets: g, scale: 1, alpha: 1, duration: 350, ease: 'Quad.in', onComplete: () => this.cameras.main.shake(250, 0.02) });
    this.tweens.add({ targets: tt, alpha: 1, delay: 300, duration: 300 });
    HG.Sound.play('victory');
    await HG.UI.wait(this, 900);
    const t1 = HG.UI.text(this, 160, 116, `칭호 「한국사 박사」  ${s.player.name}`, { depth: 21, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0);
    const nx = HG.UI.text(this, 160, 150, '스페이스를 누르세요', { depth: 21, small: true, color: '#e9e2d0' }).setOrigin(0.5, 0);
    await new Promise(r => { const h = this.keys.push(a => { if (a === 'ok') { this.keys.pop(h); r(); } }); });
    [g, tt, t1, nx].forEach(o => o.destroy());

    // 4. 시간 지킴이 점수
    const sc = HG.Score.calc();
    HG.giveTitle(sc.title); HG.giveTitle(sc.grade);
    s.flags.finalScore = sc.total; HG.Save.save();
    const box = this.add.graphics().setDepth(20);
    box.fillStyle(0x2a241e).fillRoundedRect(40, 4, 240, 160, 6); box.lineStyle(2, 0xdcbc48).strokeRoundedRect(40, 4, 240, 160, 6);
    HG.UI.text(this, 160, 9, `${s.player.name}의 시간 지킴이 점수`, { depth: 21, color: '#e3d49a' }).setOrigin(0.5, 0);
    let yy = 29;
    for (const p of Object.values(sc.parts)) {
      await HG.UI.wait(this, 350); HG.Sound.sfx('cursor');
      HG.UI.text(this, 56, yy, `${p.name}  ${p.n}${p.unit}`, { depth: 21, small: true, color: '#e9e2d0' });
      HG.UI.text(this, 264, yy, `${p.pt}점`, { depth: 21, small: true, color: '#e9e2d0' }).setOrigin(1, 0);
      yy += 13;
    }
    box.lineStyle(1, 0x7d776c).lineBetween(56, yy + 2, 264, yy + 2);
    await HG.UI.wait(this, 500);
    const tot = HG.UI.text(this, 160, yy + 7, '총점  0점', { depth: 21, color: '#ffe14a', stroke: '#1a1410' }).setOrigin(0.5, 0).setScale(1.4);
    await new Promise(r => { const o = { v: 0 }; this.tweens.add({ targets: o, v: sc.total, duration: 1200, onUpdate: () => tot.setText(`총점  ${Math.round(o.v)}점`), onComplete: r }); });
    HG.Sound.sfx('stamp'); this.cameras.main.shake(200, 0.01);
    await HG.UI.wait(this, 400);
    HG.UI.text(this, 160, yy + 30, `칭호 「${sc.grade}」 · 「${sc.title}」`, { depth: 21, color: '#e3d49a' }).setOrigin(0.5, 0);
    HG.UI.text(this, 160, yy + 45, '지식을 많이 쌓을수록 점수가 높아져요!', { depth: 21, small: true, color: '#b3ac9c' }).setOrigin(0.5, 0);
    const end = HG.UI.text(this, 160, 178, `X: 점수 카드 저장  ·  스페이스: 끝`, { depth: 21, small: true, color: '#e9e2d0' }).setOrigin(0.5, 1);
    this.tweens.add({ targets: end, alpha: 0.3, yoyo: true, repeat: -1, duration: 500 });
    // 점수 카드를 그림 파일로 저장 (웨일 팀보드·클래스에 올리기용)
    const save = () => HG.saveScoreCard(this, [end, btn], s.player.name);
    const btn = HG.cardButton(save);
    this.events.once('shutdown', () => btn.remove());
    await new Promise(r => { const h = this.keys.push(a => {
      if (a === 'cancel') { save(); return; }
      if (a === 'ok') { this.keys.pop(h); r(); }
    }); });
    btn.remove();
    // 개발자에게 후기 보내기 (설문 주소가 설정돼 있을 때만)
    if (HG.Review) await HG.Review.ask(this, this.keys, this.dlg);
    HG.Sound.stop();
    this.cameras.main.fadeOut(400); await HG.UI.wait(this, 420);
    const cb = this.onEnd; this.onEnd = null; if (cb) cb('done');
  }
};

// ── 점수 카드 저장 ──
// 화면을 찍어 3배로 키우고, 아래에 게임 이름·날짜를 붙여 PNG로 내려받기
HG.cardButton = function (onClick) {
  const b = document.createElement('button');
  b.textContent = '📷 점수 카드 저장';
  b.style.cssText = 'position:fixed;z-index:20;right:12px;top:12px;font:700 15px Galmuri11,sans-serif;padding:8px 16px;border:3px solid #1a1410;border-radius:6px;background:#dcbc48;color:#1a1410;cursor:pointer;';
  b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); onClick(); });
  document.body.appendChild(b);
  return b;
};
HG.saveScoreCard = function (scene, hide, name) {
  if (HG._savingCard) return; HG._savingCard = true;
  const objs = hide.filter(o => o && o.setVisible);
  objs.forEach(o => o.setVisible(false));
  const btnEl = hide.find(o => o && o.style); if (btnEl) btnEl.style.visibility = 'hidden';
  scene.game.renderer.snapshot(img => {
    objs.forEach(o => o.setVisible(true)); if (btnEl) btnEl.style.visibility = '';
    const k = 3, W = HG.W * k, H = HG.H * k, foot = 36;
    const c = document.createElement('canvas'); c.width = W; c.height = H + foot;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    x.drawImage(img, 0, 0, W, H);
    x.fillStyle = '#1a1410'; x.fillRect(0, H, W, foot);
    const d = new Date(), ds = `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
    x.fillStyle = '#e3d49a'; x.font = '20px Galmuri11, sans-serif'; x.textBaseline = 'middle';
    x.fillText('시간 조각 대모험', 14, H + foot / 2);
    x.textAlign = 'right'; x.fillStyle = '#b3ac9c'; x.fillText(ds, W - 14, H + foot / 2);
    const fname = `time-keeper-card_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}.png`;
    c.toBlob(blob => {
      const url = URL.createObjectURL(blob), a = document.createElement('a');
      a.download = fname; a.href = url;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, 'image/png');
    HG.Sound.sfx('item');
    const t = HG.UI.text(scene, 160, 168, '저장했어요! 팀보드에 올려 보세요', { depth: 30, small: true, color: '#ffe14a', stroke: '#1a1410' }).setOrigin(0.5, 1);
    scene.time.delayedCall(1800, () => t.destroy());
    setTimeout(() => { HG._savingCard = false; }, 600);
  });
};
