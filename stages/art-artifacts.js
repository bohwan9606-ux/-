// 신석기 ~ 일제강점기 유물 동료 그림 (32x32, 눈이 있는 정령 모습). 희귀(★)는 색을 바꾼 그림 한 장 더
HG.Art.register(function (scene) {
  const Px = HG.Pixel;
  const SHINY = { g: 'y', l: 'Y', G: 'o', r: 'p', o: 'P', y: 'w', b: 'R', n: 'o', B: 'R', c: 'P', u: 'p', U: 'R', e: 'c', E: 'u', w: 'Y' };
  const eyes = (p, x1, x2, y) => {
    [x1, x2].forEach(x => { Px.rect(p, x, y, 2, 3, 'k'); p(x, y, 'w'); });
    p(x1 - 2, y + 3, 'P'); p(x1 - 1, y + 3, 'P'); p(x2 + 2, y + 3, 'P'); p(x2 + 3, y + 3, 'P');
  };
  const mouth = (p, x, y) => { p(x, y, 'k'); p(x + 1, y + 1, 'k'); p(x + 2, y, 'k'); };
  const MON = {
    polishedaxe: p => {
      for (let i = 0; i < 16; i++) Px.rect(p, 6 + i, 28 - i, 2, 2, 'b');
      Px.poly(p, [[14, 4], [28, 6], [27, 18], [16, 20], [11, 12]], 'g');
      Px.poly(p, [[15, 6], [26, 8], [25, 12], [15, 12]], 'l');
      Px.rect(p, 12, 16, 6, 3, 'n');
      eyes(p, 17, 22, 11);
    },
    combpot: p => {
      Px.poly(p, [[6, 4], [26, 4], [24, 18], [16, 30], [8, 18]], 'n');
      Px.rect(p, 6, 4, 20, 2, 'b');
      for (let y = 7; y < 24; y += 3) for (let x = 8; x < 25; x += 3) { p(x, y, 'b'); p(x + 1, y + 1, 'b'); }
      Px.rect(p, 11, 10, 11, 7, 'n');
      eyes(p, 12, 18, 10); mouth(p, 15, 15);
    },
    grinder: p => {
      Px.ellipse(p, 16, 24, 14, 5, 'g'); Px.ellipse(p, 16, 23, 12, 3, 'l');
      Px.ellipse(p, 16, 14, 9, 6, 'g'); Px.ellipse(p, 14, 12, 4, 2, 'l');
      [[8, 22], [12, 21], [22, 22], [25, 23]].forEach(([x, y]) => p(x, y, 'Y'));
      eyes(p, 12, 18, 12);
    },
    spindle: p => {
      Px.ellipse(p, 16, 18, 12, 9, 'n'); Px.ellipse(p, 16, 18, 3, 3, 'B');
      for (let a = 0; a < 6; a++) p(Math.round(16 + Math.cos(a) * 8), Math.round(18 + Math.sin(a) * 6), 'b');
      Px.rect(p, 15, 2, 2, 12, 'Y'); Px.rect(p, 15, 22, 2, 8, 'Y');
      eyes(p, 9, 21, 15);
    },
    plainpot: p => {
      Px.ellipse(p, 16, 18, 11, 11, 'o'); Px.rect(p, 10, 4, 12, 6, 'o'); Px.rect(p, 9, 4, 14, 2, 'n');
      Px.ellipse(p, 12, 14, 3, 4, 'Y');
      eyes(p, 12, 18, 15); mouth(p, 15, 21);
    },
    bronzesword: p => {
      Px.poly(p, [[16, 1], [20, 8], [18, 12], [22, 17], [18, 22], [14, 22], [10, 17], [14, 12], [12, 8]], 'e');
      Px.rect(p, 15, 3, 2, 18, 'f');
      Px.rect(p, 13, 22, 6, 3, 'E'); Px.rect(p, 14, 25, 4, 6, 'b');
      eyes(p, 12, 18, 12);
    },
    bronzemirror: p => {
      Px.ellipse(p, 16, 16, 14, 14, 'E'); Px.ellipse(p, 16, 16, 12, 12, 'e');
      for (let a = 0; a < 24; a++) p(Math.round(16 + Math.cos(a / 3.8) * 10), Math.round(16 + Math.sin(a / 3.8) * 10), 'f');
      Px.ellipse(p, 16, 16, 2, 2, 'E');
      eyes(p, 10, 20, 11); mouth(p, 15, 20);
    },
    halfmoon: p => {
      for (let y = 4; y <= 15; y++) for (let x = 2; x <= 30; x++) if (((x - 16) ** 2) / 196 + ((y - 15) ** 2) / 121 <= 1) p(x, y, 'g');
      Px.rect(p, 3, 14, 26, 2, 'l');
      Px.ellipse(p, 12, 8, 1, 1, 'k'); Px.ellipse(p, 20, 8, 1, 1, 'k');
      Px.rect(p, 11, 16, 1, 8, 'Y'); Px.rect(p, 20, 16, 1, 8, 'Y'); Px.rect(p, 11, 24, 10, 1, 'Y');
      eyes(p, 13, 17, 9);
    },
    muralhunt: p => {
      Px.rect(p, 2, 4, 28, 24, 'Y'); Px.rect(p, 2, 4, 28, 2, 'n'); Px.rect(p, 2, 26, 28, 2, 'n');
      Px.ellipse(p, 12, 18, 6, 3, 'R'); Px.rect(p, 7, 20, 1, 4, 'R'); Px.rect(p, 16, 20, 1, 4, 'R'); Px.rect(p, 17, 13, 2, 5, 'R');
      Px.rect(p, 11, 11, 2, 5, 'k'); p(12, 10, 'k');
      for (let i = 0; i < 7; i++) p(14 + i, 12 - Math.round(i / 3), 'k');
      Px.ellipse(p, 24, 20, 3, 2, 'o'); p(26, 17, 'o'); p(22, 17, 'o');
      eyes(p, 20, 25, 7);
    },
    incense: p => {
      Px.rect(p, 12, 25, 8, 5, 'o'); Px.ellipse(p, 16, 25, 7, 2, 'y');
      Px.ellipse(p, 16, 18, 9, 7, 'y'); Px.ellipse(p, 16, 10, 7, 6, 'y');
      [[11, 8], [16, 6], [21, 8], [13, 12], [19, 12]].forEach(([x, y]) => Px.ellipse(p, x, y, 2, 2, 'o'));
      Px.rect(p, 15, 1, 2, 4, 'o');
      eyes(p, 12, 18, 16); mouth(p, 15, 21);
    },
    goldcrown: p => {
      Px.rect(p, 4, 20, 24, 6, 'y'); Px.rect(p, 4, 22, 24, 1, 'o');
      [[6, 4], [16, 2], [26, 4]].forEach(([x, y]) => { Px.rect(p, x - 1, y, 3, 18, 'y'); Px.rect(p, x - 4, y + 6, 3, 2, 'y'); Px.rect(p, x + 2, y + 6, 3, 2, 'y'); Px.rect(p, x - 4, y + 11, 3, 2, 'y'); Px.rect(p, x + 2, y + 11, 3, 2, 'y'); });
      [[8, 27], [16, 28], [24, 27], [12, 14], [20, 14]].forEach(([x, y]) => { p(x, y, 'e'); p(x, y - 1, 'e'); });
      eyes(p, 11, 19, 21);
    },
    ironarmor: p => {
      Px.poly(p, [[8, 4], [24, 4], [28, 12], [26, 28], [6, 28], [4, 12]], 'G');
      for (let y = 8; y < 28; y += 5) Px.rect(p, 6, y, 20, 1, 'g');
      for (let x = 8; x < 26; x += 5) for (let y = 6; y < 28; y += 5) p(x, y, 'l');
      Px.rect(p, 12, 2, 8, 3, 'G');
      eyes(p, 11, 19, 12); mouth(p, 15, 18);
    },
    dabotap: p => {
      Px.rect(p, 4, 26, 24, 4, 'g'); Px.rect(p, 7, 18, 18, 8, 'l');
      Px.rect(p, 9, 20, 2, 6, 'g'); Px.rect(p, 21, 20, 2, 6, 'g');
      Px.rect(p, 5, 16, 22, 2, 'g'); Px.rect(p, 10, 10, 12, 6, 'l'); Px.rect(p, 8, 9, 16, 2, 'g');
      Px.ellipse(p, 16, 6, 4, 3, 'l'); Px.rect(p, 15, 1, 2, 4, 'G');
      eyes(p, 12, 18, 20);
    },
    bell: p => {
      Px.rect(p, 13, 1, 6, 4, 'E');
      Px.poly(p, [[10, 4], [22, 4], [26, 26], [6, 26]], 'e');
      Px.rect(p, 6, 26, 20, 3, 'E');
      Px.rect(p, 8, 9, 16, 1, 'f'); Px.rect(p, 7, 22, 18, 1, 'f');
      Px.ellipse(p, 16, 17, 3, 3, 'f');
      eyes(p, 11, 19, 12); mouth(p, 15, 19);
    },
    celadon: p => {
      Px.ellipse(p, 16, 20, 9, 9, 'c'); Px.rect(p, 13, 3, 6, 9, 'c'); Px.rect(p, 12, 2, 8, 2, 'c');
      Px.ellipse(p, 16, 12, 5, 3, 'c');
      [[10, 22], [22, 22], [16, 26]].forEach(([x, y]) => { p(x, y, 'w'); p(x + 1, y, 'k'); p(x, y + 1, 'k'); });
      Px.ellipse(p, 12, 16, 2, 3, 'w');
      eyes(p, 12, 18, 17);
    },
    whiteporcelain: p => {
      Px.ellipse(p, 16, 19, 11, 10, 'w'); Px.rect(p, 11, 4, 10, 6, 'w'); Px.rect(p, 10, 3, 12, 2, 'l');
      Px.ellipse(p, 21, 22, 3, 3, 'u'); p(20, 21, 'c');
      eyes(p, 11, 18, 15); mouth(p, 14, 21);
    },
    metaltype: p => {
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { Px.rect(p, 4 + i * 9, 4 + j * 9, 8, 8, 'G'); Px.rect(p, 5 + i * 9, 5 + j * 9, 6, 6, 'g'); Px.rect(p, 6 + i * 9, 7 + j * 9, 4, 1, 'k'); Px.rect(p, 7 + i * 9, 6 + j * 9, 1, 4, 'k'); }
      Px.rect(p, 13, 13, 8, 8, 'l');
      eyes(p, 14, 18, 15);
    },
    tripitaka: p => {
      Px.rect(p, 2, 8, 28, 18, 'n'); Px.rect(p, 2, 8, 3, 18, 'b'); Px.rect(p, 27, 8, 3, 18, 'b');
      for (let y = 11; y < 24; y += 3) for (let x = 7; x < 25; x += 3) p(x, y, 'B');
      Px.rect(p, 10, 13, 13, 6, 'n');
      eyes(p, 12, 18, 13); mouth(p, 15, 18);
    },
    hunmin: p => {
      Px.rect(p, 5, 3, 22, 27, 'u'); Px.rect(p, 7, 5, 18, 23, 'Y');
      Px.rect(p, 9, 7, 5, 1, 'k'); Px.rect(p, 13, 7, 1, 5, 'k');
      Px.rect(p, 17, 7, 1, 6, 'k'); Px.rect(p, 18, 9, 3, 1, 'k');
      Px.rect(p, 10, 22, 12, 1, 'k'); Px.ellipse(p, 16, 25, 2, 1, 'k');
      eyes(p, 12, 18, 14);
    },
    raingauge: p => {
      Px.rect(p, 5, 24, 22, 6, 'g'); Px.rect(p, 6, 25, 20, 1, 'l');
      Px.rect(p, 10, 4, 12, 20, 'e'); Px.rect(p, 9, 8, 14, 2, 'E'); Px.rect(p, 9, 16, 14, 2, 'E');
      Px.rect(p, 10, 4, 12, 2, 'c');
      [[6, 1], [14, 0], [24, 2]].forEach(([x, y]) => { p(x, y, 'c'); p(x, y + 1, 'c'); });
      eyes(p, 12, 18, 10);
    },
    turtleship: p => {
      Px.ellipse(p, 16, 22, 14, 6, 'b'); Px.rect(p, 2, 22, 28, 4, 'B');
      Px.ellipse(p, 15, 17, 11, 6, 'G');
      for (let x = 6; x < 25; x += 3) { p(x, 14, 'l'); p(x + 1, 13, 'l'); }
      Px.ellipse(p, 28, 16, 3, 3, 'y'); p(29, 15, 'k'); Px.rect(p, 30, 17, 2, 1, 'r');
      for (let x = 5; x < 26; x += 4) p(x, 23, 'k');
      eyes(p, 11, 17, 17);
    },
    geojunggi: p => {
      Px.rect(p, 4, 4, 2, 26, 'b'); Px.rect(p, 26, 4, 2, 26, 'b'); Px.rect(p, 4, 4, 24, 2, 'b');
      Px.rect(p, 15, 6, 2, 10, 'Y');
      Px.ellipse(p, 16, 21, 8, 6, 'g'); Px.ellipse(p, 14, 19, 3, 2, 'l');
      Px.ellipse(p, 10, 8, 2, 2, 'n'); Px.ellipse(p, 22, 8, 2, 2, 'n');
      eyes(p, 12, 18, 20);
    },
    daedong: p => {
      Px.rect(p, 3, 3, 26, 26, 'Y');
      for (let x = 3; x < 29; x += 6) Px.rect(p, x, 3, 1, 26, 'n');
      Px.poly(p, [[14, 6], [20, 8], [22, 16], [19, 26], [12, 24], [10, 14]], 'f');
      Px.rect(p, 12, 12, 1, 8, 'u'); Px.rect(p, 18, 10, 1, 9, 'u');
      eyes(p, 13, 18, 14);
    },
    ssireum: p => {
      Px.rect(p, 2, 3, 28, 26, 'Y'); Px.rect(p, 2, 3, 28, 1, 'n'); Px.rect(p, 2, 28, 28, 1, 'n');
      Px.ellipse(p, 12, 16, 3, 3, 's'); Px.ellipse(p, 19, 16, 3, 3, 's'); Px.rect(p, 10, 19, 12, 6, 'w');
      Px.rect(p, 11, 12, 2, 2, 'k'); Px.rect(p, 18, 12, 2, 2, 'k');
      for (let x = 4; x < 28; x += 4) { Px.ellipse(p, x, 7, 1, 1, 'k'); }
      eyes(p, 13, 18, 22);
    },
    declaration: p => {
      Px.rect(p, 5, 2, 22, 28, 'w'); Px.rect(p, 5, 2, 22, 2, 'l');
      for (let y = 6; y < 28; y += 3) for (let x = 24; x > 7; x -= 3) Px.rect(p, x, y, 1, 2, 'G');
      Px.rect(p, 9, 12, 14, 7, 'w');
      eyes(p, 12, 18, 13); mouth(p, 15, 17);
    },
    taegeukgi: p => {
      Px.rect(p, 3, 1, 2, 30, 'b');
      Px.rect(p, 5, 3, 25, 18, 'w');
      // 태극: 지름은 왼쪽 위→오른쪽 아래 대각선, 위쪽 빨강·아래쪽 파랑, 왼쪽 작은 원 빨강·오른쪽 작은 원 파랑
      const ca = Math.cos(0.588), sa = Math.sin(0.588);
      for (let y = 6; y <= 18; y++) for (let x = 11; x <= 23; x++) {
        const dx = x - 17, dy = y - 12; if (dx * dx + dy * dy > 30) continue;
        const u = dx * ca + dy * sa, v = -dx * sa + dy * ca;
        const inL = (u + 2.75) ** 2 + v * v <= 7.6, inR = (u - 2.75) ** 2 + v * v <= 7.6;
        p(x, y, inL ? 'r' : inR ? 'u' : (v < 0 ? 'r' : 'u'));
      }
      // 4괘 (작게): 건 왼쪽 위, 감 오른쪽 위, 리 왼쪽 아래, 곤 오른쪽 아래 — 대각선에 수직인 짧은 막대
      [[8, 6, 1], [26, 6, -1], [8, 17, -1], [26, 17, 1]].forEach(([x, y, s]) => { for (let k = -1; k <= 1; k++) { p(x + k, y - k * s, 'k'); p(x + k + 1, y - k * s + s, 'k'); } });
      eyes(p, 13, 19, 22);
    },
    malmoi: p => {
      Px.rect(p, 4, 4, 24, 24, 'Y'); Px.rect(p, 6, 6, 24, 24, 'w');
      for (let y = 10; y < 28; y += 4) Px.rect(p, 9, y, 18, 1, 'g');
      Px.rect(p, 9, 8, 3, 1, 'k'); Px.rect(p, 11, 8, 1, 3, 'k'); Px.rect(p, 14, 8, 3, 3, 'k');
      eyes(p, 14, 20, 15);
    },
    timeking: p => {
      Px.ellipse(p, 16, 18, 14, 12, 'p'); Px.ellipse(p, 16, 16, 10, 8, 'R');
      for (let x = 3; x < 30; x += 4) Px.poly(p, [[x, 8], [x + 2, 2], [x + 4, 8]], 'p');
      Px.rect(p, 9, 13, 5, 4, 'Y'); Px.rect(p, 18, 13, 5, 4, 'Y'); p(11, 14, 'k'); p(20, 14, 'k');
      Px.rect(p, 11, 22, 10, 2, 'k'); p(12, 23, 'w'); p(19, 23, 'w');
      Px.ellipse(p, 16, 28, 9, 2, 'U');
    }
  };
  for (const id in MON) {
    Px.draw(scene, 'mon_' + id, 32, 32, (p, ctx) => { MON[id](p); Px.outline(ctx, 32, 32); });
    Px.draw(scene, 'mon_' + id + '_s', 32, 32, (p, ctx) => { MON[id](p); Px.outline(ctx, 32, 32); }, SHINY);
  }
});
