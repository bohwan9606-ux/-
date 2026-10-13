// ─────────────────────────────────────────────
// 스테이지 10: 광복·현대 — 걸어 다니는 서울 거리 + 6·25 작전 지도실
// 가운데 서울(광복 · 6·25 기념관) → ↓ 광주(민주주의) · → 동해 바닷가의 「시간의 틈」(마지막 결전)
// ─────────────────────────────────────────────
(function () {
  const B = HG.MapBuilder;
  const ERA = 'modern';

  HG.Art.register(function (scene) {
    HG.Art.person(scene, 'md_kid', { hair: 'k', shirt: 'r', pants: 'u' });
    HG.Art.person(scene, 'md_worker', { hair: 'k', shirt: 'u', pants: 'G', band: 'y' });
    HG.Art.person(scene, 'md_citizen', { hair: 'k', shirt: 'w', pants: 'G', band: 'k' });
    HG.Art.person(scene, 'md_student', { hair: 'k', shirt: 'u', pants: 'U' });
  });

  const QUIZ = [
    { q: '1945년 8월 15일, 우리나라가 일제로부터 나라를 되찾은 일은?', options: ['광복', '3·1 운동', '정전 협정'], why: '1945년 8월 15일을 「빛을 되찾았다」는 뜻으로 광복이라고 해.' },
    { q: '1948년 8월 15일에 세워진 정부는?', options: ['대한민국 정부', '대한민국 임시 정부', '조선 총독부'], why: '1948년 5·10 총선거를 거쳐 8월 15일 대한민국 정부가 세워졌어.' },
    { q: '1950년 6월 25일에 일어난 전쟁은?', options: ['6·25 전쟁', '임진왜란', '병자호란'], why: '1950년 6월 25일 북한군이 남쪽으로 쳐들어오며 6·25 전쟁이 시작되었어.' },
    { q: '1960년, 학생과 시민들이 부정 선거에 맞서 민주주의를 지킨 일은?', options: ['4·19 혁명', '3·1 운동', '6월 민주 항쟁'], why: '4·19 혁명은 학생과 시민이 부정 선거에 맞선 민주화 운동이야.' },
    { q: '1987년, 국민이 대통령을 직접 뽑는 제도를 이끌어 낸 일은?', options: ['6월 민주 항쟁', '4·19 혁명', '광복'], why: '6월 민주 항쟁으로 대통령 직선제가 다시 이루어졌어.' }
  ];

  // 마지막 문제는 모든 시대에서 골고루
  const ALL = () => {
    const pool = [];
    HG.ERAS.forEach(e => { const st = HG.stages[e.stage || e.id]; if (st && st.quiz) pool.push(...HG.shuffle(st.quiz).slice(0, 1)); });
    return pool;
  };
  // 예전 지도형 거점의 내용을 그대로 씀 (대사 · 미니게임 · 보상)
  const NODES = [
      {
        id: 'liberation', name: '서울', lon: 126.98, lat: 37.57, who: 'md_citizen', desc: '1945 · 1948\n연표 줄 세우기',
        story: ['시민: 만세! 대한 독립 만세! 오늘 라디오에서 일본이 항복했다는 소식이 나왔어요!', '시민: 이제 우리 손으로 새 나라를 세워야 해요!'],
        after: ['시민: 1948년 8월 15일, 대한민국 정부가 세워졌어요.'],
        mission: { scene: 'Timeline', p: { title: '연표 줄 세우기', npc: 'md_citizen', exp: 90,
          intro: ['시민: 1945년 8월 15일 광복을 맞았고, 1948년 5·10 총선거를 거쳐 8월 15일 대한민국 정부가 세워졌어요.', '시민: 일제 강점기부터 지금까지 있었던 일을 연표에 순서대로 끼워 넣어 볼래요? 왼쪽이 옛날, 오른쪽이 나중이에요.'],
          outro: ['연표가 완성되었다!', '시민: 나라를 되찾고, 새 나라를 세우고, 전쟁의 아픔을 이겨 내며 지금의 대한민국이 되었어요.'] } },
        reward: { item: ['meat', 3] }
      },
      {
        id: 'war', name: '6·25 전쟁', lon: 129.07, lat: 35.18, who: 'war_grandma', desc: '1950 ~ 1953\n6·25 전쟁 작전 지도',
        story: ['피란민 할머니: 광복의 기쁨도 잠시, 5년 뒤에 큰 전쟁이 일어났단다.', '피란민 할머니: 그때 부산은 임시 수도였고, 피란 온 사람들로 가득했지. 그 이야기를 들려줄게.'],
        after: ['피란민 할머니: 다시는 이런 아픔이 없도록 평화를 지켜 주렴.'],
        mission: { scene: 'War', p: {} },
        reward: { item: ['berry', 3] }
      },
      {
        id: 'democracy', name: '광주', lon: 126.85, lat: 35.16, who: 'md_student', desc: '1960 ~ 1987\n민주주의를 지킨 사람들',
        story: ['학생: 나라의 주인은 국민이에요. 그런데 그 권리를 지키기가 늘 쉬웠던 건 아니에요.', '학생: 4·19 혁명, 5·18 민주화 운동, 6월 민주 항쟁… 많은 사람이 민주주의를 지키려고 용기를 냈어요. 함께 알아볼래요?'],
        after: ['학생: 지금 우리가 누리는 민주주의는 많은 사람의 용기 덕분이에요.'],
        talk: ev => HG.talkQuiz(ev, '학생', [
          { q: '1960년, 부정 선거에 맞서 학생과 시민이 일어난 일은?', options: ['4·19 혁명', '3·1 운동', '6·25 전쟁'], why: '1960년 4월 19일, 학생과 시민들이 부정 선거에 맞서 민주주의를 지켰어.', good: '맞아요! 4·19 혁명이에요.' },
          { q: '1980년, 광주의 시민들이 민주주의를 지키려고 일어선 일은?', options: ['5·18 민주화 운동', '아우내 만세 운동', '임진왜란'], why: '5·18 민주화 운동은 광주 시민들이 민주주의를 지키려고 용기를 낸 일이야.', good: '맞아요. 꼭 기억해야 할 일이에요.' },
          { q: '1987년 6월 민주 항쟁으로 국민이 되찾은 권리는?', options: ['대통령을 직접 뽑는 권리', '왕을 뽑는 권리', '세금을 안 내는 권리'], why: '6월 민주 항쟁으로 국민이 대통령을 직접 뽑는 직선제가 이루어졌어.' }
        ]),
        reward: { item: ['meat', 2] }
      }
    ];
  const BOSS = Object.assign({
      id: 'boss', name: '시간 괴물 대왕', lon: 130.5, lat: 38.5, who: 'mon_timeking', whoScale: 2, desc: '시간의 틈\n마지막 결전!',
      story: ['???: 크크크… 여기까지 왔구나, 꼬마 시간 여행자.', '시간 괴물 대왕: 나는 시간 괴물 대왕! 역사를 뒤죽박죽 섞어서 사람들이 다 잊어버리게 만들 테다!', '시간 괴물 대왕: 네가 정말 역사를 기억하는지 보자. 구석기부터 지금까지, 모든 시대에서 문제를 내겠다!'],
      get quiz() { return ALL(); }, quizCount: 5,
      team: [['timeking', 33]], bg: 'bb_castle',
      lose: ['시간 괴물 대왕: 으아아… 역사를 기억하는 마음이 이렇게 강하다니…!'],
      win: ['시간 괴물 대왕이 빛 속으로 사라지자, 흩어졌던 마지막 시간 조각이 돌아왔다!', '할아버지(무전기): 해냈구나, {name}! 이제 모든 시대의 시간이 제자리를 찾았어!'],
      after: ['시간의 틈은 조용히 닫혀 있다.'],
      final: true,
      finalLines: ['할아버지: 구석기의 주먹도끼부터 오늘의 우리까지… 역사는 이렇게 이어져 있단다.', '할아버지: 연구소로 돌아가자. 함께한 친구들이 기다리고 있어!'],
      stamp: { name: '시간 지킴이 인장', icon: 'mon_timeking' }
    }, { where: '동해 바닷가 「시간의 틈」' });
  const R = HG.Region.make({ era: ERA, nodes: NODES, boss: BOSS, quiz: QUIZ, place: '서울', goal: '현대 돌아보기' });
  const enc = HG.Region.enc;

  // ① 서울 (가운데)
  const h = new B(24, 16, '.');
  h.border('T');
  h.rect(11, 0, 1, 16, 'A').rect(12, 0, 1, 16, 'A').rect(0, 12, 24, 1, '-').set(0, 12, 'T');
  h.set(11, 0, 'T').set(12, 0, 'T');
  h.rect(10, 1, 1, 11, 'v').rect(13, 1, 1, 11, 'v').rect(1, 11, 9, 1, 'v').rect(14, 11, 9, 1, 'v');
  h.dots([[3, 9], [20, 9], [7, 14], [19, 14]], '"');
  HG.maps.md_seoul = {
    id: 'md_seoul', name: '서울', music: 'peace', tiles: h.rows(),
    objects: [
      { kind: 'building', x: 3, y: 2, talk: ['높은 건물이 줄지어 서 있다.'] },
      { kind: 'memorial', x: 16, y: 2, talk: ['「전쟁 기념관」이다. 안에 6·25 전쟁의 작전 지도가 있다.'] },
      { kind: 'building', x: 19, y: 6, talk: ['공장이 많아지고 수출이 늘면서 우리나라 경제는 빠르게 성장했다.'],
        secret: { id: 'modern_economy', item: ['meat', 2], fact: '6·25 전쟁 뒤 가난했던 우리나라는 빠르게 경제를 일으켰어. 이것을 「한강의 기적」이라고 부르기도 해.' } },
      { kind: 'sign', x: 9, y: 13, talk: ['↓ 광주   → 동해 바닷가'] },
      { kind: 'timemachine', x: 15, y: 9, smoke: true, talk: async ev => HG.Era.timeMachine(ev, HG.state.stamps.includes(ERA)) }
    ],
    npcs: [R.npc('liberation', 7, 6, 'down'), R.npc('war', 17, 5, 'down'),
      { id: 'worker', sprite: 'md_worker', x: 5, y: 10, dir: 'right', talk: ['시민: 1988년에는 서울에서 올림픽이 열렸어.', '2002년에는 월드컵도 열렸지. 온 국민이 한마음으로 응원했단다!'] },
      { id: 'kid', sprite: 'md_kid', x: 15, y: 14, dir: 'down', wander: 2, talk: async ev => { const l = R.remaining(ev.state); await ev.say(l.length ? `아이: ${l.join(', ')}에 가 봤어?` : '아이: 동해 바닷가에 이상한 보라색 소용돌이가 생겼대!'); } }],
    tileSecrets: { '20,15': { id: 'modern_419', item: ['meat', 2], fact: '1960년 4월 19일, 학생과 시민들이 부정 선거에 맞서 일어났어. 이것을 「4·19 혁명」이라고 해.' },
      '3,9': { id: 'modern_dokdo', item: ['berry', 3], fact: '독도는 울릉도 동남쪽 바다에 있는 우리 땅이야. 신라 때 이사부가 우산국을 정복한 뒤로 우리 역사 속의 섬이지.' } },
    warps: [
      { x: 11, y: 15, to: 'md_gwangju', tx: 10, ty: 1, dir: 'down' }, { x: 12, y: 15, to: 'md_gwangju', tx: 11, ty: 1, dir: 'down' },
      { x: 23, y: 12, to: 'md_east', tx: 1, ty: 7, dir: 'right' }
    ],
    encounterRate: 0.05, encounter: enc([['taegeukgi', 50], ['malmoi', 50]], 29, 32),
    onEnter: HG.Region.arrive(ERA, ['할아버지(무전기): 드디어 마지막 시대야! 1945년 8월 15일, 우리나라는 마침내 광복을 맞았단다.',
      '할아버지: 하지만 그 뒤에도 전쟁의 아픔이 있었고, 민주주의를 지키려는 사람들의 노력이 이어졌지.',
      '할아버지: …그런데 동해 바닷가에 「시간의 틈」이 열렸어! 서울과 광주의 사람들을 도운 뒤 시간 괴물 대왕에게 맞서 보자!'])
  };

  // ② 광주 (남쪽)
  const gj = new B(22, 14, '.');
  gj.border('T');
  gj.rect(10, 0, 2, 13, 'A').set(10, 0, 'A').rect(1, 9, 20, 1, 'A');
  gj.rect(9, 1, 1, 8, 'v').rect(12, 1, 1, 8, 'v');
  gj.dots([[4, 12], [17, 12], [3, 3]], '"');
  HG.maps.md_gwangju = {
    id: 'md_gwangju', name: '광주', music: 'peace', tiles: gj.rows(),
    objects: [
      { kind: 'building', x: 3, y: 3, talk: ['옛 전라남도청 건물이다.'] },
      { kind: 'stele', x: 16, y: 5, talk: ['민주주의를 지키려 했던 사람들을 기리는 비석이다.'],
        secret: { id: 'modern_518', item: ['berry', 3], fact: '5·18 민주화 운동 기록물은 2011년 유네스코 세계 기록 유산이 되었어.' } },
      { kind: 'sign', x: 13, y: 2, talk: ['↑ 서울'] }
    ],
    npcs: [R.npc('democracy', 8, 10, 'right')],
    tileSecrets: { '21,12': { id: 'modern_june', item: ['berry', 3], fact: '1987년 6월, 전국의 시민들이 민주주의를 외쳤어(6월 민주 항쟁). 그 뒤로 국민이 대통령을 직접 뽑게 되었지.' } },
    warps: [{ x: 10, y: 0, to: 'md_seoul', tx: 11, ty: 14, dir: 'up' }, { x: 11, y: 0, to: 'md_seoul', tx: 12, ty: 14, dir: 'up' }],
    encounterRate: 0.05, encounter: enc([['taegeukgi', 50], ['declaration', 50]], 29, 32)
  };

  // ③ 동해 바닷가 · 시간의 틈
  const ea = new B(22, 14, '.');
  ea.border('T');
  ea.rect(15, 1, 6, 12, '~').rect(13, 1, 2, 12, 's');
  ea.rect(0, 7, 13, 1, ':');
  ea.rect(3, 2, 5, 3, ',');
  HG.maps.md_east = {
    id: 'md_east', name: '동해 바닷가', music: 'peace', tiles: ea.rows(),
    waterTalk: ['동해 바다다. 저 멀리 울릉도와 독도가 있다.'],
    objects: [
      { kind: 'rift', x: 12, y: 4, talk: async ev => R.boss(ev) },
      { kind: 'sign', x: 2, y: 8, talk: ['← 서울'] }
    ],
    npcs: [],
    warps: [{ x: 0, y: 7, to: 'md_seoul', tx: 22, ty: 12, dir: 'left' }],
    encounterRate: 0.05, encounter: enc([['malmoi', 50], ['taegeukgi', 50]], 30, 33)
  };

  HG.registerStage(Object.assign({
    id: ERA, type: 'village', quiz: QUIZ, objective: R.objective, taskFlags: R.T, battleBg: 'bb_village',
    devMinis: NODES.filter(n => n.mission).map(n => ({ name: n.name, scene: n.mission.scene, p: n.mission.p }))
  }, { name: '광복·현대', baseLevel: 31, teacher: '시간 괴물 대왕', music: 'peace', start: { map: 'md_seoul', x: 14, y: 13, dir: 'up' }, respawn: { map: 'md_seoul', x: 14, y: 13, dir: 'up' }, maps: ['md_seoul', 'md_gwangju', 'md_east'] }));
})();
