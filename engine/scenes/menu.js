// 메뉴 장면 — 동료, 도감, 가방, 연표, 기록 카드, 저장, 설정 / 유물 박물관
HG.MenuScene = class extends Phaser.Scene {
  constructor() { super('Menu'); }
  init(data) { this.mode = data.mode || 'main'; this.onEnd = data.onEnd; }

  create() {
    this.keys = new HG.Keys(this);
    this.dlg = new HG.UI.Dialog(this, this.keys);
    this.add.rectangle(0, 0, HG.W, HG.H, 0x000000, 0.35).setOrigin(0).setDepth(0);
    this.layer = [];
    (this.mode === 'museum' ? this.museum() : this.main()).then(() => this.close());
  }

  close() { const cb = this.onEnd; this.onEnd = null; if (cb) cb(); }
  clear() { this.layer.forEach(o => o.destroy()); this.layer = []; }
  L(o) { this.layer.push(o); return o; }
  page(title) {
    this.clear();
    this.L(HG.UI.box(this, 4, 4, HG.W - 8, HG.H - 8, 10));
    if (title) this.L(HG.UI.text(this, 14, 10, title, { depth: 11, color: '#6b4a2b' }));
  }
  // 아무 키나 누를 때까지 기다림
  waitKey(ok) {
    return new Promise(res => { const h = this.keys.push(act => { if (act === 'ok' || act === 'cancel' || act === 'menu') { this.keys.pop(h); HG.Sound.sfx(act === 'ok' ? 'select' : 'cancel'); res(act); } }); });
  }

  async main() {
    const items = ['동료', '도감', '가방', '연표', '기록 카드', '저장하기', '설정', '닫기'];
    let start = 0;
    while (true) {
      const i = await HG.UI.choice(this, this.keys, items, { x: HG.W - 6, y: 6 + items.length * 15 + 10, alignRight: true, start, depth: 50 });
      start = Math.max(0, i);
      if (i < 0 || i === 7) return;
      if (i === 0) await this.party();
      if (i === 1) await this.dex();
      if (i === 2) await this.bag();
      if (i === 3) await this.timeline();
      if (i === 4) await this.record();
      if (i === 5) { HG.Save.save() ? HG.UI.toast(this, '저장했어요!') : HG.UI.toast(this, '저장하지 못했어요'); HG.Sound.sfx('item'); }
      if (i === 6) await this.settings();
      this.clear();
    }
  }

  // ── 동료
  async party() {
    let i = 0;
    while (true) {
      const P = HG.state.party;
      this.page('동료  (' + P.length + '/6)');
      if (!P.length) { this.L(HG.UI.text(this, 20, 40, '아직 동료가 없어요.', { depth: 11 })); await this.waitKey(); return; }
      P.forEach((m, k) => {
        const y = 28 + k * 22;
        this.L(this.add.image(30, y + 7, this.monTex(m)).setScale(0.6).setDepth(11));
        this.L(HG.UI.text(this, 48, y, HG.monName(m), { depth: 11 }));
        this.L(HG.UI.text(this, 140, y + 1, 'Lv' + m.level, { depth: 11, small: true }));
        this.L(this.hpBar(176, y + 5, 80, m));
        this.L(HG.UI.text(this, 262, y + 1, m.hp + '/' + HG.stat(m, 'hp'), { depth: 11, small: true }));
      });
      const k = await this.listCursor(P.length, 28, 22, 14, i);
      if (k < 0) return;
      i = k;
      const m = P[k];
      const c = await HG.UI.choice(this, this.keys, ['정보 보기', '맨 앞으로', '그만두기'], { x: 200, y: 60, depth: 60 });
      if (c === 0) await this.monInfo(m);
      if (c === 1 && k > 0) { P.splice(k, 1); P.unshift(m); HG.Sound.sfx('select'); i = 0; }
    }
  }
  hpBar(x, y, w, m) {
    const g = this.add.graphics().setDepth(11);
    const r = m.hp / HG.stat(m, 'hp');
    g.fillStyle(0x1a1410).fillRect(x - 1, y - 1, w + 2, 5);
    g.fillStyle(0xe9e2d0).fillRect(x, y, w, 3);
    g.fillStyle(r > 0.5 ? 0x5aa83a : r > 0.2 ? 0xf8d848 : 0xd04a3a).fillRect(x, y, Math.ceil(w * r), 3);
    return g;
  }
  monTex(m) { return 'mon_' + m.species + (m.shiny ? '_s' : ''); }

  // 세로 목록 커서 (고른 번호, 취소면 -1)
  listCursor(n, y0, gap, x, start) {
    return new Promise(res => {
      let i = start || 0;
      const cur = HG.UI.text(this, x, y0 + i * gap, '▶', { depth: 12 });
      const h = this.keys.push(act => {
        if (act === 'up') { i = (i + n - 1) % n; HG.Sound.sfx('cursor'); }
        else if (act === 'down') { i = (i + 1) % n; HG.Sound.sfx('cursor'); }
        else if (act === 'ok') { HG.Sound.sfx('select'); this.keys.pop(h); cur.destroy(); res(i); return; }
        else if (act === 'cancel' || act === 'menu') { HG.Sound.sfx('cancel'); this.keys.pop(h); cur.destroy(); res(-1); return; }
        cur.y = y0 + i * gap;
      });
    });
  }

  async monInfo(m) {
    const A = HG.ARTIFACTS[m.species];
    this.page(HG.monName(m) + '   Lv' + m.level);
    this.L(this.add.image(54, 70, this.monTex(m)).setScale(2).setDepth(11));
    this.L(HG.UI.text(this, 24, 108, '속성: ' + A.type, { depth: 11, small: true }));
    this.L(HG.UI.text(this, 24, 122, '시대: ' + HG.ERAS.find(e => e.id === A.era).name, { depth: 11, small: true }));
    const st = [['체력', m.hp + '/' + HG.stat(m, 'hp')], ['공격', HG.stat(m, 'atk')], ['방어', HG.stat(m, 'def')], ['속도', HG.stat(m, 'spd')]];
    st.forEach(([k, v], i) => this.L(HG.UI.text(this, 104 + (i % 2) * 100, 30 + Math.floor(i / 2) * 15, k + '  ' + v, { depth: 11 })));
    this.L(HG.UI.text(this, 104, 66, '기술', { depth: 11, color: '#6b4a2b' }));
    m.moves.forEach((mv, i) => this.L(HG.UI.text(this, 104 + (i % 2) * 100, 82 + Math.floor(i / 2) * 15, mv, { depth: 11 })));
    const nxt = HG.expFor(m.level + 1) - m.exp;
    this.L(HG.UI.text(this, 104, 120, '다음 레벨까지 경험치 ' + nxt, { depth: 11, small: true }));
    if (A.evolve) this.L(HG.UI.text(this, 104, 134, '다음 시대에 진화할 수 있을지도…?', { depth: 11, small: true, color: '#9a5ac0' }));
    await this.waitKey();
  }

  // ── 도감
  async dex() {
    let i = 0;
    const ids = HG.dexList();
    while (true) {
      const s = HG.state.dex;
      const caught = ids.filter(id => s.caught[id]).length;
      this.page(`유물 도감   ${caught}/${ids.length}`);
      const cols = 3;
      ids.forEach((id, k) => {
        const x = 20 + (k % cols) * 98, y = 28 + Math.floor(k / cols) * 70;
        this.L(this.add.rectangle(x, y, 88, 62, 0xd6c9a2).setOrigin(0).setDepth(11).setStrokeStyle(1, 0x6b4a2b));
        const A = HG.ARTIFACTS[id];
        this.L(HG.UI.text(this, x + 4, y + 3, 'No.' + String(A.no).padStart(3, '0'), { depth: 12, small: true, color: '#6b4a2b' }));
        if (s.seen[id] || s.caught[id]) {
          const img = this.L(this.add.image(x + 44, y + 30, 'mon_' + id).setDepth(12));
          if (!s.caught[id]) img.setTint(0x1a1410);
          this.L(HG.UI.text(this, x + 44, y + 47, A.name, { depth: 12, small: true }).setOrigin(0.5, 0));
          if (s.caught[id + '_s']) this.L(HG.UI.text(this, x + 82, y + 3, '★', { depth: 12, small: true, color: '#f08a2a' }).setOrigin(1, 0));
        } else {
          this.L(HG.UI.text(this, x + 44, y + 22, '?', { depth: 12, color: '#8a8478' }).setOrigin(0.5, 0));
        }
      });
      const k = await this.gridCursor(ids.length, cols, (k) => [20 + (k % cols) * 98 - 2, 28 + Math.floor(k / cols) * 70 - 2, 92, 66], i);
      if (k < 0) return;
      i = k;
      await this.dexDetail(ids[k]);
    }
  }
  gridCursor(n, cols, rectOf, start) {
    return new Promise(res => {
      let i = start || 0;
      const g = this.add.graphics().setDepth(13);
      const draw = () => { const [x, y, w, h] = rectOf(i); g.clear(); g.lineStyle(2, 0xd04a3a).strokeRect(x, y, w, h); };
      draw();
      const h = this.keys.push(act => {
        if (act === 'left') i = (i + n - 1) % n;
        else if (act === 'right') i = (i + 1) % n;
        else if (act === 'up') i = (i - cols + n) % n;
        else if (act === 'down') i = (i + cols) % n;
        else if (act === 'ok') { HG.Sound.sfx('select'); this.keys.pop(h); g.destroy(); res(i); return; }
        else if (act === 'cancel' || act === 'menu') { HG.Sound.sfx('cancel'); this.keys.pop(h); g.destroy(); res(-1); return; }
        HG.Sound.sfx('cursor'); draw();
      });
    });
  }
  async dexDetail(id) {
    const s = HG.state.dex, A = HG.ARTIFACTS[id];
    if (!s.seen[id] && !s.caught[id]) { HG.Sound.sfx('wrong'); return; }
    this.page('No.' + String(A.no).padStart(3, '0') + '  ' + A.name);
    const img = this.L(this.add.image(60, 74, 'mon_' + id).setScale(2).setDepth(11));
    if (!s.caught[id]) img.setTint(0x1a1410);
    this.L(HG.UI.text(this, 24, 116, '속성: ' + A.type, { depth: 11, small: true }));
    this.L(HG.UI.text(this, 24, 130, HG.ERAS.find(e => e.id === A.era).name + ' 시대', { depth: 11, small: true }));
    this.L(HG.UI.text(this, 112, 32, s.caught[id] ? A.dex : '아직 동료가 되지 않아서 자세히 알 수 없다. 풀숲에서 다시 만나 보자!', { depth: 11, wrap: 190, lineSpacing: 5 }));
    if (A.rare) this.L(HG.UI.text(this, 112, 140, '아주 드물게 나타나는 유물', { depth: 11, small: true, color: '#9a5ac0' }));
    await this.waitKey();
  }

  // ── 가방
  async bag() {
    while (true) {
      const bag = HG.state.bag;
      const keys = Object.keys(HG.ITEMS).filter(k => bag[k] > 0);
      this.page('가방');
      if (!keys.length) { this.L(HG.UI.text(this, 20, 40, '가방이 비어 있어요.', { depth: 11 })); await this.waitKey(); return; }
      keys.forEach((k, i) => {
        const y = 32 + i * 20;
        this.L(this.add.image(30, y + 6, HG.ITEMS[k].icon).setDepth(11));
        this.L(HG.UI.text(this, 44, y, HG.ITEMS[k].name + '  ×' + bag[k], { depth: 11 }));
        this.L(HG.UI.text(this, 140, y + 1, HG.ITEMS[k].desc, { depth: 11, small: true, wrap: 160 }));
      });
      const i = await this.listCursor(keys.length, 32, 20, 14, 0);
      if (i < 0) return;
      const item = keys[i];
      const P = HG.state.party;
      if (!P.length) continue;
      const t = await HG.UI.choice(this, this.keys, P.map(m => `${HG.monName(m)} ${m.hp}/${HG.stat(m, 'hp')}`), { x: 150, y: 40, depth: 60 });
      if (t < 0) continue;
      const m = P[t], max = HG.stat(m, 'hp');
      if (m.hp >= max) { HG.Sound.sfx('wrong'); HG.UI.toast(this, '체력이 이미 가득해요'); continue; }
      bag[item]--; m.hp = Math.min(max, m.hp + Math.ceil(max / 2));
      HG.Sound.sfx('heal');
      HG.UI.toast(this, `${HG.monName(m)}의 체력이 회복됐다!`);
    }
  }

  // ── 연표 진행 바
  async timeline() {
    this.page('연표 — 지금 나는 어디에?');
    this.drawTimeline(this, 24, 70);
    this.L(HG.UI.text(this, HG.W / 2, 132, '색이 채워진 시대는 시간 조각을 되찾은 시대예요.', { depth: 11, small: true }).setOrigin(0.5, 0));
    await this.waitKey();
  }
  drawTimeline(scene, x0, y) {
    const s = HG.state, cur = HG.eraIndex(s.era);
    const w = (HG.W - x0 * 2) / HG.ERAS.length;
    const g = this.L(scene.add.graphics().setDepth(11));
    g.fillStyle(0x6b4a2b).fillRect(x0, y + 5, w * HG.ERAS.length, 3);
    HG.ERAS.forEach((e, i) => {
      const cx = x0 + w * i + w / 2;
      const done = s.stamps.includes(e.id);
      g.fillStyle(0x1a1410).fillCircle(cx, y + 6, 6);
      g.fillStyle(done ? 0xf8d848 : i === cur ? 0x6fa04a : 0xc9c2b0).fillCircle(cx, y + 6, 5);
      const t = this.L(HG.UI.text(scene, cx, y + (i % 2 ? 18 : -22), e.short, { depth: 12, small: true, color: i === cur ? '#2f6e2a' : '#1a1410' }).setOrigin(0.5, 0));
      if (i === cur) {
        const me = this.L(scene.add.sprite(cx, y - 42 + (i % 2 ? 6 : -2), HG.heroKey(), 0).setDepth(13));
        scene.tweens.add({ targets: me, y: me.y - 3, yoyo: true, repeat: -1, duration: 400 });
      }
    });
  }

  // ── 기록 카드 (선생님 확인용)
  async record() {
    const s = HG.state; HG.Save.tickTime();
    this.page('기록 카드');
    const mins = Math.floor(s.stats.playMs / 60000);
    const ids = HG.dexList();
    const rows = [
      ['이름', s.player.name],
      ['칭호', s.title || '(아직 없음)'],
      ['지금 시대', HG.ERAS.find(e => e.id === s.era).name],
      ['도감', ids.filter(id => s.dex.caught[id]).length + ' / ' + ids.length],
      ['시대 인장', s.stamps.length ? s.stamps.map(id => HG.ERAS.find(e => e.id === id).name).join(', ') : '없음'],
      ['배틀', s.stats.battles + '번 (이김 ' + s.stats.wins + ')'],
      ['사냥', s.stats.hunts + '번'],
      ['숨은 보물', (c => c.got + ' / ' + c.total)(HG.Secret.count())],
      ['점수', HG.Score.calc().total + '점'],
      ['플레이 시간', Math.floor(mins / 60) + '시간 ' + (mins % 60) + '분']
    ];
    rows.forEach(([k, v], i) => {
      this.L(HG.UI.text(this, 24, 28 + i * 14, k, { depth: 11, color: '#6b4a2b' }));
      this.L(HG.UI.text(this, 110, 28 + i * 14, String(v), { depth: 11 }));
    });
    this.L(this.add.sprite(270, 60, HG.heroKey(), 0).setScale(3).setDepth(11));
    await this.waitKey();
  }

  // ── 설정
  async settings() {
    let i = 0;
    while (true) {
      const st = HG.state.settings;
      this.clear();
      const items = ['효과음: ' + (st.sound ? '켜짐' : '꺼짐'), '배경음악: ' + (st.music ? '켜짐' : '꺼짐'), '저장 코드 보기', '저장 코드로 불러오기', '돌아가기'];
      i = await HG.UI.choice(this, this.keys, items, { x: 120, y: 30, depth: 60, start: i });
      if (i < 0 || i === 4) return;
      if (i === 0) { st.sound = !st.sound; if (!st.sound) HG.Sound.stop(); else HG.Sound.refresh(); }
      if (i === 1) { st.music = !st.music; if (!st.music) HG.Sound.stop(); }
      if (i === 2) await this.showCode();
      if (i === 3) await this.loadCode();
      HG.Save.save();
    }
  }
  showCode() {
    return new Promise(res => {
      HG.Keys.typing = true;
      const code = HG.Save.exportCode();
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:10;font-family:Galmuri11,sans-serif';
      wrap.innerHTML = '<div style="background:#e9e2d0;border:4px solid #6b4a2b;padding:20px;max-width:560px;width:90%;color:#1a1410">' +
        '<div style="font-size:20px;margin-bottom:8px">저장 코드</div><div style="font-size:14px;margin-bottom:8px">이 코드를 복사해 두면 다른 기기에서도 이어서 할 수 있어요.</div>' +
        '<textarea readonly style="width:100%;height:120px;font-size:11px;word-break:break-all;background:#fff;color:#1a1410;-webkit-text-fill-color:#1a1410;color-scheme:light">' + code + '</textarea>' +
        '<div style="margin-top:10px;display:flex;gap:8px"><button id="cp" style="font-family:inherit;font-size:16px;padding:6px 14px">복사하기</button><button id="cl" style="font-family:inherit;font-size:16px;padding:6px 14px">닫기</button></div></div>';
      document.body.appendChild(wrap);
      const done = () => { wrap.remove(); setTimeout(() => { HG.Keys.typing = false; }, 50); res(); };
      wrap.querySelector('#cp').onclick = () => { const ta = wrap.querySelector('textarea'); ta.select(); try { navigator.clipboard.writeText(code); } catch (e) { document.execCommand('copy'); } wrap.querySelector('#cp').textContent = '복사됨!'; };
      wrap.querySelector('#cl').onclick = done;
      wrap.addEventListener('keydown', e => { if (e.key === 'Escape') done(); });
    });
  }
  loadCode() {
    return new Promise(res => {
      HG.Keys.typing = true;
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:10;font-family:Galmuri11,sans-serif';
      wrap.innerHTML = '<div style="background:#e9e2d0;border:4px solid #6b4a2b;padding:20px;max-width:560px;width:90%;color:#1a1410">' +
        '<div style="font-size:20px;margin-bottom:8px">저장 코드로 불러오기</div><div style="font-size:14px;margin-bottom:8px">지금 기록은 사라지고, 코드의 기록으로 바뀌어요.</div>' +
        '<textarea id="ta" style="width:100%;height:120px;font-size:11px;background:#fff;color:#1a1410;-webkit-text-fill-color:#1a1410;color-scheme:light"></textarea>' +
        '<div id="msg" style="color:#d04a3a;font-size:14px;height:18px"></div>' +
        '<div style="margin-top:6px;display:flex;gap:8px"><button id="ok" style="font-family:inherit;font-size:16px;padding:6px 14px">불러오기</button><button id="cl" style="font-family:inherit;font-size:16px;padding:6px 14px">닫기</button></div></div>';
      document.body.appendChild(wrap);
      const done = v => { wrap.remove(); setTimeout(() => { HG.Keys.typing = false; }, 50); res(v); };
      wrap.querySelector('#cl').onclick = () => done(false);
      wrap.querySelector('#ok').onclick = () => {
        if (HG.Save.importCode(wrap.querySelector('#ta').value)) { done(true); window.location.reload(); }
        else wrap.querySelector('#msg').textContent = '코드가 올바르지 않아요.';
      };
    });
  }

  // ── 유물 박물관 (타임머신 안)
  async museum() {
    let i = 0;
    const ids = HG.dexList().filter(id => HG.ARTIFACTS[id].era === HG.state.era);
    while (true) {
      const s = HG.state.dex;
      const eraName = HG.ERAS.find(e => e.id === HG.state.era).name;
      const have = ids.filter(id => s.caught[id]).length;
      this.clear();
      this.L(this.add.rectangle(0, 0, HG.W, HG.H, 0x4a3220).setOrigin(0).setDepth(10));
      // 벽과 바닥
      this.L(this.add.rectangle(0, 120, HG.W, 60, 0x6b4a2b).setOrigin(0).setDepth(10));
      for (let x = 0; x < HG.W; x += 16) this.L(this.add.rectangle(x, 120, 15, 60, 0x7a5a3a).setOrigin(0).setDepth(10));
      this.L(HG.UI.text(this, HG.W / 2, 6, `유물 박물관 — ${eraName} 전시실  (${have}/${ids.length})`, { depth: 12, color: '#fff4a8', stroke: '#1a1410' }).setOrigin(0.5, 0));
      const cols = 3;
      ids.forEach((id, k) => {
        const x = 22 + (k % cols) * 98, y = 26 + Math.floor(k / cols) * 74;
        // 진열장
        this.L(this.add.rectangle(x, y, 82, 58, 0xc9e8f0, 0.35).setOrigin(0).setDepth(11).setStrokeStyle(2, 0xe9e2d0));
        this.L(this.add.rectangle(x + 8, y + 58, 66, 10, 0xa87a4a).setOrigin(0).setDepth(11).setStrokeStyle(1, 0x1a1410));
        if (s.caught[id]) {
          const img = this.L(this.add.image(x + 41, y + 30, 'mon_' + id + (s.caught[id + '_s'] ? '_s' : '')).setDepth(12));
          this.tweens.add({ targets: img, y: img.y - 2, yoyo: true, repeat: -1, duration: 700 + k * 90 });
          this.L(HG.UI.text(this, x + 41, y + 58, HG.ARTIFACTS[id].name, { depth: 12, small: true }).setOrigin(0.5, 0));
        } else {
          this.L(HG.UI.text(this, x + 41, y + 22, '?', { depth: 12, color: '#e9e2d0' }).setOrigin(0.5, 0));
          this.L(HG.UI.text(this, x + 41, y + 58, '빈 진열장', { depth: 12, small: true, color: '#4a3220' }).setOrigin(0.5, 0));
        }
      });
      if (have === ids.length) this.L(HG.UI.text(this, HG.W / 2, 168, '★ 전시실 완성! ★', { depth: 12, small: true, color: '#fff4a8', stroke: '#1a1410' }).setOrigin(0.5, 0));
      else this.L(HG.UI.text(this, HG.W / 2, 168, '다음 시대 전시실은 아직 잠겨 있어요', { depth: 12, small: true, color: '#e8dcb0' }).setOrigin(0.5, 0));
      const k = await this.gridCursor(ids.length, cols, k => [22 + (k % cols) * 98 - 3, 26 + Math.floor(k / cols) * 74 - 3, 88, 76], i);
      if (k < 0) return;
      i = k;
      if (s.caught[ids[k]]) await this.dexDetail(ids[k]);
      else { HG.Sound.sfx('wrong'); }
    }
  }
};
