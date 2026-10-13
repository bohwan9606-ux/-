// 게임 시작
// 개발자 모드: F9 (또는 Ctrl+Shift+D) — 선생님 테스트용. 비밀번호를 넣어야 열림
// 비밀번호를 바꾸려면 아래 따옴표 안의 글자만 바꾸면 됨
HG.DEV_PASSWORD = 'teacher';
HG.Dev = {
  // 미니게임에서 바로 성공시킬 수 있는 장면들
  OLD_MINIS: ['Gather', 'Build', 'Timing', 'Trade', 'Stealth', 'Hunt', 'Landing', 'Defense', 'Refugee', 'War'],

  async open(scene) {
    if (!scene || !['World', 'MapStage', 'Title'].includes(scene.scene.key) || scene.busy || scene._devOpen) return;
    const key = scene.scene.key, s0 = HG.state;
    if (!HG.dev.on) {
      scene.busy = true; scene._devOpen = true;
      const pw = await HG.UI.prompt(scene, '선생님 확인<br><small style="font-size:15px">개발자 모드 비밀번호</small>', '', 20, { password: true, cancel: true, hint: '<b style="color:#bf4436">⛔ 선생님 전용 · 학생은 들어올 수 없어요</b><br>Esc 또는 취소를 눌러 게임으로 돌아가세요' });
      scene._devOpen = false; scene.busy = false;
      if (pw === null) return;
      if (pw !== HG.DEV_PASSWORD) { HG.Sound.sfx('wrong'); HG.UI.toast(scene, '비밀번호가 달라요'); return; }
      HG.dev.on = true; HG.UI.toast(scene, '개발자 모드 켜짐 · 미니게임·배틀 중 F8 = 바로 성공'); }
    if (key === 'Title' && !HG.state) { HG.state = HG.newState(); HG.state.player.name = '선생님'; HG.Dev.ensureStarted(); }
    scene.busy = true; scene._devOpen = true;
    try { await HG.Dev.menu(scene); } catch (e) { console.error(e); }
    scene._devOpen = false;
    if (scene.scene.isActive() || scene.scene.isPaused()) scene.busy = false;
  },

  async pick(scene, items, depth) {
    return HG.UI.choice(scene, scene.keys, items, { x: 8, y: 8, depth: depth || 4000 });
  },

  async menu(scene) {
    const key = scene.scene.key, s = HG.state, st = HG.stages[s.era];
    const M = [];
    M.push(['시대 이동 (그 시대 처음으로)', async () => {
      const list = HG.ERAS.filter(e => HG.stages[e.id]);
      const j = await HG.Dev.pick(scene, list.map((e, k) => `${k + 1}. ${e.name}`).concat(['돌아가기']), 4100);
      if (j >= 0 && j < list.length) { HG.Dev.jumpEra(list[j].id); scene.busy = false; scene._devOpen = false; HG.Era.enter(scene, list[j].id); return 'gone'; }
    }]);
    M.push(['미니게임 바로 해 보기', async () => HG.Dev.miniMenu(scene)]);
    if (key === 'MapStage') {
      M.push(['거점 모두 완료 (스승 문 열기)', async () => { st.nodes.forEach(n => s.flags[s.era + '_node_' + n.id] = true); scene.refreshIcons(); scene.showNode(); HG.UI.toast(scene, '거점 모두 완료'); }]);
      M.push(['스승 앞으로 가기', async () => { const b = scene.nodes.find(n => n.kind === 'boss'); scene.cur = b; scene.hero.setPosition(b.x, b.y - 2); scene.showNode(); }]);
    }
    if (key === 'World' && st && st.taskFlags) M.push(['마을 일 모두 완료', async () => { st.taskFlags.forEach(f => s.flags[f] = true); scene.refreshMarks && scene.refreshMarks(); HG.UI.toast(scene, '마을 일 모두 완료'); }]);
    if (key === 'World' && st && st.maps) M.push(['스승 앞으로 가기', async () => {
      for (const id of st.maps) { const m = HG.maps[id], b = (m.npcs || []).find(n => n.id === 'boss' || n.id === 'king') || (m.objects || []).find(o => o.kind === 'rift');
        if (!b) continue;
        const w = b.kind === 'rift' ? 2 : 1, h = w, free = (x, y) => m.tiles[y] && m.tiles[y][x] && !(HG.TILES[m.tiles[y][x]] || {}).solid && !(m.npcs || []).some(n => n.x === x && n.y === y);
        const spot = [[b.x, b.y + h, 'up'], [b.x - 1, b.y, 'right'], [b.x + w, b.y, 'left'], [b.x, b.y - 1, 'down']].find(([x, y]) => free(x, y)) || [b.x, b.y + h, 'up'];
        scene.busy = false; scene._devOpen = false; scene.warp(id, spot[0], spot[1], spot[2]); return 'gone'; }
    }]);
    if (key === 'World' && s.era === 'paleolithic') {
      M.push(['동굴 입구로', async () => { HG.Dev.ensureStarted(); scene.busy = false; scene._devOpen = false; scene.warp('village', 25, 9, 'right'); return 'gone'; }]);
      M.push(['부족장 앞으로', async () => { HG.Dev.ensureStarted(); ['taskGather', 'taskHunt', 'taskBuild'].forEach(f => s.flags[f] = true); scene.busy = false; scene._devOpen = false; scene.warp('cave', 8, 5, 'up'); return 'gone'; }]);
    }
    if (key !== 'Title') {
      M.push(['이 시대 클리어 상태로', async () => { HG.Dev.ensureStarted(); if (!s.stamps.includes(s.era)) s.stamps.push(s.era); s.flags[s.era + 'Clear'] = true; if (s.era === 'paleolithic') s.flags.paleoClear = true; HG.giveTitle(HG.ERAS.find(e => e.id === s.era).title); scene.refreshIcons && scene.refreshIcons(); HG.UI.toast(scene, '이 시대 클리어'); }]);
      M.push(['도우미 기능 (무적·레벨·유물·고기)', async () => {
        const items = ['무적 ' + (HG.dev.god ? '끄기' : '켜기'), '동료 레벨 +5', '지금 시대 유물 전부 얻기', '고기 10개', '돌아가기'];
        const j = await HG.Dev.pick(scene, items, 4100);
        if (j === 0) { HG.dev.god = !HG.dev.god; HG.UI.toast(scene, '무적 ' + (HG.dev.god ? '켜짐' : '꺼짐')); }
        if (j === 1) { s.party.forEach(m => { HG.gainExp(m, HG.expFor(m.level + 5) - m.exp); m.hp = HG.stat(m, 'hp'); }); HG.UI.toast(scene, '레벨 +5'); }
        if (j === 2) { HG.dexList().filter(id => HG.ARTIFACTS[id].era === s.era).forEach(id => { if (!s.dex.caught[id]) HG.addToParty(HG.makeMon(id, (st && st.baseLevel) || 8)); }); if (!s.flags.starter) s.flags.starter = 'handaxe'; HG.UI.toast(scene, '유물 전부 얻음'); }
        if (j === 3) { s.bag.meat = (s.bag.meat || 0) + 10; HG.UI.toast(scene, '고기 +10'); }
      }]);
      M.push(['숨은 보물 보기 (위치 표시 · 길가 보물)', async () => {
        const left = (HG.Secret.ROADSIDE[s.era] || []).filter(x => !HG.Secret.found(x.id)).length;
        const items = ['보물 자리 표시 ' + (HG.dev.showSecrets ? '끄기' : '켜기'), '길가 보물 확률 100% ' + (HG.Secret.CHANCE >= 1 ? '끄기 (5%로)' : '켜기'), '이 시대 숨은 보물 모두 다시 숨기기', '돌아가기'];
        const j = await HG.Dev.pick(scene, items, 4100);
        if (j === 0) { HG.dev.showSecrets = !HG.dev.showSecrets; scene.devMarks && scene.devMarks(); HG.UI.toast(scene, HG.dev.showSecrets ? '★ 못 찾은 보물 · ✓ 찾은 보물' : '보물 표시 끔'); }
        if (j === 1) { HG.Secret.CHANCE = HG.Secret.CHANCE >= 1 ? 0.05 : 1; HG.Secret._lastSpot = null; HG.Secret._lastSteps = -99; HG.UI.toast(scene, HG.Secret.CHANCE >= 1 ? `길가 보물 100% (남은 것 ${left}개) · 나무·바위·물 앞에서 스페이스` : '길가 보물 5%'); }
        if (j === 2) { HG.Secret.list(s.era).forEach(x => delete s.flags['secret_' + x.id]); scene.devMarks && scene.devMarks(); HG.UI.toast(scene, '이 시대 보물을 다시 숨겼어요'); }
      }]);
      M.push(['엔딩 크레딧 보기', async () => { await HG.Dev.launch(scene, 'Credits', {}); }]);
    }
    M.push(['저장 지우고 처음으로', async () => { HG.Save.wipe(); window.location.reload(); return 'gone'; }]);
    M.push(['닫기', async () => {}]);
    const i = await HG.Dev.pick(scene, M.map(m => m[0]));
    if (i < 0) return;
    const r = await M[i][1]();
    if (r !== 'gone' && key !== 'Title') HG.Save.save();
  },

  // 미니게임 목록: 시대 → 거점
  async miniMenu(scene) {
    const groups = [];
    HG.ERAS.forEach(e => {
      const st = HG.stages[e.id]; if (!st) return;
      const list = [];
      (st.devMinis || []).forEach(m => list.push({ name: m.name, scene: m.scene, p: m.p }));
      (st.nodes || []).forEach(n => { if (n.mission) list.push({ name: n.name, scene: n.mission.scene, p: n.mission.p }); });
      if (e.id === 'modern') list.push({ name: '6·25 전쟁 (작전 지도 전체)', scene: 'War', p: {} });
      if (list.length) groups.push({ name: e.name, list });
    });
    groups.push({ name: '새 미니게임 기본판 모아 보기', list: HG.MINIS.map(c => ({ name: c.LABEL, scene: c.KEY, p: {} })) });
    while (true) {
      const g = await HG.Dev.pick(scene, groups.map(x => x.name).concat(['돌아가기']), 4100);
      if (g < 0 || g >= groups.length) return;
      const list = groups[g].list;
      const k = await HG.Dev.pick(scene, list.map(m => `${m.name}  (${HG.Dev.kind(m.scene)})`).concat(['돌아가기']), 4200);
      if (k < 0 || k >= list.length) continue;
      const r = await HG.Dev.launch(scene, list[k].scene, { p: list[k].p });
      HG.UI.toast(scene, `결과: ${r === 'win' ? '성공' : r === 'lose' ? '실패' : r}`);
      return;
    }
  },

  // 미니게임 종류 이름 (개발자 메뉴 표시용)
  kind(key) {
    const OLD = { Gather: '줍기', Build: '순서 고르기', Timing: '타이밍', Trade: '장사', Stealth: '몰래 가기', Hunt: '사냥', Landing: '배 몰기', Defense: '방어선', Refugee: '피란민 돕기', War: '작전 지도' };
    if (OLD[key]) return OLD[key];
    const c = HG.MINIS.find(c => c.KEY === key);
    return c ? c.LABEL : key;
  },

  // 아무 장면 위에 미니게임을 띄웠다가 돌아오기
  launch(scene, key, data) {
    return new Promise(res => {
      if (!HG.state.party.length) HG.Dev.ensureStarted();
      const mgr = scene.scene;
      mgr.pause();
      mgr.launch(key, Object.assign({}, data, { onEnd: r => { mgr.stop(key); mgr.resume(); scene.cameras.main.fadeIn(200); if (key !== 'Credits') HG.Sound.play(scene.st && scene.st.music || (scene.scene.key === 'Title' ? 'title' : 'village')); res(r); } }));
      mgr.bringToTop(key);
    });
  },

  // F8: 지금 하고 있는 미니게임·배틀 바로 성공
  quickWin() {
    if (!HG.dev.on || !HG.game) return;
    const act = HG.game.scene.getScenes(true).map(s => s.scene.key);
    const top = act[act.length - 1] ? HG.game.scene.getScene(act[act.length - 1]) : null;
    const sc = [...act].reverse().map(k => HG.game.scene.getScene(k)).find(s => s.devWin || s.scene.key === 'Battle' || HG.Dev.OLD_MINIS.includes(s.scene.key));
    if (!sc || !sc.onEnd) return;
    if (sc.devWin) { sc.devWin(); return; }
    HG.UI.toast(sc, '개발자: 바로 성공');
    if (sc.scene.key === 'Battle') { sc.finish('win'); return; }
    HG.Sound.stop();
    const cb = sc.onEnd; sc.onEnd = null;
    if (sc.scene.key !== 'War') HG.state.party.forEach(m => HG.gainExp(m, 30));
    cb('win');
  },

  // 개발자용: 그 시대 바로 앞까지 깬 것으로 만들기
  jumpEra(id) {
    HG.Dev.ensureStarted();
    const s = HG.state, idx = HG.eraIndex(id);
    HG.ERAS.slice(0, idx).forEach(e => { if (!s.stamps.includes(e.id)) s.stamps.push(e.id); s.flags[e.id + 'Clear'] = true; });
    s.flags.paleoClear = true;
    const lv = (HG.stages[id] && HG.stages[id].baseLevel) || 8;
    s.party.forEach(m => { if (m.level < lv) HG.gainExp(m, HG.expFor(lv) - m.exp); m.hp = HG.stat(m, 'hp'); });
  },
  ensureStarted() {
    const s = HG.state;
    ['intro', 'arrived', 'elderTalk', 'rival1'].forEach(f => s.flags[f] = true);
    s.flags.outfit = s.flags.outfit || 'paleo';
    if (!s.party.length) { HG.addToParty(HG.makeMon('handaxe', 10)); s.flags.starter = 'handaxe'; }
  }
};
window.addEventListener('keydown', e => { if (e.code === 'F8') { e.preventDefault(); HG.Dev.quickWin(); } });

// ── 미니게임 그만두기: 미니게임 중 Esc(태블릿은 메뉴 버튼) → 「그만둘까요?」 → 나가면 '다음에 다시 도전'
HG.Quit = {
  open: false,
  // 지금 하고 있는 미니게임 (6·25 작전 지도 안의 작은 게임은 작전 지도 전체를 그만둠)
  target() {
    if (!HG.game) return null;
    const act = HG.game.scene.getScenes(true), M = HG.game.scene;
    const war = M.getScene('War');
    if (war && (M.isActive('War') || M.isPaused('War'))) return war.onEnd ? war : null;
    return [...act].reverse().find(s => s.onEnd && (HG.MINIS.some(c => c.KEY === s.scene.key) || HG.Dev.OLD_MINIS.includes(s.scene.key))) || null;
  },
  ask() {
    const sc = this.target();
    if (!sc || this.open || (sc instanceof HG.MiniGame && sc.over)) return;
    this.open = true;
    const paused = HG.game.scene.getScenes(true).filter(s => s.scene.key !== 'UI');
    paused.forEach(s => s.scene.pause());
    HG.Keys.typing = true;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);z-index:40;';
    const btn = 'font-family:Galmuri11,sans-serif;font-size:20px;padding:8px 22px;border:3px solid #1a1410;border-radius:8px;margin:0 6px;';
    wrap.innerHTML = '<div style="background:#e9e2d0;border:4px solid #6b4a2b;outline:3px solid #1a1410;padding:22px 26px;font-family:Galmuri11,sans-serif;color:#1a1410;font-size:21px;text-align:center;max-width:92vw">' +
      '<div style="margin-bottom:6px">미니게임을 그만둘까요?</div><div style="font-size:15px;color:#6b4a2b;margin-bottom:16px">그만두어도 나중에 다시 도전할 수 있어요.</div>' +
      '<button id="qgo" style="' + btn + 'background:#3a6aa8;color:#e9e2d0">계속하기</button><button id="qno" style="' + btn + 'background:#bf4436;color:#e9e2d0">그만두기</button>' +
      '<div style="font-size:13px;color:#6b4a2b;margin-top:12px">←→ 고르고 스페이스</div></div>';
    document.body.appendChild(wrap);
    const bGo = wrap.querySelector('#qgo'), bNo = wrap.querySelector('#qno');
    let sel = 0;
    const mark = () => { bGo.style.outline = sel === 0 ? '4px solid #dcbc48' : 'none'; bNo.style.outline = sel === 1 ? '4px solid #dcbc48' : 'none'; };
    mark();
    const done = quit => {
      window.removeEventListener('keydown', key, true);
      wrap.remove(); this.open = false;
      setTimeout(() => { HG.Keys.typing = false; }, 60);
      if (!quit) { paused.forEach(s => { if (s.scene.isPaused()) s.scene.resume(); }); return; }
      HG.Sound.stop();
      // 6·25 안의 작은 게임까지 함께 닫기
      const M = HG.game.scene;
      if (sc.scene.key === 'War') HG.Dev.OLD_MINIS.concat(HG.MINIS.map(c => c.KEY)).forEach(k => { if (k !== 'War' && (M.isActive(k) || M.isPaused(k))) { const s = M.getScene(k); s.onEnd = null; if (s instanceof HG.MiniGame) s.over = true; M.stop(k); } });
      if (sc instanceof HG.MiniGame) sc.over = true;
      if (sc.time) sc.time.removeAllEvents(); if (sc.keys) sc.keys.stack = [];
      const cb = sc.onEnd; sc.onEnd = null;
      if (cb) cb('quit');
    };
    const key = e => {
      e.preventDefault(); e.stopPropagation();
      if (e.repeat) return;
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'KeyA' || e.code === 'KeyD') { sel = 1 - sel; mark(); HG.Sound.sfx('cursor'); }
      else if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyZ') done(sel === 1);
      else if (e.code === 'Escape' || e.code === 'KeyX' || e.code === 'Backspace') done(false);
    };
    window.addEventListener('keydown', key, true);
    bGo.onclick = () => done(false); bNo.onclick = () => done(true);
  }
};
window.addEventListener('keydown', e => { if (e.code === 'Escape' && !HG.Quit.open && !HG.Keys.typing && HG.Quit.target()) { e.preventDefault(); HG.Quit.ask(); } });

window.addEventListener('load', () => {
  HG.game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: HG.W, height: HG.H,
    backgroundColor: '#12100e',
    pixelArt: true,
    roundPixels: true,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [HG.BootScene, HG.TitleScene, HG.WorldScene, HG.BattleScene, HG.HuntScene, HG.GatherScene, HG.BuildScene, HG.RefugeeScene, HG.DefenseScene, HG.LandingScene, HG.WarScene, HG.TimingScene, HG.TradeScene, HG.StealthScene, HG.MapStageScene, HG.CreditsScene, HG.MenuScene, HG.CutsceneScene].concat(HG.MINIS)
  });
  // 미니게임 화면 왼쪽 아래에 「Esc 그만두기」 안내
  HG.game.events.once('ready', () => {
    HG.Dev.OLD_MINIS.concat(HG.MINIS.map(c => c.KEY)).forEach(k => { const sc = HG.game.scene.getScene(k); if (sc) sc.events.on('create', () => { if (k === 'War' && !sc.onEnd) return; HG.UI.text(sc, 4, HG.H - 24, 'Esc: 그만두기', { depth: 960, small: true, color: '#e9e2d0', stroke: '#1a1410' }); }); });
  });
  // 창을 닫을 때도 저장
  window.addEventListener('beforeunload', () => { if (HG.state) HG.Save.save(); });
  setInterval(() => { if (HG.state) HG.Save.save(); }, 30000);
});
