// 도트 그림 도구 — 글자로 적은 그림을 게임 그림(텍스처)으로 바꿈
// 그림 규칙: 한 글자 = 한 픽셀, 글자는 HG.PAL 의 색, '.' 은 투명
HG.Pixel = {
  canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { c, ctx };
  },

  // 글자 그림을 캔버스 위 (ox, oy) 에 찍기. swap 은 색 바꾸기 표 {원래글자: 새글자}
  paint(ctx, rows, ox, oy, swap, flipX) {
    const w = rows[0].length;
    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[y].length; x++) {
        let ch = rows[y][x];
        if (swap && swap[ch]) ch = swap[ch];
        const col = HG.PAL[ch];
        if (!col) continue;
        ctx.fillStyle = col;
        ctx.fillRect(ox + (flipX ? w - 1 - x : x), oy + y, 1, 1);
      }
    }
  },

  // 그림 한 장
  add(scene, key, rows, swap) {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    const { c, ctx } = this.canvas(rows[0].length, rows.length);
    this.paint(ctx, rows, 0, 0, swap);
    scene.textures.addCanvas(key, c);
  },

  // 여러 장을 가로로 이어 붙인 그림(애니메이션용). frames = [rows, rows, ...]
  sheet(scene, key, frames, swap) {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    const fw = frames[0][0].length, fh = frames[0].length;
    const { c, ctx } = this.canvas(fw * frames.length, fh);
    frames.forEach((f, i) => {
      const flip = f.flip;
      this.paint(ctx, f.rows || f, i * fw, 0, swap, flip);
    });
    const tex = scene.textures.addCanvas(key, c);
    frames.forEach((f, i) => tex.add(i, 0, i * fw, 0, fw, fh));
  },

  // 코드로 직접 그리는 그림. fn(p, ctx) 안에서 p(x, y, 색글자) 로 점을 찍음
  draw(scene, key, w, h, fn, swap) {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    const { c, ctx } = this.canvas(w, h);
    const p = (x, y, ch) => {
      if (swap && swap[ch]) ch = swap[ch];
      const col = HG.PAL[ch]; if (!col) return;
      ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    };
    fn(p, ctx, w, h);
    const t = scene.textures.addCanvas(key, c);
    if (t) t.add(0, 0, 0, 0, w, h);
  },

  // 칠하기 도우미들
  rect(p, x, y, w, h, ch) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) p(x + i, y + j, ch); },
  ellipse(p, cx, cy, rx, ry, ch) {
    for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++)
      if ((x * x) / (rx * rx + 0.3) + (y * y) / (ry * ry + 0.3) <= 1) p(cx + x, cy + y, ch);
  },
  // 다각형 채우기 (점 목록)
  poly(p, pts, ch) {
    let minY = Infinity, maxY = -Infinity;
    pts.forEach(q => { minY = Math.min(minY, q[1]); maxY = Math.max(maxY, q[1]); });
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        if ((a[1] <= y + 0.5 && b[1] > y + 0.5) || (b[1] <= y + 0.5 && a[1] > y + 0.5)) {
          xs.push(a[0] + ((y + 0.5 - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
        }
      }
      xs.sort((m, n) => m - n);
      for (let k = 0; k + 1 < xs.length; k += 2)
        for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) p(x, y, ch);
    }
  },
  // 외곽선 그리기: 투명 칸 중 색칠된 칸과 닿은 곳을 검정으로
  outline(ctx, w, h) {
    const img = ctx.getImageData(0, 0, w, h), d = img.data;
    const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0;
    const mark = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++)
      if (!solid(x, y) && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) mark.push([x, y]);
    ctx.fillStyle = HG.PAL.k;
    mark.forEach(m => ctx.fillRect(m[0], m[1], 1, 1));
  }
};
