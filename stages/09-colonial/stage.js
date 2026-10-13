// ─────────────────────────────────────────────
// 스테이지 9: 일제 강점기 — 걸어 다니는 「작은 한반도」
// 가운데 경성(조선어 학회 · 탑골 공원) → ↑ 평양 · ↓ 천안 아우내 장터 · ← 제물포 항구에서 배 타고 상하이
// 표현 원칙: 사람끼리 싸우는 장면 없음. 방해꾼은 「시간 괴물」.
// ─────────────────────────────────────────────
(function () {
  const B = HG.MapBuilder;
  const ERA = 'colonial';

  HG.Art.register(function (scene) {
    HG.Art.person(scene, 'cl_citizen', { hair: 'k', shirt: 'w', pants: 'w', robe: 'w', belt: 'l', hat: 'gat' });
    HG.Art.person(scene, 'cl_kid', { hair: 'k', shirt: 'k', pants: 'k' });
    HG.Art.person(scene, 'cl_merchant', { hair: 'k', shirt: 'w', pants: 'l', band: 'k', goreum: 'n' });
    HG.Art.person(scene, 'cl_patriot', { hair: 'k', shirt: 'k', pants: 'k', glasses: true, beard: true });
    const Px = HG.Pixel;
    HG.Art.person(scene, 'cl_student', { hair: 'k', shirt: 'k', pants: 'k', band: 'k' });
    HG.Art.person(scene, 'cl_yugwansun', { hair: 'k', shirt: 'w', pants: 'k', long: true, ribbon: 'k', skirt: 'k', goreum: 'w' });
    HG.Art.person(scene, 'cl_scholar', { hair: 'k', shirt: 'G', pants: 'G', glasses: true });
    HG.Art.person(scene, 'cl_kimgu', { hair: 'k', shirt: 'w', pants: 'w', robe: 'w', belt: 'l', glasses: true });
    Px.draw(scene, 'g_flag', 12, 12, (p, ctx) => { Px.rect(p, 1, 1, 1, 11, 'B'); Px.rect(p, 2, 1, 9, 7, 'w'); Px.ellipse(p, 6, 4, 2, 2, 'r'); Px.rect(p, 4, 4, 5, 2, 'u'); p(6, 4, 'r'); p(3, 2, 'k'); p(9, 2, 'k'); p(3, 6, 'k'); p(9, 6, 'k'); Px.outline(ctx, 12, 12); });
    Px.draw(scene, 'g_tshard', 12, 12, (p, ctx) => { Px.ellipse(p, 6, 7, 4, 4, 'p'); p(4, 6, 'Y'); p(8, 6, 'Y'); Px.rect(p, 5, 9, 3, 1, 'k'); Px.outline(ctx, 12, 12); });
    // 말모이 사전 만들기 단계 (48x40)
    const desk = p => { Px.rect(p, 4, 30, 40, 4, 'b'); Px.rect(p, 6, 34, 3, 6, 'B'); Px.rect(p, 39, 34, 3, 6, 'B'); };
    const cards = (p, n) => { for (let i = 0; i < n; i++) { const x = 8 + (i % 5) * 7, y = 24 - Math.floor(i / 5) * 4; Px.rect(p, x, y, 6, 5, 'w'); p(x + 2, y + 2, 'k'); } };
    const book = (p, done) => { Px.rect(p, 14, 10, 20, 20, done ? 'r' : 'w'); Px.rect(p, 14, 10, 2, 20, 'R'); if (done) { Px.rect(p, 19, 14, 10, 2, 'Y'); Px.rect(p, 19, 18, 10, 1, 'Y'); } };
    const dc = [p => { desk(p); cards(p, 5); }, p => { desk(p); cards(p, 10); }, p => { desk(p); cards(p, 15); }, p => { desk(p); book(p, false); }, p => { desk(p); book(p, true); }];
    dc.forEach((f, i) => Px.draw(scene, 'dict' + i, 48, 40, (p, ctx) => { f(p); Px.outline(ctx, 48, 40); }));
    Px.draw(scene, 'm_letter', 16, 16, (p, ctx) => { Px.rect(p, 2, 4, 12, 9, 'w'); Px.poly(p, [[2, 4], [8, 9], [14, 4]], 'l'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_cards', 16, 16, (p, ctx) => { [[2, 3], [6, 6], [9, 2]].forEach(([x, y]) => { Px.rect(p, x, y, 5, 7, 'w'); p(x + 2, y + 2, 'k'); p(x + 2, y + 4, 'k'); }); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_order', 16, 16, (p, ctx) => { Px.rect(p, 3, 2, 10, 12, 'Y'); ['ㄱ', 'ㄴ', 'ㄷ'].forEach((_, i) => Px.rect(p, 5, 4 + i * 3, 6, 1, 'k')); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_book', 16, 16, (p, ctx) => { Px.rect(p, 3, 2, 10, 12, 'r'); Px.rect(p, 3, 2, 2, 12, 'R'); Px.rect(p, 6, 5, 5, 1, 'Y'); Px.outline(ctx, 16, 16); });
  });

  const QUIZ = [
    { q: '1919년 3월 1일, 전국에서 「대한 독립 만세」를 외친 일은?', options: ['3·1 운동', '6·25 전쟁', '임진왜란'], why: '3·1 운동은 남녀노소 누구나 함께 독립을 외친 큰 만세 운동이야.' },
    { q: '아우내 장터에서 만세 운동을 이끈 학생 독립운동가는?', options: ['유관순', '신사임당', '허난설헌'], why: '유관순은 고향 천안 아우내 장터에서 만세 운동을 이끌었어.' },
    { q: '3·1 운동 뒤 독립운동을 이끌기 위해 상하이에 세운 정부는?', options: ['대한민국 임시 정부', '조선 총독부', '집현전'], why: '1919년 상하이에 대한민국 임시 정부를 세워 독립운동을 이끌었어.' },
    { q: '우리말을 지키려고 사전(말모이)을 만든 단체는?', options: ['조선어 학회', '집현전', '독립 협회'], why: '조선어 학회는 우리말 사전을 만들고 맞춤법을 정리했어.' },
    { q: '하얼빈에서 이토 히로부미를 처단한 독립운동가는?', options: ['안중근', '김구', '정약용'], why: '안중근은 1909년 하얼빈에서 이토 히로부미를 처단했어.' },
    { q: '대한민국 임시 정부를 이끌며 「백범」이라는 호로 알려진 독립운동가는?', options: ['김구', '세종', '장영실'], why: '김구는 임시 정부를 끝까지 지키며 독립운동을 이끌었어.' }
  ];

  // 예전 지도형 거점의 내용을 그대로 씀 (대사 · 미니게임 · 보상)
  const NODES = [
      {
        id: 'declaration', name: '평양', lon: 125.75, lat: 39.03, who: 'cl_student', desc: '일제 강점기 · 3·1 운동\n독립 선언서 전하기',
        story: ['학생: 1919년 3월 1일, 서울 탑골 공원에서 독립 선언서를 읽었대요! 평양에서도 같은 날 만세를 부르기로 했어요.', '학생: 그런데 시간 괴물들이 골목을 지키고 있어요. 들키지 말고 선언서를 모임 장소까지 전해 줄래요?'],
        after: ['학생: 3·1 운동은 서울과 평양에서 시작해 전국으로, 나라 밖까지 퍼져 나갔어요.'],
        mission: { scene: 'Stealth', p: { title: '독립 선언서 전하기', key: 'colonial', goal: [12, 1], start: [1, 8], goalLabel: '모임 장소', exp: 90,
          intro: ['학생: 시간 괴물은 앞쪽 세 칸을 봐요. 괴물이 다른 곳을 볼 때 재빨리 지나가요!', '방향키로 한 칸씩 움직여요. 들키면 처음 자리로 돌아가요.'],
          map: [
            '##,,,,##,,,,##',
            '#,,.....,,,.,#',
            ',,.H,..,H,..,,',
            ',..,,,.,,,.,,#',
            '#.,##,....,,,,',
            ',.,,,,.,##.,H,',
            ',....,.,,,..,,',
            '#,,H.,...,,.,#',
            ',..,,,,#,,,,,,'
          ],
          guards: [{ path: [[2, 2], [2, 6]] }, { path: [[6, 1], [6, 7]] }, { path: [[10, 1], [10, 6]] }, { path: [[4, 6], [9, 6]] }],
          outro: ['선언서를 무사히 전했다!', '「대한 독립 만세!」 외치는 소리가 거리에 울려 퍼졌다.'] } },
        reward: { mon: ['declaration', 29], text: '「대한 독립 만세!」' }
      },
      {
        id: 'aunae', name: '아우내 장터', lon: 127.3, lat: 36.75, who: 'cl_yugwansun', desc: '일제 강점기 · 유관순\n태극기 완성',
        story: ['유관순: 나는 이화 학당 학생 유관순이에요. 서울에서 만세 운동에 함께한 뒤, 고향 천안으로 내려왔어요.', '유관순: 장날에 아우내 장터에서 모두 함께 만세를 부르려고 해요. 사람들에게 나눠 줄 태극기를 함께 만들래요?'],
        after: ['유관순: 나라를 되찾고 싶은 마음은 모두 같았어요.'],
        mission: { scene: 'Flag', p: { title: '태극기 완성', npc: 'cl_yugwansun', exp: 90,
          intro: ['유관순: 장날에 아우내 장터에서 모두 함께 만세를 부르려고 해요. 밤새 태극기를 만들어야 해요!', '유관순: 가운데 태극은 빨강이 위, 파랑이 아래예요. 네 귀퉁이에는 4괘가 들어가요.', '유관순: 왼쪽 위는 하늘(건 ☰), 오른쪽 아래는 땅(곤 ☷), 오른쪽 위는 물(감 ☵), 왼쪽 아래는 불(리 ☲)이에요. 자리를 골라 스페이스를 누르면 바뀌어요.'],
          outro: ['태극기가 완성되었다!', '유관순: 장터의 사람들 손에 태극기가 하나씩 쥐어졌어요. 나라를 되찾고 싶은 마음은 모두 같았어요.'] } },
        reward: { mon: ['taegeukgi', 29], text: '만세 운동의 태극기' }
      },
      {
        id: 'malmoi', name: '조선어 학회', lon: 127.0, lat: 37.57, who: 'cl_scholar', desc: '일제 강점기 · 경성\n낱말 카드 정리',
        story: ['학자: 일제는 학교에서 우리말 대신 일본어만 쓰게 했단다. 이대로면 우리말이 사라질지도 몰라.', '학자: 그래서 조선어 학회는 전국의 낱말을 모아 사전을 만드는 「말모이」를 하고 있지. 함께 해 주겠니?'],
        after: ['학자: 말과 글을 지키는 것도 나라를 지키는 일이란다.'],
        mission: { scene: 'Sort', p: { title: '말모이 낱말 정리', npc: 'cl_scholar', need: 15, lives: 3, exp: 90,
          intro: ['학자: 전국에서 편지로 보내 준 낱말 카드가 산더미처럼 쌓였구나! 사전은 가나다 차례로 정리해야 찾기 쉽단다.', '학자: 첫 글자의 자음이 ㄱ~ㅅ 이면 ← 왼쪽 상자, ㅇ~ㅎ 이면 → 오른쪽 상자로 보내 다오. 세 번 틀리면 다시 해야 해.'],
          outro: ['낱말 카드를 모두 정리했다!', '학자: 이 원고는 광복 뒤에 「조선말 큰사전」으로 세상에 나온단다. 말과 글을 지키는 것도 나라를 지키는 일이야.'] } },
        reward: { mon: ['malmoi', 29], text: '우리말을 모은 사전' }
      }
    ];
  const BOSS = Object.assign({
      id: 'boss', name: '김구', lon: 124.3, lat: 36.0, who: 'cl_kimgu', desc: '바다 건너 상하이\n대한민국 임시 정부',
      story: ['김구: 어서 오너라. 나는 대한민국 임시 정부를 지키고 있는 김구란다.', '김구: 나라 밖에서도 많은 사람이 독립을 위해 애썼지. 독립운동의 역사를 얼마나 알게 되었는지 들어 보자꾸나.'],
      win: ['김구: 훌륭하구나! 나는 우리나라가 힘센 나라보다 「문화의 힘이 높은 나라」가 되기를 바란단다.', '김구: 1945년 8월 15일, 마침내 우리는 나라를 되찾게 된다. 그 기쁜 날로 가 보거라!'],
      after: ['김구: 문화의 힘을 기르는 사람이 되거라.'],
      quiz: QUIZ, stamp: { name: '독립의 인장', icon: 'mon_taegeukgi' }
    }, { where: '바다 건너 상하이' });
  const R = HG.Region.make({ era: ERA, nodes: NODES, boss: BOSS, quiz: QUIZ, place: '경성', goal: '독립의 길 돌아보기' });
  const enc = HG.Region.enc;

  // ① 경성 (가운데)
  const h = new B(24, 16, '.');
  h.border('T');
  h.rect(11, 0, 2, 16, 'A').rect(0, 12, 24, 1, 'A').set(23, 12, 'T');
  h.rect(10, 0, 1, 12, 'v').rect(13, 0, 1, 12, 'v').rect(1, 11, 9, 1, 'v').rect(14, 11, 9, 1, 'v');
  h.rect(15, 2, 7, 5, 'Q');
  h.dots([[3, 8], [20, 9], [7, 14], [19, 14]], '"');
  HG.maps.cl_gyeongseong = {
    id: 'cl_gyeongseong', name: '경성 거리', music: 'village', tiles: h.rows(),
    objects: [
      { kind: 'brick', x: 4, y: 3, talk: ['「조선어 학회」 간판이 걸린 건물이다.'] },
      { kind: 'pagoda', x: 18, y: 3, talk: ['탑골 공원의 십층 석탑이다.'],
        secret: { id: 'colonial_tapgol', item: ['berry', 3], fact: '1919년 3월 1일, 서울 탑골 공원에서 학생과 시민들이 독립 선언서를 읽고 만세 운동을 시작했어.' } },
      { kind: 'brick', x: 2, y: 8, talk: ['상점이 늘어선 근대식 건물이다.'] },
      { kind: 'sign', x: 9, y: 13, talk: ['↑ 평양   ↓ 천안 아우내 장터', '← 제물포 항구 (배 타고 상하이)'] },
      { kind: 'timemachine', x: 15, y: 9, smoke: true, talk: async ev => HG.Era.timeMachine(ev, HG.state.stamps.includes(ERA)) }
    ],
    npcs: [R.npc('malmoi', 6, 6, 'down'),
      { id: 'citizen', sprite: 'cl_citizen', x: 17, y: 7, dir: 'down', talk: ['시민: 1910년 일본에 나라를 빼앗긴 뒤로 우리는 많은 어려움을 겪었어.', '그래도 우리말을 지키고, 독립을 외치는 사람들이 끊이지 않았단다.'] },
      { id: 'kid', sprite: 'cl_kid', x: 6, y: 14, dir: 'down', wander: 2, talk: async ev => { const l = R.remaining(ev.state); await ev.say(l.length ? `아이: ${l.join(', ')}에서 도움이 필요하대!` : '아이: 제물포에서 배를 타면 상하이 임시 정부에 갈 수 있어!'); } }],
    tileSecrets: { '20,9': { id: 'colonial_ahn', item: ['meat', 2], fact: '안중근은 1909년 하얼빈에서 이토 히로부미를 처단했어. 감옥에서도 동양의 평화를 바라는 글을 썼지.' } },
    warps: [
      { x: 11, y: 0, to: 'cl_pyongyang', tx: 10, ty: 12, dir: 'up' }, { x: 12, y: 0, to: 'cl_pyongyang', tx: 11, ty: 12, dir: 'up' },
      { x: 11, y: 15, to: 'cl_aunae', tx: 10, ty: 1, dir: 'down' }, { x: 12, y: 15, to: 'cl_aunae', tx: 11, ty: 1, dir: 'down' },
      { x: 0, y: 12, to: 'cl_shanghai', tx: 20, ty: 10, dir: 'left' }
    ],
    encounterRate: 0.05, encounter: enc([['declaration', 35], ['taegeukgi', 35], ['malmoi', 30]], 27, 30),
    onEnter: HG.Region.arrive(ERA, ['할아버지(무전기): 여기는 일제 강점기의 경성(지금의 서울)이란다. 일본이 우리나라를 강제로 빼앗아 다스리던 아픈 시간이야.',
      '할아버지: 하지만 우리 조상들은 포기하지 않았어. 만세를 외치고, 우리말을 지키고, 나라 밖에서도 독립을 위해 힘썼지.',
      '할아버지: 경성의 조선어 학회, 북쪽 평양, 남쪽 천안 아우내 장터를 도운 뒤, 제물포에서 배를 타고 상하이의 김구 선생님을 찾아가렴.'])
  };

  // ② 평양 (북쪽)
  const py = new B(22, 14, '.');
  py.border('T');
  py.rect(10, 0, 2, 14, 'A').rect(9, 0, 1, 14, 'v').rect(12, 0, 1, 14, 'v');
  py.rect(1, 8, 20, 1, 'A');
  py.dots([[4, 11], [17, 11], [3, 3]], '"');
  HG.maps.cl_pyongyang = {
    id: 'cl_pyongyang', name: '평양 거리', music: 'field', tiles: py.rows(),
    objects: [
      { kind: 'brick', x: 4, y: 3, talk: ['학교 건물이다. 학생들이 몰래 모여 만세 운동을 준비했다.'] },
      { kind: 'brick', x: 15, y: 3, talk: ['교회 건물이다. 3월 1일에 이곳에서도 독립 선언식이 열렸다.'],
        secret: { id: 'colonial_pyongyang', item: ['berry', 3], fact: '3·1 운동은 서울뿐 아니라 평양, 의주 같은 여러 도시에서 같은 날 함께 시작되었어.' } },
      { kind: 'sign', x: 13, y: 12, talk: ['↓ 경성'] }
    ],
    npcs: [R.npc('declaration', 8, 9, 'right')],
    warps: [{ x: 10, y: 13, to: 'cl_gyeongseong', tx: 11, ty: 1, dir: 'down' }, { x: 11, y: 13, to: 'cl_gyeongseong', tx: 12, ty: 1, dir: 'down' }],
    encounterRate: 0.05, encounter: enc([['declaration', 70], ['taegeukgi', 30]], 27, 30)
  };

  // ③ 천안 아우내 장터 (남쪽)
  const au = new B(22, 14, '.');
  au.border('T');
  au.rect(10, 0, 2, 14, ':').set(10, 13, 'T').set(11, 13, 'T');
  au.rect(3, 6, 16, 4, 'Q');
  au.rect(15, 11, 5, 2, ',');
  au.dots([[3, 3], [18, 3], [5, 12]], '"');
  HG.maps.cl_aunae = {
    id: 'cl_aunae', name: '천안 · 아우내 장터', music: 'field', tiles: au.rows(),
    objects: [
      { kind: 'stall', x: 4, y: 6, talk: ['장날이라 사람들이 많이 모였다.'] },
      { kind: 'stall', x: 14, y: 6, talk: ['짚신과 곡식을 파는 가게다.'],
        secret: { id: 'colonial_aunae', item: ['meat', 2], fact: '1919년 4월 1일 아우내 장날, 유관순과 마을 사람들은 태극기를 나누어 주며 만세를 외쳤어.' } },
      { kind: 'chogajip', x: 3, y: 2, talk: ['유관순의 고향 집이다.'] },
      { kind: 'sign', x: 12, y: 2, talk: ['↑ 경성'] }
    ],
    npcs: [R.npc('aunae', 9, 8, 'right'),
      { id: 'merchant', sprite: 'cl_merchant', x: 16, y: 8, dir: 'left', talk: ['장꾼: 장날에는 여러 마을 사람들이 모이니까 만세 운동을 하기 좋았지.'] }],
    warps: [{ x: 10, y: 0, to: 'cl_gyeongseong', tx: 11, ty: 14, dir: 'up' }, { x: 11, y: 0, to: 'cl_gyeongseong', tx: 12, ty: 14, dir: 'up' }],
    encounterRate: 0.05, encounter: enc([['taegeukgi', 70], ['malmoi', 30]], 27, 30)
  };

  // ④ 상하이 (바다 건너)
  const sh = new B(22, 14, '.');
  sh.border('T');
  sh.rect(1, 1, 3, 12, '~').rect(4, 1, 1, 12, 's');
  sh.rect(5, 10, 17, 1, 'A').rect(12, 5, 1, 5, 'v');
  sh.rect(15, 11, 5, 2, '"');
  HG.maps.cl_shanghai = {
    id: 'cl_shanghai', name: '상하이 · 대한민국 임시 정부', music: 'field', tiles: sh.rows(),
    waterTalk: ['황푸강이다. 배를 타고 바다를 건너 이곳에 왔다.'],
    objects: [
      { kind: 'brick', x: 11, y: 2, talk: ['「대한민국 임시 정부」 청사다.'],
        secret: { id: 'colonial_provisional', mon: ['declaration', 28], fact: '대한민국 임시 정부는 1919년 상하이에서 세워져, 광복 때까지 27년 동안 독립운동을 이끌었어.' } },
      { kind: 'boat', x: 2, y: 6, talk: ['제물포에서 타고 온 배다.'] },
      { kind: 'sign', x: 19, y: 9, talk: ['→ 제물포 항구 · 경성'] }
    ],
    npcs: [R.bossNpc(13, 5, 'down'),
      { id: 'patriot', sprite: 'cl_patriot', x: 8, y: 9, dir: 'down', talk: ['독립운동가: 나라 밖에서도 많은 사람이 독립을 위해 애썼소.', '임시 정부는 한국광복군을 만들어 광복을 준비했다오.'] }],
    warps: [{ x: 21, y: 10, to: 'cl_gyeongseong', tx: 1, ty: 12, dir: 'right' }],
    encounterRate: 0.05, encounter: enc([['malmoi', 50], ['declaration', 50]], 28, 31),
    onEnter: async ev => { if (!ev.flag('cl_shanghai_seen')) { ev.setFlag('cl_shanghai_seen'); await ev.say('제물포 항구에서 배를 타고 바다를 건너 상하이에 도착했다.'); } }
  };

  HG.registerStage(Object.assign({
    id: ERA, type: 'village', quiz: QUIZ, objective: R.objective, taskFlags: R.T, battleBg: 'bb_village',
    devMinis: NODES.filter(n => n.mission).map(n => ({ name: n.name, scene: n.mission.scene, p: n.mission.p }))
  }, { name: '일제 강점기', baseLevel: 29, teacher: '김구', start: { map: 'cl_gyeongseong', x: 14, y: 13, dir: 'up' }, respawn: { map: 'cl_gyeongseong', x: 14, y: 13, dir: 'up' }, maps: ['cl_gyeongseong', 'cl_pyongyang', 'cl_aunae', 'cl_shanghai'] }));
})();
