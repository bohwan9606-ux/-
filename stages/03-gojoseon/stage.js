// ─────────────────────────────────────────────
// 스테이지 3: 청동기 시대와 고조선 — 논이 있는 고인돌 마을
// 마을 일: 고인돌 세우기(만들기) · 벼 거두기(줍기) · 8조법 재판(대화) → 단군왕검 퀴즈·배틀
// ─────────────────────────────────────────────
(function () {
  const B = HG.MapBuilder;
  const ERA = 'gojoseon';

  HG.Art.register(function (scene) {
    const Px = HG.Pixel;
    HG.Art.person(scene, 'go_dangun', { hair: 'k', shirt: 'w', pants: 'w', robe: 'w', belt: 'y', band: 'y', beard: true, collar: 'y' });
    HG.Art.person(scene, 'go_builder', { hair: 'k', shirt: 'Y', pants: 'b', band: 'n' });
    HG.Art.person(scene, 'go_farmer', { hair: 'B', shirt: 'Y', pants: 'n', long: true });
    HG.Art.person(scene, 'go_judge', { hair: 'l', shirt: 'e', pants: 'n', robe: 'e', beard: true, band: 'y' });
    HG.Art.person(scene, 'go_smith', { hair: 'k', shirt: 'G', pants: 'b', band: 'r' });
    HG.Art.person(scene, 'go_kid', { hair: 'k', shirt: 'Y', pants: 'b' });
    Px.draw(scene, 'g_rice', 12, 12, (p, ctx) => { Px.rect(p, 6, 4, 1, 8, 'e'); for (let y = 1; y < 8; y += 2) { p(4, y, 'y'); p(5, y + 1, 'y'); p(7, y, 'y'); p(8, y + 1, 'y'); } Px.outline(ctx, 12, 12); });
    Px.draw(scene, 'g_snake', 14, 10, (p, ctx) => { for (let x = 1; x < 12; x++) p(x, 5 + Math.round(Math.sin(x / 1.5) * 2), 'e'); for (let x = 1; x < 12; x++) p(x, 6 + Math.round(Math.sin(x / 1.5) * 2), 'E'); Px.rect(p, 11, 3, 3, 3, 'e'); p(12, 3, 'k'); Px.outline(ctx, 14, 10); });
    // 고인돌 세우기 단계 (48x40)
    const ground = p => { Px.ellipse(p, 24, 37, 22, 2, 'b'); };
    const legs = p => { Px.rect(p, 12, 22, 6, 15, 'g'); Px.rect(p, 30, 22, 6, 15, 'g'); Px.rect(p, 13, 23, 1, 12, 'l'); Px.rect(p, 31, 23, 1, 12, 'l'); };
    const ramp = p => Px.poly(p, [[2, 37], [12, 22], [36, 22], [46, 37]], 'n');
    const cap = (p, y) => { Px.poly(p, [[6, y + 6], [10, y], [38, y], [42, y + 6], [40, y + 9], [8, y + 9]], 'g'); Px.rect(p, 12, y + 1, 24, 2, 'l'); };
    const logs = p => { [8, 18, 28, 38].forEach(x => Px.ellipse(p, x, 36, 2, 2, 'b')); };
    const st = [p => { ground(p); }, p => { ground(p); legs(p); }, p => { ground(p); ramp(p); legs(p); }, p => { ground(p); ramp(p); legs(p); logs(p); cap(p, 13); }, p => { ground(p); legs(p); cap(p, 13); }];
    st.forEach((f, i) => Px.draw(scene, 'dol' + i, 48, 40, (p, ctx) => { f(p); Px.outline(ctx, 48, 40); }));
    Px.draw(scene, 'm_pillar', 16, 16, (p, ctx) => { Px.rect(p, 5, 1, 6, 14, 'g'); Px.rect(p, 6, 2, 1, 11, 'l'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_soil', 16, 16, (p, ctx) => { Px.poly(p, [[1, 14], [8, 4], [15, 14]], 'n'); p(7, 9, 'b'); p(10, 12, 'b'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_log', 16, 16, (p, ctx) => { Px.rect(p, 1, 6, 14, 5, 'b'); Px.ellipse(p, 14, 8, 2, 2, 'n'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_shovel', 16, 16, (p, ctx) => { Px.rect(p, 7, 1, 2, 9, 'b'); Px.poly(p, [[4, 9], [12, 9], [10, 15], [6, 15]], 'g'); Px.outline(ctx, 16, 16); });
  });

  // ── 고인돌 마을
  const v = new B(30, 20, '.');
  v.border('T');
  v.rect(2, 11, 10, 6, 'R').rect(18, 12, 9, 5, 'R');
  v.rect(1, 9, 28, 1, ':').rect(14, 1, 2, 8, ':').rect(14, 10, 1, 9, ':');
  v.rect(12, 2, 6, 4, 'Q');
  v.rect(23, 2, 5, 4, ',');
  v.dots([[4, 3], [8, 6], [20, 7], [26, 10], [11, 17], [16, 17]], '"');
  HG.maps.go_village = {
    id: 'go_village', name: '고인돌 마을', music: 'village', tiles: v.rows(),
    objects: [
      { kind: 'dolmen', x: 3, y: 2, talk: ['고인돌이다. 커다란 덮개돌 아래에 힘센 지배자가 묻혀 있다고 한다.', '이렇게 큰 돌을 옮기려면 아주 많은 사람이 힘을 모아야 했다.'] },
      { kind: 'dolmen', x: 7, y: 4, talk: ['또 다른 고인돌이다. 이 마을 지배자의 힘이 아주 셌던 모양이다.'], secret: { id: 'gojoseon_dolmen', item: ['meat', 2], fact: '우리나라에는 세계 고인돌의 절반 가까이가 있어. 고창·화순·강화의 고인돌은 세계 유산이야.' } },
      { kind: 'pithouse', x: 18, y: 4, talk: ['움집이다. 청동기 시대에도 사람들은 움집에서 살았다.'] },
      { kind: 'pithouse', x: 20, y: 9, talk: ['움집 안에 민무늬 토기가 놓여 있다.'], secret: { id: 'gojoseon_plainpot', mon: ['plainpot', 10], fact: '청동기 시대에는 무늬가 없는 「민무늬 토기」를 많이 썼어.' } },
      { kind: 'fire', x: 10, y: 7, talk: ['청동을 녹이는 불이다. 아주 뜨겁다!'], secret: { id: 'gojoseon_bronze', item: ['berry', 3], fact: '청동은 구리에 주석을 섞어 만든 금속이야. 귀해서 지배자들이 무기나 거울, 방울로 썼어.' } },
      { kind: 'timemachine', x: 16, y: 14, talk: async ev => HG.Era.timeMachine(ev, ev.flag('gojoseonClear')) }
    ],
    npcs: [
      { id: 'dangun', sprite: 'go_dangun', x: 15, y: 3, dir: 'down', mark: ev => tasks(ev.state) >= 3 && !ev.flag('gojoseonClear'), talk: async ev => dangun(ev) },
      { id: 'builder', sprite: 'go_builder', x: 6, y: 7, dir: 'down', mark: ev => !ev.flag('goDolmen'), talk: async ev => dolmenTask(ev) },
      { id: 'farmer', sprite: 'go_farmer', x: 12, y: 13, dir: 'left', mark: ev => !ev.flag('goRice'), talk: async ev => riceTask(ev) },
      { id: 'judge', sprite: 'go_judge', x: 17, y: 3, dir: 'left', mark: ev => !ev.flag('goLaw'), talk: async ev => lawTask(ev) },
      { id: 'smith', sprite: 'go_smith', x: 11, y: 7, dir: 'left', talk: ['청동 장인: 구리에 주석을 섞어 녹이면 청동이 돼. 청동은 귀해서 무기나 거울, 방울을 만들었지.', '청동기를 가진 사람이 힘을 갖게 되면서 다스리는 사람과 다스림을 받는 사람이 생겼어.'] },
      { id: 'kid', sprite: 'go_kid', x: 24, y: 9, dir: 'down', wander: 2, talk: ['아이: 저기 논에서 벼농사를 지어! 반달 돌칼로 벼 이삭을 따지.'] }
    ],
    warps: [],
    encounterRate: 0.08,
    encounter: () => { const t = [['plainpot', 35], ['halfmoon', 35], ['bronzemirror', 20], ['bronzesword', 10]]; let r = Math.random() * 100, sp = t[0][0]; for (const [id, w] of t) { if ((r -= w) < 0) { sp = id; break; } } return [sp, HG.rand(9, 12)]; },
    onEnter: async ev => {
      if (!ev.flag('go_arrived')) {
        await ev.say('할아버지(무전기): 이번엔 청동기 시대구나! 청동으로 무기와 도구를 만들고, 논에서 벼농사도 짓던 때란다.');
        await HG.Era.showEvolutions(ev);
        await ev.say('할아버지: 저 위에 계신 분이 바로 단군왕검이야. 우리 역사 최초의 나라, 고조선을 세운 분이지!', '할아버지: 마을 사람들을 도와 인정을 받아 보렴.');
        await HG.Secret.tip(ev);
        ev.setFlag('go_arrived');
      } else await HG.Era.showEvolutions(ev);
    }
  };

  const T = ['goDolmen', 'goRice', 'goLaw'];
  const tasks = s => T.filter(f => s.flags[f]).length;
  async function done(ev, name) {
    HG.Sound.sfx('stamp');
    const n = tasks(ev.state);
    await ev.say(`마을 일 「${name}」 완료! (${n}/3)` + (n >= 3 ? ' 이제 단군왕검을 찾아가자!' : ''));
  }

  const DOLMEN = { title: '고인돌 세우기', npc: 'go_builder', exp: 45, wall: 't_tree', floor: 't_grass',
    intro: ['일꾼: 고인돌은 굄돌을 세우고, 흙으로 비탈을 쌓은 뒤, 통나무를 깔아 덮개돌을 굴려 올려서 만들었어.', '일꾼: 덮개돌은 아주 무거워서 당길 수 없고 뒤에서 밀기만 할 수 있어. 받침돌(□) 위로 모두 밀어 올려 줘!', '막히면 X를 눌러 처음부터 다시 할 수 있어.'],
    outro: ['고인돌이 완성되었다!', '일꾼: 덮개돌을 올린 뒤에는 쌓았던 흙을 치웠지. 이렇게 큰 무덤을 만들 수 있다는 건 지배자의 힘이 아주 셌다는 뜻이야.'] };

  async function dolmenTask(ev) {
    if (ev.flag('goDolmen')) { await ev.say('일꾼: 고인돌을 보면 그 사람이 얼마나 많은 사람을 부릴 수 있었는지 알 수 있지.'); return; }
    const c = await ev.choose('일꾼: 지배자의 무덤인 고인돌을 세워야 해. 힘을 보태 줄래?', ['도와줄게요!', '다음에요'], 1);
    if (c !== 0) return;
    const r = await ev.mini('Push', DOLMEN);
    if (r !== 'win') return;
    ev.setFlag('goDolmen');
    ev.addMon('bronzemirror', 11); HG.Sound.sfx('levelup');
    await ev.say('고인돌 곁에서 반짝이던 청동 거울이 동료가 되었다!');
    await done(ev, '고인돌 세우기');
  }

  const RICE = {
    bg: 'field', need: 10, time: 35, unit: '벼 이삭', done: '추수 성공!', exp: 45,
    help: '방향키 이동 · 벼 이삭을 줍자 · 뱀은 피하기',
    intro: ['농부: 반달 돌칼로 벼 이삭을 10개 거둬 오렴!', '논에 숨은 뱀은 조심해!'],
    items: [{ tex: 'g_rice', label: '벼 이삭', n: 1, w: 75 }, { tex: 'g_snake', label: '뱀이다!', n: -1, w: 25, bad: true }],
    win: ['벼를 넉넉히 거뒀다! 열매 3개를 나눠 받았다.'], lose: ['농부: 괜찮아, 다시 해 보자!'],
    reward: { item: 'berry', n: 3 }
  };

  async function riceTask(ev) {
    if (ev.flag('goRice')) { await ev.say('농부: 벼농사로 먹을거리가 넉넉해지면서 사람들이 더 많이 모여 살게 됐어.'); return; }
    const c = await ev.choose('농부: 벼가 누렇게 익었어! 같이 벼 이삭을 거둘래?', ['좋아요!', '다음에요'], 1);
    if (c !== 0) return;
    const r = await ev.gather(RICE);
    if (r !== 'win') return;
    ev.setFlag('goRice');
    ev.addMon('halfmoon', 11); HG.Sound.sfx('levelup');
    await ev.say('반달 돌칼이 동료가 되었다!');
    await done(ev, '벼 거두기');
  }

  async function lawTask(ev) {
    if (ev.flag('goLaw')) { await ev.say('재판관: 8조법 가운데 지금은 세 조항만 전해진단다. 그래도 고조선 사회의 모습을 알 수 있지.'); return; }
    await ev.say('재판관: 고조선에는 사회 질서를 지키기 위한 법, 「8조법」이 있었다.', '재판관: 오늘 재판을 도와주겠느냐? 8조법에 따라 알맞게 판결해 보거라.');
    const cases = [
      { q: '사건 1: 싸우다가 남을 다치게 한 사람이 왔다. 어떻게 할까?', options: ['곡식으로 갚게 한다', '그냥 돌려보낸다', '상을 준다'], why: '8조법에는 「남을 다치게 한 사람은 곡식으로 갚는다」고 되어 있어.' },
      { q: '사건 2: 남의 물건을 훔친 사람이 왔다. 어떻게 할까?', options: ['그 집의 노비가 되게 한다', '물건을 가져도 된다고 한다', '마을 대표로 뽑는다'], why: '8조법에는 「남의 물건을 훔친 사람은 그 집의 노비가 된다」고 되어 있어. 용서받으려면 많은 돈을 내야 했지.' },
      { q: '8조법을 보면 고조선은 어떤 사회였을까?', options: ['사람의 생명과 개인의 재산을 중요하게 여겼다', '법이 하나도 없었다', '모든 사람의 신분이 똑같았다'], why: '생명과 재산을 지키는 법이 있었고, 노비가 있는 것으로 보아 신분의 차이도 있었어.' }
    ];
    let ok = 0;
    for (const q of cases) {
      const opts = HG.shuffle(q.options);
      const pick = await ev.choose(q.q, opts, 'none', { noDefault: true });
      if (opts[pick] === q.options[0]) { ok++; HG.Sound.sfx('correct'); await ev.say('재판관: 옳은 판결이다!'); }
      else { HG.Sound.sfx('wrong'); await ev.say(`재판관: 음… 8조법대로라면 '${q.options[0]}'.`, q.why); }
    }
    await ev.say(`재판관: ${ok}건을 바르게 판결했구나. 수고 많았다!`);
    ev.setFlag('goLaw');
    ev.addMon('bronzesword', 11); HG.Sound.sfx('levelup');
    await ev.say('재판관: 이 비파형 동검을 데려가거라. 고조선을 대표하는 유물이란다.', '비파형 동검이 동료가 되었다!');
    await done(ev, '8조법 재판');
  }

  const QUIZ = [
    { q: '우리 역사에서 처음 세워진 나라는?', options: ['고조선', '고구려', '신라'], why: '단군왕검이 세운 고조선이 우리 역사 최초의 나라야.' },
    { q: '고조선을 세운 사람은?', options: ['단군왕검', '주몽', '박혁거세'], why: '단군왕검이 고조선을 세웠어. 주몽은 고구려, 박혁거세는 신라를 세웠지.' },
    { q: '비파를 닮은 고조선의 대표 유물은?', options: ['비파형 동검', '주먹도끼', '금관'], why: '비파형 동검이 나온 곳을 보면 고조선의 세력 범위를 알 수 있어.' },
    { q: '큰 돌을 얹어 만든 청동기 시대 지배자의 무덤은?', options: ['고인돌', '석굴암', '첨성대'], why: '고인돌은 청동기 시대 지배자의 무덤이야.' },
    { q: '벼 이삭을 딸 때 쓴 도구는?', options: ['반달 돌칼', '갈돌과 갈판', '측우기'], why: '반달 돌칼에 끈을 꿰어 손에 걸고 벼 이삭을 땄어.' },
    { q: '고조선에서 사회 질서를 지키려고 만든 법은?', options: ['8조법', '경국대전', '훈민정음'], why: '고조선에는 8조법이 있었어. 경국대전은 조선의 법전이야.' }
  ];

  async function dangun(ev) {
    if (ev.flag('gojoseonClear')) { await ev.say('단군왕검: 고조선의 자손이여, 다음 시대에서도 용기를 잃지 말거라.'); return; }
    const n0 = tasks(ev.state);
    if (n0 < 3) { await ev.say(`단군왕검: 백성들을 도와 널리 이롭게 하거라. 그러면 너를 만나 주겠다. (지금 ${n0}/3)`); return; }
    await ev.say('단군왕검: 나는 단군왕검, 고조선을 세운 사람이다.', '단군왕검: 백성들을 잘 도와주었구나. 이제 그 지혜를 시험하겠다!');
    const n = await ev.quiz(QUIZ, 3);
    const boost = n >= 3 ? 2 : n >= 2 ? 1 : 0;
    await ev.say(`단군왕검: ${n}개를 맞혔구나. ` + (boost ? '좋다, 겨뤄 보자!' : '아쉽지만 힘으로 겨뤄 보자!'));
    const r = await ev.battle({ trainer: { name: '단군왕검', sprite: 'go_dangun', team: [['halfmoon', 11], ['bronzesword', 12]], lose: ['단군왕검: 훌륭하다! 너를 고조선의 전사로 인정하마.'] }, bg: 'bb_village', music: 'boss', atkBoost: boost });
    if (r !== 'win') return;
    await HG.Era.award(ev, { name: '청동 인장', icon: 'mon_bronzesword' });
    await ev.say('할아버지(무전기): 시간 조각이 또 돌아왔구나! 이제부터는 나라가 여럿 생기는 시대야. 타임머신으로 오렴!');
  }

  function objective(s) {
    const f = s.flags;
    if (!f.go_arrived) return '';
    const n = tasks(s);
    if (n < 3) return `마을 일 돕기 ${n}/3 (고인돌 · 벼 · 8조법)`;
    if (!f.gojoseonClear) return '위쪽 제단의 단군왕검을 만나자';
    return '타임머신으로 다음 시대에 가자';
  }

  HG.registerStage({
    id: ERA, name: '청동기·고조선', type: 'village', baseLevel: 11, teacher: '단군왕검',
    start: { map: 'go_village', x: 18, y: 15, dir: 'left' },
    battleBg: 'bb_village', respawn: { map: 'go_village', x: 18, y: 15, dir: 'left' }, objective, quiz: QUIZ,
    taskFlags: T, devMinis: [{ name: '고인돌 세우기', scene: 'Push', p: DOLMEN }, { name: '벼 거두기', scene: 'Gather', p: RICE }]
  });
})();
