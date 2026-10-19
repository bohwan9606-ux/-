// 시간의 꽃길 — 엔딩을 본 뒤 구석기 사냥터 들판 북쪽에 열리는 축하 길
// 모은 동료가 시대 순서대로 길 양옆에 서서 반겨 주고(가드 오브 아너), 길 끝 광장에서 스승들이 맞아 줌
HG.Honor = {
  // 엔딩을 봤으면(점수 카드가 나왔거나 마지막 인장이 있으면) 열림
  open() { const s = HG.state; return !!s && (s.flags.finalScore != null || s.stamps.includes('modern')); },

  // 엔딩 크레딧이 끝난 뒤: 처음 시작했던 구석기로 가 볼까?
  async invite(ev) {
    if (!HG.Honor.open()) return;
    await ev.say('할아버지(무전기): {name}! 시간 조각을 모두 되찾았더니, 구석기 사냥터 들판 북쪽의 시간 안개가 걷혔다는구나!');
    const i = await ev.choose('처음 시작했던 구석기 시대로 가 볼까?', ['가 본다', '나중에'], 1);
    if (i !== 0) { await ev.say('할아버지(무전기): 언제든 타임머신 「다른 시대로 가기」로 구석기에 가 보렴. 북쪽 길이 열려 있을 거야.'); return; }
    HG.Era.enter(ev.scene, 'paleolithic');
    Object.assign(HG.state.player, { map: 'field', x: 13, y: 4, dir: 'up' });
    HG.Save.save();
  }
};

// 꽃잎 길 (밟을 수 있음)
HG.Art.register(function (scene) {
  const Px = HG.Pixel;
  Px.draw(scene, 't_petal', 16, 16, p => {
    Px.rect(p, 0, 0, 16, 16, 'Y'); for (let i = 0; i < 8; i++) p((i * 7 + 2) % 16, (i * 5 + 1) % 16, 'y');
    [[2, 3, 'P'], [10, 2, 'w'], [6, 8, 'P'], [13, 9, 'r'], [3, 12, 'w'], [11, 13, 'P']].forEach(([x, y, c]) => { p(x, y, c); p(x + 1, y, c); });
  });
  HG.TILES['q'] = { tex: 't_petal' };
});

(function () {
  const W = 22, ROWS = 18, TOP = 7, H = TOP + ROWS + 4;
  const L = 8, R = 13;           // 동료가 서는 칸 (왼쪽 · 오른쪽)
  const b = new HG.MapBuilder(W, H, '"');
  // 바탕: 꽃과 풀이 섞인 들판
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if ((x * 7 + y * 3) % 5 === 0) b.set(x, y, '.');
  b.border('T');
  // 광장 (꽃잎 바닥)
  b.rect(1, 1, W - 2, TOP - 1, '"').rect(3, 4, W - 6, 2, 'q').rect(10, 1, 2, TOP, 'q');
  b.rect(1, 1, 1, 2, 'h').rect(W - 2, 1, 1, 2, 'h');
  // 꽃길: 가운데 꽃잎 길, 양옆 꽃밭, 그 위에 동료가 섬
  for (let y = TOP; y < TOP + ROWS; y++) {
    b.set(10, y, 'q').set(11, y, 'q').set(9, y, '"').set(12, y, '"');
    b.set(L, y, 'h').set(R, y, 'h').set(6, y, 'h').set(7, y, 'h').set(14, y, 'h').set(15, y, 'h');
    if (y % 4 === 0) { b.set(2, y, 'T'); b.set(W - 3, y, 'T'); }
  }
  // 입구
  b.rect(9, TOP + ROWS, 4, 3, '"').rect(10, TOP + ROWS, 2, 4, 'q');

  const TEACH = [
    ['npc_elder', '부족장', '부족장: 뗀석기를 처음 쥐던 꼬마가 이렇게 자랐구나!'],
    ['neo_chief', '촌장', '촌장: 농사를 짓고 정착하던 그때를 기억하니?'],
    ['go_dangun', '단군왕검', '단군왕검: 우리 역사의 첫 나라, 고조선부터 여기까지 왔구나.'],
    ['tk_gwanggaeto', '광개토대왕', '광개토대왕: 넓은 땅을 달리듯, 먼 시간을 달려왔구나!'],
    ['gr_gangamchan', '강감찬', '강감찬: 지혜와 용기로 시간 괴물을 물리쳤구려.'],
    ['js_yisunsin', '이순신', '이순신: 그대와 함께한 동료들이 길에 줄지어 축하하고 있소.'],
    ['lj_jeongyakyong', '정약용', '정약용: 배움을 실제로 쓰는 것, 그것이 진짜 공부라오.'],
    ['us_daejoyeong', '대조영', '대조영: 고구려를 이은 발해처럼, 역사는 이어진단다.']
  ];
  const xs = [1, 3, 5, 7, 14, 16, 18, 20];
  const npcs = TEACH.map(([sp, nm, line], i) => ({ id: 'teach' + i, sprite: sp, x: xs[i], y: 3, dir: 'down', talk: [line] }));
  npcs.push({ id: 'grandpa', sprite: 'grandpa', x: 10, y: 2, dir: 'down', talk: async ev => HG.Honor.ceremony(ev, true) });
  npcs.push({ id: 'kimgu', sprite: 'cl_kimgu', x: 11, y: 2, dir: 'down', talk: ['김구: 우리 역사를 기억하는 마음이 곧 나라를 지키는 힘이란다.'] });

  HG.maps.honor = {
    id: 'honor', name: '시간의 꽃길', music: 'title', tiles: b.rows(),
    npcs,
    objects: [{ kind: 'sign', x: 9, y: TOP + ROWS + 1, talk: ['「시간의 꽃길」', '시간 조각을 모두 되찾은 시간 지킴이만 걸을 수 있는 길.', '동료들이 시대 순서대로 서서 기다리고 있다!'] }],
    warps: [{ x: 10, y: H - 1, to: 'field', tx: 13, ty: 2, dir: 'down' }, { x: 11, y: H - 1, to: 'field', tx: 14, ty: 2, dir: 'down' }],
    triggers: [{ x: 10, y: TOP - 1, w: 2, run: async ev => HG.Honor.ceremony(ev, false) }],
    onEnter: async ev => HG.Honor.setup(ev.scene)
  };

  // 동료를 시대 순서로 길 양옆에 세우고, 지나가면 폴짝
  HG.Honor.setup = function (S) {
    const s = HG.state, ids = HG.dexList();
    const slots = [];
    let lastEra = null;
    ids.forEach((id, i) => {
      const row = Math.floor(i / 2), side = i % 2 ? R : L;
      const y = TOP + ROWS - 1 - row;          // 입구 쪽이 구석기, 광장 쪽이 현대
      const has = !!s.dex.caught[id];
      const img = S.add.image(side * HG.T + 8, y * HG.T + 15, 'mon_' + id).setOrigin(0.5, 1).setScale(0.8).setDepth(y * HG.T + 14);
      if (side === R) img.setFlipX(true);
      if (!has) img.setTintFill(0xe9e2d0).setAlpha(0.45);
      slots.push({ img, y, has });
      const era = HG.ARTIFACTS[id].era;
      if (era !== lastEra) {
        lastEra = era;
        const e = HG.ERAS.find(x => x.id === era);
        HG.UI.text(S, 5 * HG.T + 4, y * HG.T + 2, e ? e.short : '', { small: true, color: '#e9e2d0', stroke: '#1a1410', depth: 600 }).setOrigin(1, 0).setScrollFactor(1);
      }
    });
    S.honorSlots = slots;
    // 꽃잎이 흩날림
    S.time.addEvent({ delay: 260, loop: true, callback: () => {
      const cam = S.cameras.main, x = cam.scrollX + HG.rand(0, HG.W), y = cam.scrollY - 4;
      const c = S.add.rectangle(x, y, 2, 2, HG.pick([0xd684aa, 0xe9e2d0, 0xe3d49a])).setDepth(700);
      S.tweens.add({ targets: c, y: y + HG.H + 10, x: x + HG.rand(-30, 30), angle: 180, duration: HG.rand(2600, 4000), onComplete: () => c.destroy() });
    } });
    // 가드 오브 아너: 주인공이 다가오면 그 줄의 동료가 폴짝 뛰며 반김
    S.time.addEvent({ delay: 100, loop: true, callback: () => {
      const py = HG.state.player.y;
      slots.forEach(sl => {
        if (sl.done || !sl.has || py > sl.y + 1) return;
        sl.done = true;
        S.tweens.add({ targets: sl.img, y: sl.img.y - 7, duration: 140, yoyo: true, repeat: 1, ease: 'Quad.easeOut' });
        if (sl.img.x < 10.5 * HG.T) HG.Sound.sfx('cursor');
      });
    } });
  };

  // 길 끝 광장: 할아버지와 스승들이 맞아 줌 (처음 한 번은 긴 장면, 그 뒤엔 짧게)
  HG.Honor.ceremony = async function (ev, talked) {
    const s = HG.state, ids = HG.dexList(), n = ids.filter(id => s.dex.caught[id]).length;
    if (s.flags.honorDone && !talked) return;
    if (!s.flags.honorDone) {
      HG.Sound.sfx('levelup');
      await ev.say('할아버지: {name}! 시간 조각을 모두 되찾아 준 덕분에 시간 안개가 걷혔단다.',
        '할아버지: 봐라, 그동안 함께한 동료들이 시대 순서대로 서서 너를 반겨 주었지?',
        '광개토대왕: 구석기부터 현대까지, 정말 먼 길을 왔구나!',
        '이순신: 그대와 함께한 동료들이 길에 줄지어 축하하고 있소.',
        '김구: 우리 역사를 기억하는 마음이 곧 나라를 지키는 힘이란다.');
      HG.giveTitle('꽃길의 시간 지킴이');
      s.flags.honorDone = true; HG.Save.save();
      HG.Sound.sfx('stamp');
      await ev.say('칭호 「꽃길의 시간 지킴이」를 받았다!');
    }
    if (n >= ids.length) await ev.say(`할아버지: 도감 ${n}종을 모두 채웠구나! 꽃길이 동료들로 가득하구나. 진정한 시간 지킴이다!`);
    else await ev.say(`할아버지: 지금까지 모은 동료는 ${n}종이란다.`, '할아버지: 흐린 빈자리는 아직 만나지 못한 동료들이야. 도감의 힌트를 보고 찾아보렴. 찾을 때마다 이 길에 와서 서 있을 거란다!');
  };
})();
