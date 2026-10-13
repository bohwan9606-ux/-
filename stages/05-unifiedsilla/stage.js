// ─────────────────────────────────────────────
// 스테이지 5: 남북국 시대 — 걸어 다니는 「작은 한반도」
// 가운데 서라벌 → → 동쪽 불국사(토함산) · ← 서남쪽 청해진 · ↑ 북쪽 끝 발해(동모산)
// ─────────────────────────────────────────────
(function () {
  const B = HG.MapBuilder;
  const ERA = 'unifiedsilla';

  HG.Art.register(function (scene) {
    HG.Art.person(scene, 'us_official', { hair: 'k', shirt: 'p', pants: 'U', robe: 'p', belt: 'y', hat: 'boktu', beard: true });
    HG.Art.person(scene, 'us_kid', { hair: 'k', shirt: 'y', pants: 'n', collar: 'w', goreum: 'r' });
    HG.Art.person(scene, 'us_balhae', { hair: 'k', shirt: 'n', pants: 'b', robe: 'n', belt: 'B', hat: 'sangtu', collar: 'w' });
    HG.Art.person(scene, 'us_trader', { hair: 'k', shirt: 'c', pants: 'b', band: 'w', pack: true, collar: 'w', goreum: 'u' });
    const Px = HG.Pixel;
    HG.Art.person(scene, 'us_monk', { hair: 'k', shirt: 'g', pants: 'g', robe: 'g', belt: 'G', shoes: 'k', hat: 'monk' });
    HG.Art.person(scene, 'us_bellmaker', { hair: 'k', shirt: 'u', pants: 'w', band: 'u', collar: 'w', goreum: 'U', hat: 'sangtu' });
    HG.Art.person(scene, 'us_jangbogo', { hair: 'k', shirt: 'u', pants: 'U', armor: 'u', robe: 'U', belt: 'y', beard: true, band: 'r', hat: 'sangtu' });
    HG.Art.person(scene, 'us_daejoyeong', { hair: 'k', shirt: 'R', pants: 'G', armor: 'G', robe: 'R', belt: 'y', beard: true, hat: 'helmet' });
    // 석탑 쌓기 단계 (48x40)
    const base = p => { Px.rect(p, 8, 32, 32, 6, 'g'); Px.rect(p, 9, 33, 30, 1, 'l'); };
    const body1 = p => { Px.rect(p, 13, 24, 22, 8, 'l'); Px.rect(p, 14, 25, 1, 6, 'g'); Px.rect(p, 33, 25, 1, 6, 'g'); };
    const roof = (p, y, w) => { Px.rect(p, 24 - w / 2 - 3, y, w + 6, 3, 'g'); };
    const body2 = p => { Px.rect(p, 16, 15, 16, 6, 'l'); Px.rect(p, 18, 8, 12, 5, 'l'); };
    const top = p => { Px.rect(p, 23, 0, 2, 7, 'G'); Px.ellipse(p, 24, 4, 2, 1, 'y'); };
    const st = [p => base(p), p => { base(p); body1(p); }, p => { base(p); body1(p); roof(p, 21, 22); }, p => { base(p); body1(p); roof(p, 21, 22); body2(p); roof(p, 13, 16); roof(p, 6, 12); }, p => { base(p); body1(p); roof(p, 21, 22); body2(p); roof(p, 13, 16); roof(p, 6, 12); top(p); }];
    st.forEach((f, i) => Px.draw(scene, 'tap' + i, 48, 40, (p, ctx) => { f(p); Px.outline(ctx, 48, 40); }));
    Px.draw(scene, 'm_base', 16, 16, (p, ctx) => { Px.rect(p, 1, 9, 14, 5, 'g'); Px.rect(p, 2, 10, 12, 1, 'l'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_body', 16, 16, (p, ctx) => { Px.rect(p, 4, 3, 8, 10, 'l'); Px.rect(p, 5, 4, 1, 8, 'g'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_roof', 16, 16, (p, ctx) => { Px.rect(p, 1, 7, 14, 3, 'g'); Px.rect(p, 3, 5, 10, 2, 'g'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'm_top', 16, 16, (p, ctx) => { Px.rect(p, 7, 2, 2, 12, 'G'); Px.ellipse(p, 8, 6, 3, 1, 'y'); Px.ellipse(p, 8, 10, 2, 1, 'y'); Px.outline(ctx, 16, 16); });
  });

  const QUIZ = [
    { q: '발해를 세운 사람은?', options: ['대조영', '장보고', '김유신'], why: '고구려 장수였던 대조영이 고구려 사람들과 함께 발해를 세웠어.' },
    { q: '장보고가 바다의 해적을 막고 무역을 한 곳은?', options: ['청해진', '벽란도', '한산도'], why: '장보고는 청해진을 세워 해적을 막고 당·일본과 무역을 했어.' },
    { q: '다보탑과 석가탑이 있는 통일 신라의 절은?', options: ['불국사', '해인사', '경복궁'], why: '경주 불국사에 다보탑과 석가탑이 마주 서 있어.' },
    { q: '「에밀레종」이라고도 불리는 통일 신라의 큰 종은?', options: ['성덕 대왕 신종', '보신각 종', '측우기'], why: '성덕 대왕 신종은 소리가 맑고 아름다운 통일 신라의 종이야.' },
    { q: '발해는 어느 나라를 이은 나라라고 했을까?', options: ['고구려', '백제', '고려'], why: '발해는 고구려 사람들이 세운 나라로, 고구려를 이었다고 했어.' },
    { q: '남쪽의 통일 신라와 북쪽의 발해가 함께 있던 시대는?', options: ['남북국 시대', '삼국 시대', '조선 시대'], why: '신라와 발해가 남과 북에 함께 있던 때를 남북국 시대라고 해.' }
  ];

  // 예전 지도형 거점의 내용을 그대로 씀 (대사 · 미니게임 · 보상)
  const NODES = [
      {
        id: 'bulguksa', name: '불국사', lon: 129.33, lat: 35.75, who: 'us_monk', desc: '통일 신라 · 경주\n다른 곳 찾기',
        story: ['스님: 여기는 경주 불국사란다. 불교를 믿은 신라 사람들이 정성을 다해 지은 절이지.', '스님: 근처의 석굴암은 돌을 다듬어 만든 굴 안에 부처님을 모셨단다. 그런데 큰일이 났어, 좀 도와주겠니?'],
        after: ['스님: 불국사와 석굴암은 세계 유산으로 등록되어 있단다.'],
        mission: { scene: 'Spot', p: { title: '불국사 다른 곳 찾기', npc: 'us_monk', count: 6, time: 60, exp: 60,
          intro: ['스님: 이런! 시간 괴물이 불국사 그림을 몰래 바꿔 놓았구나.', '스님: 왼쪽이 원래 모습이란다. 석가탑은 단정하고, 다보탑은 화려하지. 오른쪽에서 달라진 곳 6군데를 찾아 주렴.'],
          outro: ['달라진 곳을 모두 찾았다!', '스님: 석가탑과 다보탑은 마주 보고 서 있는데, 생김새가 서로 아주 다르단다.'] } },
        reward: { mon: ['dabotap', 17], text: '불국사의 석탑' }
      },
      {
        id: 'bell', name: '성덕 대왕 신종', lon: 128.35, lat: 35.95, who: 'us_bellmaker', desc: '통일 신라 · 큰 종\n종소리 리듬',
        story: ['종 만드는 장인: 왕의 명으로 아주 큰 종을 만들고 있어.', '장인: 오랜 정성 끝에 종이 거의 완성됐단다. 첫 소리를 함께 울려 보자!'],
        after: ['장인: 성덕 대왕 신종은 지금도 아름다운 소리로 유명하단다.'],
        mission: { scene: 'Rhythm', p: { title: '성덕 대왕 신종 울리기', npc: 'us_bellmaker', art: 'mon_bell', notes: 32, speed: 96, exp: 60,
          intro: ['장인: 드디어 커다란 종이 완성되었어! 이제 맑은 소리가 나는지 울려 볼 차례야.', '장인: 음표가 내려와서 노란 선에 닿을 때 같은 방향키를 눌러! 박자를 맞추면 종이 「데엥~」 하고 울린단다.'],
          outro: ['맑고 긴 종소리가 서라벌에 울려 퍼졌다!', '장인: 성덕 대왕 신종은 소리가 길게 이어지며 커졌다 작아졌다 하는 「맥놀이」로 유명하단다.'] } },
        reward: { mon: ['bell', 17], text: '맑은 소리의 큰 종' }
      },
      {
        id: 'cheonghaejin', name: '청해진', lon: 126.75, lat: 34.35, who: 'us_jangbogo', desc: '통일 신라 · 장보고\n바다 무역',
        story: ['장보고: 나는 장보고! 청해진을 세워 바다의 해적을 몰아냈지.', '장보고: 이제 바다가 안전해졌으니 당나라, 일본과 무역을 해 보자. 싸게 사서 비싸게 팔면 돼!'],
        after: ['장보고: 청해진은 바다를 잇는 무역의 중심지였단다.'],
        mission: { scene: 'Trade', p: { title: '장보고의 바다 무역', move: '배', money: 20, goal: 100, trips: 4, cargo: 5, exp: 60,
          intro: ['장보고: 돈 20냥으로 시작해서 100냥을 만들어 보자. 네 번 안에 해내려면 길을 잘 짜야 해! 배에는 물건을 5개까지 실을 수 있어.', '장보고: 항구마다 사고파는 값이 달라. 어디서 사서 어디서 팔지 잘 생각해 봐!'],
          goods: { ginseng: { name: '인삼', icon: 'gd_ginseng' }, silk: { name: '비단', icon: 'gd_silk' }, pottery: { name: '도자기', icon: 'gd_pottery' } },
          ports: [
            { name: '청해진', buy: { ginseng: 4 }, sell: { silk: 8, pottery: 8 } },
            { name: '당나라 항구', buy: { silk: 3, pottery: 4 }, sell: { ginseng: 10 } },
            { name: '일본 항구', buy: {}, sell: { silk: 10, pottery: 11, ginseng: 6 } }
          ],
          outro: ['장보고: 훌륭한 장사꾼이로구나! 바다를 오가는 무역으로 신라는 더 풍요로워졌단다.'] } },
        reward: { item: ['meat', 3] }
      }
    ];
  const BOSS = Object.assign({
      id: 'boss', name: '대조영', lon: 128.3, lat: 42.5, who: 'us_daejoyeong', desc: '발해 · 동모산\n남북국의 스승',
      story: ['대조영: 나는 대조영, 고구려 사람들과 함께 발해를 세웠다.', '대조영: 발해는 고구려를 이어 크게 발전했고, 훗날 「바다 동쪽의 번성한 나라(해동성국)」라고 불렸지.', '대조영: 남쪽의 신라를 돌아보고 왔다지? 그 지혜를 시험하겠다!'],
      team: [['dabotap', 17], ['bell', 18]], bg: 'bb_castle',
      lose: ['대조영: 훌륭하다! 너는 바다와 땅을 잇는 진정한 상인이자 용사로구나.'],
      win: ['대조영: 시간이 흘러 신라는 힘이 약해지고, 왕건이 고려를 세워 다시 나라를 하나로 모은단다.'],
      after: ['대조영: 발해의 기상을 잊지 말거라!'],
      quiz: QUIZ, stamp: { name: '남북국 인장', icon: 'mon_bell' }
    }, { where: '북쪽 끝 발해 동모산' });
  const R = HG.Region.make({ era: ERA, nodes: NODES, boss: BOSS, quiz: QUIZ, place: '서라벌', goal: '남북국 돌아보기' });
  const enc = HG.Region.enc;

  // ① 서라벌 (가운데)
  const h = new B(24, 16, '.');
  h.border('T');
  h.rect(11, 0, 2, 16, ':').rect(0, 12, 24, 1, ':');
  h.set(11, 15, 'T').set(12, 15, 'T');
  h.rect(3, 2, 6, 4, 'Q');
  h.rect(17, 13, 5, 2, ',');
  h.dots([[20, 2], [21, 3], [19, 7], [2, 9]], 'T');
  h.dots([[5, 9], [16, 3], [8, 14], [21, 9]], '"');
  HG.maps.us_gyeong = {
    id: 'us_gyeong', name: '통일 신라 · 서라벌', music: 'village', tiles: h.rows(),
    objects: [
      { kind: 'giwajip', x: 4, y: 2, talk: ['통일 신라의 왕궁이다.', '왕궁 옆에는 아름다운 연못과 정원이 있다.'],
        secret: { id: 'unifiedsilla_wolji', item: ['berry', 3], fact: '왕궁 옆 연못 「동궁과 월지(안압지)」에서는 신라 사람들이 쓰던 그릇과 주사위 같은 물건이 많이 나왔어.' } },
      { kind: 'bellhouse', x: 15, y: 4, talk: ['커다란 종을 걸어 둘 종각이다.'] },
      { kind: 'cheom', x: 8, y: 8, talk: ['첨성대다. 삼국 시대부터 하늘을 살피던 곳이다.'] },
      { kind: 'sign', x: 10, y: 11, talk: ['→ 토함산 불국사 (동쪽)', '← 청해진 (서남쪽 바다)   ↑ 발해 (북쪽 끝)'] },
      { kind: 'timemachine', x: 15, y: 9, smoke: true, talk: async ev => HG.Era.timeMachine(ev, HG.state.stamps.includes(ERA)) }
    ],
    npcs: [
      R.npc('bell', 14, 6, 'right'),
      { id: 'official', sprite: 'us_official', x: 6, y: 7, dir: 'down', talk: ['신라 관리: 신라는 당나라와 힘을 합쳐 백제와 고구려를 무너뜨렸어.', '그 뒤 당나라가 한반도를 차지하려 하자 당나라 군대를 몰아내고 삼국을 통일했지(676년).'] },
      { id: 'kid', sprite: 'us_kid', x: 5, y: 13, dir: 'down', wander: 2, talk: async ev => { const l = R.remaining(ev.state); await ev.say(l.length ? `아이: ${l.join(', ')}에 가 봤어? 다들 도움이 필요하대!` : '아이: 북쪽 끝 발해에 대조영 왕이 계신대!'); } }
    ],
    tileSecrets: { '21,3': { id: 'unifiedsilla_pine', item: ['meat', 2], fact: '통일 신라는 넓어진 땅을 9주로 나누고, 5소경이라는 작은 서울을 두어 다스렸어.' } },
    warps: [
      { x: 11, y: 0, to: 'us_balhae', tx: 10, ty: 12, dir: 'up' }, { x: 12, y: 0, to: 'us_balhae', tx: 11, ty: 12, dir: 'up' },
      { x: 23, y: 12, to: 'us_bulguk', tx: 1, ty: 10, dir: 'right' },
      { x: 0, y: 12, to: 'us_cheong', tx: 20, ty: 11, dir: 'left' }
    ],
    encounterRate: 0.06, encounter: enc([['dabotap', 50], ['bell', 50]], 15, 18),
    onEnter: HG.Region.arrive(ERA, ['할아버지(무전기): 여기는 통일 신라의 서울, 서라벌이란다! 신라가 삼국을 통일한 뒤의 시대야.',
      '할아버지: 그리고 북쪽에서는 고구려 사람이었던 대조영이 발해를 세웠지. 남쪽의 신라와 북쪽의 발해가 함께 있어서 「남북국 시대」라고 해.',
      '할아버지: 동쪽 불국사, 서남쪽 청해진, 그리고 이 서라벌의 종각을 돌아본 뒤 북쪽 끝 발해의 대조영을 찾아가 보렴.'])
  };

  // ② 불국사 (동쪽 토함산)
  const bg = new B(22, 14, '.');
  bg.border('T');
  bg.rect(16, 1, 5, 4, '#');
  bg.rect(6, 3, 10, 6, 'Q');
  bg.rect(0, 10, 16, 1, ':').rect(10, 9, 1, 1, ':');
  bg.rect(16, 9, 4, 3, ',');
  bg.dots([[3, 3], [4, 7], [18, 12], [2, 12]], '"');
  HG.maps.us_bulguk = {
    id: 'us_bulguk', name: '토함산 불국사', music: 'field', tiles: bg.rows(),
    objects: [
      { kind: 'giwajip', x: 9, y: 3, talk: ['불국사의 대웅전이다. 부처님을 모신 큰 법당이다.'] },
      { kind: 'pagoda', x: 7, y: 5, talk: ['화려하고 복잡하게 쌓은 탑, 다보탑이다.'],
        secret: { id: 'unifiedsilla_dabo', mon: ['dabotap', 16], fact: '다보탑과 석가탑은 불국사 대웅전 앞에 마주 서 있어. 다보탑은 화려하고, 석가탑은 단정하지.' } },
      { kind: 'pagoda', x: 14, y: 5, talk: ['단정하고 깔끔한 탑, 석가탑이다.', '탑 안에서 세계에서 가장 오래된 목판 인쇄물인 「무구정광대다라니경」이 나왔다고 한다.'] },
      { kind: 'sign', x: 15, y: 6, talk: ['↗ 토함산 석굴암', '돌을 다듬어 쌓아 만든 굴 안에 부처님을 모신 곳.'] },
      { kind: 'sign', x: 2, y: 9, talk: ['← 서라벌'] }
    ],
    npcs: [R.npc('bulguksa', 11, 8, 'down')],
    tileSecrets: { '17,5': { id: 'unifiedsilla_seokguram', item: ['meat', 2], fact: '석굴암은 돌을 다듬어 쌓은 인공 굴이야. 불국사와 함께 1995년 세계 유산이 되었어.' } },
    tileTalk: { '#': ['토함산의 바위 절벽이다. 이 너머에 석굴암이 있다.'] },
    warps: [{ x: 0, y: 10, to: 'us_gyeong', tx: 22, ty: 12, dir: 'left' }],
    encounterRate: 0.07, encounter: enc([['dabotap', 70], ['bell', 30]], 15, 18)
  };

  // ③ 청해진 (서남쪽 바다)
  const ch = new B(22, 14, '.');
  ch.border('T');
  ch.rect(1, 1, 5, 12, '~').rect(6, 1, 1, 12, 's');
  ch.rect(6, 7, 4, 1, ':').rect(6, 11, 16, 1, ':').rect(12, 8, 1, 3, ':');
  ch.rect(11, 2, 6, 4, 'Q');
  ch.dots([[18, 3], [19, 8], [8, 3]], '"');
  HG.maps.us_cheong = {
    id: 'us_cheong', name: '청해진 (완도)', music: 'field', tiles: ch.rows(),
    waterTalk: ['넓은 남해 바다다. 여기서 당나라와 일본으로 배가 오갔다.'],
    objects: [
      { kind: 'giwajip', x: 12, y: 2, talk: ['장보고가 세운 청해진의 본영이다.'] },
      { kind: 'boat', x: 4, y: 7, talk: ['무역선이다. 비단과 도자기, 인삼을 싣고 바다를 건넌다.'] },
      { kind: 'boat', x: 4, y: 3, talk: ['해적을 막는 청해진의 배다.'] },
      { kind: 'stall', x: 15, y: 8, talk: ['당나라 비단과 도자기, 신라 인삼을 파는 가게다.'],
        secret: { id: 'unifiedsilla_market', item: ['meat', 2], fact: '장보고는 청해진을 중심으로 신라·당·일본을 잇는 바닷길 무역을 이끌어 「해상왕」이라 불렸어.' } },
      { kind: 'sign', x: 19, y: 10, talk: ['→ 서라벌 (동북쪽)'] }
    ],
    npcs: [R.npc('cheonghaejin', 9, 6, 'down'),
      { id: 'trader', sprite: 'us_trader', x: 17, y: 10, dir: 'left', talk: ['상인: 당나라에는 신라 사람들이 모여 사는 마을, 「신라방」도 있었어.', '바다가 안전해지니 장사가 정말 잘돼!'] }],
    warps: [{ x: 21, y: 11, to: 'us_gyeong', tx: 1, ty: 12, dir: 'right' }],
    encounterRate: 0.06, encounter: enc([['bell', 50], ['dabotap', 50]], 15, 18)
  };

  // ④ 발해 동모산 (북쪽 끝)
  const bh = new B(22, 14, '.');
  bh.border('T');
  bh.rect(1, 1, 20, 3, 'n');
  bh.rect(7, 2, 8, 4, 'Q');
  bh.rect(10, 6, 2, 8, ':');
  bh.rect(14, 8, 5, 3, ',');
  bh.dots([[3, 6], [4, 11], [19, 5]], '"');
  HG.maps.us_balhae = {
    id: 'us_balhae', name: '발해 · 동모산', music: 'field', tiles: bh.rows(),
    tileTalk: { 'n': ['하얀 눈이 쌓여 있다. 발해는 추운 북쪽에 있었다.'] },
    objects: [
      { kind: 'giwajip', x: 8, y: 2, talk: ['발해의 궁궐이다. 고구려 궁궐을 닮았다.'] },
      { kind: 'chogajip', x: 3, y: 8, talk: ['발해 사람들의 집이다. 방바닥이 따뜻하다.'],
        secret: { id: 'unifiedsilla_ondol', item: ['berry', 3], fact: '발해 사람들은 고구려처럼 온돌로 방을 데웠어. 이것도 발해가 고구려를 이었다는 증거 가운데 하나야.' } },
      { kind: 'sign', x: 12, y: 12, talk: ['↓ 서라벌 (남쪽)'] }
    ],
    npcs: [R.bossNpc(12, 4, 'down'),
      { id: 'balhae', sprite: 'us_balhae', x: 6, y: 10, dir: 'down', talk: ['발해 사람: 발해는 고구려 사람들이 중심이 되어 세운 나라야.', '왕은 일본에 보낸 편지에 스스로 「고려(고구려)의 왕」이라고 썼대.'] }],
    warps: [{ x: 10, y: 13, to: 'us_gyeong', tx: 11, ty: 1, dir: 'down' }, { x: 11, y: 13, to: 'us_gyeong', tx: 12, ty: 1, dir: 'down' }],
    encounterRate: 0.07, encounter: enc([['dabotap', 50], ['bell', 50]], 16, 19)
  };

  HG.registerStage(Object.assign({
    id: ERA, type: 'village', quiz: QUIZ, objective: R.objective, taskFlags: R.T, battleBg: 'bb_village',
    devMinis: NODES.filter(n => n.mission).map(n => ({ name: n.name, scene: n.mission.scene, p: n.mission.p }))
  }, { name: '남북국', baseLevel: 17, teacher: '대조영', start: { map: 'us_gyeong', x: 13, y: 13, dir: 'up' }, respawn: { map: 'us_gyeong', x: 13, y: 13, dir: 'up' }, maps: ['us_gyeong', 'us_bulguk', 'us_cheong', 'us_balhae'] }));
})();
