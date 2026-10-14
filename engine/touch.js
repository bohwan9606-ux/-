// ─────────────────────────────────────────────
// 태블릿용 화면 버튼
// 터치 화면이면 왼쪽에 방향 버튼, 오른쪽에 A(결정)·B(취소)·메뉴 버튼을 보여 줌.
// 버튼은 키보드를 누른 것과 똑같은 신호를 보내므로 게임 코드는 그대로 동작함.
// 주소 뒤에 ?touch=1 을 붙이면 컴퓨터에서도 버튼이 보이고, ?touch=0 이면 숨김.
// ─────────────────────────────────────────────
HG.Touch = {
  on: false,
  // 화면 글자 바꾸기: 키보드 이름 → 버튼 이름
  label(s) {
    if (!HG.Touch.on || typeof s !== 'string') return s;
    return s.replace(/아무 키나 누르세요/g, '화면이나 A 버튼을 누르세요').replace(/스페이스\/Z\/엔터/g, 'A').replace(/X\/백스페이스/g, 'B')
      .replace(/메뉴\(Esc\)/g, '메뉴 버튼').replace(/Esc 메뉴/g, '메뉴 버튼').replace(/Esc/g, '메뉴')
      .replace(/스페이스바/g, 'A').replace(/스페이스/g, 'A')
      .replace(/X를 눌러/g, 'B를 눌러').replace(/X를 누른 채 방향키/g, 'B를 누른 채 방향 버튼').replace(/X: 취소/g, 'B: 취소').replace(/X 힌트/g, 'B 힌트').replace(/X를 눌러 보/g, 'B를 눌러 보').replace(/X 처음부터/g, 'B 처음부터')
      .replace(/방향키/g, '방향 버튼');
  },

  init() {
    const q = new URLSearchParams(location.search).get('touch');
    if (q === '0') return;
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (q === '1' || coarse) this.enable();
    else window.addEventListener('touchstart', () => this.enable(), { once: true, passive: true });
  },

  enable() {
    if (this.on) return;
    this.on = true;
    document.body.classList.add('touch');
    const css = document.createElement('style');
    css.textContent = `
      body.touch { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
      body.touch #game { position: absolute; }
      .tc { position: fixed; z-index: 5; touch-action: none; -webkit-tap-highlight-color: transparent; }
      .tc-pad { border-radius: 50%; background: rgba(233,226,208,.07); }
      .tc-arm { position: absolute; background: rgba(78,74,67,.85); border: 3px solid #1a1410; box-sizing: border-box; display: flex; align-items: center; justify-content: center; color: #e9e2d0; font: 700 22px Galmuri11, sans-serif; }
      .tc-arm.on, .tc-btn.on { background: rgba(220,188,72,.95); color: #1a1410; }
      .tc-mid { position: absolute; background: rgba(78,74,67,.85); }
      .tc-btn { border-radius: 50%; background: rgba(191,68,54,.85); border: 3px solid #1a1410; box-sizing: border-box; color: #e9e2d0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: Galmuri11, sans-serif; line-height: 1.05; }
      .tc-btn b { font-size: 1.5em; }
      .tc-btn small { font-size: .62em; opacity: .9; }
      .tc-btn.b { background: rgba(58,106,168,.85); }
      .tc-btn.menu { border-radius: 14px; background: rgba(78,74,67,.85); }
      #tc-rotate { position: fixed; inset: 0; z-index: 30; background: #12100e; color: #e9e2d0; display: none; align-items: center; justify-content: center; flex-direction: column; font: 22px Galmuri11, sans-serif; text-align: center; gap: 16px; }
      #tc-rotate .ph { width: 70px; height: 110px; border: 5px solid #e9e2d0; border-radius: 12px; animation: tcrot 1.8s ease-in-out infinite; }
      @keyframes tcrot { 0%, 30% { transform: rotate(0); } 60%, 100% { transform: rotate(-90deg); } }
    `;
    document.head.appendChild(css);
    this.build();
    this.layout();
    window.addEventListener('resize', () => this.layout());
    window.addEventListener('orientationchange', () => setTimeout(() => this.layout(), 200));
    // 길게 눌렀을 때 뜨는 메뉴, 두 번 탭 확대 막기
    document.addEventListener('contextmenu', e => { if (e.target.closest && e.target.closest('.tc, #game')) e.preventDefault(); });
    document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });
    // 연타 중: 화면(방향 버튼·A·B·메뉴 버튼 말고) 어디를 눌러도 스페이스 한 번
    document.addEventListener('pointerdown', e => {
      if (!this.mash || (e.target.closest && e.target.closest('.tc, #tc-rotate, form'))) return;
      e.preventDefault(); this.key('Space', true); setTimeout(() => this.key('Space', false), 25);
    }, { passive: false });
    // 이미 만들어진 글자도 버튼 이름으로
    if (HG.game) HG.game.scene.getScenes(true).forEach(sc => sc.children && sc.children.list.forEach(o => { if (o.type === 'Text') o.setText(HG.Touch.label(o.text)); }));
  },

  // 연타 게임(씨름·막집 짓기 등) 동안에는 화면 아무 곳이나 톡톡 쳐도 A(스페이스)로 인정
  mash: false,
  mashOn() { this.mash = true; },
  mashOff() { this.mash = false; },

  // 키 신호 보내기
  key(code, down) {
    window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code, key: code === 'Space' ? ' ' : code, bubbles: true, cancelable: true }));
  },

  build() {
    const mk = (cls, html) => { const d = document.createElement('div'); d.className = cls; if (html) d.innerHTML = html; document.body.appendChild(d); return d; };
    // 방향 버튼 (하나의 판에서 손가락 위치로 방향을 정함 → 손가락을 미끄러뜨려도 됨)
    const pad = this.pad = mk('tc tc-pad');
    this.arms = {};
    [['up', '▲'], ['down', '▼'], ['left', '◀'], ['right', '▶']].forEach(([d, s]) => { const a = document.createElement('div'); a.className = 'tc-arm'; a.textContent = s; pad.appendChild(a); this.arms[d] = a; });
    const mid = document.createElement('div'); mid.className = 'tc-mid'; pad.appendChild(mid); this.mid = mid;
    const CODE = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
    let cur = null, pid = null;
    const set = d => {
      if (d === cur) return;
      if (cur) { this.key(CODE[cur], false); this.arms[cur].classList.remove('on'); }
      cur = d;
      if (cur) { this.key(CODE[cur], true); this.arms[cur].classList.add('on'); }
    };
    const dirAt = e => {
      const r = pad.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < r.width * 0.12) return cur;          // 가운데는 그대로 유지
      return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    };
    pad.addEventListener('pointerdown', e => { e.preventDefault(); pid = e.pointerId; pad.setPointerCapture(pid); set(dirAt(e)); });
    pad.addEventListener('pointermove', e => { if (e.pointerId === pid) set(dirAt(e)); });
    const up = e => { if (e.pointerId === pid) { pid = null; set(null); } };
    pad.addEventListener('pointerup', up); pad.addEventListener('pointercancel', up); pad.addEventListener('lostpointercapture', up);

    // A · B · 메뉴
    const btn = (cls, html, code) => {
      const b = mk('tc tc-btn ' + cls, html);
      let p = null;
      b.addEventListener('pointerdown', e => { e.preventDefault(); p = e.pointerId; b.setPointerCapture(p); b.classList.add('on'); this.key(code, true); });
      const rel = e => { if (e.pointerId !== p) return; p = null; b.classList.remove('on'); this.key(code, false); };
      b.addEventListener('pointerup', rel); b.addEventListener('pointercancel', rel); b.addEventListener('lostpointercapture', rel);
      return b;
    };
    this.bA = btn('a', '<b>A</b><small>결정</small>', 'Space');
    this.bB = btn('b', '<b>B</b><small>취소·달리기</small>', 'KeyX');
    this.bM = btn('menu', '<small>메뉴</small>', 'Escape');

    this.rot = mk('', '<div class="ph"></div><div>태블릿을 가로로 돌려 주세요</div>');
    this.rot.id = 'tc-rotate';
  },

  // 화면 크기에 맞춰 게임 화면과 버튼 자리 정하기
  layout() {
    const W = window.innerWidth, H = window.innerHeight;
    this.rot.style.display = H > W * 1.05 ? 'flex' : 'none';
    const b = Math.round(Math.max(46, Math.min(86, Math.min(W, H) * 0.115)));   // 버튼 한 칸 크기
    const pad = 12, ctrlW = b * 3 + pad * 2, ctrlH = b * 3 + pad * 2;
    // ① 아래쪽에 버튼 띠  ② 양옆에 버튼 기둥 — 게임 화면이 더 크게 나오는 쪽을 고름
    const gwBottom = Math.min(W, (H - ctrlH) * 16 / 9);
    const gwSide = Math.min(W - ctrlW * 2, H * 16 / 9);
    const g = document.getElementById('game');
    let gw, gh, gx, gy, cy;
    if (gwBottom >= gwSide) {
      gw = gwBottom; gh = gw * 9 / 16; gx = (W - gw) / 2; gy = Math.max(0, (H - ctrlH - gh) / 2);
      cy = Math.min(H - pad - b * 1.5, gy + gh + pad + b * 1.5);
    } else {
      gw = gwSide; gh = gw * 9 / 16; gx = (W - gw) / 2; gy = (H - gh) / 2;
      cy = Math.max(H / 2, H - pad - b * 1.5 - (H - gh) / 4);
    }
    Object.assign(g.style, { left: gx + 'px', top: gy + 'px', width: gw + 'px', height: gh + 'px' });
    // 방향 버튼
    const P = this.pad.style, S = b * 3;
    Object.assign(P, { left: pad + 'px', top: (cy - S / 2) + 'px', width: S + 'px', height: S + 'px' });
    const place = (el, x, y, w, h) => Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
    place(this.arms.up, b, 0, b, b * 1.1); place(this.arms.down, b, b * 1.9, b, b * 1.1);
    place(this.arms.left, 0, b, b * 1.1, b); place(this.arms.right, b * 1.9, b, b * 1.1, b);
    place(this.mid, b, b, b, b);
    // A · B · 메뉴
    const A = b * 1.3, Bs = b * 1.15;
    const ax = W - pad - A, ay = cy - A * 0.75;
    place(this.bA, ax, ay, A, A); this.bA.style.fontSize = Math.round(b * 0.3) + 'px';
    place(this.bB, ax - Bs - b * 0.25, ay + A * 0.55, Bs, Bs); this.bB.style.fontSize = Math.round(b * 0.27) + 'px';
    place(this.bM, W - pad - b * 1.4, Math.max(4, ay - b * 0.95), b * 1.4, b * 0.6); this.bM.style.fontSize = Math.round(b * 0.36) + 'px';
    if (HG.game && HG.game.scale) HG.game.scale.refresh();
  }
};
window.addEventListener('load', () => HG.Touch.init());
