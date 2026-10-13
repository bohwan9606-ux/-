// ─────────────────────────────────────────────
// 스테이지 2: 신석기 시대 — 강가 움집 마을
// 마을 일: 토기 빚기(만들기) · 조개 줍기(줍기) · 곡식 갈기(타이밍) → 촌장 퀴즈·배틀
// ─────────────────────────────────────────────
(function () {
  const B = HG.MapBuilder;
  const ERA = 'neolithic';

  HG.Art.register(function (scene) {
    const Px = HG.Pixel;
    HG.Art.person(scene, 'neo_chief', { hair: 'l', shirt: 'l', pants: 'n', band: 'r', beard: true });
    HG.Art.person(scene, 'neo_potter', { hair: 'B', shirt: 'l', pants: 'n', long: true, band: 'o' });
    HG.Art.person(scene, 'neo_fisher', { hair: 'k', shirt: 'n', pants: 'l' });
    HG.Art.person(scene, 'neo_farmer', { hair: 'B', shirt: 'l', pants: 'b', band: 'y' });
    HG.Art.person(scene, 'neo_weaver', { hair: 'k', shirt: 'w', pants: 'n', long: true });
    HG.Art.person(scene, 'neo_kid', { hair: 'B', shirt: 'l', pants: 'n' });
    // 줍기 물건
    Px.draw(scene, 'g_clam', 12, 12, (p, ctx) => { Px.ellipse(p, 6, 7, 5, 4, 'Y'); for (let x = 2; x < 11; x += 2) Px.rect(p, x, 4, 1, 6, 'n'); Px.rect(p, 1, 9, 10, 1, 'n'); Px.outline(ctx, 12, 12); });
    Px.draw(scene, 'g_crab', 14, 12, (p, ctx) => { Px.ellipse(p, 7, 7, 5, 3, 'r'); Px.rect(p, 1, 3, 2, 3, 'r'); Px.rect(p, 11, 3, 2, 3, 'r'); p(5, 5, 'k'); p(9, 5, 'k'); for (let x = 3; x < 12; x += 3) p(x, 10, 'R'); Px.outline(ctx, 14, 12); });
    // 토기 빚기 단계 (48x40)
    const board = p => { Px.rect(p, 8, 34, 32, 4, 'b'); Px.rect(p, 8, 34, 32, 1, 'n'); };
    const lump = (p, smooth) => { Px.ellipse(p, 24, 28, 9, 6, smooth ? 'o' : 'n'); if (!smooth) { p(20, 26, 'b'); p(27, 29, 'b'); p(23, 24, 'b'); } else Px.ellipse(p, 21, 26, 3, 2, 'Y'); };
    const pot = (p, col) => { Px.poly(p, [[14, 6], [34, 6], [32, 22], [24, 34], [16, 22]], col); Px.rect(p, 14, 6, 20, 2, col === 'n' ? 'b' : 'R'); };
    const comb = p => { for (let y = 9; y < 28; y += 3) for (let x = 16; x < 33; x += 3) { p(x, y, 'b'); p(x + 1, y + 1, 'b'); } };
    const fire = p => { [[6, 36], [42, 36]].forEach(([x, y]) => { Px.poly(p, [[x, y - 8], [x + 3, y], [x - 3, y]], 'r'); Px.poly(p, [[x, y - 5], [x + 2, y], [x - 2, y]], 'y'); }); };
    const st = [p => { board(p); lump(p, false); }, p => { board(p); lump(p, true); }, p => { board(p); pot(p, 'n'); }, p => { board(p); pot(p, 'n'); comb(p); }, p => { board(p); pot(p, 'o'); comb(p); fire(p); }];
    st.forEach((f, i) => Px.draw(scene, 'pot' + i, 48, 40, (p, ctx) => { f(p); Px.outline(ctx, 48, 40); }));
    Px.draw(scene, 'm_clay', 16, 16, (p, ctx) => { Px.ellipse(p, 8, 9, 6, 5, 'n'); p(6, 7, 'b'); p(10, 10, 'b'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_hands', 16, 16, (p, ctx) => { Px.ellipse(p, 5, 8, 3, 4, 's'); Px.ellipse(p, 11, 8, 3, 4, 's'); Px.rect(p, 4, 12, 8, 2, 'S'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_combtool', 16, 16, (p, ctx) => { Px.rect(p, 3, 3, 10, 3, 'n'); for (let x = 3; x < 13; x += 2) Px.rect(p, x, 6, 1, 6, 'b'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_fire', 16, 16, (p, ctx) => { Px.poly(p, [[8, 1], [13, 13], [3, 13]], 'r'); Px.poly(p, [[8, 5], [11, 13], [5, 13]], 'y'); Px.rect(p, 3, 13, 10, 2, 'B'); Px.outline(ctx, 16, 16); });
  });

  // ── 강가 움집 마을
  const v = new B(30, 20, '.');
  v.rect(0, 0, 30, 1, 'T').rect(0, 0, 1, 15, 'T').rect(29, 0, 1, 15, 'T');
  v.rect(0, 15, 30, 1, 's').rect(0, 16, 30, 4, '~').rect(20, 14, 8, 2, 's');
  v.rect(2, 2, 7, 4, 'F');
  v.rect(22, 2, 6, 5, ',');
  v.rect(10, 9, 14, 1, ':').rect(16, 6, 1, 3, ':').rect(18, 10, 1, 3, ':');
  v.dots([[12, 3], [26, 9], [3, 12], [9, 13], [14, 13]], '"').dots([[1, 13], [28, 13]], 'T');
  HG.maps.neo_village = {
    id: 'neo_village', name: '강가 움집 마을', music: 'village', tiles: v.rows(),
    waterTalk: ['강물에 물고기가 헤엄친다. 신석기 사람들은 강가나 바닷가에 마을을 이루고 살았다.'],
    objects: [
      { kind: 'pithouse', x: 14, y: 3, talk: ['촌장님의 큰 움집이다.', '땅을 파고 기둥을 세운 뒤 지붕을 덮어 만든 집이야. 가운데에 화덕이 있어.'] },
      { kind: 'pithouse', x: 10, y: 5, talk: ['움집이다. 땅을 둥글게 파고 지은 집이라 겨울에도 따뜻하다.'] },
      { kind: 'pithouse', x: 6, y: 10, talk: ['움집 안에 빗살무늬 토기가 가지런히 놓여 있다.'], secret: { id: 'neolithic_pithouse', item: ['berry', 3], fact: '움집은 땅을 둥글게 파고 기둥을 세운 뒤 지붕을 덮은 집이야. 가운데에 화덕을 두어 음식을 익히고 몸을 녹였지.' } },
      { kind: 'pithouse', x: 12, y: 11, talk: ['움집 안에서 실을 뽑는 소리가 들린다.'], secret: { id: 'neolithic_spindle', mon: ['spindle', 8], fact: '가락바퀴를 돌려 실을 뽑고, 뼈바늘로 옷과 그물을 만들었어.' } },
      { kind: 'fire', x: 16, y: 10, talk: ['모닥불에서 토기를 굽고 있다.'], secret: { id: 'neolithic_fire', item: ['meat', 2], fact: '흙으로 빚은 그릇을 불에 구우면 단단한 토기가 돼. 토기에 곡식을 담아 오래 두고 먹을 수 있었지.' } },
      { kind: 'sign', x: 21, y: 8, talk: ['북쪽 풀숲: 홀린 유물이 가끔 튀어나온다.'] },
      { kind: 'timemachine', x: 19, y: 12, talk: async ev => HG.Era.timeMachine(ev, ev.flag('neolithicClear')) }
    ],
    npcs: [
      { id: 'chief', sprite: 'neo_chief', x: 15, y: 5, dir: 'down', mark: ev => tasks(ev.state) >= 3 && !ev.flag('neolithicClear'), talk: async ev => chief(ev) },
      { id: 'potter', sprite: 'neo_potter', x: 8, y: 9, dir: 'right', mark: ev => !ev.flag('neoPot'), talk: async ev => potter(ev) },
      { id: 'fisher', sprite: 'neo_fisher', x: 23, y: 13, dir: 'down', mark: ev => !ev.flag('neoShell'), talk: async ev => fisher(ev) },
      { id: 'farmer', sprite: 'neo_farmer', x: 5, y: 6, dir: 'down', mark: ev => !ev.flag('neoGrind'), talk: async ev => farmer(ev) },
      { id: 'weaver', sprite: 'neo_weaver', x: 13, y: 13, dir: 'up', talk: ['실 뽑는 사람: 가락바퀴를 돌려 실을 뽑고, 뼈바늘로 옷을 지어 입어.', '구석기 사람들은 가죽을 걸쳤지만, 우리는 실로 옷을 만들 줄 안단다.'] },
      { id: 'kid', sprite: 'neo_kid', x: 20, y: 9, dir: 'down', wander: 2, talk: ['아이: 우리는 이제 옮겨 다니지 않아! 농사를 지으면서 한곳에 머물러 살거든.', '이걸 「정착 생활」이라고 한대.'] }
    ],
    warps: [],
    encounterRate: 0.08,
    encounter: () => { const t = [['combpot', 30], ['grinder', 30], ['polishedaxe', 25], ['spindle', 15]]; let r = Math.random() * 100, sp = t[0][0]; for (const [id, w] of t) { if ((r -= w) < 0) { sp = id; break; } } return [sp, HG.rand(6, 9)]; },
    onEnter: async ev => {
      if (!ev.flag('neo_arrived')) {
        await ev.say('타임머신이 덜컹거리며 멈췄다. 여기는…', '할아버지(무전기): 신석기 시대에 왔구나! 사람들이 강가에 움집을 짓고 농사를 짓기 시작한 때란다.');
        await HG.Era.showEvolutions(ev);
        await ev.say('할아버지: 이 마을 촌장님께 인정을 받으려면, 먼저 마을 사람들을 도와 드리렴. 「!」가 있는 사람들이야.');
        await HG.Secret.tip(ev);
        ev.setFlag('neo_arrived');
      } else await HG.Era.showEvolutions(ev);
    }
  };

  const T = ['neoPot', 'neoShell', 'neoGrind'];
  const tasks = s => T.filter(f => s.flags[f]).length;
  async function done(ev, name) {
    HG.Sound.sfx('stamp');
    const n = tasks(ev.state);
    await ev.say(`마을 일 「${name}」 완료! (${n}/3)` + (n >= 3 ? ' 이제 촌장님을 찾아가자!' : ''));
  }

  const POT = {
    title: '토기 빚기', speaker: '토기 빚는 사람', npc: 'neo_potter', stageKey: 'pot', bg: 'grass', exp: 40,
    intro: ['토기 빚는 사람: 흙으로 그릇을 빚어 불에 구우면 단단한 토기가 된단다. 순서대로 해 보자!'],
    steps: [
      { name: '흙 반죽', icon: 'm_clay', act: '흙을 주물러 반죽하자', hint: '먼저 흙을 물과 섞어 말랑하게 반죽해야 해.' },
      { name: '모양 빚기', icon: 'm_hands', act: '그릇 모양을 빚자', hint: '반죽한 흙으로 그릇 모양부터 만들어야지.' },
      { name: '빗살무늬 새기기', icon: 'm_combtool', act: '빗살무늬를 새기자', hint: '굽기 전에, 말랑할 때 무늬를 새겨야 해.' },
      { name: '불에 굽기', icon: 'm_fire', act: '불에 구워 단단하게!', hint: '마지막으로 불에 구워야 단단해진단다.' }
    ],
    outro: ['빗살무늬 토기가 완성되었다!', '토기 빚는 사람: 바닥이 뾰족해서 강가 모래에 꽂아 두기 좋단다.']
  };

  async function potter(ev) {
    if (ev.flag('neoPot')) { await ev.say('토기 빚는 사람: 토기 덕분에 곡식을 오래 담아 둘 수 있어. 농사를 짓게 되면서 꼭 필요해졌지.'); return; }
    const c = await ev.choose('토기 빚는 사람: 곡식을 담을 그릇이 모자라. 토기 빚는 걸 도와줄래?', ['도와줄게요!', '다음에요'], 1);
    if (c !== 0) return;
    await ev.build(POT);
    ev.setFlag('neoPot');
    ev.addMon('combpot', 8); HG.Sound.sfx('levelup');
    await ev.say('빗살무늬 토기가 동료가 되었다!');
    await done(ev, '토기 빚기');
  }

  const FISH = { title: '작살 낚시', need: 8, time: 40, exp: 40, npc: 'neo_fisher',
    intro: ['고기잡이: 신석기 사람들은 뼈로 만든 작살과 그물로 물고기를 잡았어.', '고기잡이: 물고기가 지나갈 때 스페이스로 작살을 던져 8마리를 잡아 봐!', '보라색 시간 괴물을 맞히면 작살이 엉켜 버리니 조심해!'],
    outro: ['물고기를 넉넉히 잡았다!', '고기잡이: 우리가 먹고 버린 조개껍데기는 쌓여서 「조개더미」가 된단다.'] };

  async function fisher(ev) {
    if (ev.flag('neoShell')) { await ev.say('고기잡이: 우리가 먹고 버린 조개껍데기가 쌓여 「조개더미」가 되었지. 옛날 사람들이 무엇을 먹었는지 알 수 있대.'); return; }
    await ev.say('고기잡이: 우리는 농사도 짓지만, 강과 바다에서 물고기를 잡고 조개도 캐서 먹어.');
    const c = await ev.choose('고기잡이: 같이 작살로 물고기를 잡아 볼래?', ['좋아요!', '다음에요'], 1);
    if (c !== 0) return;
    const r = await ev.mini('Harpoon', FISH);
    if (r !== 'win') return;
    HG.state.bag.meat = (HG.state.bag.meat || 0) + 3; HG.Sound.sfx('item');
    await ev.say('고기잡이: 솜씨 좋다! 잡은 물고기 대신 고기 3개를 나눠 줄게.');
    ev.setFlag('neoShell');
    await done(ev, '작살 낚시');
  }

  const GRIND = {
    title: '곡식 갈기', npc: 'neo_farmer', icon: 'mon_grinder', act: '갈돌로 쓱싹!', rounds: 4, speed: 1.0, zone: 40, exp: 40, bg: 'grass', music: 'village',
    intro: ['농부: 갈판 위에 곡식을 올리고, 바늘이 초록 칸에 올 때 스페이스를 눌러 갈돌을 밀어!'],
    outro: ['곡식을 곱게 갈았다!', '농부: 이렇게 껍질을 벗기고 가루를 내서 먹는단다.']
  };

  async function farmer(ev) {
    if (ev.flag('neoGrind')) { await ev.say('농부: 농사를 지으면서 우리는 한곳에 머물러 살게 됐어. 곡식이 있으니 옮겨 다닐 필요가 없거든.'); return; }
    await ev.say('농부: 밭에서 조와 피 같은 곡식을 길러. 신석기 시대부터 사람들이 농사를 짓기 시작했단다.');
    const c = await ev.choose('농부: 거둔 곡식을 갈돌로 갈아야 하는데, 도와줄래?', ['도와줄게요!', '다음에요'], 1);
    if (c !== 0) return;
    await ev.mini('Timing', GRIND);
    ev.setFlag('neoGrind');
    ev.addMon('grinder', 8); HG.Sound.sfx('levelup');
    await ev.say('갈돌과 갈판이 동료가 되었다!');
    await done(ev, '곡식 갈기');
  }

  const QUIZ = [
    { q: '신석기 사람들이 돌을 갈아서 만든 도구는?', options: ['간석기', '뗀석기', '청동기'], why: '돌을 갈아 만든 도구가 간석기야. 뗀석기는 구석기 시대 도구란다.' },
    { q: '신석기 사람들이 곡식을 담거나 저장한 그릇은?', options: ['빗살무늬 토기', '고려청자', '조선 백자'], why: '흙으로 빚어 불에 구운 빗살무늬 토기에 곡식을 담았어.' },
    { q: '신석기 사람들이 살던 집은?', options: ['움집', '막집', '기와집'], why: '땅을 파고 기둥을 세워 지붕을 덮은 움집에서 살았어.' },
    { q: '신석기 시대에 처음 시작된 일은?', options: ['농사', '금속 활자 인쇄', '철로 무기 만들기'], why: '신석기 시대에 농사를 짓기 시작했어. 그래서 한곳에 머물러 살게 됐지.' },
    { q: '농사를 지으며 한곳에 머물러 사는 생활은?', options: ['정착 생활', '이동 생활', '유목 생활'], why: '한곳에 머물러 사는 것을 정착 생활이라고 해.' },
    { q: '실을 뽑는 데 쓴 신석기 도구는?', options: ['가락바퀴', '반달 돌칼', '비파형 동검'], why: '가락바퀴로 실을 뽑고 뼈바늘로 옷을 지었어.' }
  ];

  async function chief(ev) {
    if (ev.flag('neolithicClear')) { await ev.say('촌장: 이제 너도 우리 마을 사람이나 다름없구나. 타임머신으로 다음 시대에 가 보거라.'); return; }
    const n0 = tasks(ev.state);
    if (n0 < 3) { await ev.say(`촌장: 우리 마을 일을 도와주면 너를 인정하마. (지금 ${n0}/3)`); return; }
    await ev.say('촌장: 마을 일을 모두 도와주었구나! 이제 신석기 사람의 지혜를 시험해 보겠다.');
    const n = await ev.quiz(QUIZ, 3);
    const boost = n >= 3 ? 2 : n >= 2 ? 1 : 0;
    await ev.say(`촌장: ${n}개를 맞혔구나. ` + (boost ? '좋다, 겨뤄 보자!' : '아쉽지만 힘으로 겨뤄 보자!'));
    const r = await ev.battle({ trainer: { name: '촌장', sprite: 'neo_chief', team: [['grinder', 8], ['polishedaxe', 9]], lose: ['촌장: 훌륭하다! 너는 진정한 신석기 농부로구나.'] }, bg: 'bb_village', music: 'boss', atkBoost: boost });
    if (r !== 'win') return;
    await HG.Era.award(ev, { name: '간석기 인장', icon: 'mon_polishedaxe' });
    await ev.say('할아버지(무전기): 시간 조각이 돌아왔다! 타임머신으로 와서 다음 시대로 가자!');
  }

  function objective(s) {
    const f = s.flags;
    if (!f.neo_arrived) return '';
    const n = tasks(s);
    if (n < 3) return `마을 일 돕기 ${n}/3 (토기 · 낚시 · 곡식)`;
    if (!f.neolithicClear) return '움집 앞 촌장님을 만나자';
    return '타임머신으로 다음 시대에 가자';
  }

  HG.registerStage({
    id: ERA, name: '신석기', type: 'village', baseLevel: 8, teacher: '촌장',
    start: { map: 'neo_village', x: 21, y: 13, dir: 'left' },
    battleBg: 'bb_village', respawn: { map: 'neo_village', x: 21, y: 13, dir: 'left' }, objective, quiz: QUIZ,
    taskFlags: T, devMinis: [{ name: '토기 빚기', scene: 'Build', p: POT }, { name: '작살 낚시', scene: 'Harpoon', p: FISH }, { name: '곡식 갈기', scene: 'Timing', p: GRIND }]
  });
})();
