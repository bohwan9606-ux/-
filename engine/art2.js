// 여러 시대가 같이 쓰는 그림 — 땅(논·밭·돌벽·돌바닥), 집(움집·고인돌·초가집·기와집·석탑), 지도 표시, 장사 물건
HG.Art.register(function (scene) {
  const Px = HG.Pixel;
  const hash = (x, y, s) => { let h = (x * 374761393 + y * 668265263 + (s || 0) * 982451653) | 0; h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967295; };

  // ── 땅
  Px.draw(scene, 't_field', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'b'); for (let y = 1; y < 16; y += 4) { Px.rect(p, 0, y, 16, 2, 'n'); for (let x = 1; x < 16; x += 3) p(x, y - 1, 'f'); } });
  Px.draw(scene, 't_paddy', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'c'); for (let y = 2; y < 16; y += 5) for (let x = 2; x < 16; x += 4) { p(x, y, 'e'); p(x, y + 1, 'f'); p(x - 1, y, 'f'); p(x + 1, y, 'f'); } Px.rect(p, 0, 15, 16, 1, 'n'); });
  Px.draw(scene, 't_wall', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'g'); for (let y = 0; y < 16; y += 5) { Px.rect(p, 0, y, 16, 1, 'G'); for (let x = (y % 10 ? 3 : 8); x < 16; x += 10) Px.rect(p, x, y, 1, 5, 'G'); } p(4, 2, 'l'); p(12, 7, 'l'); });
  Px.draw(scene, 't_stonefloor', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'l'); Px.rect(p, 0, 0, 16, 1, 'g'); Px.rect(p, 0, 0, 1, 16, 'g'); Px.rect(p, 8, 8, 8, 1, 'g'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (hash(x, y, 41) < 0.05) p(x, y, 'w'); });
  Px.draw(scene, 't_sandpath', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'Y'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (hash(x, y, 43) < 0.07) p(x, y, 'n'); });
  HG.TILES['='] = { tex: 't_wall', solid: true };
  HG.TILES['F'] = { tex: 't_field' };
  HG.TILES['R'] = { tex: 't_paddy' };
  HG.TILES['Q'] = { tex: 't_stonefloor' };
  HG.TILES['y'] = { tex: 't_sandpath' };

  // ── 집과 건물 (32x32, 석탑은 16x32)
  Px.draw(scene, 'o_pithouse', 32, 32, (p, ctx) => {
    Px.ellipse(p, 16, 29, 14, 2, 'B');
    Px.poly(p, [[16, 3], [30, 28], [2, 28]], 'y');
    for (let y = 8; y < 28; y += 3) for (let x = 2; x < 31; x++) if ((x + y) % 5 === 0) p(x, y, 'o');
    Px.poly(p, [[16, 3], [20, 10], [12, 10]], 'n');
    Px.rect(p, 13, 20, 6, 8, 'k'); Px.rect(p, 14, 21, 4, 7, 'B');
    Px.outline(ctx, 32, 32);
  });
  Px.draw(scene, 'o_dolmen', 32, 32, (p, ctx) => {
    Px.rect(p, 6, 14, 5, 15, 'g'); Px.rect(p, 21, 14, 5, 15, 'g'); Px.rect(p, 7, 15, 1, 12, 'l'); Px.rect(p, 22, 15, 1, 12, 'l');
    Px.poly(p, [[1, 10], [6, 5], [27, 4], [31, 9], [29, 15], [3, 15]], 'g');
    Px.poly(p, [[3, 9], [7, 6], [25, 5], [28, 8]], 'l');
    p(14, 11, 'G'); p(20, 12, 'G');
    Px.outline(ctx, 32, 32);
  });
  Px.draw(scene, 'o_chogajip', 32, 32, (p, ctx) => {
    Px.rect(p, 4, 16, 24, 13, 'w'); Px.rect(p, 4, 16, 2, 13, 'n'); Px.rect(p, 26, 16, 2, 13, 'n');
    Px.rect(p, 13, 19, 6, 10, 'b'); Px.rect(p, 7, 19, 4, 4, 'Y'); Px.rect(p, 21, 19, 4, 4, 'Y');
    Px.ellipse(p, 16, 14, 16, 8, 'y'); Px.rect(p, 0, 14, 32, 3, 'y');
    for (let x = 2; x < 31; x += 3) p(x, 16, 'o');
    Px.ellipse(p, 16, 11, 11, 4, 'Y');
    Px.outline(ctx, 32, 32);
  });
  Px.draw(scene, 'o_giwajip', 32, 32, (p, ctx) => {
    Px.rect(p, 5, 17, 22, 12, 'n'); Px.rect(p, 5, 17, 2, 12, 'R'); Px.rect(p, 25, 17, 2, 12, 'R'); Px.rect(p, 15, 17, 2, 12, 'R');
    Px.rect(p, 9, 20, 4, 6, 'w'); Px.rect(p, 19, 20, 4, 6, 'w');
    Px.poly(p, [[0, 16], [3, 9], [29, 9], [32, 16], [28, 14], [4, 14]], 'G');
    Px.poly(p, [[6, 9], [9, 4], [23, 4], [26, 9]], 'G');
    for (let x = 2; x < 31; x += 2) p(x, 13, 'k');
    Px.rect(p, 8, 4, 16, 1, 'k');
    Px.outline(ctx, 32, 32);
  });
  Px.draw(scene, 'o_pagoda', 16, 32, (p, ctx) => {
    Px.rect(p, 2, 27, 12, 4, 'g');
    [[3, 20, 10], [4, 13, 8], [5, 7, 6]].forEach(([x, y, w]) => { Px.rect(p, x, y + 2, w, 5, 'l'); Px.rect(p, x - 2, y, w + 4, 2, 'g'); });
    Px.rect(p, 7, 2, 2, 5, 'G'); p(7, 1, 'y'); p(8, 1, 'y');
    Px.outline(ctx, 16, 32);
  });
  Object.assign(HG.OBJECTS, {
    pithouse: { tex: 'o_pithouse', w: 2, h: 2 }, dolmen: { tex: 'o_dolmen', w: 2, h: 2 },
    chogajip: { tex: 'o_chogajip', w: 2, h: 2 }, giwajip: { tex: 'o_giwajip', w: 2, h: 2 }, pagoda: { tex: 'o_pagoda', w: 1, h: 2 }
  });

  // ── 배틀 배경
  const bb = (key, sky, far, ground, plat, plat2, deco) => Px.draw(scene, key, 320, 180, p => {
    Px.rect(p, 0, 0, 320, 74, sky);
    if (far) far(p);
    Px.rect(p, 0, 74, 320, 106, ground);
    for (let y = 74; y < 180; y++) for (let x = 0; x < 320; x++) if (hash(x, y, 51) < 0.03) p(x, y, plat2);
    Px.ellipse(p, 230, 82, 48, 10, plat2); Px.ellipse(p, 230, 81, 44, 8, plat);
    Px.ellipse(p, 80, 134, 58, 12, plat2); Px.ellipse(p, 80, 133, 54, 10, plat);
    if (deco) deco(p);
  });
  bb('bb_castle', 'c', p => { Px.rect(p, 0, 40, 320, 34, 'g'); for (let x = 0; x < 320; x += 16) { Px.rect(p, x, 34, 10, 6, 'g'); Px.rect(p, x, 40, 320, 1, 'G'); } for (let y = 46; y < 74; y += 7) Px.rect(p, 0, y, 320, 1, 'G'); }, 'n', 'Y', 'b');
  bb('bb_village', 'c', p => { for (let x = 0; x < 320; x++) { const h = 10 + Math.floor(8 * Math.sin(x / 31) + 3 * Math.sin(x / 7)); Px.rect(p, x, 74 - h, 1, h, 'e'); } }, 'f', 'e', 'E');
  bb('bb_sea', 'c', p => { Px.rect(p, 0, 60, 320, 14, 'u'); for (let x = 0; x < 320; x += 9) p(x, 64 + (x % 3), 'w'); }, 'u', 'Y', 'U');

  // ── 지도 거점 표시
  Px.draw(scene, 'node', 12, 14, (p, ctx) => { Px.rect(p, 2, 1, 1, 12, 'B'); Px.poly(p, [[3, 1], [11, 3.5], [3, 6]], 'r'); Px.ellipse(p, 2, 12, 2, 1, 'G'); Px.outline(ctx, 12, 14); });
  Px.draw(scene, 'node_done', 12, 14, (p, ctx) => { Px.rect(p, 2, 1, 1, 12, 'B'); Px.poly(p, [[3, 1], [11, 3.5], [3, 6]], 'y'); p(5, 3, 'k'); p(6, 4, 'k'); p(7, 3, 'k'); p(8, 2, 'k'); Px.ellipse(p, 2, 12, 2, 1, 'G'); Px.outline(ctx, 12, 14); });
  Px.draw(scene, 'node_boss', 14, 12, (p, ctx) => { Px.poly(p, [[1, 10], [1, 3], [4, 6], [7, 1], [10, 6], [13, 3], [13, 10]], 'y'); p(7, 5, 'r'); p(4, 8, 'u'); p(10, 8, 'u'); Px.outline(ctx, 14, 12); });
  Px.draw(scene, 'node_lock', 10, 12, (p, ctx) => { Px.rect(p, 1, 5, 8, 6, 'g'); Px.rect(p, 2, 1, 1, 5, 'G'); Px.rect(p, 7, 1, 1, 5, 'G'); Px.rect(p, 2, 1, 6, 1, 'G'); p(4, 7, 'k'); p(5, 7, 'k'); Px.outline(ctx, 10, 12); });
  Px.draw(scene, 'node_tm', 14, 14, (p, ctx) => { Px.ellipse(p, 7, 8, 6, 5, 'l'); Px.ellipse(p, 7, 7, 3, 2, 'c'); Px.rect(p, 6, 1, 2, 3, 'y'); Px.outline(ctx, 14, 14); });

  // ── 장사 물건 (12x12)
  Px.draw(scene, 'coin', 10, 10, (p, ctx) => { Px.ellipse(p, 5, 5, 4, 4, 'y'); Px.rect(p, 4, 4, 2, 2, 'k'); Px.outline(ctx, 10, 10); });
  const good = (key, fn) => Px.draw(scene, key, 12, 12, (p, ctx) => { fn(p); Px.outline(ctx, 12, 12); });
  good('gd_silk', p => { Px.rect(p, 2, 3, 8, 7, 'P'); Px.rect(p, 2, 3, 8, 1, 'r'); Px.rect(p, 2, 6, 8, 1, 'w'); });
  good('gd_pottery', p => { Px.ellipse(p, 6, 7, 4, 4, 'c'); Px.rect(p, 4, 1, 4, 3, 'c'); p(5, 6, 'w'); });
  good('gd_iron', p => { Px.rect(p, 1, 4, 10, 4, 'G'); Px.rect(p, 2, 5, 8, 1, 'l'); Px.rect(p, 3, 8, 6, 2, 'G'); });
  good('gd_salt', p => { Px.ellipse(p, 6, 8, 5, 3, 'w'); Px.ellipse(p, 6, 6, 3, 2, 'w'); p(4, 7, 'l'); });
  good('gd_rice', p => { Px.ellipse(p, 6, 7, 4, 4, 'n'); Px.rect(p, 4, 2, 4, 2, 'b'); p(5, 6, 'Y'); });
  good('gd_ginseng', p => { Px.rect(p, 5, 4, 2, 6, 'Y'); p(4, 9, 'Y'); p(7, 10, 'Y'); Px.rect(p, 4, 1, 1, 3, 'e'); Px.rect(p, 7, 1, 1, 3, 'e'); p(6, 2, 'f'); });
  good('gd_book', p => { Px.rect(p, 2, 2, 8, 9, 'u'); Px.rect(p, 3, 3, 6, 7, 'Y'); Px.rect(p, 4, 4, 4, 1, 'k'); Px.rect(p, 4, 6, 4, 1, 'k'); });
  good('gd_fabric', p => { Px.rect(p, 1, 4, 10, 6, 'w'); Px.rect(p, 1, 6, 10, 1, 'l'); Px.ellipse(p, 2, 7, 1, 3, 'l'); });
  good('gd_fish', p => { Px.ellipse(p, 5, 6, 4, 2, 'c'); Px.poly(p, [[8, 6], [11, 3], [11, 9]], 'c'); p(3, 5, 'k'); });

  // 짚신 장수(보부상)·상인·관리 등 공용 사람
  HG.Art.person(scene, 'p_merchant', { hair: 'k', shirt: 'n', pants: 'w', shoes: 'B', pack: true, band: 'B', goreum: 'b', hat: 'sangtu' });
  HG.Art.person(scene, 'p_scholar', { hair: 'k', shirt: 'w', pants: 'w', shoes: 'k', robe: 'w', belt: 'u', beard: true, hat: 'gat' });
  HG.Art.person(scene, 'p_official', { hair: 'k', shirt: 'u', pants: 'U', shoes: 'k', robe: 'u', belt: 'y', beard: true, hat: 'boktu' });
  HG.Art.person(scene, 'p_king', { hair: 'k', shirt: 'r', pants: 'R', shoes: 'k', robe: 'r', belt: 'y', emblem: 'o', beard: true, hat: 'ikseon' });
  HG.Art.person(scene, 'p_queen', { hair: 'k', shirt: 'p', pants: 'P', shoes: 'k', skirt: 'r', goreum: 'y', collar: 'w', hat: 'bun' });
  HG.Art.person(scene, 'p_general', { hair: 'k', shirt: 'r', pants: 'B', shoes: 'k', armor: 'r', robe: 'R', hat: 'helmet' });
  HG.Art.person(scene, 'p_farmer', { hair: 'k', shirt: 'w', pants: 'l', shoes: 'n', band: 'w', goreum: 'n', hat: 'sangtu' });
  HG.Art.person(scene, 'p_woman', { hair: 'k', shirt: 'P', pants: 'w', shoes: 'k', skirt: 'u', goreum: 'r', collar: 'w', hat: 'bun' });
  HG.Art.person(scene, 'p_monk', { hair: 'k', shirt: 'g', pants: 'g', shoes: 'k', robe: 'g', belt: 'G', hat: 'monk' });
  HG.Art.person(scene, 'p_student', { hair: 'k', shirt: 'k', pants: 'k', shoes: 'k', band: 'k' });
  HG.Art.person(scene, 'p_girl1919', { hair: 'k', shirt: 'w', pants: 'k', shoes: 'k', long: true, skirt: 'k', goreum: 'w' });
});
