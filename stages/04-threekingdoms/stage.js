// ─────────────────────────────────────────────
// 스테이지 4: 삼국·가야 — 걸어 다니는 「작은 한반도」
// 가운데 한강 나루에서 ↑ 고구려 · ← 백제(서남쪽) · → 신라(동남쪽) · ↓ 가야
// 나라 일: 살수 물길(고구려) · 바닷길(백제) · 진흥왕 문답(신라) · 대장간(가야) → 국내성의 광개토대왕
// ─────────────────────────────────────────────
(function () {
  const B = HG.MapBuilder;
  const ERA = 'threekingdoms';

  HG.Art.register(function (scene) {
    const Px = HG.Pixel;
    HG.Art.person(scene, 'tk_eulji', { hair: 'k', shirt: 'G', pants: 'G', armor: 'G', robe: 'R', hat: 'helmet', beard: true });
    HG.Art.person(scene, 'tk_geunchogo', { hair: 'k', shirt: 'u', pants: 'U', robe: 'u', belt: 'y', hat: 'crown', beard: true, collar: 'y' });
    HG.Art.person(scene, 'tk_smith', { hair: 'k', shirt: 'G', pants: 'B', band: 'e', collar: 'w', goreum: 'e', hat: 'sangtu' });
    HG.Art.person(scene, 'tk_jinheung', { hair: 'k', shirt: 'p', pants: 'P', robe: 'p', belt: 'y', hat: 'crown', beard: true, collar: 'w' });
    HG.Art.person(scene, 'tk_gwanggaeto', { hair: 'k', shirt: 'r', pants: 'R', armor: 'r', robe: 'R', belt: 'y', hat: 'helmet', beard: true });
    HG.Art.person(scene, 'tk_ferry', { hair: 'k', shirt: 'w', pants: 'n', beard: true, collar: 'l', goreum: 'n', hat: 'sangtu' });
    HG.Art.person(scene, 'tk_hwarang', { hair: 'k', shirt: 'P', pants: 'w', band: 'r', collar: 'w', goreum: 'r', hat: 'sangtu' });
    HG.Art.person(scene, 'tk_craft', { hair: 'k', shirt: 'c', pants: 'U', collar: 'w', goreum: 'u', long: true, skirt: 'U', hat: 'bun' });
    HG.Art.person(scene, 'tk_merchant', { hair: 'k', shirt: 'n', pants: 'b', band: 'w', pack: true, collar: 'w', goreum: 'b' });
    HG.Art.person(scene, 'tk_kid', { hair: 'k', shirt: 'y', pants: 'U', collar: 'w', goreum: 'r' });
    HG.Art.person(scene, 'tk_guard', { hair: 'k', shirt: 'R', pants: 'G', armor: 'R', hat: 'helmet' });
    // 고분 (2×2)
    Px.draw(scene, 'o_tomb', 32, 32, (p, ctx) => { Px.ellipse(p, 16, 20, 15, 11, 'e'); Px.ellipse(p, 13, 15, 8, 5, 'f'); Px.rect(p, 2, 28, 28, 3, 'g'); for (let x = 3; x < 30; x += 4) p(x, 29, 'l'); Px.outline(ctx, 32, 32); });
    // 첨성대 (1×2)
    Px.draw(scene, 'o_cheom', 16, 32, (p, ctx) => {
      for (let y = 4; y < 30; y++) { const w = Math.round(3 + (y - 4) * 0.17); Px.rect(p, 8 - w, y, w * 2, 1, (y % 3 === 0) ? 'g' : 'l'); }
      Px.rect(p, 4, 1, 8, 3, 'g'); Px.rect(p, 5, 2, 6, 1, 'l'); Px.rect(p, 6, 15, 4, 4, 'B'); Px.rect(p, 2, 30, 12, 2, 'G'); Px.outline(ctx, 16, 32);
    });
    // 돛단배 (2×1)
    Px.draw(scene, 'o_boat', 32, 16, (p, ctx) => { Px.poly(p, [[1, 10], [31, 10], [27, 15], [5, 15]], 'b'); Px.rect(p, 3, 10, 26, 1, 'n'); Px.rect(p, 15, 1, 2, 9, 'B'); Px.poly(p, [[17, 1], [27, 8], [17, 8]], 'w'); Px.outline(ctx, 32, 16); });
    // 비석 (1×1)
    Px.draw(scene, 'o_stele', 16, 16, (p, ctx) => { Px.rect(p, 4, 1, 8, 13, 'g'); Px.rect(p, 5, 2, 6, 11, 'l'); for (let y = 3; y < 12; y += 2) Px.rect(p, 6, y, 4, 1, 'G'); Px.rect(p, 2, 14, 12, 2, 'G'); Px.outline(ctx, 16, 16); });
    // 대장간 화로 (1×1)
    Px.draw(scene, 'o_forge0', 16, 16, (p, ctx) => { Px.rect(p, 2, 6, 12, 9, 'G'); Px.rect(p, 4, 8, 8, 4, 'o'); Px.rect(p, 5, 9, 6, 2, 'y'); Px.rect(p, 6, 2, 4, 4, 'g'); Px.outline(ctx, 16, 16); });
    Px.draw(scene, 'o_forge1', 16, 16, (p, ctx) => { Px.rect(p, 2, 6, 12, 9, 'G'); Px.rect(p, 4, 8, 8, 4, 'r'); Px.rect(p, 5, 8, 6, 2, 'o'); Px.rect(p, 6, 2, 4, 4, 'g'); p(8, 1, 'l'); Px.outline(ctx, 16, 16); });
    Object.assign(HG.OBJECTS, {
      tomb: { tex: 'o_tomb', w: 2, h: 2 }, cheom: { tex: 'o_cheom', w: 1, h: 2 }, boat: { tex: 'o_boat', w: 2, h: 1 },
      stele: { tex: 'o_stele', w: 1, h: 1 }, forge: { tex: 'o_forge0', anim: ['o_forge0', 'o_forge1'], w: 1, h: 1 }
    });
  });

  // 풀숲에서 나오는 유물 (나라마다 조금씩 다름)
  const enc = table => () => { let r = Math.random() * 100, sp = table[0][0]; for (const [id, w] of table) { if ((r -= w) < 0) { sp = id; break; } } return [sp, HG.rand(12, 15)]; };

  // ─────────────────────────────────────────────
  // ① 한강 나루 (가운데)
  // ─────────────────────────────────────────────
  const h = new B(24, 16, '.');
  h.border('T');
  h.rect(1, 6, 22, 1, 's').rect(1, 7, 22, 2, '~').rect(1, 9, 22, 1, 's');
  h.rect(11, 0, 2, 16, ':').rect(0, 12, 24, 1, ':');
  h.rect(11, 7, 2, 2, 'Q');                      // 나루의 디딤돌
  h.rect(3, 2, 4, 3, ',');
  h.dots([[17, 2], [19, 4], [20, 2], [8, 3], [15, 4]], 'o');
  h.rect(15, 13, 7, 2, 'R');                     // 기름진 논
  h.dots([[4, 11], [7, 14], [19, 10], [2, 14], [8, 10]], '"');
  HG.maps.tk_han = {
    id: 'tk_han', name: '한강 나루', music: 'village', tiles: h.rows(),
    waterTalk: ['넓은 한강이 흐른다.', '한강 둘레는 땅이 기름지고, 강을 따라 서해로 나가 중국과 오가기 좋았다.'],
    objects: [
      { kind: 'sign', x: 10, y: 11, talk: ['↑ 고구려 (북쪽)', '← 백제 (서남쪽)   → 신라 (동남쪽)', '↓ 가야 (남쪽)'] },
      { kind: 'stele', x: 17, y: 3, talk: ['오래된 비석이 서 있다. 「진흥왕 순수비」라고 새겨져 있다.', '신라 진흥왕이 한강 유역을 차지한 뒤, 넓힌 땅을 둘러보고 세운 비석이다.'],
        secret: { id: 'threekingdoms_stele', item: ['berry', 3], fact: '삼국은 한강 유역을 차례로 차지했어. 처음엔 백제, 그다음 고구려(장수왕), 마지막엔 신라(진흥왕)가 차지했지.' } },
      { kind: 'chogajip', x: 3, y: 9, talk: ['뱃사공의 초가집이다. 노와 그물이 걸려 있다.'] },
      { kind: 'timemachine', x: 14, y: 10, smoke: true, talk: async ev => HG.Era.timeMachine(ev, ev.flag(ERA + 'Clear')) }
    ],
    npcs: [
      { id: 'ferry', sprite: 'tk_ferry', x: 10, y: 6, dir: 'down', talk: async ev => ferry(ev) },
      { id: 'kid', sprite: 'tk_kid', x: 6, y: 13, dir: 'down', wander: 2, talk: ['아이: 북쪽 강 건너는 고구려, 서남쪽은 백제, 동남쪽은 신라래!', '남쪽 끝 바닷가에는 철이 많이 나는 가야가 있대.'] }
    ],
    warps: [
      { x: 11, y: 0, to: 'tk_go', tx: 11, ty: 14, dir: 'up' }, { x: 12, y: 0, to: 'tk_go', tx: 12, ty: 14, dir: 'up' },
      { x: 0, y: 12, to: 'tk_bj', tx: 22, ty: 12, dir: 'left' },
      { x: 23, y: 12, to: 'tk_sl', tx: 1, ty: 12, dir: 'right' },
      { x: 11, y: 15, to: 'tk_gy', tx: 11, ty: 1, dir: 'down' }, { x: 12, y: 15, to: 'tk_gy', tx: 12, ty: 1, dir: 'down' }
    ],
    encounterRate: 0.06, encounter: enc([['muralhunt', 25], ['incense', 25], ['goldcrown', 25], ['ironarmor', 25]]),
    onEnter: async ev => {
      if (!ev.flag('tk_arrived')) {
        await ev.say('할아버지(무전기): 여기는 삼국 시대의 한강 나루란다! 고구려, 백제, 신라, 그리고 가야가 함께 있던 때야.');
        await HG.Era.showEvolutions(ev);
        await ev.say('할아버지: 이번에는 지도 대신 직접 걸어서 나라들을 돌아보자. 북쪽 강을 건너면 고구려, 서쪽으로 가면 백제, 동쪽으로 가면 신라, 남쪽으로 가면 가야란다.',
          '할아버지: 나라마다 너의 도움을 기다리는 사람이 있어. 네 나라를 모두 도우면 고구려 국내성의 광개토대왕이 만나 줄 거야.');
        await HG.Secret.tip(ev);
        ev.setFlag('tk_arrived');
      } else await HG.Era.showEvolutions(ev);
    }
  };

  // ─────────────────────────────────────────────
  // ② 고구려 (국내성 · 살수)
  // ─────────────────────────────────────────────
  const g = new B(24, 16, '.');
  g.border('T');
  g.rect(1, 1, 2, 3, '#').rect(21, 1, 2, 4, '#');
  g.rect(3, 1, 2, 12, '~').rect(5, 1, 1, 12, 's');            // 살수
  g.rect(7, 1, 10, 1, '=').rect(7, 1, 1, 5, '=').rect(16, 1, 1, 5, '=').rect(7, 5, 10, 1, '=');
  g.rect(8, 2, 8, 3, 'Q').rect(11, 5, 2, 1, 'Q');               // 궁궐 마당과 성문
  g.rect(11, 6, 2, 10, ':').rect(5, 13, 16, 1, ':');
  g.rect(7, 8, 3, 3, ',').rect(14, 9, 3, 2, ',');
  g.dots([[18, 7], [21, 9], [6, 14], [19, 14]], '"');
  HG.maps.tk_go = {
    id: 'tk_go', name: '고구려 · 국내성', music: 'field', tiles: g.rows(),
    waterTalk: ['살수(지금의 청천강)다. 물살이 세다.'],
    objects: [
      { kind: 'giwajip', x: 9, y: 2, talk: ['고구려 왕이 사는 궁궐이다. 기와지붕이 웅장하다.'] },
      { kind: 'stele', x: 18, y: 4, talk: ['커다란 비석이다. 「광개토대왕릉비」라고 쓰여 있다.', '광개토대왕의 아들 장수왕이 아버지의 업적을 새겨 세웠다고 한다.'],
        secret: { id: 'threekingdoms_gwangbi', item: ['meat', 2], fact: '광개토대왕릉비에는 광개토대왕이 영토를 넓힌 일이 새겨져 있어. 지금도 중국 지린성 지안에 남아 있지.' } },
      { kind: 'tomb', x: 19, y: 8, talk: ['고구려의 돌무덤이다. 안쪽 벽에 그림이 그려져 있다고 한다.'],
        secret: { id: 'threekingdoms_muyong', mon: ['muralhunt', 13], fact: '고구려 무용총의 「수렵도」에는 말을 타고 활을 쏘며 사냥하는 모습이 그려져 있어. 고구려 사람들의 씩씩한 기상을 보여 주지.' } },
      { kind: 'sign', x: 10, y: 14, talk: ['↓ 한강 나루', '↑ 국내성 궁궐 · ← 살수'] }
    ],
    npcs: [
      { id: 'eulji', sprite: 'tk_eulji', x: 6, y: 9, dir: 'left', mark: ev => !ev.flag('tk_salsu'), talk: async ev => mission(ev, M.salsu) },
      { id: 'king', sprite: 'tk_gwanggaeto', x: 13, y: 3, dir: 'down', mark: ev => tasks(ev.state) >= 4 && !ev.flag(ERA + 'Clear'), talk: async ev => king(ev) },
      { id: 'guard', sprite: 'tk_guard', x: 13, y: 6, dir: 'down', talk: ['고구려 병사: 이곳은 국내성이다. 고구려는 산성을 쌓고 말을 잘 타는 용맹한 나라지!', '광개토대왕께서는 사방으로 땅을 크게 넓히셨다.'] }
    ],
    warps: [{ x: 11, y: 15, to: 'tk_han', tx: 11, ty: 1, dir: 'down' }, { x: 12, y: 15, to: 'tk_han', tx: 12, ty: 1, dir: 'down' }],
    encounterRate: 0.07, encounter: enc([['muralhunt', 60], ['ironarmor', 20], ['incense', 20]])
  };

  // ─────────────────────────────────────────────
  // ③ 백제 (한성 · 서해 바닷길)
  // ─────────────────────────────────────────────
  const bj = new B(24, 16, '.');
  bj.border('T');
  bj.rect(1, 1, 4, 14, '~').rect(5, 1, 1, 14, 's');
  bj.rect(5, 7, 3, 1, ':');                       // 나루터
  bj.rect(10, 1, 7, 4, 'Q');
  bj.rect(6, 12, 18, 1, ':').rect(13, 5, 1, 7, ':').rect(7, 7, 6, 1, ':');
  bj.rect(16, 6, 5, 3, ',');
  bj.dots([[8, 3], [20, 3], [9, 14], [18, 14], [21, 10]], '"');
  // 꽃밭 (무령왕릉은 백제 땅 꽃밭을 살펴보다 발견됨)
  bj.rect(7, 13, 6, 2, 'h').rect(15, 13, 7, 2, 'h').rect(14, 9, 2, 2, 'h').rect(19, 9, 2, 2, 'h').rect(6, 2, 3, 3, 'h').rect(9, 8, 3, 1, 'h');
  HG.maps.tk_bj = {
    id: 'tk_bj', name: '백제 · 한성과 서해', music: 'field', tiles: bj.rows(),
    waterTalk: ['서해 바다다. 이 바닷길로 중국과 왜(일본)를 오갔다.'],
    tileTalk: { 'h': ['들꽃이 가득 핀 꽃밭이다. 꽃 사이로 무언가 보일 것 같기도 하다…'] },
    objects: [
      { kind: 'giwajip', x: 11, y: 1, talk: ['백제 왕이 사는 궁궐이다.'] },
      { kind: 'pagoda', x: 18, y: 2, talk: ['날씬하고 아름다운 백제의 석탑이다.'],
        secret: { id: 'threekingdoms_pagoda', item: ['meat', 2], fact: '백제는 목탑을 본뜬 돌탑을 쌓았어. 부여 정림사지 5층 석탑이 대표적이야.' } },
      { kind: 'boat', x: 3, y: 7, talk: ['바다를 건너는 백제의 배다. 학문과 기술을 실어 왜에 전해 주었다.'] },
      { kind: 'chogajip', x: 8, y: 9, talk: ['백제 사람들이 사는 초가집이다.'] },
      { kind: 'sign', x: 21, y: 11, talk: ['→ 한강 나루 (동북쪽)', '← 서해 바다 나루터'] }
    ],
    npcs: [
      { id: 'geunchogo', sprite: 'tk_geunchogo', x: 13, y: 4, dir: 'down', mark: ev => !ev.flag('tk_hanseong'), talk: async ev => mission(ev, M.hanseong) },
      { id: 'craft', sprite: 'tk_craft', x: 17, y: 10, dir: 'left', talk: ['백제 장인: 나는 향로를 만드는 장인이오.', '백제 금동 대향로를 아시오? 뚜껑에 산과 신선, 동물이 섬세하게 새겨져 있지. 백제 사람들의 솜씨는 정말 뛰어나다오!'] },
      { id: 'sailor', sprite: 'tk_ferry', x: 6, y: 6, dir: 'down', talk: ['뱃사람: 백제는 바다를 잘 다루는 나라야.', '중국의 문화를 받아들이고, 왜에는 학문과 기술을 전해 주었지.'] }
    ],
    warps: [{ x: 23, y: 12, to: 'tk_han', tx: 1, ty: 12, dir: 'right' }],
    encounterRate: 0.07, encounter: enc([['incense', 60], ['goldcrown', 20], ['muralhunt', 20]])
  };

  // ─────────────────────────────────────────────
  // ④ 신라 (서라벌)
  // ─────────────────────────────────────────────
  const sl = new B(24, 16, '.');
  sl.border('T');
  sl.rect(0, 12, 19, 1, ':').rect(10, 1, 1, 12, ':').rect(10, 6, 9, 1, ':');
  sl.rect(3, 8, 6, 3, 'Q');
  sl.rect(15, 9, 6, 3, ',');
  sl.dots([[4, 3], [8, 2], [13, 9], [21, 14], [3, 14]], '"');
  HG.maps.tk_sl = {
    id: 'tk_sl', name: '신라 · 서라벌', music: 'field', tiles: sl.rows(),
    objects: [
      { kind: 'cheom', x: 6, y: 2, talk: ['돌을 둥글게 쌓아 올린 탑이 있다. 「첨성대」다.', '하늘의 별과 해, 달을 살피던 곳이라고 한다.'],
        secret: { id: 'threekingdoms_cheom', item: ['berry', 3], fact: '첨성대는 신라 선덕 여왕 때 세운 천문대야. 동양에서 지금까지 남아 있는 가장 오래된 천문대로 알려져 있어.' } },
      { kind: 'tomb', x: 14, y: 2, talk: ['신라의 커다란 무덤이다.'],
        secret: { id: 'threekingdoms_geumgwan', item: ['meat', 2], fact: '1921년 경주에서 집을 짓던 중 땅속에서 금관이 나왔어. 그래서 그 무덤 이름이 「금관총」이 되었단다.' } },
      { kind: 'tomb', x: 18, y: 3, talk: ['커다란 무덤이다. 안에서 금관과 하늘을 나는 말 그림이 나왔다고 한다.'],
        secret: { id: 'threekingdoms_cheonma', mon: ['goldcrown', 13], fact: '경주 천마총에서는 금관과 하늘을 나는 말이 그려진 「천마도」가 나왔어.' } },
      { kind: 'giwajip', x: 4, y: 8, talk: ['신라 왕이 사는 궁궐이다.'] },
      { kind: 'sign', x: 2, y: 11, talk: ['← 한강 나루 (서북쪽)', '신라는 한반도 동남쪽에 있었다.'] }
    ],
    npcs: [
      { id: 'jinheung', sprite: 'tk_jinheung', x: 7, y: 11, dir: 'down', mark: ev => !ev.flag('tk_seorabeol'), talk: async ev => mission(ev, M.seorabeol) },
      { id: 'hwarang', sprite: 'tk_hwarang', x: 12, y: 7, dir: 'left', talk: ['화랑: 나는 신라의 화랑이오!', '우리는 산과 들을 다니며 무예와 학문을 익히고 몸과 마음을 닦는다오. 신라가 삼국을 통일하는 데 화랑이 큰 힘이 되었지.'] },
      { id: 'kid', sprite: 'tk_kid', x: 16, y: 13, dir: 'down', wander: 2, talk: ['아이: 서라벌에는 커다란 무덤이 많아!', '그 안에서 반짝이는 금관이 나왔대.'] }
    ],
    warps: [{ x: 0, y: 12, to: 'tk_han', tx: 22, ty: 12, dir: 'left' }],
    encounterRate: 0.07, encounter: enc([['goldcrown', 60], ['incense', 20], ['ironarmor', 20]])
  };

  // ─────────────────────────────────────────────
  // ⑤ 가야 (금관가야 · 바닷가)
  // ─────────────────────────────────────────────
  const gy = new B(24, 16, '.');
  gy.border('T');
  gy.rect(1, 12, 22, 1, 's').rect(1, 13, 22, 2, '~');
  gy.rect(11, 0, 2, 12, ':').rect(3, 10, 18, 1, ':').rect(6, 11, 1, 1, ':');
  gy.rect(8, 5, 6, 3, 'Q');
  gy.dots([[3, 7], [5, 3], [15, 4], [21, 8], [7, 8]], 'o');
  gy.rect(15, 7, 4, 2, ',');
  HG.maps.tk_gy = {
    id: 'tk_gy', name: '가야 · 바닷가 쇠부리터', music: 'field', tiles: gy.rows(),
    waterTalk: ['남쪽 바다다. 가야는 이 바다로 철을 왜와 낙랑에 실어 날랐다.'],
    objects: [
      { kind: 'forge', x: 10, y: 6, talk: ['쇠를 녹이는 화로가 이글이글 타오른다.'] },
      { kind: 'tomb', x: 17, y: 2, talk: ['가야의 무덤이다. 안에서 철로 만든 갑옷과 무기, 덩이쇠가 나왔다고 한다.'],
        secret: { id: 'threekingdoms_gayatomb', mon: ['ironarmor', 13], fact: '가야의 무덤에서는 철갑옷과 투구, 그리고 돈처럼 쓰인 「덩이쇠」가 많이 나왔어.' } },
      { kind: 'chogajip', x: 3, y: 4, talk: ['가야 사람들의 집이다.'] },
      { kind: 'boat', x: 5, y: 13, talk: ['덩이쇠를 실은 배다.'] },
      { kind: 'sign', x: 13, y: 2, talk: ['↑ 한강 나루 (북쪽)', '가야는 여러 작은 나라가 모인 연맹 왕국이었다.'] }
    ],
    npcs: [
      { id: 'smith', sprite: 'tk_smith', x: 12, y: 6, dir: 'left', mark: ev => !ev.flag('tk_gaya'), talk: async ev => mission(ev, M.gaya) },
      { id: 'merchant', sprite: 'tk_merchant', x: 7, y: 11, dir: 'down', talk: ['가야 상인: 가야의 철은 아주 좋아서, 덩이쇠를 바다 건너 왜와 낙랑까지 팔았지!', '덩이쇠는 돈처럼 쓰이기도 했어.'] }
    ],
    warps: [{ x: 11, y: 0, to: 'tk_han', tx: 11, ty: 14, dir: 'up' }, { x: 12, y: 0, to: 'tk_han', tx: 12, ty: 14, dir: 'up' }],
    encounterRate: 0.07, encounter: enc([['ironarmor', 60], ['goldcrown', 20], ['incense', 20]])
  };

  // ─────────────────────────────────────────────
  // 나라 일 (예전 지도형 거점의 내용을 그대로 옮김)
  // ─────────────────────────────────────────────
  const M = {
    salsu: {
      flag: 'tk_salsu', who: '을지문덕', place: '고구려',
      story: ['을지문덕: 수나라가 엄청난 대군을 이끌고 쳐들어왔다!', '을지문덕: 나는 적을 살수까지 끌어들인 뒤 크게 물리칠 작전을 세웠다. 시간 괴물들도 섞여 있으니 함께 막아 다오!'],
      after: ['을지문덕: 살수 대첩의 승리로 고구려는 나라를 지켜 냈다.'],
      scene: 'Pipes', p: { title: '살수 대첩 물길 작전', npc: 'tk_eulji', target: 'tmon0', cols: 7, rows: 5, time: 80, exp: 60,
        intro: ['을지문덕: 강 위쪽에 둑을 쌓아 물을 모아 두었다. 시간 괴물들이 강을 건널 때 물을 흘려보내자!', '을지문덕: 물길 조각을 돌려서 둑의 물이 오른쪽 끝의 괴물들까지 흘러가게 이어 다오.'],
        outro: ['물길이 열리며 시간 괴물들이 휩쓸려 갔다!', '을지문덕: 고구려 사람들은 이렇게 지혜롭게 나라를 지켰단다.'] },
      reward: { mon: ['muralhunt', 14], text: '고구려 무덤 벽화 속 사냥꾼' }
    },
    hanseong: {
      flag: 'tk_hanseong', who: '근초고왕', place: '백제',
      story: ['근초고왕: 백제는 한강 근처 한성에 도읍을 정하고 크게 발전했다.', '근초고왕: 우리는 바닷길로 중국과 왜(일본)를 오가며 문화를 주고받았지. 배를 몰아 왜까지 다녀와 주겠느냐?'],
      after: ['근초고왕: 백제는 바닷길로 학문과 기술을 왜에 전해 주기도 했단다.'],
      scene: 'Landing', p: { from: '백제', to: '왜', done: '왜에 도착!', tide: '거의 다 왔다!', exp: 60, intro: ['근초고왕: 백제의 학문과 기술을 실은 배다. 암초와 소용돌이를 피해 무사히 다녀오너라!'], outro: ['백제의 문화를 무사히 전했다!'] },
      reward: { mon: ['incense', 14], text: '백제 사람들의 뛰어난 솜씨' }
    },
    gaya: {
      flag: 'tk_gaya', who: '대장장이', place: '가야',
      story: ['대장장이: 가야는 철이 많이 나는 나라야!', '대장장이: 쇳덩이를 달궈 두드려서 갑옷과 무기를 만들고, 덩이쇠를 다른 나라에 팔기도 하지. 망치질을 도와줄래?'],
      after: ['대장장이: 가야의 철은 이웃 나라들이 탐낼 만큼 좋았단다.'],
      scene: 'Timing', p: { title: '대장간 망치질', npc: 'tk_smith', icon: 'gd_iron', act: '쾅! 두드리기', rounds: 5, speed: 1.3, zone: 32, exp: 60, bg: 'cave', intro: ['대장장이: 쇠가 빨갛게 달았을 때 정확히 두드려야 해. 바늘이 초록 칸에 오면 스페이스!'], outro: ['튼튼한 철갑옷이 완성되었다!'] },
      reward: { mon: ['ironarmor', 14], text: '가야의 철로 만든 갑옷' }
    },
    seorabeol: {
      flag: 'tk_seorabeol', who: '진흥왕', place: '신라',
      story: ['진흥왕: 나는 신라의 진흥왕이다. 신라는 한강 유역을 차지하며 크게 성장했지.', '진흥왕: 신라가 어떻게 강해졌는지, 내 질문에 답해 보겠느냐?'],
      after: ['진흥왕: 훗날 신라는 삼국을 통일하게 된단다.'],
      talk: ev => HG.talkQuiz(ev, '진흥왕', [
        { q: '삼국이 한강 유역을 서로 차지하려 한 까닭은?', options: ['땅이 기름지고 바닷길로 중국과 오가기 좋아서', '금이 많이 나서', '높은 산이 많아서'], why: '한강 유역은 농사짓기 좋고, 서해를 건너 중국과 교류하기에 좋았단다.', good: '그렇다! 그래서 한강을 차지한 나라가 강해졌지.' },
        { q: '신라에서 몸과 마음을 닦으며 나라에 힘이 된 청소년 무리는?', options: ['화랑', '의병', '수군'], why: '신라의 화랑은 무예와 학문을 익히며 나라를 위해 힘썼단다.', good: '그렇지, 화랑이다!' },
        { q: '신라의 왕이 쓰던 금빛 관은?', options: ['금관', '갓', '면류관'], why: '신라의 금관에는 나뭇가지와 사슴뿔 모양 장식이 달려 있지.' }
      ]),
      reward: { mon: ['goldcrown', 14], text: '신라 왕의 금관' }
    }
  };
  const T = ['tk_salsu', 'tk_hanseong', 'tk_seorabeol', 'tk_gaya'];
  const tasks = s => T.filter(f => s.flags[f]).length;

  async function mission(ev, m) {
    if (ev.flag(m.flag)) { await ev.say(...m.after); return; }
    await ev.say(...m.story);
    const c = await ev.choose('도와줄까?', ['도와줄게요!', '다음에요'], 1);
    if (c !== 0) return;
    const r = m.talk ? await m.talk(ev) : await ev.mini(m.scene, m.p);
    if (r !== 'win') { await ev.say('아쉽다! 언제든 다시 도전할 수 있어.'); return; }
    ev.setFlag(m.flag);
    const rw = m.reward;
    if (rw.mon) { const nm = HG.ARTIFACTS[rw.mon[0]].name; ev.addMon(rw.mon[0], rw.mon[1]); HG.Sound.sfx('levelup'); await ev.say(`${nm}${HG.josa(nm, '이', '가')} 동료가 되었다! (${rw.text})`); }
    HG.Sound.sfx('stamp');
    const n = tasks(ev.state);
    await ev.say(`${m.place}의 일을 도왔다! (${n}/4)` + (n >= 4 ? '\n이제 고구려 국내성의 광개토대왕을 만나러 가자!' : ''));
  }

  const QUIZ = [
    { q: '살수에서 수나라 대군을 크게 물리친 고구려 장수는?', options: ['을지문덕', '강감찬', '이순신'], why: '을지문덕이 살수에서 수나라 군대를 크게 물리쳤어. 이것을 살수 대첩이라고 해.' },
    { q: '영토를 크게 넓힌 고구려의 왕은?', options: ['광개토대왕', '세종대왕', '근초고왕'], why: '광개토대왕은 사방으로 영토를 크게 넓혔어.' },
    { q: '철이 많이 나서 철로 갑옷과 무기를 만든 나라는?', options: ['가야', '백제', '고조선'], why: '가야는 철이 풍부해서 철을 다른 나라에 팔기도 했어.' },
    { q: '나뭇가지와 사슴뿔 모양 장식이 있는 신라 왕의 관은?', options: ['금관', '갓', '투구'], why: '신라의 금관에는 나뭇가지와 사슴뿔 모양 장식이 달려 있어.' },
    { q: '삼국이 서로 차지하려고 다툰 강 주변 지역은?', options: ['한강 유역', '낙동강 유역', '압록강 유역'], why: '한강 유역은 땅이 기름지고 서해 바닷길로 중국과 교류하기 좋았어.' },
    { q: '뚜껑에 산과 신선, 동물을 섬세하게 새긴 백제의 유물은?', options: ['금동 대향로', '첨성대', '측우기'], why: '백제 금동 대향로는 백제 사람들의 뛰어난 솜씨를 보여 줘.' },
    { q: '한강 나루에서 북쪽으로 가면 나오는 나라는?', options: ['고구려', '신라', '가야'], why: '고구려는 한반도 북쪽, 백제는 서남쪽, 신라는 동남쪽, 가야는 남쪽에 있었어.' }
  ];

  async function king(ev) {
    if (ev.flag(ERA + 'Clear')) { await ev.say('광개토대왕: 고구려의 기상을 잊지 말거라!'); return; }
    const n0 = tasks(ev.state);
    if (n0 < 4) { await ev.say(`광개토대왕: 고구려, 백제, 신라, 가야를 모두 돌아보고 오너라. 그러면 너를 시험하겠다. (지금 ${n0}/4)`); return; }
    await ev.say('광개토대왕: 고구려, 백제, 신라, 가야를 모두 돌아보고 왔구나.', '광개토대왕: 나는 말을 달려 고구려의 땅을 사방으로 크게 넓혔다. 이제 너의 지혜와 힘을 시험하겠다!');
    const n = await ev.quiz(QUIZ, 3);
    const boost = n >= 3 ? 2 : n >= 2 ? 1 : 0;
    await ev.say(`광개토대왕: ${n}개를 맞혔구나. ` + (boost ? '좋다, 겨뤄 보자!' : '아쉽지만 힘으로 겨뤄 보자!'));
    const r = await ev.battle({ trainer: { name: '광개토대왕', sprite: 'tk_gwanggaeto', team: [['muralhunt', 14], ['ironarmor', 15]], lose: ['광개토대왕: 대단하구나! 너를 삼국의 영웅으로 인정하마.'] }, bg: 'bb_castle', music: 'boss', atkBoost: boost });
    if (r !== 'win') return;
    await ev.say('광개토대왕: 내 아들 장수왕은 도읍을 평양으로 옮기고 남쪽으로 땅을 넓혔지.', '광개토대왕: 그 뒤 신라가 당과 힘을 합쳐 삼국을 통일하게 된단다. 다음 시대에서 확인해 보거라.');
    await HG.Era.award(ev, { name: '삼국 인장', icon: 'mon_goldcrown' });
    await ev.say('할아버지(무전기): 시간 조각이 돌아왔구나! 한강 나루의 타임머신으로 오렴!');
  }

  async function ferry(ev) {
    await ev.say('뱃사공: 어서 오너라! 여기는 한강을 건너는 나루터란다.', '뱃사공: 한강 둘레는 땅이 기름지고, 강을 따라 서해로 나가면 중국과 오가기 좋지. 그래서 삼국이 이곳을 서로 차지하려고 다투었단다.');
    const n = tasks(ev.state);
    const left = [['tk_salsu', '북쪽 고구려의 을지문덕'], ['tk_hanseong', '서쪽 백제의 근초고왕'], ['tk_seorabeol', '동쪽 신라의 진흥왕'], ['tk_gaya', '남쪽 가야의 대장장이']].filter(([f]) => !ev.flag(f)).map(([, w]) => w);
    if (left.length) await ev.say(`뱃사공: 아직 ${left.join(', ')}${HG.josa(left[left.length - 1].slice(-1), '이', '가')} 너를 기다리고 있단다.`);
    else if (!ev.flag(ERA + 'Clear')) await ev.say('뱃사공: 네 나라를 모두 도왔구나! 강을 건너 북쪽 국내성의 광개토대왕을 만나 보렴.');
  }

  function objective(s) {
    const f = s.flags;
    if (!f.tk_arrived) return '';
    const n = tasks(s);
    if (n < 4) return `나라 돌아보기 ${n}/4 (고구려 · 백제 · 신라 · 가야)`;
    if (!f[ERA + 'Clear']) return '북쪽 고구려 국내성의 광개토대왕을 만나자';
    return '한강 나루의 타임머신으로 가자';
  }

  HG.registerStage({
    id: ERA, name: '삼국·가야', type: 'village', baseLevel: 14, teacher: '광개토대왕', quiz: QUIZ,
    start: { map: 'tk_han', x: 13, y: 13, dir: 'up' },
    battleBg: 'bb_village', respawn: { map: 'tk_han', x: 13, y: 13, dir: 'up' }, objective,
    maps: ['tk_han', 'tk_go', 'tk_bj', 'tk_sl', 'tk_gy'],
    taskFlags: T,
    devMinis: [{ name: '살수 (고구려)', scene: 'Pipes', p: M.salsu.p }, { name: '한성 바닷길 (백제)', scene: 'Landing', p: M.hanseong.p }, { name: '대장간 (가야)', scene: 'Timing', p: M.gaya.p }]
  });
})();
