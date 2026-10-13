// 시간 조각 대모험 — 엔진 공용 도구
// 모든 스테이지가 같이 쓰는 상수, 상태, 도우미 함수
window.HG = window.HG || {};

HG.W = 320;          // 내부 화면 너비 (픽셀)
HG.H = 180;          // 내부 화면 높이
HG.T = 16;           // 타일 한 칸 크기
HG.FONT = 'Galmuri11';
HG.FONT_S = 'Galmuri9';

// 색 팔레트 (모든 그림이 이 색만 씀 → 나중에 아이들 그림도 이 색으로 맞춤)
HG.PAL = {
  '.': null,
  'k': '#1a1410', // 검정(외곽선)
  'w': '#e9e2d0', // 흰색
  'g': '#7d776c', // 회색
  'G': '#4e4a43', // 진회색
  'l': '#b3ac9c', // 연회색
  'b': '#5e4229', // 갈색
  'B': '#3f2b1c', // 진갈색
  'n': '#94704a', // 연갈색(가죽)
  's': '#e8bf98', // 피부
  'S': '#c48e62', // 피부 그림자
  'r': '#bf4436', // 빨강
  'R': '#7d2a22', // 진빨강
  'o': '#d97d2c', // 주황
  'y': '#dcbc48', // 노랑
  'Y': '#e3d49a', // 연노랑
  'e': '#4a8a3a', // 초록
  'E': '#2c5a2a', // 진초록
  'f': '#6fa04a', // 연초록
  'u': '#3a6aa8', // 파랑
  'U': '#25416a', // 진파랑
  'c': '#7fb0c8', // 하늘
  'p': '#86549f', // 보라
  'P': '#d684aa'  // 분홍
};

HG.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
HG.rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
HG.pick = arr => arr[Math.floor(Math.random() * arr.length)];
HG.shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// 스테이지 등록소 — 각 stages/폴더의 stage.js가 여기에 자기 내용을 등록함
HG.stages = {};
HG.registerStage = function (stage) { HG.stages[stage.id] = stage; };

// 지도 등록소 (모든 스테이지의 지도가 id로 모임)
HG.maps = {};

// 게임 진행 상태 (저장되는 것)
HG.newState = function () {
  return {
    version: HG.SAVE_VERSION,
    player: { name: '나', look: 0, map: 'lab', x: 5, y: 5, dir: 'down' },
    era: 'paleolithic',
    party: [],
    box: [],
    dex: { seen: {}, caught: {} },
    bag: { meat: 2 },
    flags: {},
    stamps: [],
    titles: [],
    title: '',
    stats: { playMs: 0, battles: 0, wins: 0, hunts: 0, steps: 0 },
    settings: { sound: true, music: true },
    createdAt: Date.now()
  };
};
HG.state = null;

// 유물 동료 하나 만들기
HG.makeMon = function (species, level, opts) {
  opts = opts || {};
  const sp = HG.ARTIFACTS[species];
  const m = { species: species, level: level, exp: HG.expFor(level), shiny: !!opts.shiny, moves: [], buffs: null };
  m.moves = HG.movesAt(species, level);
  m.hp = HG.stat(m, 'hp');
  return m;
};
HG.expFor = lv => Math.floor(lv * lv * lv * 0.8);
HG.stat = function (m, key) {
  const base = HG.ARTIFACTS[m.species].base[key];
  const shinyBonus = m.shiny ? 1.1 : 1;
  if (key === 'hp') return Math.floor((base * 2 * m.level) / 20 + m.level + 10);
  return Math.floor(((base * 2 * m.level) / 20 + 5) * shinyBonus);
};
HG.movesAt = function (species, level) {
  const learn = HG.ARTIFACTS[species].learn;
  const ms = learn.filter(l => l[0] <= level).map(l => l[1]);
  return ms.slice(-4);
};
HG.monName = m => HG.ARTIFACTS[m.species].name + (m.shiny ? '★' : '');

// 칭호 주기
HG.giveTitle = function (t) {
  if (!HG.state.titles.includes(t)) HG.state.titles.push(t);
  HG.state.title = t;
};

// 받침 유무에 따라 조사 고르기: HG.josa('주먹도끼','이','가')
HG.josa = function (word, a, b) {
  const ch = word.replace(/★$/, '').charCodeAt(word.replace(/★$/, '').length - 1);
  if (ch < 0xAC00 || ch > 0xD7A3) return b;
  return ((ch - 0xAC00) % 28) ? a : b;
};
HG.fill = function (text) {
  // 대사 속 {name} 을 주인공 이름으로 바꿈
  const t = text.replace(/\{name\}/g, HG.state ? HG.state.player.name : '나')
             .replace(/\{rival\}/g, '하람');
  return HG.Touch ? HG.Touch.label(t) : t;
};

// 지도 만들기 도우미 — 글자 지도를 코드로 그림
// 글자: . 풀  " 꽃  , 긴풀(유물이 튀어나옴)  : 길  s 모래  ~ 물  T 나무  o 바위
//       # 절벽·동굴벽  _ 동굴바닥  D 동굴입구  P 동굴벽화  b 뼈  L 연구실바닥  W 연구실벽  S 선반  K 책상
HG.MapBuilder = class {
  constructor(w, h, fill) { this.w = w; this.h = h; this.g = []; for (let y = 0; y < h; y++) this.g.push(new Array(w).fill(fill || '.')); }
  set(x, y, ch) { if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.g[y][x] = ch; return this; }
  rect(x, y, w, h, ch) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, ch); return this; }
  border(ch) { this.rect(0, 0, this.w, 1, ch).rect(0, this.h - 1, this.w, 1, ch).rect(0, 0, 1, this.h, ch).rect(this.w - 1, 0, 1, this.h, ch); return this; }
  dots(list, ch) { list.forEach(([x, y]) => this.set(x, y, ch)); return this; }
  rows() { return this.g.map(r => r.join('')); }
};
HG.TILES = {
  '.': { tex: 't_grass' }, '"': { tex: 't_grass2' }, ',': { tex: 't_tall', grass: true },
  ':': { tex: 't_path' }, 's': { tex: 't_sand' }, '~': { tex: 't_water0', solid: true, water: true },
  'T': { tex: 't_tree', solid: true }, 'o': { tex: 't_rock', solid: true },
  '#': { tex: 't_cliff', solid: true }, '_': { tex: 't_cavefloor' }, 'D': { tex: 't_cavedoor' },
  'P': { tex: 't_cavepaint', solid: true }, 'b': { tex: 't_bones' },
  'L': { tex: 't_labfloor' }, 'W': { tex: 't_labwall', solid: true }, 'S': { tex: 't_shelf', solid: true }, 'K': { tex: 't_desk', solid: true }
};
// 물건 크기(칸)와 막힘
HG.OBJECTS = {
  hut: { tex: 'o_hut', w: 2, h: 2 },
  fire: { tex: 'o_fire0', anim: ['o_fire0', 'o_fire1'], w: 1, h: 1 },
  sign: { tex: 'o_sign', w: 1, h: 1 },
  bush: { tex: 'o_bush', w: 1, h: 1 },
  timemachine: { tex: 'timemachine', w: 2, h: 2 }
};
HG.dev = { god: false };

// 배틀 밖에서 경험치 주기 (사냥 등). 오른 레벨과 새로 배운 기술을 돌려줌
HG.gainExp = function (m, g) {
  const out = { levels: 0, learned: [] };
  m.exp += g;
  while (m.level < 50 && m.exp >= HG.expFor(m.level + 1)) {
    const oldMax = HG.stat(m, 'hp');
    m.level++; out.levels++;
    m.hp += HG.stat(m, 'hp') - oldMax;
    HG.ARTIFACTS[m.species].learn.filter(l => l[0] === m.level).forEach(l => {
      if (m.moves.includes(l[1])) return;
      if (m.moves.length >= 4) m.moves.shift();
      m.moves.push(l[1]); out.learned.push(l[1]);
    });
  }
  return out;
};
