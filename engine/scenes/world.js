// 풀숲 하나에서 유물이 튀어나오는 최대 횟수
HG.GRASS_MAX = 3;
// 걸어 다니는 지도 장면 — 이동, 대화, 물건, 이벤트, 풀숲 만남
HG.DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
HG.OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };

HG.setFace = function (spr, dir, step, alt) {
  const base = { down: 0, up: 2, left: 4, right: 4 }[dir];
  spr.setFrame(base + (step ? 1 : 0));
  if (dir === 'left') spr.setFlipX(true);
  else if (dir === 'right') spr.setFlipX(false);
  else spr.setFlipX(!!(step && alt));
};
HG.heroKey = function () {
  const s = HG.state, era = HG.ERAS.find(e => e.id === s.era);
  const outfit = s.flags.outfit || 'modern';
  return 'hero' + (s.player.look || 0) + '_' + outfit;
};

HG.WorldScene = class extends Phaser.Scene {
  constructor() { super('World'); }

  init(data) { this.data0 = data || {}; }

  create() {
    const st = HG.state;
    const d = this.data0;
    if (d.map) { st.player.map = d.map; st.player.x = d.x; st.player.y = d.y; st.player.dir = d.dir || st.player.dir; }
    this.map = HG.maps[st.player.map];
    const M = this.map;
    this.mw = M.tiles[0].length; this.mh = M.tiles.length;
    this.keys = new HG.Keys(this);
    this.dlg = new HG.UI.Dialog(this, this.keys);
    this.busy = true; this.moving = false; this.dead = false;

    // 바닥 그리기 (물이 출렁이도록 2장)
    this.bg = [0, 1].map(f => this.add.image(0, 0, this.buildMapTexture(f)).setOrigin(0).setDepth(-10));
    this.bg[1].setVisible(false);
    if (M.tiles.some(r => r.includes('~'))) this.time.addEvent({ delay: 600, loop: true, callback: () => { this.bg[0].setVisible(!this.bg[0].visible); this.bg[1].setVisible(!this.bg[1].visible); } });

    // 물건
    this.objects = [];
    (M.objects || []).forEach(o => this.addObject(o));
    HG.Secret.placedFor(M.id).forEach(o => this.addObject(o));
    // 사람
    this.npcs = [];
    (M.npcs || []).forEach(n => { if (!n.when || n.when(this.ev)) this.addNpc(n); });

    // 주인공
    this.player = this.add.sprite(0, 0, HG.heroKey(), 0);
    this.placeSprite(this.player, st.player.x, st.player.y);
    HG.setFace(this.player, st.player.dir);
    this.shadow = this.add.image(0, 0, 'shadow').setAlpha(0.35);

    // 카메라
    const cam = this.cameras.main;
    const pw = this.mw * HG.T, ph = this.mh * HG.T;
    cam.setBounds(Math.min(0, (pw - HG.W) / 2), Math.min(0, (ph - HG.H) / 2), Math.max(pw, HG.W), Math.max(ph, HG.H));
    cam.startFollow(this.player, true, 1, 1);
    cam.setRoundPixels(true);
    cam.fadeIn(250, 0, 0, 0);

    // 지도 이름 띠 + 왼쪽 위 목표
    this.showMapName();
    this.objBg = this.add.graphics().setScrollFactor(0).setDepth(2990);
    this.objTxt = HG.UI.text(this, 7, 5, '', { small: true, depth: 2991, color: '#e3d49a' });
    this.updateObjective();

    // 기본 키 처리 (대화창·메뉴가 위에 쌓이면 그쪽이 받음)
    this.keys.push(act => {
      if (this.busy || this.moving) return;
      if (act === 'ok') this.interact();
      else if (act === 'menu') this.openMenu();
    });

    HG.Sound.play(M.music || 'title');
    this.time.delayedCall(260, async () => {
      if (M.onEnter) await this.runEvent(M.onEnter);
      this.busy = false;
    });
    this.time.delayedCall(300, () => this.refreshMarks());
    this.time.delayedCall(320, () => this.devMarks());
    this.walkTimer = this.time.addEvent({ delay: 1400, loop: true, callback: () => this.wanderNpcs() });
    this.events.on('resume', () => { this.keys.down = {}; HG.Sound.play(this.map.music || 'title'); });
  }

  // ── 지도 그림 만들기
  buildMapTexture(frame) {
    const key = 'map_' + this.map.id + '_' + frame;
    if (this.textures.exists(key)) return key;
    const M = this.map, w = M.tiles[0].length, h = M.tiles.length;
    const { c, ctx } = HG.Pixel.canvas(w * HG.T, h * HG.T);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const t = HG.TILES[M.tiles[y][x]] || HG.TILES['.'];
      let tex = t.tex; if (t.water) tex = 't_water' + frame;
      ctx.drawImage(this.textures.get(tex).getSourceImage(), x * HG.T, y * HG.T);
    }
    this.textures.addCanvas(key, c);
    return key;
  }

  // 사람 그림은 발끝 기준으로 세움 (16x24)
  placeSprite(spr, x, y) { spr.setOrigin(0.5, 1); spr.x = x * HG.T + 8; spr.y = y * HG.T + 15; spr.setDepth(spr.y); }

  addObject(o) {
    const def = HG.OBJECTS[o.kind];
    if (o.when && !o.when(this.ev)) return;
    const img = this.add.image(o.x * HG.T, o.y * HG.T, def.tex).setOrigin(0);
    img.setDepth((o.y + def.h) * HG.T - 2);
    if (def.anim) { let i = 0; this.time.addEvent({ delay: 220, loop: true, callback: () => { i = (i + 1) % def.anim.length; img.setTexture(def.anim[i]); } }); }
    if (o.kind === 'timemachine' && o.smoke) {
      this.time.addEvent({ delay: 500, loop: true, callback: () => {
        const s = this.add.image(img.x + 22, img.y + 4, 'smoke').setDepth(img.depth + 1).setAlpha(0.8);
        this.tweens.add({ targets: s, y: s.y - 18, x: s.x + 6, alpha: 0, scale: 1.6, duration: 1400, onComplete: () => s.destroy() });
      } });
    }
    const ob = Object.assign({ img, w: def.w, h: def.h }, o);
    this.objects.push(ob);
    return ob;
  }

  addNpc(n) {
    const spr = this.add.sprite(0, 0, n.sprite, 0);
    const npc = Object.assign({ spr, home: [n.x, n.y] }, n);
    this.placeSprite(spr, n.x, n.y);
    HG.setFace(spr, n.dir || 'down');
    npc.facing = n.dir || 'down';
    this.npcs.push(npc);
    return npc;
  }

  // 할 일이 있는 사람 머리 위에 「!」 표시
  refreshMarks() {
    this.npcs.forEach(n => {
      const on = !n.gone && n.mark && n.mark(this.ev);
      if (on && !n.markImg) {
        n.markImg = this.add.image(n.spr.x, n.spr.y - 32, 'qmark').setDepth(4000);
        n.markTw = this.tweens.add({ targets: n.markImg, y: n.markImg.y - 3, yoyo: true, repeat: -1, duration: 350 });
      } else if (!on && n.markImg) { n.markTw.remove(); n.markImg.destroy(); n.markImg = null; }
    });
  }

  // 개발자 모드: 숨은 보물 자리 표시 (★ 아직 못 찾음 · ✓ 찾음)
  devMarks() {
    (this._devMk || []).forEach(t => t.destroy()); this._devMk = [];
    if (!HG.dev || !HG.dev.showSecrets) return;
    const M = this.map, put = (x, y, sec) => {
      const got = HG.Secret.found(sec.id);
      this._devMk.push(this.add.text(x * HG.T + 8, y * HG.T - 2, got ? '✓' : '★', { fontFamily: HG.FONT, fontSize: '10px', color: got ? '#b3ac9c' : '#ffe14a', stroke: '#1a1410', strokeThickness: 3 }).setOrigin(0.5, 1).setDepth(4500));
    };
    this.objects.forEach(o => { if (o.secret) put(o.x + (o.w - 1) / 2, o.y, o.secret); });
    this.npcs.forEach(n => { if (n.secret && !n.gone) put(n.x, n.y - 1, n.secret); });
    Object.entries(M.tileSecrets || {}).forEach(([k, sec]) => { const [x, y] = k.split(',').map(Number); put(x, y, sec); });
  }

  updateObjective() {
    const st = HG.stages[HG.state.era];
    const t = st && st.objective ? st.objective(HG.state) : '';
    this.objBg.clear();
    this.objTxt.setText(t ? '목표  ' + t : '');
    if (t) this.objBg.fillStyle(0x1a1410, 0.72).fillRoundedRect(3, 3, this.objTxt.width + 9, 15, 3);
  }


  showMapName() {
    if (!this.map.name) return;
    const t = HG.UI.text(this, HG.W / 2, 24, this.map.name, { depth: 3000, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
    this.tweens.add({ targets: t, alpha: 0, delay: 1500, duration: 500, onComplete: () => t.destroy() });
  }

  // ── 막힘 확인
  tileAt(x, y) { if (x < 0 || y < 0 || x >= this.mw || y >= this.mh) return null; return this.map.tiles[y][x]; }
  objectAt(x, y) { return this.objects.find(o => x >= o.x && x < o.x + o.w && y >= o.y && y < o.y + o.h); }
  npcAt(x, y) { return this.npcs.find(n => n.x === x && n.y === y && !n.gone); }
  solid(x, y) {
    const t = this.tileAt(x, y);
    if (t === null) return !this.isWarpTile(x, y);
    if ((HG.TILES[t] || {}).solid) return true;
    if (this.objectAt(x, y)) return true;
    if (this.npcAt(x, y)) return true;
    return false;
  }
  isWarpTile(x, y) { return (this.map.warps || []).some(w => w.x === x && w.y === y); }

  // ── 매 프레임: 걷기
  update(time, delta) {
    if (this.shadow) { this.shadow.x = this.player.x; this.shadow.y = this.player.y - 1; this.shadow.setDepth(this.player.depth - 1); }
    if (this.busy || this.moving || this.dead) return;
    const dir = this.keys.held();
    if (!dir) return;
    const st = HG.state.player;
    if (dir !== st.dir) {
      st.dir = dir; HG.setFace(this.player, dir);
      this.turnAt = time;
      return;
    }
    if (this.turnAt && time - this.turnAt < 90) return;
    this.step(dir);
  }

  step(dir) {
    const st = HG.state.player;
    const [dx, dy] = HG.DIRS[dir];
    const nx = st.x + dx, ny = st.y + dy;
    if (this.solid(nx, ny)) {
      if (!this.bumpAt || this.time.now - this.bumpAt > 350) { HG.Sound.sfx('bump'); this.bumpAt = this.time.now; }
      return;
    }
    this.moving = true;
    const run = this.keys.isHeld('cancel');
    const dur = run ? 110 : 170;
    this.altStep = !this.altStep;
    HG.setFace(this.player, dir, true, this.altStep);
    this.tweens.add({
      targets: this.player, x: nx * HG.T + 8, y: ny * HG.T + 15, duration: dur,
      onUpdate: () => this.player.setDepth(this.player.y),
      onComplete: async () => {
        st.x = nx; st.y = ny;
        HG.state.stats.steps++;
        HG.setFace(this.player, dir);
        this.moving = false;
        await this.afterStep(nx, ny);
      }
    });
  }

  async afterStep(x, y) {
    // 이동 지점
    const w = (this.map.warps || []).find(w => w.x === x && w.y === y);
    if (w) { await this.warp(w.to, w.tx, w.ty, w.dir || HG.state.player.dir); return; }
    // 밟으면 일어나는 일
    for (const t of (this.map.triggers || [])) {
      const tw = t.w || 1, th = t.h || 1;
      if (x >= t.x && x < t.x + tw && y >= t.y && y < t.y + th) {
        if (t.once && HG.state.flags[t.once]) continue;
        if (t.when && !t.when(this.ev)) continue;
        await this.runEvent(t.run);
        if (this.dead) return;
      }
    }
    // 긴 풀 — 유물이 튀어나옴
    const tile = HG.TILES[this.tileAt(x, y)];
    if (tile && tile.grass) {
      this.rustle(x, y);
      const pk = this.grassPatch(x, y), gc = HG.state.flags.grassCount = HG.state.flags.grassCount || {};
      if (HG.state.party.length && this.map.encounter && (gc[pk] || 0) < HG.GRASS_MAX && Math.random() < (this.map.encounterRate || 0.11)) {
        gc[pk] = (gc[pk] || 0) + 1;
        // 아직 못 모은 유물이 더 잘 나오도록 (풀숲마다 기회가 3번뿐이라서)
        let [species, level] = this.map.encounter(x, y);
        for (let k = 0; k < 4 && HG.state.dex.caught[species]; k++) [species, level] = this.map.encounter(x, y);
        const shiny = Math.random() < 1 / 48;
        await this.runEvent(async ev => { await ev.battle({ wild: { species, level, shiny } }); });
      }
    }
  }

  // 이어진 풀숲 한 덩어리마다 번호 붙이기 (풀숲마다 배틀 횟수 제한에 씀)
  grassPatch(x, y) {
    const M = this.map;
    if (!M._patch) {
      const H = M.tiles.length, W = M.tiles[0].length, lab = Array.from({ length: H }, () => Array(W).fill(-1));
      let n = 0;
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
        if (lab[j][i] >= 0 || !(HG.TILES[M.tiles[j][i]] || {}).grass) continue;
        const q = [[i, j]]; lab[j][i] = n;
        while (q.length) { const [a, b] = q.pop(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const u = a + dx, v = b + dy; if (u >= 0 && v >= 0 && u < W && v < H && lab[v][u] < 0 && (HG.TILES[M.tiles[v][u]] || {}).grass) { lab[v][u] = n; q.push([u, v]); } }); }
        n++;
      }
      M._patch = lab;
    }
    return M.id + ':' + M._patch[y][x];
  }

  rustle(x, y) {
    for (let i = 0; i < 3; i++) {
      const lf = this.add.rectangle(x * HG.T + 4 + i * 4, y * HG.T + 13, 2, 2, 0x6fa04a).setDepth(this.player.depth + 1);
      this.tweens.add({ targets: lf, y: lf.y - 6 - i * 2, x: lf.x + (i - 1) * 3, alpha: 0, duration: 300, onComplete: () => lf.destroy() });
    }
  }

  // ── 앞에 있는 것과 말하기
  async interact() {
    const st = HG.state.player;
    const [dx, dy] = HG.DIRS[st.dir];
    const fx = st.x + dx, fy = st.y + dy;
    const npc = this.npcAt(fx, fy);
    if (npc && npc.talk) {
      await this.runEvent(async ev => {
        const prev = npc.facing;
        if (!npc.noTurn) ev.face(npc, HG.OPP[st.dir]);
        if (typeof npc.talk === 'function') await npc.talk(ev, npc);
        else await ev.say(...npc.talk);
        if (npc.secret) await HG.Secret.check(ev, npc.secret);
      });
      return;
    }
    const ob = this.objectAt(fx, fy);
    if (ob && ob.talk) {
      await this.runEvent(async ev => { if (typeof ob.talk === 'function') await ob.talk(ev, ob); else await ev.say(...ob.talk); if (ob.secret) await HG.Secret.check(ev, ob.secret); });
      return;
    }
    // 물·벽화 같은 땅 앞
    const ch = this.tileAt(fx, fy), t = HG.TILES[ch];
    const sec = (this.map.tileSecrets && this.map.tileSecrets[fx + ',' + fy]) || HG.Secret.roadside(fx + ',' + fy + '@' + this.map.id, ch);
    if (!sec && HG.Secret.CHANCE >= 1 && HG.dev && HG.dev.on) HG.UI.toast(this, HG.Secret.whereLeft());
    const def = HG.TILE_TALK[ch];
    const lines = sec && sec.roadside ? null : (this.map.tileTalk && this.map.tileTalk[ch]) || (t && t.water && this.map.waterTalk) || (def && [HG.pick(def)]);
    if (lines || sec) await this.runEvent(async ev => { if (lines) await ev.say(...lines); if (sec) await HG.Secret.check(ev, sec); });
  }

  async runEvent(fn) {
    this.busy = true;
    try { await fn(this.ev); if (!this.dead) await HG.boxNotice((...l) => this.ev.say(...l)); }
    catch (e) { console.error(e); }
    if (this.dead) return;
    this.busy = false;
    this.updateObjective();
    this.refreshMarks();
    this.devMarks();
    HG.Save.save();
  }

  async openMenu() {
    this.busy = true;
    HG.Sound.sfx('select');
    await this.overlay('Menu', { mode: 'main' });
    this.player.setTexture(HG.heroKey());
    HG.setFace(this.player, HG.state.player.dir);
    this.busy = false;
  }

  // 다른 장면(배틀·메뉴·사냥)을 위에 띄우고 끝날 때까지 기다림
  overlay(key, data) {
    return new Promise(res => {
      this.scene.pause();
      this.scene.launch(key, Object.assign({}, data, { onEnd: r => { this.scene.stop(key); this.scene.resume(); this.cameras.main.fadeIn(200, 0, 0, 0); res(r); } }));
      this.scene.bringToTop(key);
    });
  }

  async warp(map, x, y, dir) {
    this.busy = true; this.dead = true;
    HG.Sound.sfx('cursor');
    HG.state.player.map = map; HG.state.player.x = x; HG.state.player.y = y; HG.state.player.dir = dir || HG.state.player.dir;
    HG.Save.save();
    this.cameras.main.fadeOut(220, 0, 0, 0);
    await HG.UI.wait(this, 240);
    this.scene.restart({ map, x, y, dir });
    return new Promise(() => {});
  }

  wanderNpcs() {
    if (this.busy) return;
    this.npcs.forEach(n => {
      if (!n.wander || n.gone || n.walking || Math.random() < 0.5) return;
      const dir = HG.pick(['up', 'down', 'left', 'right']);
      const [dx, dy] = HG.DIRS[dir];
      const nx = n.x + dx, ny = n.y + dy;
      const p = HG.state.player;
      if (Math.abs(nx - n.home[0]) > n.wander || Math.abs(ny - n.home[1]) > n.wander) { HG.setFace(n.spr, dir); n.facing = dir; return; }
      if (this.solid(nx, ny) || (nx === p.x && ny === p.y) || HG.TILES[this.tileAt(nx, ny)].grass) return;
      this.moveNpc(n, dir, 260);
    });
  }

  moveNpc(n, dir, dur) {
    return new Promise(res => {
      const [dx, dy] = HG.DIRS[dir];
      n.x += dx; n.y += dy; n.walking = true; n.facing = dir;
      n.alt = !n.alt;
      HG.setFace(n.spr, dir, true, n.alt);
      this.tweens.add({ targets: n.spr, x: n.x * HG.T + 8, y: n.y * HG.T + 15, duration: dur || 220,
        onUpdate: () => n.spr.setDepth(n.spr.y),
        onComplete: () => { HG.setFace(n.spr, dir); n.walking = false; res(); } });
    });
  }

  // ── 이벤트에서 쓰는 명령들
  get ev() {
    if (this._ev) return this._ev;
    const S = this;
    const halt = () => new Promise(() => {});
    this._ev = {
      scene: S,
      get state() { return HG.state; },
      say: (...l) => S.dead ? halt() : S.dlg.say(...l),
      choose: (q, o, c, e) => S.dead ? halt() : S.dlg.choose(q, o, c, e),
      wait: ms => HG.UI.wait(S, ms),
      flag: k => HG.state.flags[k],
      setFlag: (k, v) => { HG.state.flags[k] = v === undefined ? true : v; },
      npc: id => S.npcs.find(n => n.id === id),
      face: (n, dir) => { n.facing = dir; HG.setFace(n.spr, dir); },
      facePlayer: n => { const p = HG.state.player; const dx = p.x - n.x, dy = p.y - n.y; const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); n.facing = dir; HG.setFace(n.spr, dir); },
      walk: async (n, dirs, dur) => { for (const d of dirs) await S.moveNpc(n, d, dur); },
      spawn: def => S.addNpc(def),
      remove: n => { n.gone = true; S.tweens.add({ targets: n.spr, alpha: 0, duration: 250, onComplete: () => n.spr.destroy() }); },
      bang: async n => { const b = S.add.image(n.spr.x, n.spr.y - 30, 'bang').setDepth(5000); HG.Sound.sfx('encounter'); await HG.UI.wait(S, 600); b.destroy(); },
      playerFace: dir => { HG.state.player.dir = dir; HG.setFace(S.player, dir); },
      stepPlayer: dir => new Promise(res => {
        const st = HG.state.player; const [dx, dy] = HG.DIRS[dir];
        st.x += dx; st.y += dy; st.dir = dir;
        S.altStep = !S.altStep; HG.setFace(S.player, dir, true, S.altStep);
        S.tweens.add({ targets: S.player, x: st.x * HG.T + 8, y: st.y * HG.T + 15, duration: 200, onUpdate: () => S.player.setDepth(S.player.y), onComplete: () => { HG.setFace(S.player, dir); res(); } });
      }),
      give: async (item, n, silent) => {
        HG.state.bag[item] = (HG.state.bag[item] || 0) + n;
        HG.Sound.sfx('item');
        if (!silent) await S.dlg.say(`${HG.ITEMS[item].name} ${n}개를 얻었다!`);
      },
      heal: () => { HG.state.party.forEach(m => { m.hp = HG.stat(m, 'hp'); }); HG.Sound.sfx('heal'); },
      addMon: (species, level, shiny) => HG.addToParty(HG.makeMon(species, level, { shiny })),
      battle: async opts => {
        const r = await S.overlay('Battle', { opts });
        if (r === 'lose' && !opts.allowLose) {
          S.player.setVisible(true);
          await S.dlg.say('눈앞이 캄캄해졌다…', '…타임머신 옆에서 정신을 차렸다. 동료들도 다시 기운을 되찾았다.');
          HG.state.party.forEach(m => { m.hp = HG.stat(m, 'hp'); });
          if (opts.onLose) await opts.onLose();
          const r0 = HG.stages[HG.state.era].respawn;
          await S.warp(r0.map, r0.x, r0.y, r0.dir);
        }
        return r;
      },
      hunt: () => S.overlay('Hunt', {}),
      gather: p => S.overlay('Gather', { p }),
      build: p => S.overlay('Build', { p }),
      mini: (key, p) => S.overlay(key, { p }),
      menu: mode => S.overlay('Menu', { mode }),
      cutscene: (kind, data) => S.overlay('Cutscene', { kind, data }),
      warp: (map, x, y, dir) => S.warp(map, x, y, dir),
      music: name => HG.Sound.play(name),
      setOutfit: o => { HG.state.flags.outfit = o; S.player.setTexture(HG.heroKey()); HG.setFace(S.player, HG.state.player.dir); },
      flash: async (color) => { S.cameras.main.flash(500, ...(color || [255, 255, 255])); await HG.UI.wait(S, 500); },
      shake: () => S.cameras.main.shake(300, 0.01),
      maxLevel: () => Math.max(0, ...HG.state.party.map(m => m.level)),
      quiz: async (pool, count) => {
        let correct = 0;
        const qs = HG.shuffle(pool).slice(0, count);
        for (let i = 0; i < qs.length; i++) {
          const q = qs[i];
          const opts = HG.shuffle(q.options);
          const pick = await S.dlg.choose(`[문제 ${i + 1}] ${q.q}`, opts, 'none', { noDefault: true });
          if (opts[pick] === q.options[0]) { correct++; HG.Score.markQuiz(q, true); HG.Sound.sfx('correct'); await S.dlg.say(HG.pick(['옳지! 정답이다.', '훌륭하구나! 맞았다.', '그렇지! 바로 그거다.'])); }
          else { HG.Sound.sfx('wrong'); await S.dlg.say(`음… 정답은 '${q.options[0]}'이란다.`, q.why); }
        }
        return correct;
      }
    };
    return this._ev;
  }
};

// 아이템
HG.ITEMS = {
  meat: { name: '고기', desc: '동료 하나의 체력을 절반만큼 회복한다.', icon: 'i_meat' },
  berry: { name: '열매', desc: '동료 하나의 체력을 절반만큼 회복한다.', icon: 'i_berry' }
};

// 동료 들이기: 6마리까지 데리고 다니고, 나머지는 타임머신에 맡김
// 동료가 가득 차서 타임머신에 맡겨졌을 때 안내 (이벤트가 끝날 때 한 번에)
HG.boxNotice = async function (say) {
  const l = HG.pendingBox || []; HG.pendingBox = [];
  if (!l.length) return;
  const nm = l.join(', '), last = l[l.length - 1].replace('★', '');
  await say(`함께 다닐 수 있는 동료는 6명까지라서, ${nm}${HG.josa(last, '은', '는')} 타임머신에 맡겨 두었다.`, '타임머신의 「동료 바꾸기」에서 언제든 데리고 나올 수 있어!');
};
HG.addToParty = function (m) {
  const s = HG.state;
  s.dex.seen[m.species] = true;
  s.dex.caught[m.species] = true;
  if (m.shiny) s.dex.caught[m.species + '_s'] = true;
  if (s.party.length < 6) { s.party.push(m); return 'party'; }
  s.box.push(m); (HG.pendingBox = HG.pendingBox || []).push(HG.monName(m)); return 'box';
};
