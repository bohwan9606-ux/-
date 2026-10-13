// ─────────────────────────────────────────────
// 스테이지 7: 조선 — 걸어 다니는 「작은 한반도」
// 가운데 한양(경복궁 집현전 · 관상감) → ↓ 의령 의병 마을 · → 동남쪽 바다 한산도(이순신)
// ─────────────────────────────────────────────
(function () {
  const B = HG.MapBuilder;
  const ERA = 'joseon';

  HG.Art.register(function (scene) {
    HG.Art.person(scene, 'js_merchant', { hair: 'k', shirt: 'w', pants: 'l', band: 'k', goreum: 'n', hat: 'sangtu' });
    HG.Art.person(scene, 'js_sailor', { hair: 'k', shirt: 'u', pants: 'w', band: 'r', collar: 'w', goreum: 'r', hat: 'sangtu' });
    HG.Art.person(scene, 'js_villager', { hair: 'k', shirt: 'w', pants: 'n', long: false, skirt: 'u', goreum: 'r', hat: 'bun' });
    HG.Art.person(scene, 'js_kid', { hair: 'k', shirt: 'y', pants: 'w', collar: 'w', goreum: 'r' });
    const Px = HG.Pixel;
    HG.Art.person(scene, 'js_sejong', { hair: 'k', shirt: 'r', pants: 'R', robe: 'r', belt: 'y', emblem: 'o', hat: 'ikseon', beard: true });
    HG.Art.person(scene, 'js_jangyeongsil', { hair: 'k', shirt: 'u', pants: 'U', robe: 'u', belt: 'k', hat: 'boktu' });
    HG.Art.person(scene, 'js_gwak', { hair: 'k', shirt: 'r', pants: 'R', robe: 'r', belt: 'k', hat: 'gat', beard: true });
    HG.Art.person(scene, 'js_yisunsin', { hair: 'k', shirt: 'r', pants: 'R', armor: 'r', robe: 'U', belt: 'y', hat: 'helmet', beard: true });
    Px.draw(scene, 'g_mud', 12, 12, (p, ctx) => { Px.poly(p, [[6, 1], [10, 8], [2, 8]], 'b'); Px.ellipse(p, 6, 8, 4, 3, 'b'); p(5, 6, 'n'); Px.outline(ctx, 12, 12); });
  });

  const QUIZ = [
    { q: '집현전 학자들과 함께 훈민정음을 만든 왕은?', options: ['세종대왕', '태조 이성계', '정조'], why: '세종대왕은 백성이 쉽게 글을 읽고 쓰도록 훈민정음을 만들었어.' },
    { q: '「훈민정음」은 무슨 뜻일까?', options: ['백성을 가르치는 바른 소리', '임금이 쓰는 글자', '중국의 글자'], why: '훈민정음은 「백성을 가르치는 바른 소리」라는 뜻이야.' },
    { q: '비가 내린 양을 재는 조선의 과학 기구는?', options: ['측우기', '해시계', '거중기'], why: '세종 때 측우기를 만들어 전국의 비 양을 재었어.' },
    { q: '거북선을 만들어 바다를 지킨 조선의 장군은?', options: ['이순신', '강감찬', '곽재우'], why: '이순신은 거북선과 뛰어난 작전으로 바다를 지켰어.' },
    { q: '이순신이 한산도 앞바다에서 학이 날개를 펼친 모양으로 배를 벌여 싸운 진법은?', options: ['학익진', '살수 대첩', '8조법'], why: '학익진은 학이 날개를 편 모양으로 적을 둘러싸는 작전이야.' },
    { q: '나라가 위기에 빠졌을 때 스스로 일어나 싸운 백성들의 군대는?', options: ['의병', '화랑', '수군'], why: '임진왜란 때 곽재우 같은 의병들이 고향을 지키려고 스스로 일어났어.' },
    { q: '조선을 세운 사람은?', options: ['이성계', '왕건', '세종'], why: '이성계가 조선을 세우고 한양을 도읍으로 정했어.' }
  ];

  // 예전 지도형 거점의 내용을 그대로 씀 (대사 · 미니게임 · 보상)
  const NODES = [
      {
        id: 'hangeul', name: '경복궁 집현전', lon: 126.98, lat: 37.58, who: 'js_sejong', desc: '조선 · 세종대왕\n한글 조합',
        story: ['세종대왕: 어서 오너라. 백성들이 한자를 몰라 억울한 일을 당해도 글로 알릴 수가 없구나.', '세종대왕: 그래서 집현전 학자들과 함께 누구나 쉽게 배우는 글자, 훈민정음을 만들었단다. 한번 써 보겠느냐?'],
        after: ['세종대왕: 슬기로운 사람은 아침이 끝나기 전에, 어리석은 사람도 열흘이면 배울 수 있는 글자란다.'],
        mission: { scene: 'Hangul', p: { title: '훈민정음으로 낱말 만들기', npc: 'js_sejong', count: 3, time: 60, exp: 70,
          intro: ['세종대왕: 자음은 소리 낼 때 입과 혀의 모양을, 모음은 하늘(ㆍ)·땅(ㅡ)·사람(ㅣ)을 본떠 만들었단다.', '세종대왕: 자음과 모음을 모으면 어떤 소리든 글로 쓸 수 있지. 떨어지는 글자를 차례대로 받아 낱말을 만들어 보거라!', '노랗게 빛나는 글자가 다음에 받아야 할 글자야. 다른 글자를 받으면 잠깐 어지러워져.'],
          outro: ['낱말이 완성되었다!', '세종대왕: 슬기로운 사람은 아침이 끝나기 전에, 어리석은 사람도 열흘이면 배울 수 있는 글자란다.'] } },
        reward: { mon: ['hunmin', 23], text: '백성을 가르치는 바른 소리' }
      },
      {
        id: 'rain', name: '충청 들녘', lon: 127.15, lat: 36.45, who: 'js_jangyeongsil', desc: '조선 · 장영실\n측우기로 빗물 재기',
        story: ['장영실: 나는 장영실! 세종대왕의 명으로 해시계, 물시계 같은 과학 기구를 만들었지.', '장영실: 농사를 잘 지으려면 비가 얼마나 왔는지 알아야 해. 측우기에 빗물을 모아 볼래?'],
        after: ['장영실: 측우기는 전국 고을에 놓여 비의 양을 재는 데 쓰였단다.'],
        mission: { scene: 'Gather', p: { bg: 'field', need: 10, time: 30, unit: '빗방울', exp: 70, done: '빗물을 넉넉히 모았다!', music: 'village', help: '방향키 이동 · 맑은 빗방울을 받자',
          intro: ['장영실: 하늘에서 떨어진 맑은 빗방울 10개를 받아 줘.', '갈색 흙탕물은 측우기에 들어가면 안 돼! 잘못 재면 농사를 망치거든.'],
          items: [{ tex: 'i_water', label: '빗방울', n: 1, w: 70 }, { tex: 'g_mud', label: '흙탕물이 튀었다!', n: -1, w: 30, bad: true }],
          win: ['측우기에 빗물이 고였다! 이제 비의 양을 잴 수 있다.'], lose: ['조금 모자라! 장영실: 다시 한번 받아 보자.'], reward: { item: 'berry', n: 2 } } },
        reward: { mon: ['raingauge', 23], text: '비의 양을 재는 과학 기구' }
      },
      {
        id: 'uibyeong', name: '의령', lon: 128.05, lat: 35.55, who: 'js_gwak', desc: '조선 · 곽재우\n의병의 비밀 길',
        story: ['곽재우: 나는 붉은 옷을 입고 싸워 「홍의 장군」이라 불리는 곽재우요.', '곽재우: 임진왜란이 일어나자 고향 사람들과 함께 의병을 일으켰소. 마을에 시간 괴물이 섞여 들었으니, 들키지 말고 의병 진지에 소식을 전해 주시오!'],
        after: ['곽재우: 이름 없는 많은 백성이 의병이 되어 나라를 지켰다오.'],
        mission: { scene: 'Stealth', p: { title: '의병 진지로 소식 전하기', key: 'joseon', goal: [12, 1], start: [1, 8], goalLabel: '의병 진지', exp: 70,
          intro: ['곽재우: 시간 괴물은 앞쪽 세 칸을 본다오. 괴물이 고개를 돌렸을 때 재빨리 지나가시오!', '방향키로 한 칸씩 움직여요. 들키면 처음 자리로 돌아가요.'],
          map: [
            'TT,,,,TT,,,,TT',
            'T,,.....,,,.,T',
            ',,.H,,.,H,..,,',
            ',..,,,.,,,.,,T',
            'T.,TT,....,,,,',
            ',.,,,,.,TT.,H,',
            ',....,.,,,..,,',
            'T,,H.,...,,.,T',
            ',..,,,,T,,,,,,'
          ],
          guards: [{ path: [[2, 3], [2, 6]] }, { path: [[6, 1], [6, 6]] }, { path: [[10, 2], [10, 6]] }],
          outro: ['의병 진지에 무사히 소식을 전했다!', '곽재우: 고맙소! 이제 힘을 모아 고향을 지킬 수 있겠소.'] } },
        reward: { item: ['meat', 3] }
      }
    ];
  const BOSS = Object.assign({
      id: 'boss', name: '이순신', lon: 128.43, lat: 34.78, who: 'js_yisunsin', desc: '조선 · 한산도\n조선의 스승',
      story: ['이순신: 나는 조선 수군을 이끄는 이순신이오.', '이순신: 거북선과 학익진으로 한산도 앞바다에서 크게 이겼지. 그대가 조선을 두루 살폈다면, 그 지혜를 보여 주시오!'],
      team: [['raingauge', 23], ['turtleship', 24]], bg: 'bb_sea',
      lose: ['이순신: 훌륭하오! 그대에게 거북선을 맡기겠소.'],
      win: ['이순신: 나라를 지키려는 마음이 모이면 어떤 어려움도 이겨 낼 수 있다오.', '이순신: 전쟁이 끝난 뒤 조선 사람들은 무너진 나라를 다시 일으켜 세운다오. 다음 시대에서 확인하시오.'],
      reward: { mon: ['turtleship', 24], text: '이순신 장군의 거북선' },
      after: ['이순신: 바다를 잘 부탁하오.'],
      quiz: QUIZ, stamp: { name: '조선 인장', icon: 'mon_hunmin' }
    }, { where: '동남쪽 바다 한산도' });
  const R = HG.Region.make({ era: ERA, nodes: NODES, boss: BOSS, quiz: QUIZ, place: '한양', goal: '조선 돌아보기' });
  const enc = HG.Region.enc;

  // ① 한양 (가운데)
  const h = new B(24, 16, '.');
  h.border('T');
  h.rect(5, 1, 12, 1, '=').rect(5, 1, 1, 6, '=').rect(16, 1, 1, 6, '=').rect(5, 6, 12, 1, '=');
  h.rect(6, 2, 10, 4, 'Q').rect(11, 6, 2, 1, 'Q');
  h.rect(11, 7, 2, 9, ':').rect(0, 12, 24, 1, ':').set(0, 12, 'T');
  h.rect(18, 7, 5, 4, 'Q');
  h.dots([[3, 9], [20, 3], [7, 14], [21, 14]], '"');
  HG.maps.js_hanyang = {
    id: 'js_hanyang', name: '조선 · 한양', music: 'village', tiles: h.rows(),
    objects: [
      { kind: 'giwajip', x: 10, y: 2, talk: ['경복궁의 근정전이다. 임금님이 나랏일을 보던 곳이다.'] },
      { kind: 'giwajip', x: 13, y: 2, talk: ['집현전이다. 학자들이 모여 책을 읽고 연구하던 곳이다.'] },
      { kind: 'raingauge', x: 19, y: 8, talk: ['관상감의 측우기다. 비가 내린 양을 잰다.'] },
      { kind: 'stele', x: 21, y: 8, talk: ['솥 모양의 해시계, 「앙부일구」다.'],
        secret: { id: 'joseon_angbu', item: ['berry', 3], fact: '세종 때 만든 해시계 앙부일구는 그림자로 시간을 알려 주었어. 글을 모르는 백성도 볼 수 있게 시간마다 동물 그림을 새겼지.' } },
      { kind: 'stall', x: 3, y: 10, talk: ['종로의 가게다. 비단과 쌀, 그릇을 판다.'],
        secret: { id: 'joseon_market', item: ['meat', 2], fact: '한양 종로에는 「시전」이라는 큰 가게 거리가 있었어. 나라의 허가를 받아 물건을 팔았지.' } },
      { kind: 'sign', x: 10, y: 11, talk: ['↓ 의령 (남쪽)   → 한산도 (동남쪽 바다)'] },
      { kind: 'timemachine', x: 14, y: 9, smoke: true, talk: async ev => HG.Era.timeMachine(ev, HG.state.stamps.includes(ERA)) }
    ],
    npcs: [R.npc('hangeul', 8, 4, 'down'), R.npc('rain', 20, 9, 'down'),
      { id: 'merchant', sprite: 'js_merchant', x: 6, y: 11, dir: 'down', talk: ['상인: 이성계가 조선을 세우고 도읍을 한양으로 정했지.', '한양은 가운데로 한강이 흐르고 산으로 둘러싸여 나라의 중심이 되기에 좋았어.'] },
      { id: 'kid', sprite: 'js_kid', x: 16, y: 13, dir: 'down', wander: 2, talk: async ev => { const l = R.remaining(ev.state); await ev.say(l.length ? `아이: ${l.join(', ')}에 아직 안 가 봤지?` : '아이: 동남쪽 바다 한산도에 이순신 장군님이 계셔!'); } }],
    tileSecrets: { '20,3': { id: 'joseon_book', item: ['berry', 2], fact: '훈민정음은 1443년에 만들고 1446년에 백성들에게 널리 알렸어. 그날을 기념하는 날이 한글날(10월 9일)이야.' } },
    warps: [
      { x: 11, y: 15, to: 'js_uiryeong', tx: 10, ty: 1, dir: 'down' }, { x: 12, y: 15, to: 'js_uiryeong', tx: 11, ty: 1, dir: 'down' },
      { x: 23, y: 12, to: 'js_hansan', tx: 1, ty: 7, dir: 'right' }
    ],
    encounterRate: 0.06, encounter: enc([['hunmin', 35], ['raingauge', 35], ['whiteporcelain', 30]], 21, 24),
    onEnter: HG.Region.arrive(ERA, ['할아버지(무전기): 여기는 조선의 서울, 한양이란다! 이성계가 세운 나라지.',
      '할아버지: 세종 때는 한글과 과학 기구가 만들어졌고, 임진왜란 때는 이순신과 의병들이 나라를 지켰단다.',
      '할아버지: 경복궁의 세종대왕, 관상감의 장영실, 남쪽 의령의 곽재우를 도운 뒤 동남쪽 바다 한산도의 이순신 장군을 찾아가렴.'])
  };

  // ② 의령 의병 마을 (남쪽)
  const ui = new B(22, 14, '.');
  ui.border('T');
  ui.rect(1, 9, 20, 2, '~').rect(10, 9, 2, 2, 'Q');
  ui.rect(10, 0, 2, 9, ':').rect(10, 11, 2, 2, ':');
  ui.rect(14, 2, 5, 3, ',');
  ui.dots([[3, 3], [7, 6], [19, 12], [3, 12]], '"');
  HG.maps.js_uiryeong = {
    id: 'js_uiryeong', name: '의령 · 의병 마을', music: 'field', tiles: ui.rows(),
    waterTalk: ['남강이 흐른다. 의병들은 강과 산을 잘 아는 고향 사람들이었다.'],
    objects: [
      { kind: 'chogajip', x: 3, y: 4, talk: ['의병들이 모이는 집이다.'] },
      { kind: 'chogajip', x: 6, y: 11, talk: ['마을 사람의 집이다. 깨끗한 흰 그릇이 놓여 있다.'],
        secret: { id: 'joseon_baekja', mon: ['whiteporcelain', 22], fact: '조선 사람들은 깨끗하고 소박한 흰 그릇, 「백자」를 즐겨 썼어.' } },
      { kind: 'sign', x: 12, y: 2, talk: ['↑ 한양'] }
    ],
    npcs: [R.npc('uibyeong', 8, 6, 'right'),
      { id: 'villager', sprite: 'js_villager', x: 15, y: 12, dir: 'left', talk: ['마을 사람: 임진왜란 때 나라 곳곳에서 백성들이 스스로 의병이 되었어.', '선비도, 농민도, 스님도 함께 싸웠단다.'] }],
    warps: [{ x: 10, y: 0, to: 'js_hanyang', tx: 11, ty: 14, dir: 'up' }, { x: 11, y: 0, to: 'js_hanyang', tx: 12, ty: 14, dir: 'up' }],
    encounterRate: 0.06, encounter: enc([['raingauge', 50], ['whiteporcelain', 50]], 21, 24)
  };

  // ③ 한산도 (동남쪽 바다)
  const hs = new B(22, 14, '.');
  hs.border('T');
  hs.rect(13, 1, 8, 12, '~').rect(12, 1, 1, 12, 's');
  hs.rect(0, 7, 12, 1, ':').set(0, 7, ':');
  hs.rect(3, 2, 5, 3, ',');
  hs.dots([[4, 10], [9, 12], [2, 5]], '"');
  HG.maps.js_hansan = {
    id: 'js_hansan', name: '한산도 수군 진영', music: 'field', tiles: hs.rows(),
    waterTalk: ['한산도 앞바다다. 이곳에서 학익진으로 크게 이겼다.'],
    objects: [
      { kind: 'turtle', x: 13, y: 5, talk: ['거북선이다! 지붕을 덮개로 씌우고 쇠못을 꽂았다.'],
        secret: { id: 'joseon_turtle', item: ['meat', 2], fact: '거북선은 지붕에 쇠못을 꽂아 적이 배 위로 올라타지 못하게 했어. 용머리에서 대포를 쏘기도 했지.' } },
      { kind: 'boat', x: 13, y: 10, talk: ['조선 수군의 배, 판옥선이다.'] },
      { kind: 'giwajip', x: 6, y: 9, talk: ['수군 진영의 지휘소다.'] },
      { kind: 'sign', x: 2, y: 8, talk: ['← 한양 (서북쪽)'] }
    ],
    npcs: [R.bossNpc(11, 7, 'right'),
      { id: 'sailor', sprite: 'js_sailor', x: 9, y: 5, dir: 'down', talk: ['수군: 이순신 장군님은 학이 날개를 펼친 모양으로 배를 벌여 적을 둘러쌌어. 그게 학익진이야!', '장군님은 『난중일기』라는 일기도 꼼꼼히 쓰셨대.'] }],
    warps: [{ x: 0, y: 7, to: 'js_hanyang', tx: 22, ty: 12, dir: 'left' }],
    encounterRate: 0.06, encounter: enc([['hunmin', 50], ['raingauge', 50]], 22, 25)
  };

  HG.registerStage(Object.assign({
    id: ERA, type: 'village', quiz: QUIZ, objective: R.objective, taskFlags: R.T, battleBg: 'bb_village',
    devMinis: NODES.filter(n => n.mission).map(n => ({ name: n.name, scene: n.mission.scene, p: n.mission.p }))
  }, { name: '조선', baseLevel: 23, teacher: '이순신', start: { map: 'js_hanyang', x: 13, y: 13, dir: 'up' }, respawn: { map: 'js_hanyang', x: 13, y: 13, dir: 'up' }, maps: ['js_hanyang', 'js_uiryeong', 'js_hansan'] }));
})();
