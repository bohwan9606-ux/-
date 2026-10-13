// ─────────────────────────────────────────────
// 스테이지 6: 고려 — 걸어 다니는 「작은 한반도」
// 가운데 개경(서희·벽란도) → ↑ 귀주(강감찬) · ↓ 남쪽 절 마을(청주 흥덕사·해인사) → ← 서남쪽 강진 가마
// ─────────────────────────────────────────────
(function () {
  const B = HG.MapBuilder;
  const ERA = 'goryeo';

  HG.Art.register(function (scene) {
    HG.Art.person(scene, 'gr_arab', { hair: 'k', shirt: 'w', pants: 'w', robe: 'w', belt: 'y', beard: true, hat: 'hood' });
    HG.Art.person(scene, 'gr_soldier', { hair: 'k', shirt: 'u', pants: 'G', armor: 'G', hat: 'helmet' });
    HG.Art.person(scene, 'gr_kid', { hair: 'k', shirt: 'c', pants: 'n', collar: 'w', goreum: 'u' });
    const Px = HG.Pixel;
    HG.Art.person(scene, 'gr_seohui', { hair: 'k', shirt: 'u', pants: 'U', robe: 'u', belt: 'y', hat: 'boktu', beard: true });
    HG.Art.person(scene, 'gr_potter', { hair: 'k', shirt: 'c', pants: 'w', band: 'w', collar: 'w', goreum: 'U', hat: 'sangtu' });
    HG.Art.person(scene, 'gr_monk', { hair: 'k', shirt: 'g', pants: 'G', robe: 'g', belt: 'G', shoes: 'k', hat: 'monk' });
    HG.Art.person(scene, 'gr_printer', { hair: 'k', shirt: 'n', pants: 'b', band: 'w', collar: 'w', goreum: 'b', hat: 'sangtu' });
    HG.Art.person(scene, 'gr_gangamchan', { hair: 'k', shirt: 'R', pants: 'G', armor: 'G', robe: 'U', belt: 'y', beard: true, hat: 'helmet' });
    // 대장경판 · 벌레 먹은 나무
    Px.draw(scene, 'g_board', 14, 12, (p, ctx) => { Px.rect(p, 1, 2, 12, 8, 'n'); Px.rect(p, 0, 2, 1, 8, 'b'); Px.rect(p, 13, 2, 1, 8, 'b'); for (let y = 3; y < 9; y += 2) for (let x = 3; x < 11; x += 2) p(x, y, 'B'); Px.outline(ctx, 14, 12); });
    Px.draw(scene, 'g_bug', 12, 12, (p, ctx) => { Px.ellipse(p, 6, 7, 3, 4, 'B'); Px.rect(p, 5, 2, 2, 2, 'k'); [[2, 5], [10, 5], [2, 8], [10, 8], [2, 11], [10, 11]].forEach(([x, y]) => p(x, y, 'k')); p(5, 6, 'n'); Px.outline(ctx, 12, 12); });
    // 금속 활자 인쇄 단계 (48x40)
    const tray = p => { Px.rect(p, 6, 30, 36, 8, 'b'); Px.rect(p, 7, 31, 34, 1, 'n'); };
    const types = (p, n) => { for (let i = 0; i < n; i++) { const x = 9 + (i % 6) * 5, y = 20 + Math.floor(i / 6) * 5; Px.rect(p, x, y, 4, 4, 'G'); p(x + 1, y + 1, 'l'); } };
    const paper = p => { Px.rect(p, 10, 4, 28, 14, 'w'); for (let y = 6; y < 16; y += 3) Px.rect(p, 13, y, 22, 1, 'k'); };
    const pr = [p => { tray(p); Px.rect(p, 14, 20, 20, 8, 'n'); Px.rect(p, 16, 22, 16, 4, 'b'); },
      p => { tray(p); Px.rect(p, 14, 20, 20, 8, 'n'); Px.rect(p, 16, 22, 16, 4, 'o'); Px.rect(p, 22, 10, 4, 10, 'r'); },
      p => { tray(p); types(p, 6); },
      p => { tray(p); types(p, 12); Px.rect(p, 8, 19, 32, 1, 'k'); },
      p => { tray(p); types(p, 12); paper(p); }];
    pr.forEach((f, i) => Px.draw(scene, 'print' + i, 48, 40, (p, ctx) => { f(p); Px.outline(ctx, 48, 40); }));
    Px.draw(scene, 'm_mold', 16, 16, (p, ctx) => { Px.rect(p, 2, 4, 12, 9, 'n'); Px.rect(p, 4, 6, 8, 5, 'b'); p(6, 8, 'Y'); p(9, 8, 'Y'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_metal', 16, 16, (p, ctx) => { Px.ellipse(p, 8, 10, 6, 4, 'G'); Px.ellipse(p, 8, 8, 4, 2, 'o'); Px.rect(p, 7, 1, 2, 5, 'r'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_type', 16, 16, (p, ctx) => { [[2, 3], [8, 3], [2, 9], [8, 9]].forEach(([x, y]) => { Px.rect(p, x, y, 5, 5, 'G'); p(x + 2, y + 2, 'l'); }); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_paper', 16, 16, (p, ctx) => { Px.rect(p, 2, 2, 12, 12, 'w'); for (let y = 4; y < 13; y += 3) Px.rect(p, 4, y, 8, 1, 'k'); Px.outline(ctx, 16, 16); });
  });

  const QUIZ = [
    { q: '거란이 쳐들어왔을 때 말로 담판을 지어 강동 6주를 얻은 사람은?', options: ['서희', '강감찬', '왕건'], why: '서희는 거란 장수 소손녕과 담판을 지어 싸우지 않고 강동 6주를 얻었어.' },
    { q: '귀주에서 거란군을 크게 물리친 고려의 장군은?', options: ['강감찬', '을지문덕', '이순신'], why: '강감찬은 귀주 대첩에서 거란군을 크게 물리쳤어.' },
    { q: '그릇 겉면을 파내고 다른 흙을 메워 무늬를 낸 고려청자의 기법은?', options: ['상감 기법', '빗살무늬', '거중기'], why: '상감 기법으로 만든 상감 청자는 고려만의 독창적인 도자기야.' },
    { q: '부처의 힘으로 몽골의 침입을 이겨 내려고 만든 고려의 유산은?', options: ['팔만대장경', '훈민정음', '대동여지도'], why: '팔만대장경은 8만여 장의 나무판에 불교 경전을 새긴 거야. 해인사에 보관되어 있어.' },
    { q: '지금 남아 있는 금속 활자 책 가운데 가장 오래된 것은?', options: ['직지심체요절', '삼국사기', '훈민정음 해례본'], why: '청주 흥덕사에서 금속 활자로 찍은 「직지」는 세계에서 가장 오래된 금속 활자 책이야.' },
    { q: '고려를 세운 사람은?', options: ['왕건', '이성계', '대조영'], why: '왕건이 고려를 세우고 후삼국을 다시 하나로 통일했어.' }
  ];

  // 예전 지도형 거점의 내용을 그대로 씀 (대사 · 미니게임 · 보상)
  const NODES = [
      {
        id: 'seohui', name: '개경', lon: 126.55, lat: 37.97, who: 'gr_seohui', desc: '고려 · 서희\n말로 나라를 지킨 담판',
        story: ['서희: 거란이 큰 군대를 이끌고 쳐들어왔소. 하지만 싸우지 않고 말로 해결할 길이 있을지도 모르오.', '서희: 거란 장수와 담판을 지으러 가기 전에, 내 생각을 함께 정리해 주겠소?'],
        after: ['서희: 칼보다 지혜로운 말이 나라를 지킬 때도 있는 법이오.'],
        talk: ev => HG.talkQuiz(ev, '서희', [
          { q: '거란 장수가 「고려는 신라를 이었으니 옛 고구려 땅을 내놓아라!」 하면 뭐라고 답할까?', options: ['고려는 고구려를 이었다', '땅을 다 내주겠다', '잘 모르겠다'], why: '서희는 고려가 고구려를 이었다는 것을 당당히 밝혔어.', good: '바로 그거요! 이름부터 고구려를 이었다는 뜻이지.' },
          { q: '거란이 정말 바라는 것은 송나라 대신 거란과 사귀는 것이오. 그러려면 무엇이 필요하다고 할까?', options: ['여진을 몰아낼 땅이 필요하다', '금은보화가 필요하다', '아무것도 필요 없다'], why: '서희는 여진을 몰아내야 거란과 오갈 수 있다며 그 땅을 얻어 냈어.', good: '옳소! 그래서 얻은 땅이 강동 6주라오.' },
          { q: '서희가 담판으로 얻은 땅은?', options: ['강동 6주', '한강 유역', '울릉도'], why: '서희는 압록강 동쪽의 강동 6주를 얻었어.' }
        ]),
        reward: { item: ['berry', 3] }
      },
      {
        id: 'gangjin', name: '강진 가마', lon: 126.77, lat: 34.62, who: 'gr_potter', desc: '고려 · 도공\n상감 청자 만들기',
        story: ['도공: 어서 오너라! 여기는 고려청자를 굽는 강진의 가마란다.', '도공: 그릇에 무늬를 파내고 흰 흙과 붉은 흙을 메우는 게 「상감」이지. 무늬를 새기는 걸 도와줄래?'],
        after: ['도공: 비취처럼 푸른 고려청자의 빛깔은 다른 나라 사람들도 감탄했단다.'],
        mission: { scene: 'Trace', p: { title: '상감 무늬 파기', npc: 'gr_potter', time: 70, exp: 70,
          intro: ['도공: 그릇 겉면에 무늬를 파고, 그 자리에 흰 흙과 붉은 흙을 메우는 게 「상감」이야.', '도공: 연필 밑그림을 따라 방향키로 무늬를 파 보렴. 밑그림 밖으로 나가려 하면 그릇에 금이 가니 조심!'],
          outro: ['구름과 학이 날아오르는 상감 청자가 완성되었다!', '도공: 이것이 고려만의 기법, 상감 청자란다.'] } },
        reward: { mon: ['celadon', 20], text: '비취색 고려청자' }
      },
      {
        id: 'haeinsa', name: '해인사', lon: 128.1, lat: 35.8, who: 'gr_monk', desc: '고려 · 팔만대장경\n기록 짝 맞추기',
        story: ['스님: 몽골이 쳐들어와 나라가 어려울 때, 고려 사람들은 마음을 모아 대장경을 새겼단다.', '스님: 나무판 8만 장이 넘게 새겼지! 이렇게 많은 기록은 어떻게 정리했을까?'],
        after: ['스님: 팔만대장경은 지금도 해인사 장경판전에 잘 보관되어 있단다.'],
        mission: { scene: 'Memory', p: { title: '기록 짝 맞추기', npc: 'gr_monk', exp: 70,
          items: ['handaxe', 'combpot', 'bronzemirror', 'halfmoon', 'goldcrown', 'ironarmor', 'incense', 'dabotap', 'bell', 'celadon', 'muralhunt', 'bronzesword'],
          intro: ['스님: 몽골이 쳐들어와 나라가 어려울 때, 고려 사람들은 마음을 모아 8만 장이 넘는 나무판에 경전을 새겼단다.', '스님: 이렇게 많은 기록도 차곡차곡 정리해야 잃어버리지 않지. 너도 지금까지 만난 유물 기록을 정리해 보렴. 그림과 이름을 짝지어 주면 돼!'],
          outro: ['기록을 모두 정리했다!', '스님: 팔만대장경은 지금도 해인사 장경판전에 잘 보관되어 있단다.'] } },
        reward: { mon: ['tripitaka', 20], text: '8만 장의 나무판' }
      },
      {
        id: 'jikji', name: '청주 흥덕사', lon: 127.49, lat: 36.64, who: 'gr_printer', desc: '고려 · 금속 활자\n거울 글자 찾기',
        story: ['인쇄공: 여기는 청주 흥덕사! 쇠로 글자 도장(금속 활자)을 만들어 책을 찍고 있단다.', '인쇄공: 한 번 만든 활자는 글자를 바꿔 끼워 여러 책을 찍을 수 있지. 함께 찍어 볼래?'],
        after: ['인쇄공: 우리가 찍은 「직지」는 지금 남아 있는 가장 오래된 금속 활자 책이란다.'],
        mission: { scene: 'Mirror', p: { title: '금속 활자 고르기', npc: 'gr_printer', rounds: 8, exp: 70,
          intro: ['인쇄공: 쇠로 만든 글자 도장을 「금속 활자」라고 해. 활자를 판에 늘어놓고 먹을 발라 종이에 찍는 거지.', '인쇄공: 그런데 도장처럼 활자는 글자가 좌우로 뒤집혀 있어야 종이에 바르게 찍힌단다. 알맞은 활자를 골라 봐!', '(직지는 한자로 찍었지만, 여기서는 한글로 연습해 보자.)'],
          outro: ['한 장이 깨끗하게 찍혀 나왔다!', '인쇄공: 이렇게 찍은 책이 「직지」란다. 지금은 프랑스 국립 도서관에 있지.'] } },
        reward: { mon: ['metaltype', 20], text: '쇠로 만든 글자 도장' }
      }
    ];
  const BOSS = Object.assign({
      id: 'boss', name: '강감찬', lon: 125.2, lat: 39.95, who: 'gr_gangamchan', desc: '고려 · 귀주\n고려의 스승',
      story: ['강감찬: 나는 강감찬이오. 거란이 세 번째로 쳐들어왔을 때, 귀주에서 크게 물리쳤지.', '강감찬: 이것을 귀주 대첩이라 하오. 고려의 지혜와 문화를 두루 살펴보고 왔다니, 시험해 보겠소!'],
      team: [['metaltype', 20], ['celadon', 21]], bg: 'bb_castle',
      lose: ['강감찬: 훌륭하오! 그대는 고려의 진정한 장인이로군.'],
      win: ['강감찬: 시간이 흘러 고려는 힘이 약해지고, 이성계가 새 나라 조선을 세운다오.', '강감찬: 다음 시대에서 그 이야기를 이어 가시오.'],
      after: ['강감찬: 나라를 지키는 것은 용기와 지혜, 둘 다라오.'],
      quiz: QUIZ, stamp: { name: '고려 인장', icon: 'mon_celadon' }
    }, { where: '북쪽 귀주' });
  const R = HG.Region.make({ era: ERA, nodes: NODES, boss: BOSS, quiz: QUIZ, place: '개경', goal: '고려 돌아보기' });
  const enc = HG.Region.enc;

  // ① 개경 (가운데) — 서쪽 바닷가에 벽란도
  const h = new B(24, 16, '.');
  h.border('T');
  h.rect(1, 1, 3, 14, '~').rect(4, 1, 1, 14, 's');
  h.rect(11, 0, 2, 16, ':').rect(5, 12, 18, 1, ':').rect(5, 8, 6, 1, ':');
  h.rect(14, 2, 7, 4, 'Q');
  h.rect(17, 13, 5, 2, ',');
  h.dots([[8, 3], [21, 8], [7, 14]], '"');
  HG.maps.gr_gaegyeong = {
    id: 'gr_gaegyeong', name: '고려 · 개경', music: 'village', tiles: h.rows(),
    waterTalk: ['예성강 하구의 바다다. 벽란도 항구로 배들이 드나든다.'],
    objects: [
      { kind: 'giwajip', x: 16, y: 2, talk: ['고려 왕궁 「만월대」다.'] },
      { kind: 'boat', x: 2, y: 8, talk: ['송나라에서 온 무역선이다.'],
        secret: { id: 'goryeo_byeokrando', item: ['meat', 2], fact: '고려의 무역항 벽란도에는 송나라와 아라비아 상인까지 찾아왔어. 이때 「고려」가 서양에 알려져 「코리아」라는 이름이 생겼지.' } },
      { kind: 'sign', x: 10, y: 11, talk: ['↑ 귀주 (북쪽)   ↓ 남쪽 절 마을 (청주 · 해인사)', '← 벽란도 항구'] },
      { kind: 'timemachine', x: 14, y: 9, smoke: true, talk: async ev => HG.Era.timeMachine(ev, HG.state.stamps.includes(ERA)) }
    ],
    npcs: [R.npc('seohui', 8, 6, 'down'),
      { id: 'arab', sprite: 'gr_arab', x: 5, y: 9, dir: 'left', talk: ['아라비아 상인: 나는 멀리 서쪽에서 왔소!', '고려의 인삼과 비단, 청자는 정말 훌륭하다오. 우리는 고려를 「코레」라고 부른다오.'] },
      { id: 'kid', sprite: 'gr_kid', x: 15, y: 13, dir: 'down', wander: 2, talk: async ev => { const l = R.remaining(ev.state); await ev.say(l.length ? `아이: ${l.join(', ')}에 아직 안 가 봤지?` : '아이: 북쪽 귀주에 강감찬 장군님이 계셔!'); } }],
    tileSecrets: { '21,8': { id: 'goryeo_ginseng', item: ['berry', 3], fact: '왕건은 918년 고려를 세우고, 후삼국을 다시 하나로 통일했어(936년).' } },
    warps: [
      { x: 11, y: 0, to: 'gr_gwiju', tx: 10, ty: 12, dir: 'up' }, { x: 12, y: 0, to: 'gr_gwiju', tx: 11, ty: 12, dir: 'up' },
      { x: 11, y: 15, to: 'gr_south', tx: 10, ty: 1, dir: 'down' }, { x: 12, y: 15, to: 'gr_south', tx: 11, ty: 1, dir: 'down' }
    ],
    encounterRate: 0.06, encounter: enc([['celadon', 35], ['tripitaka', 35], ['metaltype', 30]], 18, 21),
    onEnter: HG.Region.arrive(ERA, ['할아버지(무전기): 여기는 고려의 서울, 개경이란다! 왕건이 세운 나라지.',
      '할아버지: 고려는 거란과 몽골이 쳐들어와 어려움을 겪었지만, 지혜와 용기로 이겨 내고 멋진 문화도 많이 남겼어.',
      '할아버지: 개경의 서희, 남쪽 절 마을의 청주 흥덕사와 해인사, 서남쪽 강진 가마를 돌아본 뒤 북쪽 귀주의 강감찬 장군을 찾아가렴.'])
  };

  // ② 귀주 (북쪽)
  const gw = new B(22, 14, '.');
  gw.border('T');
  gw.rect(1, 1, 20, 3, ',');
  gw.rect(1, 4, 20, 1, '=').rect(10, 4, 2, 1, ':');
  gw.rect(10, 5, 2, 9, ':');
  gw.rect(15, 9, 5, 3, '"');
  HG.maps.gr_gwiju = {
    id: 'gr_gwiju', name: '귀주 성', music: 'field', tiles: gw.rows(),
    objects: [
      { kind: 'stele', x: 14, y: 6, talk: ['「귀주 대첩」을 기리는 비석이다.'],
        secret: { id: 'goryeo_gwiju', item: ['meat', 2], fact: '1019년 강감찬은 귀주에서 거란군을 크게 물리쳤어. 살아 돌아간 거란군이 수천 명뿐이었다고 해.' } },
      { kind: 'sign', x: 12, y: 12, talk: ['↓ 개경 (남쪽)'] }
    ],
    npcs: [R.bossNpc(9, 6, 'down'),
      { id: 'soldier', sprite: 'gr_soldier', x: 13, y: 5, dir: 'down', talk: ['고려 병사: 성 너머 북쪽에서 거란군이 쳐들어오곤 했지.', '서희 대감이 얻어 낸 강동 6주 덕분에 이곳을 단단히 지킬 수 있었어.'] }],
    tileTalk: { ',': ['성 밖 북쪽 들판이다. 풀이 무성하다.'] },
    warps: [{ x: 10, y: 13, to: 'gr_gaegyeong', tx: 11, ty: 1, dir: 'down' }, { x: 11, y: 13, to: 'gr_gaegyeong', tx: 12, ty: 1, dir: 'down' }],
    encounterRate: 0.07, encounter: enc([['metaltype', 50], ['celadon', 50]], 19, 22)
  };

  // ③ 남쪽 절 마을 (청주 흥덕사 · 해인사)
  const so = new B(22, 14, '.');
  so.border('T');
  so.rect(14, 1, 7, 3, '#');
  so.rect(10, 0, 2, 11, ':').rect(0, 10, 22, 1, ':').set(21, 10, 'T');
  so.rect(2, 3, 6, 4, 'Q').rect(14, 4, 6, 4, 'Q');
  so.dots([[4, 12], [17, 12], [8, 8]], '"');
  HG.maps.gr_south = {
    id: 'gr_south', name: '남쪽 절 마을 (청주 · 해인사)', music: 'field', tiles: so.rows(),
    tileTalk: { '#': ['가야산의 바위다. 해인사는 이 깊은 산속에 있다.'] },
    objects: [
      { kind: 'giwajip', x: 3, y: 3, talk: ['청주 흥덕사다. 금속 활자로 책을 찍는 곳이다.'],
        secret: { id: 'goryeo_heungdeok', mon: ['metaltype', 19], fact: '「직지」는 1377년 청주 흥덕사에서 금속 활자로 찍었어. 지금 남아 있는 금속 활자 책 가운데 가장 오래되었지.' } },
      { kind: 'giwajip', x: 15, y: 4, talk: ['가야산 해인사다.'] },
      { kind: 'giwajip', x: 18, y: 4, talk: ['팔만대장경을 보관하는 「장경판전」이다. 창문 크기가 위아래 서로 다르다.'],
        secret: { id: 'goryeo_janggyeong', item: ['berry', 3], fact: '해인사 장경판전은 바람이 잘 통하고 습기가 알맞게 지어져서, 팔만대장경을 700년 넘게 지켜 왔어.' } },
      { kind: 'sign', x: 12, y: 2, talk: ['↑ 개경   ← 강진 (서남쪽)'] }
    ],
    npcs: [R.npc('jikji', 6, 7, 'down'), R.npc('haeinsa', 16, 8, 'down')],
    warps: [
      { x: 10, y: 0, to: 'gr_gaegyeong', tx: 11, ty: 14, dir: 'up' }, { x: 11, y: 0, to: 'gr_gaegyeong', tx: 12, ty: 14, dir: 'up' },
      { x: 0, y: 10, to: 'gr_gangjin', tx: 20, ty: 10, dir: 'left' }
    ],
    encounterRate: 0.06, encounter: enc([['tripitaka', 50], ['metaltype', 50]], 18, 21)
  };

  // ④ 강진 가마 (서남쪽 바닷가)
  const gj = new B(22, 14, '.');
  gj.border('T');
  gj.rect(1, 12, 20, 1, 's').rect(1, 13, 20, 1, '~').rect(1, 1, 3, 11, '~').rect(4, 1, 1, 11, 's');
  gj.rect(5, 10, 17, 1, ':').rect(12, 5, 1, 5, ':');
  gj.rect(14, 2, 6, 3, ',');
  HG.maps.gr_gangjin = {
    id: 'gr_gangjin', name: '강진 청자 가마', music: 'field', tiles: gj.rows(),
    waterTalk: ['강진 앞바다다. 구운 청자를 배에 실어 개경으로 보냈다.'],
    objects: [
      { kind: 'kiln', x: 7, y: 4, talk: ['청자를 굽는 가마다. 언덕을 따라 길게 만들었다.'],
        secret: { id: 'goryeo_kiln', mon: ['celadon', 19], fact: '고려청자의 은은한 푸른빛을 「비색」이라고 해. 전라도 강진과 부안에서 많이 구웠어.' } },
      { kind: 'kiln', x: 7, y: 7, talk: ['가마 안에서 그릇이 구워지고 있다. 아주 뜨겁다!'] },
      { kind: 'chogajip', x: 15, y: 6, talk: ['도공들이 사는 집이다.'] },
      { kind: 'sign', x: 19, y: 9, talk: ['→ 남쪽 절 마을'] }
    ],
    npcs: [R.npc('gangjin', 10, 6, 'left')],
    warps: [{ x: 21, y: 10, to: 'gr_south', tx: 1, ty: 10, dir: 'right' }],
    encounterRate: 0.06, encounter: enc([['celadon', 70], ['tripitaka', 30]], 18, 21)
  };

  HG.registerStage(Object.assign({
    id: ERA, type: 'village', quiz: QUIZ, objective: R.objective, taskFlags: R.T, battleBg: 'bb_village',
    devMinis: NODES.filter(n => n.mission).map(n => ({ name: n.name, scene: n.mission.scene, p: n.mission.p }))
  }, { name: '고려', baseLevel: 20, teacher: '강감찬', start: { map: 'gr_gaegyeong', x: 13, y: 13, dir: 'up' }, respawn: { map: 'gr_gaegyeong', x: 13, y: 13, dir: 'up' }, maps: ['gr_gaegyeong', 'gr_gwiju', 'gr_south', 'gr_gangjin'] }));
})();
