// 구석기 스테이지 그림 — 땅, 막집, 모닥불, 사람들, 유물 동료, 매머드
HG.Art.register(function (scene) {
  const Px = HG.Pixel;
  const hash = (x, y, s) => { let h = (x * 374761393 + y * 668265263 + (s || 0) * 982451653) | 0; h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967295; };

  // ── 땅 타일 16x16
  const grass = (p, s) => { Px.rect(p, 0, 0, 16, 16, 'e'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = hash(x, y, s); if (r < 0.06) p(x, y, 'f'); else if (r < 0.1) p(x, y, 'E'); } };
  Px.draw(scene, 't_grass', 16, 16, p => grass(p, 1));
  Px.draw(scene, 't_grass2', 16, 16, p => { grass(p, 2); p(4, 5, 'w'); p(3, 6, 'w'); p(5, 6, 'w'); p(4, 7, 'w'); p(4, 6, 'y'); p(11, 11, 'P'); p(10, 12, 'P'); p(12, 12, 'P'); p(11, 13, 'P'); p(11, 12, 'y'); });
  Px.draw(scene, 't_tall', 16, 16, p => {
    Px.rect(p, 0, 0, 16, 16, 'E');
    const blade = (bx, by) => { p(bx, by, 'f'); p(bx, by + 1, 'e'); p(bx - 1, by + 2, 'e'); p(bx + 1, by + 2, 'e'); p(bx - 1, by + 3, 'e'); p(bx + 1, by + 3, 'e'); p(bx - 2, by + 3, 'f'); p(bx + 2, by + 3, 'f'); };
    [[3, 1], [11, 1], [7, 5], [3, 9], [11, 9], [7, 12]].forEach(b => blade(b[0], b[1]));
  });
  Px.draw(scene, 't_path', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'n'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = hash(x, y, 7); if (r < 0.07) p(x, y, 'b'); else if (r < 0.1) p(x, y, 's'); } });
  Px.draw(scene, 't_sand', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'Y'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (hash(x, y, 9) < 0.08) p(x, y, 'y'); });
  [0, 1].forEach(f => Px.draw(scene, 't_water' + f, 16, 16, p => {
    Px.rect(p, 0, 0, 16, 16, 'u');
    for (let y = 2; y < 16; y += 5) for (let x = 0; x < 16; x++) if (((x + y + f * 3) % 8) < 3) p(x, y, 'c');
  }));
  Px.draw(scene, 't_tree', 16, 16, (p, ctx) => {
    grass(p, 3);
    Px.rect(p, 7, 11, 3, 5, 'B');
    Px.ellipse(p, 8, 7, 7, 6, 'E'); Px.ellipse(p, 7, 6, 5, 4, 'e'); p(5, 4, 'f'); p(6, 4, 'f'); p(5, 5, 'f');
    for (let x = 1; x < 15; x++) if (hash(x, 0, 4) < 0.3) p(x, 12, 'E');
  });
  Px.draw(scene, 't_rock', 16, 16, (p, ctx) => {
    grass(p, 5);
    Px.ellipse(p, 8, 9, 7, 6, 'k'); Px.ellipse(p, 8, 9, 6, 5, 'g'); Px.ellipse(p, 7, 8, 3, 2, 'l'); p(10, 12, 'G'); p(11, 11, 'G'); p(5, 12, 'G');
  });
  Px.draw(scene, 't_cliff', 16, 16, p => {
    Px.rect(p, 0, 0, 16, 16, 'G');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = hash(x, y, 11); if (r < 0.12) p(x, y, 'g'); else if (r < 0.16) p(x, y, 'k'); }
    Px.rect(p, 0, 15, 16, 1, 'k');
  });
  Px.draw(scene, 't_cavefloor', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'B'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = hash(x, y, 13); if (r < 0.08) p(x, y, 'b'); else if (r < 0.11) p(x, y, 'G'); } });
  Px.draw(scene, 't_cavedoor', 16, 16, p => {
    Px.rect(p, 0, 0, 16, 16, 'G');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (hash(x, y, 11) < 0.12) p(x, y, 'g');
    Px.ellipse(p, 8, 13, 6, 10, 'k');
  });
  // 동굴 벽화(손바닥·짐승 그림) — 장식
  Px.draw(scene, 't_cavepaint', 16, 16, p => {
    Px.rect(p, 0, 0, 16, 16, 'G'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (hash(x, y, 11) < 0.1) p(x, y, 'g');
    Px.rect(p, 3, 6, 7, 3, 'o'); p(2, 6, 'o'); p(3, 9, 'o'); p(5, 9, 'o'); p(8, 9, 'o'); p(9, 9, 'o'); p(10, 5, 'o'); p(11, 4, 'o');
    Px.rect(p, 12, 10, 2, 3, 'R'); p(11, 9, 'R'); p(12, 9, 'R'); p(13, 9, 'R'); p(14, 9, 'R');
    Px.rect(p, 0, 15, 16, 1, 'k');
  });
  Px.draw(scene, 't_bones', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'B'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (hash(x, y, 13) < 0.08) p(x, y, 'b'); Px.rect(p, 3, 7, 9, 2, 'w'); p(2, 6, 'w'); p(2, 9, 'w'); p(12, 6, 'w'); p(12, 9, 'w'); });

  // ── 물건
  // 막집: 나뭇가지를 세우고 가죽을 덮은 집 (32x32)
  Px.draw(scene, 'o_hut', 32, 32, (p, ctx) => {
    Px.poly(p, [[16, 3], [30, 29], [2, 29]], 'n');
    Px.poly(p, [[16, 6], [26, 27], [6, 27]], 'b');
    for (let y = 8; y < 28; y += 4) for (let x = 0; x < 32; x++) if (hash(x, y, 21) < 0.5) p(x, y, 'n');
    Px.poly(p, [[16, 15], [21, 29], [11, 29]], 'k');
    // 나뭇가지 끝
    p(13, 1, 'B'); p(14, 2, 'B'); p(15, 3, 'B'); p(19, 1, 'B'); p(18, 2, 'B'); p(17, 3, 'B');
    Px.outline(ctx, 32, 32);
  });
  // 모닥불 2장
  [0, 1].forEach(f => Px.draw(scene, 'o_fire' + f, 16, 16, (p, ctx) => {
    [[2, 13], [5, 14], [9, 14], [12, 13], [4, 11], [11, 11]].forEach(q => Px.ellipse(p, q[0], q[1], 1, 1, 'g'));
    Px.rect(p, 4, 12, 8, 2, 'B');
    const h = f ? 1 : 0;
    Px.poly(p, [[8, 2 + h], [12, 12], [4, 12]], 'r');
    Px.poly(p, [[8 - h, 5], [11, 12], [5, 12]], 'o');
    Px.poly(p, [[8, 8], [10, 12], [6, 12]], 'y');
  }));
  // 표지판
  Px.draw(scene, 'o_sign', 16, 16, (p, ctx) => { Px.rect(p, 7, 9, 2, 6, 'B'); Px.rect(p, 2, 3, 12, 7, 'n'); Px.rect(p, 3, 4, 10, 1, 'b'); Px.rect(p, 3, 6, 8, 1, 'b'); Px.outline(ctx, 16, 16); });
  // 열매 덤불
  Px.draw(scene, 'o_bush', 16, 16, (p, ctx) => { Px.ellipse(p, 8, 9, 7, 6, 'E'); Px.ellipse(p, 7, 8, 5, 4, 'e'); [[4, 7], [9, 6], [11, 10], [6, 11], [8, 9]].forEach(q => { p(q[0], q[1], 'r'); p(q[0] + 1, q[1], 'R'); }); Px.outline(ctx, 16, 16); });
  // 바닥에 놓인 첫 동료 유물 (작은 아이콘)
  Px.draw(scene, 'o_stone', 16, 16, (p, ctx) => { Px.ellipse(p, 8, 10, 6, 4, 'n'); Px.ellipse(p, 8, 10, 5, 3, 'b'); Px.outline(ctx, 16, 16); });

  // ── 구석기 사람들
  HG.Art.person(scene, 'npc_elder', { hair: 'l', shirt: 'n', pants: 'b', band: 'r', beard: true });
  HG.Art.person(scene, 'npc_chief', { hair: 'k', shirt: 'B', pants: 'b', band: 'y', shade: 'S' });
  HG.Art.person(scene, 'npc_hunter', { hair: 'k', shirt: 'n', pants: 'B' });
  HG.Art.person(scene, 'npc_woman', { hair: 'B', shirt: 'n', pants: 'b', long: true });
  HG.Art.person(scene, 'npc_kid', { hair: 'B', shirt: 'f', pants: 'b' });
  HG.Art.person(scene, 'npc_fire', { hair: 'B', shirt: 'o', pants: 'b', band: 'o' });
  HG.Art.person(scene, 'npc_guard', { hair: 'k', shirt: 'G', pants: 'B', band: 'w' });

  // ── 유물 동료 32x32 (눈이 있는 정령 모습). 희귀(★)는 색을 바꿔 한 장 더
  const SHINY = { g: 'y', l: 'Y', G: 'o', r: 'p', o: 'P', y: 'w', b: 'R', n: 'o', B: 'R' };
  const eyes = (p, x1, x2, y) => {
    [x1, x2].forEach(x => { Px.rect(p, x, y, 2, 3, 'k'); p(x, y, 'w'); });
    p(x1 - 2, y + 3, 'P'); p(x1 - 1, y + 3, 'P'); p(x2 + 2, y + 3, 'P'); p(x2 + 3, y + 3, 'P');
  };
  const mouth = (p, x, y) => { p(x, y, 'k'); p(x + 1, y + 1, 'k'); p(x + 2, y, 'k'); };
  const MON = {
    handaxe: p => {
      Px.poly(p, [[16, 2], [25, 14], [26, 22], [21, 29], [11, 29], [6, 22], [7, 14]], 'g');
      Px.poly(p, [[16, 4], [21, 12], [16, 15], [11, 12]], 'l');
      [[9, 18], [23, 19], [12, 26], [20, 26], [18, 8]].forEach(q => Px.ellipse(p, q[0], q[1], 1, 1, 'G'));
      eyes(p, 12, 18, 17); mouth(p, 15, 23);
    },
    spear: p => {
      for (let i = 0; i < 18; i++) { Px.rect(p, 4 + i, 28 - i, 2, 2, 'b'); }
      Px.poly(p, [[29, 2], [26, 18], [14, 13]], 'g');
      Px.poly(p, [[28, 4], [25, 12], [20, 11]], 'l');
      Px.rect(p, 15, 14, 5, 3, 'n'); p(16, 13, 'n'); p(18, 17, 'n');
      eyes(p, 20, 24, 8);
    },
    ember: p => {
      Px.rect(p, 5, 26, 22, 3, 'b'); Px.rect(p, 7, 25, 18, 1, 'B');
      Px.poly(p, [[16, 1], [26, 16], [25, 25], [7, 25], [6, 16], [11, 8], [13, 12]], 'r');
      Px.poly(p, [[16, 6], [23, 17], [22, 24], [10, 24], [9, 17]], 'o');
      Px.poly(p, [[16, 14], [20, 20], [19, 24], [13, 24], [12, 20]], 'y');
      eyes(p, 12, 18, 16); mouth(p, 15, 21);
    },
    chopper: p => {
      Px.ellipse(p, 16, 19, 12, 10, 'g');
      for (let x = 5; x < 28; x++) { const t = (x % 4 < 2) ? 0 : 1; Px.rect(p, x, 9 + t, 1, 2, 'l'); }
      Px.ellipse(p, 11, 22, 2, 1, 'G'); Px.ellipse(p, 23, 24, 2, 1, 'G');
      eyes(p, 11, 19, 16); mouth(p, 15, 22);
    },
    scraper: p => {
      Px.ellipse(p, 16, 20, 14, 7, 'g');
      Px.ellipse(p, 16, 17, 13, 3, 'l');
      for (let x = 3; x < 30; x += 3) p(x, 14 + (x % 2), 'w');
      Px.ellipse(p, 24, 22, 2, 1, 'G');
      eyes(p, 11, 19, 18);
    },
    tanged: p => {
      Px.poly(p, [[16, 1], [22, 14], [19, 22], [13, 22], [10, 14]], 'g');
      Px.poly(p, [[16, 3], [19, 12], [16, 15], [13, 12]], 'l');
      Px.rect(p, 14, 22, 4, 8, 'G'); Px.rect(p, 15, 22, 2, 8, 'g');
      eyes(p, 12, 18, 13);
    }
  };
  for (const id in MON) {
    Px.draw(scene, 'mon_' + id, 32, 32, (p, ctx) => { MON[id](p); Px.outline(ctx, 32, 32); });
    Px.draw(scene, 'mon_' + id + '_s', 32, 32, (p, ctx) => { MON[id](p); Px.outline(ctx, 32, 32); }, SHINY);
  }

  // ── 매머드 (사냥) 40x32, 2장
  [0, 1].forEach(f => Px.draw(scene, 'mammoth' + f, 40, 32, (p, ctx) => {
    const leg = f ? 1 : 0;
    Px.rect(p, 10, 22, 5, 8 - leg, 'B'); Px.rect(p, 25, 22, 5, 8 - (1 - leg), 'B');
    Px.rect(p, 16, 22, 4, 7 + leg, 'b'); Px.rect(p, 30, 22, 4, 7 + (1 - leg), 'b');
    Px.ellipse(p, 21, 16, 15, 10, 'b');
    Px.ellipse(p, 19, 12, 11, 5, 'n');
    for (let x = 8; x < 36; x += 2) p(x, 24 + (x % 3 ? 0 : 1), 'B');
    Px.ellipse(p, 33, 12, 6, 6, 'b');
    Px.ellipse(p, 34, 7, 4, 3, 'n');
    Px.rect(p, 36, 14, 3, 10, 'b'); p(37, 24, 'b'); p(38, 25, 'b');
    for (let i = 0; i < 6; i++) p(33 + i, 18 + Math.floor(i / 2), 'w'), p(32 + i, 18 + Math.floor(i / 2), 'w');
    p(35, 10, 'k'); p(35, 9, 'w');
    p(5, 13, 'B'); p(6, 14, 'B'); p(4, 12, 'B');
    Px.outline(ctx, 40, 32);
  }));
  // 던지는 창 (16x4)
  Px.draw(scene, 'thrown', 14, 3, p => { Px.rect(p, 0, 1, 10, 1, 'b'); p(10, 0, 'g'); p(11, 1, 'g'); p(12, 1, 'k'); p(10, 2, 'g'); p(10, 1, 'g'); });
  // 고기 아이콘
  Px.draw(scene, 'i_meat', 12, 12, (p, ctx) => { Px.ellipse(p, 5, 5, 4, 3, 'r'); Px.ellipse(p, 4, 4, 2, 1, 'P'); Px.rect(p, 7, 7, 3, 2, 'w'); p(10, 9, 'w'); p(10, 6, 'w'); Px.outline(ctx, 12, 12); });

  // ── 배틀 배경 (320x180에 깔 땅과 발판)
  Px.draw(scene, 'bb_paleo', 320, 180, p => {
    Px.rect(p, 0, 0, 320, 70, 'c');
    for (let x = 0; x < 320; x++) { const h = 8 + Math.floor(6 * Math.sin(x / 23) + 4 * Math.sin(x / 9)); Px.rect(p, x, 70 - h, 1, h, 'g'); }
    Px.rect(p, 0, 70, 320, 110, 'f');
    for (let y = 70; y < 180; y++) for (let x = 0; x < 320; x += 1) if (hash(x, y, 31) < 0.03) p(x, y, 'e');
    Px.ellipse(p, 230, 82, 48, 10, 'e'); Px.ellipse(p, 230, 81, 44, 8, 'E');
    Px.ellipse(p, 80, 134, 58, 12, 'e'); Px.ellipse(p, 80, 133, 54, 10, 'E');
  });
  Px.draw(scene, 'bb_cave', 320, 180, p => {
    Px.rect(p, 0, 0, 320, 180, 'G');
    for (let y = 0; y < 180; y++) for (let x = 0; x < 320; x++) { const r = hash(x, y, 33); if (r < 0.04) p(x, y, 'g'); else if (r < 0.06) p(x, y, 'k'); }
    Px.rect(p, 0, 74, 320, 106, 'B');
    for (let y = 74; y < 180; y++) for (let x = 0; x < 320; x++) if (hash(x, y, 34) < 0.04) p(x, y, 'b');
    Px.ellipse(p, 230, 82, 48, 10, 'b'); Px.ellipse(p, 230, 81, 44, 8, 'n');
    Px.ellipse(p, 80, 134, 58, 12, 'b'); Px.ellipse(p, 80, 133, 54, 10, 'n');
  });
});

// ── 생활 체험 그림: 채집 물건, 막집 짓기 단계, 막집 짓는 사람
HG.Art.register(function (scene) {
  const Px = HG.Pixel;
  HG.Art.person(scene, 'npc_builder', { hair: 'B', shirt: 'b', pants: 'B', band: 'n', beard: false });
  // 채집 물건 (12x12)
  Px.draw(scene, 'g_berry', 12, 12, (p, ctx) => { Px.rect(p, 5, 1, 2, 3, 'E'); [[3, 6], [7, 5], [5, 8], [8, 8]].forEach(([x, y]) => { Px.ellipse(p, x, y, 2, 2, 'r'); p(x - 1, y - 1, 'P'); }); Px.outline(ctx, 12, 12); });
  Px.draw(scene, 'g_acorn', 12, 12, (p, ctx) => { Px.ellipse(p, 6, 7, 3, 4, 'n'); Px.rect(p, 3, 3, 7, 3, 'b'); p(6, 1, 'B'); p(6, 2, 'B'); p(5, 6, 'Y'); Px.outline(ctx, 12, 12); });
  Px.draw(scene, 'g_mush', 12, 12, (p, ctx) => { Px.rect(p, 5, 6, 3, 5, 'w'); Px.ellipse(p, 6, 5, 5, 3, 'n'); Px.rect(p, 1, 5, 11, 1, 'n'); p(4, 4, 'Y'); Px.outline(ctx, 12, 12); });
  Px.draw(scene, 'g_poison', 12, 12, (p, ctx) => { Px.rect(p, 5, 6, 3, 5, 'w'); Px.ellipse(p, 6, 5, 5, 3, 'r'); Px.rect(p, 1, 5, 11, 1, 'r'); [[3, 4], [7, 3], [9, 5], [5, 5]].forEach(([x, y]) => p(x, y, 'w')); Px.outline(ctx, 12, 12); });
  Px.draw(scene, 'g_root', 12, 12, (p, ctx) => { Px.ellipse(p, 6, 10, 5, 1, 'b'); [[4, 4], [6, 2], [8, 4]].forEach(([x, y]) => { Px.rect(p, x, y, 1, 7 - y + 2, 'e'); p(x, y, 'f'); }); Px.outline(ctx, 12, 12); });
  Px.draw(scene, 'g_rootout', 12, 12, (p, ctx) => { Px.ellipse(p, 6, 8, 2, 3, 'o'); p(6, 11, 'o'); Px.rect(p, 5, 1, 1, 4, 'e'); Px.rect(p, 7, 2, 1, 3, 'e'); Px.outline(ctx, 12, 12); });
  Px.draw(scene, 'i_berry', 12, 12, (p, ctx) => { [[4, 6], [7, 5], [6, 8]].forEach(([x, y]) => { Px.ellipse(p, x, y, 2, 2, 'r'); p(x - 1, y - 1, 'P'); }); Px.rect(p, 6, 1, 1, 3, 'E'); Px.outline(ctx, 12, 12); });

  // 막집 짓기 단계 (48x40): 0 빈 땅, 1 나뭇가지 세움, 2 끈으로 묶음, 3 가죽 덮음, 4 돌로 누름
  const ground = p => { Px.ellipse(p, 24, 35, 22, 4, 'b'); Px.ellipse(p, 24, 34, 20, 3, 'n'); };
  const poles = p => {
    for (let i = 0; i < 26; i++) {
      const t = i / 25;
      p(Math.round(6 + t * 16), Math.round(34 - t * 30), 'B'); p(Math.round(7 + t * 16), Math.round(34 - t * 30), 'b');
      p(Math.round(42 - t * 16), Math.round(34 - t * 30), 'B'); p(Math.round(41 - t * 16), Math.round(34 - t * 30), 'b');
      p(Math.round(16 + t * 7), Math.round(34 - t * 30), 'b'); p(Math.round(32 - t * 7), Math.round(34 - t * 30), 'b');
    }
    p(22, 2, 'B'); p(26, 2, 'B'); p(21, 1, 'B'); p(27, 1, 'B');
  };
  const rope = p => { Px.rect(p, 20, 4, 9, 3, 'y'); p(20, 7, 'y'); p(28, 7, 'y'); p(19, 8, 'o'); p(29, 8, 'o'); };
  const hide = p => {
    Px.poly(p, [[24, 4], [43, 34], [5, 34]], 'n');
    for (let y = 9; y < 34; y += 5) for (let x = 6; x < 43; x++) if ((x + y) % 7 < 2) p(x, y, 'b');
    Px.poly(p, [[24, 18], [30, 34], [18, 34]], 'B');
    Px.rect(p, 20, 4, 9, 3, 'y');
  };
  const stones = p => { [[7, 33], [13, 34], [35, 34], [41, 33], [19, 35], [29, 35]].forEach(([x, y]) => { Px.ellipse(p, x, y, 2, 2, 'g'); p(x - 1, y - 1, 'l'); }); };
  const stages = [[], [poles], [poles, rope], [poles, hide], [poles, hide, stones]];
  stages.forEach((fs, i) => Px.draw(scene, 'build' + i, 48, 40, (p, ctx) => { ground(p); fs.forEach(f => f(p)); if (i) Px.outline(ctx, 48, 40); }));
  // 재료 카드 아이콘 (16x16)
  Px.draw(scene, 'm_stick', 16, 16, (p, ctx) => { for (let i = 0; i < 13; i++) { p(2 + i, 14 - i, 'b'); p(3 + i, 14 - i, 'B'); } p(6, 9, 'b'); p(5, 8, 'b'); Px.outline(ctx, 16, 16); });
  Px.draw(scene, 'm_rope', 16, 16, (p, ctx) => { for (let a = 0; a < 40; a++) { const r = 5 - a / 12; p(Math.round(8 + Math.cos(a / 3) * r), Math.round(8 + Math.sin(a / 3) * r), a % 4 < 2 ? 'y' : 'o'); } Px.outline(ctx, 16, 16); });
  Px.draw(scene, 'm_hide', 16, 16, (p, ctx) => { Px.poly(p, [[2, 4], [7, 2], [14, 3], [13, 13], [8, 14], [3, 12]], 'n'); p(5, 6, 'b'); p(9, 9, 'b'); p(11, 5, 'b'); Px.outline(ctx, 16, 16); });
  Px.draw(scene, 'm_stone', 16, 16, (p, ctx) => { Px.ellipse(p, 8, 9, 6, 5, 'g'); Px.ellipse(p, 6, 7, 2, 1, 'l'); p(10, 12, 'G'); Px.outline(ctx, 16, 16); });
});
