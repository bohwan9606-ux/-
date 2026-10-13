// 화면 도구 — 키 입력, 창, 대화창, 선택 메뉴
// 키: 방향키 이동, 스페이스/Z/엔터 = 확인, X/백스페이스 = 취소, Esc = 메뉴
HG.KEYMAP = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right',
  Space: 'ok', KeyZ: 'ok', Enter: 'ok', NumpadEnter: 'ok',
  KeyX: 'cancel', Backspace: 'cancel',
  Escape: 'menu', KeyC: 'menu'
};

// 장면마다 하나씩: 맨 위에 있는 처리기만 키를 받음
HG.Keys = class {
  constructor(scene) {
    this.scene = scene;
    this.stack = [];
    this.down = {};
    this._onDown = e => {
      if (HG.Keys.typing) return;
      const act = HG.KEYMAP[e.code];
      if (e.code === 'F9' || (e.ctrlKey && e.shiftKey && e.code === 'KeyD')) { e.preventDefault(); HG.Dev && HG.Dev.open(scene); return; }
      if (!act) return;
      e.preventDefault();
      HG.Sound.resume();
      if (!this.down[e.code]) {
        this.down[e.code] = true;
        const top = this.stack[this.stack.length - 1];
        if (top && scene.scene.isActive()) top(act, e);
      }
    };
    this._onUp = e => { this.down[e.code] = false; };
    window.addEventListener('keydown', this._onDown);
    window.addEventListener('keyup', this._onUp);
    scene.events.once('shutdown', () => this.destroy());
    scene.events.once('destroy', () => this.destroy());
  }
  push(fn) { this.stack.push(fn); return fn; }
  pop(fn) { const i = this.stack.lastIndexOf(fn); if (i >= 0) this.stack.splice(i, 1); }
  // 계속 누르고 있는 방향 (걷기용)
  held() {
    const d = this.down;
    if (d.ArrowUp || d.KeyW) return 'up';
    if (d.ArrowDown || d.KeyS) return 'down';
    if (d.ArrowLeft || d.KeyA) return 'left';
    if (d.ArrowRight || d.KeyD) return 'right';
    return null;
  }
  isHeld(act) { for (const c in this.down) if (this.down[c] && HG.KEYMAP[c] === act) return true; return false; }
  destroy() { window.removeEventListener('keydown', this._onDown); window.removeEventListener('keyup', this._onUp); this.stack = []; }
};
HG.Keys.typing = false;

HG.UI = {
  // 게임보이 느낌 창
  box(scene, x, y, w, h, depth) {
    const g = scene.add.graphics().setScrollFactor(0).setDepth(depth || 1000);
    g.fillStyle(0xe9e2d0, 1).fillRect(x, y, w, h);
    g.lineStyle(1, 0x1a1410, 1).strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    g.lineStyle(1, 0x6b4a2b, 1).strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
    return g;
  },
  text(scene, x, y, str, opts) {
    opts = opts || {};
    if (HG.Touch) str = HG.Touch.label(str);
    const t = scene.add.text(x, y, str, {
      fontFamily: opts.small ? HG.FONT_S : HG.FONT,
      fontSize: opts.small ? '10px' : '12px',
      color: opts.color || '#1a1410',
      align: opts.align || 'left',
      lineSpacing: opts.lineSpacing != null ? opts.lineSpacing : 3,
      wordWrap: opts.wrap ? { width: opts.wrap, useAdvancedWrap: true } : undefined,
      stroke: opts.stroke, strokeThickness: opts.stroke ? 3 : 0
    }).setScrollFactor(0).setDepth(opts.depth || 1001);
    if (opts.origin != null) t.setOrigin(opts.origin, 0);
    return t;
  },
  wait(scene, ms) { return new Promise(r => scene.time.delayedCall(ms, r)); }
};

// ── 대화창: await dlg.say('문장', '문장'...) / await dlg.choose('질문', ['예','아니오'])
HG.UI.Dialog = class {
  constructor(scene, keys) {
    this.scene = scene; this.keys = keys;
    this.objs = [];
  }
  _open() {
    if (this.objs.length) return;
    const s = this.scene;
    const bx = 4, by = HG.H - 50, bw = HG.W - 8, bh = 46;
    this.objs.push(HG.UI.box(s, bx, by, bw, bh, 2000));
    this.txt = HG.UI.text(s, bx + 9, by + 7, '', { wrap: bw - 22, depth: 2001 });
    this.arrow = HG.UI.text(s, bx + bw - 14, by + bh - 15, '▼', { depth: 2001, small: true });
    this.arrow.setVisible(false);
    this.objs.push(this.txt, this.arrow);
    this.arrowTween = s.tweens.add({ targets: this.arrow, y: this.arrow.y + 2, yoyo: true, repeat: -1, duration: 300 });
  }
  close() {
    if (this.arrowTween) this.arrowTween.remove();
    this.objs.forEach(o => o.destroy()); this.objs = [];
  }
  // 긴 문장은 두 줄씩 페이지로 나눔
  _pages(str) {
    this.txt.setText(str);
    const lines = this.txt.getWrappedText(str);
    const pages = [];
    for (let i = 0; i < lines.length; i += 2) pages.push(lines.slice(i, i + 2).join('\n'));
    return pages;
  }
  async say(...lines) {
    this._open();
    for (const raw of lines.flat()) {
      for (const page of this._pages(HG.fill(raw))) await this._type(page, true);
    }
    this.close();
  }
  // 대화창을 닫지 않고 한 줄 (선택지 앞 질문용)
  async _type(page, waitKey) {
    const s = this.scene;
    this.arrow.setVisible(false);
    let shown = 0, skip = false, done = false;
    this.txt.setText('');
    await new Promise(res => {
      const h = this.keys.push(act => { if (act === 'ok' || act === 'cancel') { if (!done) skip = true; else { this.keys.pop(h); HG.Sound.sfx('cursor'); res(); } } });
      const ev = s.time.addEvent({
        delay: 14, loop: true, callback: () => {
          if (skip) shown = page.length; else shown++;
          this.txt.setText(page.slice(0, shown));
          if (shown % 3 === 0) HG.Sound.sfx('talk');
          if (shown >= page.length) {
            ev.remove(); done = true;
            if (!waitKey) { this.keys.pop(h); res(); } else this.arrow.setVisible(true);
          }
        }
      });
    });
  }
  async choose(question, options, cancelIndex, extra) {
    this._open();
    const pages = this._pages(HG.fill(question));
    for (let i = 0; i < pages.length - 1; i++) await this._type(pages[i], true);
    await this._type(pages[pages.length - 1], false);
    const idx = await HG.UI.choice(this.scene, this.keys, options, Object.assign({ x: HG.W - 8, y: HG.H - 54, alignRight: true, cancelIndex: cancelIndex, noCancel: cancelIndex === 'none' }, extra || {}));
    this.close();
    return idx;
  }
};

// ── 선택 메뉴: 고른 번호를 돌려줌 (취소하면 cancelIndex 또는 -1)
HG.UI.choice = function (scene, keys, options, o) {
  o = o || {};
  return new Promise(res => {
    const lineH = 15;
    const tmp = options.map(op => HG.UI.text(scene, 0, 0, op));
    const w = Math.max(...tmp.map(t => t.width)) + 26; tmp.forEach(t => t.destroy());
    const bh = options.length * lineH + 10;
    const x = o.alignRight ? o.x - w : o.x, y = o.alignRight ? o.y - bh : o.y;
    const depth = o.depth || 2100;
    const box = HG.UI.box(scene, x, y, w, bh, depth);
    const items = options.map((op, i) => HG.UI.text(scene, x + 16, y + 6 + i * lineH, op, { depth: depth + 1 }));
    const cur = HG.UI.text(scene, x + 6, y + 6, '▶', { depth: depth + 1 });
    // noDefault: 처음엔 아무것도 골라져 있지 않음 → 방향키로 먼저 골라야 함 (퀴즈에서 엔터 연타로 1번이 골라지는 것 방지)
    let i = o.noDefault ? -1 : (o.start || 0);
    let hint = null;
    const draw = () => { cur.setVisible(i >= 0); if (i >= 0) cur.y = y + 6 + i * lineH; if (o.onMove && i >= 0) o.onMove(i); };
    draw();
    const openedAt = Date.now();
    const finish = v => { keys.pop(h); box.destroy(); items.forEach(t => t.destroy()); cur.destroy(); if (hint) hint.destroy(); res(v); };
    const h = keys.push(act => {
      const n = options.length;
      if (act === 'up') { i = i < 0 ? 0 : (i + n - 1) % n; HG.Sound.sfx('cursor'); draw(); }
      else if (act === 'down') { i = i < 0 ? 0 : (i + 1) % n; HG.Sound.sfx('cursor'); draw(); }
      else if (act === 'ok') {
        if (Date.now() - openedAt < 300) return; // 열리자마자 눌린 엔터는 무시
        if (i < 0) {
          HG.Sound.sfx('wrong');
          if (!hint) {
            hint = HG.UI.text(scene, Math.min(x + w, HG.W - 4), y - 14, '↑↓ 방향키로 답을 고르세요', { depth: depth + 2, small: true, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(1, 0);
            scene.tweens.add({ targets: hint, alpha: 0.3, yoyo: true, repeat: -1, duration: 350 });
          }
          return;
        }
        HG.Sound.sfx('select'); finish(i);
      }
      else if (act === 'cancel' || act === 'menu') {
        if (o.noCancel) return;
        HG.Sound.sfx('cancel'); finish(o.cancelIndex != null ? o.cancelIndex : -1);
      }
    });
  });
};

// 글자 입력 (이름 짓기) — 화면 위에 진짜 입력칸을 잠깐 띄움
HG.UI.prompt = function (scene, label, def, maxLen, opt) {
  opt = opt || {};
  return new Promise(res => {
    HG.Keys.typing = true;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);z-index:40;';
    // 화면이 어두운 모드여도 글자가 보이도록 글자색·배경색을 직접 정함 (흰 칸에 흰 글자 문제)
    wrap.innerHTML = '<form autocomplete="off" style="background:#e9e2d0;border:4px solid #6b4a2b;outline:3px solid #1a1410;padding:22px 26px;font-family:Galmuri11,sans-serif;color:#1a1410;font-size:22px;text-align:center;min-width:280px;max-width:92vw;box-sizing:border-box">' +
      '<div style="margin-bottom:14px">' + label + '</div>' +
      '<input id="hgname" type="' + (opt.password ? 'password' : 'text') + '" maxlength="' + (maxLen || 6) + '" enterkeyhint="done" autocapitalize="off" spellcheck="false" style="font-family:Galmuri11,sans-serif;font-size:26px;width:220px;max-width:70vw;text-align:center;padding:6px;border:3px solid #1a1410;background:#ffffff;color:#1a1410;-webkit-text-fill-color:#1a1410;caret-color:#bf4436;color-scheme:light;opacity:1">' +
      '<div style="margin-top:14px"><button type="submit" style="font-family:Galmuri11,sans-serif;font-size:20px;padding:8px 26px;background:#bf4436;color:#e9e2d0;border:3px solid #1a1410;border-radius:8px">확인</button>' +
      (opt.cancel ? ' <button type="button" id="hgcancel" style="font-family:Galmuri11,sans-serif;font-size:20px;padding:8px 18px;background:#7d776c;color:#e9e2d0;border:3px solid #1a1410;border-radius:8px">취소</button>' : '') + '</div>' +
      '<div style="margin-top:10px;font-size:14px;color:#6b4a2b">' + (opt.hint || '이름을 쓰고 엔터 또는 확인') + '</div></form>';
    document.body.appendChild(wrap);
    const form = wrap.querySelector('form'), inp = wrap.querySelector('#hgname');
    inp.value = def || ''; setTimeout(() => { inp.focus(); inp.select(); }, 30);
    let done = false, composing = false, pendingEnter = false;
    const commit = () => {
      if (done) return; done = true;
      const v = opt.password ? inp.value : (inp.value.trim().slice(0, maxLen || 6) || def);
      wrap.remove(); setTimeout(() => { HG.Keys.typing = false; }, 50);
      HG.Sound.sfx('select'); res(v);
    };
    const cb = wrap.querySelector('#hgcancel');
    const cancel = () => { if (done) return; done = true; wrap.remove(); setTimeout(() => { HG.Keys.typing = false; }, 50); res(null); };
    if (cb) cb.addEventListener('click', cancel);
    form.addEventListener('submit', e => { e.preventDefault(); if (composing) { pendingEnter = true; return; } commit(); });
    inp.addEventListener('compositionstart', () => { composing = true; });
    // 한글 입력 중에 엔터를 누르면 글자가 완성된 뒤에 넘어가기
    inp.addEventListener('compositionend', () => { composing = false; if (pendingEnter) setTimeout(commit, 0); });
    inp.addEventListener('keydown', e => {
      e.stopPropagation();
      if (e.key === 'Escape' && opt.cancel) { e.preventDefault(); cancel(); return; }
      if (e.key === 'Enter' || e.keyCode === 13) { e.preventDefault(); if (e.isComposing || composing) { pendingEnter = true; return; } commit(); }
    });
    inp.addEventListener('keyup', e => e.stopPropagation());
  });
};

// 위쪽 알림 띠 (아이템 얻음 등)
HG.UI.toast = function (scene, msg) {
  const t = HG.UI.text(scene, HG.W / 2, 6, msg, { depth: 3000, color: '#fff4a8', stroke: '#1a1410', origin: 0.5 });
  t.setOrigin(0.5, 0);
  scene.tweens.add({ targets: t, alpha: 0, delay: 1600, duration: 500, onComplete: () => t.destroy() });
};
