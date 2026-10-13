// 공용 그림 — 사람 캐릭터 틀, 타임머신, 연구실
// 사람 틀 글자: H 머리카락, s 피부, S 피부그늘, q 윗옷, Q 아랫옷, F 신발, k 외곽선
HG.Art = {
  builders: [],
  register(fn) { this.builders.push(fn); },
  buildAll(scene) { this.common(scene); this.builders.forEach(fn => fn(scene)); },

  // 사람 그림 (16x24) — 코드로 그림을 그려서 모든 인물이 같은 품질
  // o: {hair, shirt, pants, shoes, scarf, goggles, pack, band, long, beard, glasses}
  SHADE: { u: 'U', n: 'b', b: 'B', r: 'R', w: 'l', l: 'g', g: 'G', f: 'e', e: 'E', o: 'R', G: 'k', B: 'k', R: 'k', y: 'o', U: 'k', c: 'u', p: 'R', P: 'p', s: 'S', Y: 'y' },
  HILITE: { B: 'b', R: 'r', k: 'G', l: 'w', b: 'n', G: 'g', y: 'Y', o: 'y' },

  personFrame(dir, step, o) {
    const W = 16, H = 24;
    const g = []; for (let y = 0; y < H; y++) g.push(new Array(W).fill('.'));
    const S = (x, y, c) => { if (c && x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
    const R = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) S(x + i, y + j, c); };
    const row = (y, x0, x1, c) => R(x0, y, x1 - x0 + 1, 1, c);
    const mirror = () => { for (let y = 0; y < H; y++) for (let x = 0; x < 8; x++) g[y][15 - x] = g[y][x]; };
    const hair = o.hair || 'B', hi = this.HILITE[hair] || hair;
    const sht = o.shirt || 'u', shtD = this.SHADE[sht] || 'k';
    const pn = o.pants || 'U', pnD = this.SHADE[pn] || 'k';
    const sho = o.shoes || 'B';
    const sc = o.scarf, scD = sc ? (this.SHADE[sc] || 'k') : null;
    const top = sc ? 15 : 14;

    if (dir === 'down' || dir === 'up') {
      // 머리 (왼쪽 절반만 그리고 거울처럼 복사)
      row(1, 5, 7, hair); row(2, 3, 7, hair); row(3, 2, 7, hair);
      for (let y = 4; y <= 11; y++) row(y, 1, 7, hair);
      row(12, 2, 7, hair); row(13, 3, 7, hair);
      S(4, 2, hi); S(5, 2, hi); S(3, 3, hi);
      if (dir === 'down') {
        for (let y = 6; y <= 12; y++) row(y, 3, 7, 's');
        row(13, 4, 7, 's');
        row(5, 2, 7, hair); S(3, 6, hair); S(5, 6, hair);
        R(4, 8, 2, 3, 'k'); S(4, 8, 'w');
        S(3, 11, 'P'); S(7, 12, 'R');
      }
      if (o.goggles) { row(4, 1, 7, 'G'); R(3, 3, 3, 2, 'c'); S(3, 3, 'w'); S(2, 3, 'k'); S(2, 4, 'k'); S(6, 3, 'k'); S(6, 4, 'k'); if (dir === 'up') { R(2, 3, 5, 2, hair); row(4, 1, 7, 'G'); } }
      if (o.band) row(4, 1, 7, o.band);
      if (o.ribbon) { S(1, 2, o.ribbon); S(2, 2, o.ribbon); S(2, 3, o.ribbon); S(1, 4, o.ribbon); }
      // 목도리 또는 목
      if (sc) { row(13, 3, 7, sc); row(14, 3, 7, sc); }
      // 몸
      R(4, top, 4, 20 - top, sht);
      R(2, 15, 2, 4, sht); R(2, 19, 2, 1, 's');
      row(19, 4, 7, o.belt || 'B');
      R(5, 20, 2, 2, pn); R(4, 22, 3, 1, sho);
      mirror();
      if (dir === 'down') { S(11, 8, 'k'); S(10, 8, 'w'); }
      // 그늘
      for (let y = top; y < 19; y++) S(11, y, shtD);
      S(10, 20, pnD); S(10, 21, pnD);
      if (dir === 'down' && sc) { R(10, 15, 2, 2, sc); S(11, 16, scD); S(11, 17, scD); }
      if (dir === 'down' && o.pack) { S(4, 15, 'B'); S(4, 16, 'B'); S(11, 15, 'B'); S(11, 16, 'B'); }
      if (dir === 'up' && o.pack) { R(4, 15, 8, 5, 'b'); R(4, 15, 8, 2, 'n'); S(7, 17, 'y'); S(8, 17, 'y'); R(4, 19, 8, 1, 'B'); }
      if (o.long) {
        if (dir === 'down') { R(1, 12, 2, 4, hair); R(13, 12, 2, 4, hair); }
        else { R(2, 12, 12, 4, hair); S(5, 13, hi); }
      }
      if (o.beard && dir === 'down') { R(5, 11, 6, 2, 'l'); R(6, 13, 4, 1, 'l'); S(7, 12, 'R'); S(8, 12, 'R'); }
      if (o.glasses && dir === 'down') { R(3, 8, 4, 1, 'k'); R(9, 8, 4, 1, 'k'); R(4, 9, 2, 1, 'c'); R(10, 9, 2, 1, 'c'); S(4, 10, 'k'); S(5, 10, 'k'); S(10, 10, 'k'); S(11, 10, 'k'); }
      if (step) { // 한 발 들기
        R(5, 21, 2, 1, '.'); R(4, 22, 3, 1, '.'); R(4, 21, 3, 1, sho);
        R(2, 18, 2, 1, 's'); R(2, 19, 2, 1, '.');
      }
    } else {
      // 옆모습 (오른쪽을 봄)
      row(1, 5, 9, hair); row(2, 3, 11, hair); row(3, 2, 12, hair);
      for (let y = 4; y <= 11; y++) row(y, 1, 12, hair);
      row(12, 2, 12, hair);
      for (let y = 6; y <= 12; y++) row(y, 6, 12, 's');
      R(13, 8, 1, 3, 's');
      row(5, 5, 12, hair); S(7, 6, hair); S(9, 6, hair);
      S(5, 2, hi); S(6, 2, hi); S(4, 3, hi);
      S(6, 9, 'S');
      R(10, 8, 2, 3, 'k'); S(10, 8, 'w');
      S(9, 11, 'P'); S(12, 12, 'R');
      if (o.goggles) { row(4, 1, 12, 'G'); R(9, 3, 3, 2, 'c'); S(9, 3, 'w'); S(8, 3, 'k'); S(8, 4, 'k'); S(12, 3, 'k'); S(12, 4, 'k'); }
      if (o.band) row(4, 1, 12, o.band);
      if (o.ribbon) { S(2, 2, o.ribbon); S(3, 2, o.ribbon); S(2, 3, o.ribbon); S(3, 4, o.ribbon); }
      if (o.long) { R(1, 6, 3, 7, hair); S(2, 13, hair); S(2, 8, hi); }
      if (o.beard) { R(9, 11, 4, 2, 'l'); R(10, 13, 2, 1, 'l'); }
      if (o.glasses) { R(9, 8, 4, 1, 'k'); R(10, 9, 2, 1, 'c'); }
      if (sc) { row(13, 4, 10, sc); row(14, 4, 10, sc); S(3, 13, sc); S(2, 14, sc); S(3, 14, sc); S(1, 15, scD); S(2, 15, sc); }
      else { R(7, 13, 3, 1, 's'); }
      R(5, top, 6, 20 - top, sht); for (let y = top; y < 19; y++) S(5, y, shtD);
      if (o.pack) { R(3, 15, 2, 5, 'b'); S(3, 15, 'n'); S(4, 15, 'n'); }
      row(19, 5, 10, o.belt || 'B');
      if (!step) { R(7, 15, 2, 4, shtD); R(7, 19, 2, 1, 's'); R(6, 20, 3, 2, pn); S(6, 21, pnD); R(6, 22, 4, 1, sho); }
      else { R(9, 15, 2, 3, shtD); R(10, 18, 1, 1, 's'); S(9, 18, 's'); R(4, 20, 2, 2, pnD); R(3, 22, 3, 1, sho); R(9, 20, 2, 2, pn); R(9, 22, 3, 1, sho); }
    }
    this.dress(g, dir, step, o, top);
    return g.map(r => r.join(''));
  },

  // 옷차림 덧그리기 (시대 옷 · 모자 · 갑옷)
  // o.robe: 긴 두루마기·곤룡포 색 · o.skirt: 치마 색 · o.collar: 깃 색 · o.goreum: 고름 색 · o.emblem: 가슴 용 무늬(보)
  // o.armor: 갑옷 색 · o.hat: boktu(복두) gat(갓) sangtu(상투) ikseon(익선관) helmet(투구) crown(금관) bun(쪽진 머리) monk(삭발)
  dress(g, dir, step, o, top) {
    const W = 16, H = 24;
    const S = (x, y, c) => { if (c && x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
    const R = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) S(x + i, y + j, c); };
    const SH = c => this.SHADE[c] || 'k';
    const hair = o.hair || 'B';
    const side = dir !== 'down' && dir !== 'up';
    // ── 몸
    if (o.robe) {
      const c = o.robe, d = SH(c);
      if (!side) { R(4, top, 8, 21 - top + 1, c); R(3, 19, 1, 3, c); R(12, 19, 1, 3, c); for (let y = top; y <= 21; y++) S(11, y, d); S(12, 20, d); S(12, 21, d); R(4, 19, 8, 1, o.belt || d); }
      else { R(5, top, 6, 21 - top + 1, c); R(4, 19, 8, 3, c); for (let y = top; y <= 21; y++) S(5, y, d); R(7, 15, 2, 4, d); R(4, 19, 8, 1, o.belt || d); S(7, 19, o.belt || d); R(7, 19, 2, 1, 's'); }
    }
    if (o.skirt) {
      const c = o.skirt, d = SH(c);
      if (!side) { R(4, 18, 8, 1, c); R(3, 19, 10, 3, c); S(12, 19, d); S(12, 20, d); S(12, 21, d); R(4, 22, 8, 1, '.'); if (!step) { R(5, 22, 2, 1, o.shoes || 'B'); R(9, 22, 2, 1, o.shoes || 'B'); } else R(9, 22, 2, 1, o.shoes || 'B'); }
      else { R(5, 18, 6, 1, c); R(4, 19, 8, 3, c); S(4, 19, d); S(4, 20, d); S(4, 21, d); R(3, 22, 9, 1, '.'); R(7, 22, 3, 1, o.shoes || 'B'); R(7, 15, 2, 3, SH(o.shirt || 'u')); }
    }
    if (o.armor) {
      const c = o.armor, d = SH(c), end = o.robe ? 18 : 18;
      if (!side) { for (let y = top; y <= end; y++) for (let x = 4; x <= 11; x++) S(x, y, (x + y) % 2 ? c : d); R(2, 14, 3, 2, c); R(11, 14, 3, 2, c); S(4, 15, d); S(11, 15, d); R(4, 19, 8, 1, o.belt || 'y'); }
      else { for (let y = top; y <= end; y++) for (let x = 5; x <= 10; x++) S(x, y, (x + y) % 2 ? c : d); R(6, 14, 4, 2, c); R(7, 16, 2, 2, d); R(5, 19, 6, 1, o.belt || 'y'); }
    }
    if (dir === 'down') {
      if (o.collar) { S(6, top, o.collar); S(7, top + 1, o.collar); S(9, top, o.collar); S(8, top + 1, o.collar); }
      if (o.goreum) { S(9, top + 2, o.goreum); S(10, top + 2, o.goreum); S(10, top + 3, o.goreum); }
      if (o.emblem) { R(6, 15, 4, 3, 'y'); S(7, 16, o.emblem); S(8, 16, o.emblem); }
    } else if (side) {
      if (o.collar) { S(10, top, o.collar); S(9, top + 1, o.collar); }
      if (o.goreum) { S(10, top + 2, o.goreum); S(11, top + 3, o.goreum); }
      if (o.emblem) { R(9, 15, 2, 3, 'y'); }
    }
    // ── 머리
    const h = o.hat;
    if (!h) return;
    if (!side) {
      if (h === 'gat') { R(4, 0, 8, 5, 'G'); R(5, 1, 1, 3, 'g'); R(4, 4, 8, 1, 'k'); R(0, 5, 16, 1, 'G'); S(2, 6, 'G'); S(13, 6, 'G'); }
      if (h === 'sangtu') { R(7, 0, 2, 1, hair); R(6, 1, 4, 1, hair); }
      if (h === 'ikseon') { R(3, 0, 10, 1, 'G'); R(2, 1, 12, 5, 'G'); R(3, 1, 3, 1, 'g'); R(2, 3, 12, 1, 'k'); R(0, 0, 2, 3, 'G'); R(14, 0, 2, 3, 'G'); S(7, 4, 'y'); S(8, 4, 'y'); }
      if (h === 'helmet') { R(3, 0, 10, 1, 'G'); R(2, 1, 12, 3, 'G'); R(4, 1, 3, 1, 'g'); R(1, 4, 14, 1, 'y'); R(7, 0, 2, 1, 'r'); S(7, 0, 'r'); R(1, 5, 1, 6, 'G'); R(14, 5, 1, 6, 'G'); }
      if (h === 'crown') { R(1, 4, 14, 1, 'y'); [2, 6, 9, 13].forEach(x => R(x, 1, 1, 3, 'y')); [2, 6, 9, 13].forEach(x => S(x, 0, 'Y')); S(4, 4, 'e'); S(11, 4, 'e'); }
      if (h === 'bun') { if (dir === 'up') { R(5, 10, 6, 3, hair); R(3, 11, 10, 1, 'y'); } else { S(7, 1, 'S'); S(8, 1, 'S'); S(7, 2, 'S'); S(13, 11, 'y'); S(14, 11, 'y'); } }
      if (h === 'monk') { for (let y = 1; y <= 5; y++) for (let x = 0; x < W; x++) if (g[y][x] === hair) g[y][x] = 's'; if (dir === 'up') for (let y = 6; y <= 12; y++) for (let x = 0; x < W; x++) if (g[y][x] === hair) g[y][x] = 's'; }
      if (h === 'boktu') { R(3, 0, 10, 1, 'G'); R(2, 1, 12, 5, 'G'); R(3, 1, 3, 1, 'g'); R(0, 3, 16, 1, 'G'); R(2, 4, 12, 1, 'k'); }
      if (h === 'hood') { R(2, 1, 12, 4, o.hoodColor || 'w'); R(1, 4, 1, 8, o.hoodColor || 'w'); R(14, 4, 1, 8, o.hoodColor || 'w'); }
    } else {
      if (h === 'gat') { R(3, 0, 8, 5, 'G'); R(8, 1, 1, 3, 'g'); R(3, 4, 8, 1, 'k'); R(0, 5, 15, 1, 'G'); }
      if (h === 'sangtu') { R(6, 0, 2, 1, hair); R(5, 1, 4, 1, hair); }
      if (h === 'ikseon') { R(3, 0, 9, 1, 'G'); R(1, 1, 12, 5, 'G'); R(8, 1, 3, 1, 'g'); R(1, 3, 12, 1, 'k'); R(0, 0, 2, 4, 'G'); S(10, 4, 'y'); }
      if (h === 'helmet') { R(3, 0, 8, 1, 'G'); R(1, 1, 12, 3, 'G'); R(8, 1, 3, 1, 'g'); R(0, 4, 14, 1, 'y'); R(6, 0, 2, 1, 'r'); R(1, 5, 3, 6, 'G'); }
      if (h === 'crown') { R(1, 4, 12, 1, 'y'); [2, 6, 10].forEach(x => { R(x, 1, 1, 3, 'y'); S(x, 0, 'Y'); }); S(8, 4, 'e'); }
      if (h === 'bun') { R(0, 6, 2, 4, hair); R(0, 7, 4, 1, 'y'); }
      if (h === 'monk') { for (let y = 1; y <= 12; y++) for (let x = 0; x < W; x++) if (g[y][x] === hair) g[y][x] = (y <= 5 || x < 6) ? 's' : g[y][x]; }
      if (h === 'boktu') { R(3, 0, 9, 1, 'G'); R(1, 1, 12, 5, 'G'); R(8, 1, 3, 1, 'g'); R(0, 3, 15, 1, 'G'); R(1, 4, 12, 1, 'k'); }
      if (h === 'hood') { R(1, 1, 11, 4, o.hoodColor || 'w'); R(1, 4, 4, 8, o.hoodColor || 'w'); }
    }
  },

  person(scene, key, o) {
    const frames = [['down', 0], ['down', 1], ['up', 0], ['up', 1], ['side', 0], ['side', 1]].map(([d, st]) => this.personFrame(d, st, o));
    if (scene.textures.exists(key)) scene.textures.remove(key);
    const fw = 16, fh = 24;
    const { c, ctx } = HG.Pixel.canvas(fw * frames.length, fh);
    frames.forEach((f, i) => HG.Pixel.paint(ctx, f, i * fw, 0));
    HG.Pixel.outline(ctx, fw * frames.length, fh);
    const tex = scene.textures.addCanvas(key, c);
    frames.forEach((f, i) => tex.add(i, 0, i * fw, 0, fw, fh));
  },

  common(scene) {
    const Px = HG.Pixel;
    // 주인공: 0 남 / 1 여, 옷: modern(현대) / paleo(구석기 가죽옷)
    const outfits = {
      modern: { shirt: 'u', pants: 'U', shoes: 'r' },
      paleo: { shirt: 'n', pants: 'b', shoes: 'B' },
      neo: { shirt: 'l', pants: 'n', shoes: 'B' },
      bronze: { shirt: 'Y', pants: 'n', shoes: 'B' },
      three: { shirt: 'r', pants: 'G', shoes: 'k', collar: 'w', goreum: 'y' },
      silla: { shirt: 'u', pants: 'w', shoes: 'k', collar: 'w', goreum: 'r' },
      goryeo: { shirt: 'c', pants: 'w', shoes: 'k', collar: 'w', goreum: 'u' },
      joseon: { shirt: 'w', pants: 'w', shoes: 'k', goreum: 'u' },
      latejoseon: { shirt: 'Y', pants: 'w', shoes: 'n', collar: 'w', goreum: 'r' },
      colonial: { shirt: 'k', pants: 'k', shoes: 'k' }
    };
    // 주인공의 상징: 머리 위 시간 고글 + 빨간 목도리 + 작은 배낭
    for (const of in outfits) {
      const hero = Object.assign({ hair: 'B', goggles: true, scarf: 'r', pack: true }, outfits[of]);
      this.person(scene, 'hero0_' + of, hero);
      this.person(scene, 'hero1_' + of, Object.assign({}, hero, { long: true, ribbon: 'P' }));
    }
    this.person(scene, 'rival_modern', { hair: 'R', shirt: 'y', pants: 'U', shoes: 'k', scarf: 'u', band: 'u' });
    this.person(scene, 'rival_paleo', { hair: 'R', shirt: 'n', pants: 'b', shoes: 'B', scarf: 'u', band: 'u' });
    this.person(scene, 'grandpa', { hair: 'l', shirt: 'w', pants: 'G', shoes: 'k', beard: true, glasses: true });

    // 타임머신 (32x32) — 둥근 캡슐에 안테나
    Px.draw(scene, 'timemachine', 32, 32, (p, ctx) => {
      Px.ellipse(p, 16, 18, 13, 11, 'l');
      Px.ellipse(p, 14, 15, 9, 7, 'w');
      Px.ellipse(p, 16, 18, 7, 6, 'c');
      Px.ellipse(p, 14, 16, 3, 2, 'w');
      Px.rect(p, 4, 22, 24, 3, 'g');
      Px.rect(p, 6, 28, 4, 3, 'G'); Px.rect(p, 22, 28, 4, 3, 'G');
      Px.rect(p, 15, 3, 2, 5, 'G'); Px.rect(p, 14, 1, 4, 3, 'y');
      p(9, 23, 'r'); p(13, 23, 'y'); p(17, 23, 'e'); p(21, 23, 'u');
      Px.outline(ctx, 32, 32);
    });
    // 고장 연기
    Px.draw(scene, 'smoke', 8, 8, p => { Px.ellipse(p, 4, 4, 3, 3, 'l'); p(3, 3, 'w'); });
    // 연구실 바닥·벽
    Px.draw(scene, 't_labfloor', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'l'); Px.rect(p, 0, 0, 8, 8, 'w'); Px.rect(p, 8, 8, 8, 8, 'w'); });
    Px.draw(scene, 't_labwall', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'c'); Px.rect(p, 0, 12, 16, 4, 'u'); Px.rect(p, 0, 15, 16, 1, 'U'); Px.rect(p, 3, 3, 10, 6, 'w'); Px.rect(p, 4, 4, 8, 4, 'c'); });
    Px.draw(scene, 't_shelf', 16, 16, (p, ctx) => {
      Px.rect(p, 1, 1, 14, 15, 'b'); Px.rect(p, 2, 2, 12, 4, 'B'); Px.rect(p, 2, 8, 12, 4, 'B');
      [[3, 'r'], [5, 'u'], [7, 'y'], [10, 'e'], [12, 'p']].forEach(([x, c]) => { Px.rect(p, x, 3, 1, 3, c); Px.rect(p, x, 9, 1, 3, c === 'r' ? 'o' : c); });
    });
    Px.draw(scene, 't_desk', 16, 16, p => { Px.rect(p, 0, 4, 16, 6, 'n'); Px.rect(p, 0, 9, 16, 1, 'b'); Px.rect(p, 1, 10, 2, 6, 'b'); Px.rect(p, 13, 10, 2, 6, 'b'); Px.rect(p, 4, 1, 6, 4, 'G'); Px.rect(p, 5, 2, 4, 2, 'c'); });

    // 말풍선 느낌표
    Px.add(scene, 'bang', ['..kkk..', '..kyk..', '..kyk..', '..kyk..', '..kkk..', '..kyk..', '..kkk..']);
    // 할 일 표시 말풍선
    Px.add(scene, 'qmark', [
      '.kkkkkkk.',
      'kwwwwwwwk',
      'kwwwrrwwk',
      'kwwwrrwwk',
      'kwwwrrwwk',
      'kwwwrrwwk',
      'kwwwwwwwk',
      'kwwwrrwwk',
      'kwwwwwwwk',
      '.kkkkkkk.',
      '...kwk...',
      '....k....']);
    // 그림자
    Px.draw(scene, 'shadow', 12, 4, p => Px.ellipse(p, 6, 2, 5, 1, 'k'));
  }
};
