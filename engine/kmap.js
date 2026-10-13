// 한반도 지도와 미니게임 공용 그림·음악·도우미 (모든 지도형 스테이지가 같이 씀)
(function () {
  // ── 한반도 지도 (경도, 위도)
  const OUT = [
    [124.4, 40.0], [125.0, 39.6], [125.4, 39.4], [125.3, 38.9], [124.8, 38.6], [125.2, 38.4], [124.9, 38.0], [125.6, 37.9],
    [126.2, 37.8], [126.6, 37.6], [126.6, 37.2], [126.8, 36.9], [126.3, 36.8], [126.5, 36.3], [126.6, 35.9], [126.4, 35.5],
    [126.3, 35.0], [126.3, 34.5], [126.9, 34.4], [127.4, 34.6], [127.8, 34.8], [128.4, 34.8], [128.7, 35.0], [129.1, 35.1],
    [129.4, 35.5], [129.5, 36.0], [129.4, 36.5], [129.4, 37.0], [129.1, 37.5], [128.6, 38.2], [128.3, 38.6], [127.6, 39.1],
    [127.6, 39.6], [128.2, 39.9], [128.9, 40.3], [129.7, 40.8], [129.8, 41.4], [130.1, 41.8], [130.7, 42.3], [130.4, 42.6],
    [129.9, 42.9], [129.3, 42.4], [128.6, 42.0], [128.0, 42.0], [127.4, 41.5], [126.6, 41.7], [126.0, 41.1], [125.3, 40.6]
  ];
  const VIEWS = {
    full: { lon0: 123.9, lat0: 43.2, sy: 16.4, sx: 13.1, x0: 10, y0: 4 },
    se: { lon0: 126.85, lat0: 36.6, sy: 92, sx: 74, x0: 8, y0: 4 }
  };
  const P = (v, lon, lat) => [v.x0 + (lon - v.lon0) * v.sx, v.y0 + (v.lat0 - lat) * v.sy];

  // 지도 그림 만들기 (바다·땅·해안선). 땅 판별용 마스크도 저장
  HG.KMap = {
    masks: {},
    build(scene, key, vname, w, h) {
      const v = typeof vname === 'string' ? VIEWS[vname] : vname;
      if (scene.textures.exists(key)) return v;
      const land = HG.Pixel.canvas(w, h);
      const p = (x, y, ch) => { const c = HG.PAL[ch]; if (!c) return; land.ctx.fillStyle = c; land.ctx.fillRect(Math.round(x), Math.round(y), 1, 1); };
      HG.Pixel.poly(p, OUT.map(([lo, la]) => P(v, lo, la)), 'e');
      const isl = (lo, la, r) => { const [x, y] = P(v, lo, la); HG.Pixel.ellipse(p, Math.round(x), Math.round(y), Math.max(1, Math.round(r * v.sx)), Math.max(1, Math.round(r * 0.55 * v.sy)), 'e'); };
      isl(126.55, 33.38, 0.35); isl(130.87, 37.5, 0.07); isl(131.87, 37.24, 0.03);
      const id = land.ctx.getImageData(0, 0, w, h);
      HG.KMap.masks[key] = { d: id.data, w, h };
      // 산 느낌 점
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (!id.data[i + 3]) continue;
        const r = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
        if (r < 0.07) p(x, y, 'f'); else if (r < 0.12) p(x, y, 'E');
      }
      HG.Pixel.outline(land.ctx, w, h);
      const out = HG.Pixel.canvas(w, h);
      out.ctx.fillStyle = HG.PAL.U; out.ctx.fillRect(0, 0, w, h);
      out.ctx.fillStyle = HG.PAL.u;
      for (let y = 3; y < h; y += 7) for (let x = (y * 3) % 11; x < w; x += 11) out.ctx.fillRect(x, y, 3, 1);
      out.ctx.drawImage(land.c, 0, 0);
      scene.textures.addCanvas(key, out.c);
      return v;
    },
    isLand(key, x, y) {
      const m = this.masks[key]; x = Math.round(x); y = Math.round(y);
      if (!m || x < 0 || y < 0 || x >= m.w || y >= m.h) return false;
      return m.d[(y * m.w + x) * 4 + 3] > 0;
    },
    P
  };

  // ── 그림
  HG.Art.register(function (scene) {
    const Px = HG.Pixel;
    HG.Art.person(scene, 'war_man', { hair: 'k', shirt: 'w', pants: 'l', shoes: 'k', pack: true, goreum: 'l' });
    HG.Art.person(scene, 'war_woman', { hair: 'k', shirt: 'w', pants: 'l', shoes: 'k', pack: true, skirt: 'l', goreum: 'r', hat: 'bun' });
    HG.Art.person(scene, 'war_kid', { hair: 'k', shirt: 'l', pants: 'b', shoes: 'k' });
    HG.Art.person(scene, 'war_grandma', { hair: 'l', shirt: 'w', pants: 'l', shoes: 'k', pack: true, skirt: 'g', goreum: 'g', hat: 'bun' });
    Px.draw(scene, 'i_water', 10, 12, (p, ctx) => { Px.poly(p, [[5, 1], [9, 8], [1, 8]], 'c'); Px.ellipse(p, 5, 8, 3, 2, 'c'); p(4, 6, 'w'); Px.outline(ctx, 10, 12); });
    Px.draw(scene, 'i_rice', 12, 12, (p, ctx) => { Px.poly(p, [[6, 1], [11, 10], [1, 10]], 'w'); Px.rect(p, 3, 7, 6, 3, 'G'); Px.outline(ctx, 12, 12); });
    Px.draw(scene, 'i_heart', 9, 8, (p, ctx) => { Px.ellipse(p, 2, 2, 1, 1, 'r'); Px.ellipse(p, 6, 2, 1, 1, 'r'); Px.poly(p, [[0, 3], [9, 3], [4.5, 7.5]], 'r'); p(2, 1, 'P'); Px.outline(ctx, 9, 8); });
    // 시간 괴물 (보라색 그림자, 2장)
    [0, 1].forEach(f => Px.draw(scene, 'tmon' + f, 16, 16, (p, ctx) => {
      Px.ellipse(p, 8, 9 - f, 6, 5 + f, 'p');
      for (let x = 3; x < 14; x += 3) p(x, 14, 'p');
      Px.rect(p, 5, 7, 2, 2, 'Y'); Px.rect(p, 9, 7, 2, 2, 'Y');
      Px.outline(ctx, 16, 16);
    }));
    // 거점 깃발
    Px.draw(scene, 'post', 14, 16, (p, ctx) => { Px.rect(p, 3, 2, 1, 13, 'B'); Px.rect(p, 4, 2, 8, 5, 'u'); Px.rect(p, 5, 3, 2, 1, 'w'); Px.ellipse(p, 4, 14, 3, 1, 'G'); Px.outline(ctx, 14, 16); });
    // 배 (위에서 본 모습)
    Px.draw(scene, 'ship', 16, 28, (p, ctx) => {
      Px.poly(p, [[8, 0], [14, 9], [14, 25], [2, 25], [2, 9]], 'l');
      Px.rect(p, 4, 10, 8, 12, 'g'); Px.rect(p, 6, 12, 4, 5, 'w'); Px.rect(p, 7, 18, 2, 3, 'G');
      Px.rect(p, 3, 25, 10, 2, 'G');
      Px.outline(ctx, 16, 28);
    });
    Px.draw(scene, 'reef', 18, 12, (p, ctx) => { Px.ellipse(p, 9, 7, 8, 4, 'g'); Px.ellipse(p, 7, 6, 3, 2, 'l'); p(13, 8, 'G'); Px.outline(ctx, 18, 12); });
    Px.draw(scene, 'whirl', 18, 18, p => { for (let a = 0; a < 60; a++) { const r = 8 - a / 8; p(Math.round(9 + Math.cos(a / 2.2) * r), Math.round(9 + Math.sin(a / 2.2) * r), a % 6 < 3 ? 'c' : 'w'); } });
  });

  // ── 배경음악
  HG.Sound.TRACKS.war = { bpm: 72, melody: [['A3', 3], ['C4', 1], ['E4', 4], ['D4', 2], ['C4', 2], ['B3', 4], ['A3', 3], ['G3', 1], ['A3', 2], ['C4', 2], ['B3', 6], ['-', 2]],
    bass: [['A2', 8], ['F2', 8], ['D2', 8], ['E2', 8]], lead: 'triangle' };
  HG.Sound.TRACKS.mission = { bpm: 138, melody: [['E4', 1], ['E4', 1], ['G4', 1], ['E4', 1], ['A4', 2], ['G4', 2], ['E4', 1], ['E4', 1], ['G4', 1], ['B4', 1], ['A4', 4]],
    bass: [['A2', 1], ['-', 1], ['A2', 1], ['E3', 1], ['A2', 1], ['-', 1], ['A2', 1], ['E3', 1], ['F2', 1], ['-', 1], ['F2', 1], ['C3', 1], ['G2', 1], ['-', 1], ['G2', 1], ['D3', 1]] };
  HG.Sound.TRACKS.peace = { bpm: 80, melody: [['C5', 2], ['E5', 2], ['G5', 4], ['F5', 2], ['E5', 2], ['D5', 4], ['C5', 2], ['D5', 2], ['E5', 2], ['G4', 2], ['C5', 8]],
    bass: [['C3', 8], ['F2', 8], ['G2', 8], ['C3', 8]], lead: 'triangle' };

  // 미니게임 공통: 시작 카운트다운·큰 글자
  const big = (S, s, ms) => new Promise(r => {
    const t = HG.UI.text(S, HG.W / 2, 70, s, { depth: 950, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0).setScale(2);
    S.tweens.add({ targets: t, scale: 3, alpha: 0, duration: ms, onComplete: () => { t.destroy(); r(); } });
  });
  const countdown = async S => { for (const n of ['3', '2', '1']) { await big(S, n, 420); HG.Sound.sfx('cursor'); } HG.Sound.sfx('select'); big(S, '시작!', 500); };
  const finish = async (S, r) => { HG.Sound.stop(); S.cameras.main.fadeOut(250); await HG.UI.wait(S, 260); const cb = S.onEnd; S.onEnd = null; if (cb) cb(r); };
  HG.KMap.OUT = OUT; HG.KMap.VIEWS = VIEWS;
  HG.Mini = { big, countdown, finish };
})();
