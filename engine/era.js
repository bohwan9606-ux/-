// 시대 이동 — 다음 시대로 갈 때 옷 바꾸기, 유물 진화, 레벨 맞추기, 시작 장소로 보내기
HG.Era = {
  next(id) { const i = HG.eraIndex(id); return HG.ERAS[i + 1]; },

  // 가 본 시대 중 가장 나중 시대 번호 (예전 기록은 인장·지금 시대로 계산)
  furthest() {
    const s = HG.state; if (!s) return 0;
    const fromStamps = Math.max(-1, ...s.stamps.map(id => HG.eraIndex(id))) + 1;
    return Math.min(HG.ERAS.length - 1, Math.max(s.flags.maxEra || 0, HG.eraIndex(s.era), fromStamps));
  },

  // 타임머신: 가 본 시대 사이를 자유롭게 오가기
  async travel(ev) {
    const s = HG.state, max = HG.Era.furthest();
    const list = HG.ERAS.slice(0, max + 1).filter(e => HG.stages[e.id] && e.id !== s.era);
    if (!list.length) { await ev.say('할아버지: 아직 다른 시대에 가 본 적이 없구나.'); return; }
    const names = list.map(e => e.name + (s.stamps.includes(e.id) ? ' ✔' : ''));
    const i = await ev.choose('어느 시대로 갈까? (✔ 시간 조각을 되찾은 시대)', names.concat(['그만두기']), list.length);
    if (i < 0 || i >= list.length) return;
    const to = list[i];
    await ev.say(`할아버지(무전기): ${to.name} 시대로 출발! 언제든 타임머신으로 다시 돌아올 수 있단다.`);
    HG.Era.enter(ev.scene, to.id);
    return 'gone';
  },

  // 다음 시대로 들어가기 (scene: 지금 장면)
  enter(scene, eraId) {
    const s = HG.state, st = HG.stages[eraId], era = HG.ERAS.find(e => e.id === eraId);
    s.era = eraId;
    s.flags.maxEra = Math.max(HG.Era.furthest(), HG.eraIndex(eraId));
    s.flags.outfit = era.outfit || s.flags.outfit;
    // 유물 진화
    const evo = [];
    s.party.concat(s.box).forEach(m => {
      const A = HG.ARTIFACTS[m.species];
      if (A.evolve && A.evolve.era === eraId && HG.ARTIFACTS[A.evolve.to]) {
        const from = A.name; m.species = A.evolve.to;
        m.moves = HG.movesAt(m.species, m.level);
        m.hp = HG.stat(m, 'hp');
        s.dex.seen[m.species] = true; s.dex.caught[m.species] = true;
        evo.push([from, HG.ARTIFACTS[m.species].name]);
      }
    });
    s.flags.pendingEvo = evo;
    // 뒤처진 동료 레벨 맞추기 (시대마다 기본 레벨)
    const base = st.baseLevel || 5;
    s.party.forEach(m => { if (m.level < base) { HG.gainExp(m, HG.expFor(base) - m.exp); } m.hp = HG.stat(m, 'hp'); });
    if (st.type === 'map') { s.player.map = '@map'; }
    else { s.player.map = st.start.map; s.player.x = st.start.x; s.player.y = st.start.y; s.player.dir = st.start.dir || 'down'; }
    HG.Save.save();
    HG.Sound.stop();
    HG.Era.startScene(scene);
  },

  // 지금 시대에 맞는 장면 시작
  startScene(scene) {
    const st = HG.stages[HG.state.era];
    scene.cameras.main.fadeOut(300);
    scene.time.delayedCall(320, () => {
      const mgr = scene.scene.manager;
      mgr.getScenes(true).forEach(sc => { if (sc.scene.key !== scene.scene.key) sc.scene.stop(); });
      if (st && st.type === 'map') scene.scene.start('MapStage', {});
      else {
        // 예전 기록이 지도형 시대였다가 마을형으로 바뀐 경우: 시대의 시작 마을로
        const pl = HG.state.player;
        if (st && st.start && !HG.maps[pl.map]) { pl.map = st.start.map; pl.x = st.start.x; pl.y = st.start.y; pl.dir = st.start.dir || 'down'; }
        scene.scene.start('World', {});
      }
    });
  },

  // 진화 알림 (도착하자마자 보여 줌)
  async showEvolutions(ev) {
    const list = HG.state.flags.pendingEvo || [];
    HG.state.flags.pendingEvo = [];
    for (const [a, b] of list) {
      HG.Sound.sfx('levelup');
      await ev.say(`어?! 새 시대의 기운을 받아 ${a}${HG.josa(a, '이', '가')} 반짝인다…!`, `${a}${HG.josa(a, '이', '가')} ${b}${HG.josa(b, '으로', '로')} 진화했다!`);
    }
  },

  // 타임머신 메뉴 (모든 시대 공용). cleared: 이 시대 인장을 받았는지
  async timeMachine(ev, cleared) {
    const s = HG.state;
    const items = ['동료 쉬게 하기', '동료 바꾸기', '유물 박물관', '기록 저장', '다음 시대로', '다른 시대로 가기', '그만두기'];
    while (true) {
      const i = await ev.choose('타임머신이다. 무엇을 할까?', items, 6);
      if (i === 0) { if (!s.party.length) { await ev.say('아직 동료가 없다.'); continue; } ev.heal(); await ev.say('동료들이 모두 기운을 되찾았다!'); }
      else if (i === 1) await ev.menu('swap');
      else if (i === 2) await ev.menu('museum');
      else if (i === 3) { HG.Save.save(); HG.Sound.sfx('item'); await ev.say('기록을 저장했다!'); }
      else if (i === 4) {
        if (!cleared) { await ev.say('할아버지: 이 시대의 시간 조각을 아직 못 찾았구나. 스승께 인정을 받아 보렴!'); continue; }
        if (!HG.Era.next(s.era)) { await ev.say('할아버지: 여기가 마지막 시대란다. 모든 시간 조각을 되찾았어! 고맙다, {name}.', '(유물 박물관에서 모은 동료들을 구경하거나, 지도의 거점을 다시 둘러볼 수 있어요.)'); continue; }
        const r = await ev.cutscene('nextEra');
        if (r === 'go') { HG.Era.enter(ev.scene, HG.Era.next(s.era).id); return 'gone'; }
        ev.setFlag('sawNextEra');
      }
      else if (i === 5) { if (await HG.Era.travel(ev) === 'gone') return 'gone'; }
      else return;
    }
  },

  // 시대 인장 받기 (스승을 이겼을 때)
  async award(ev, stamp) {
    const s = HG.state, era = HG.ERAS.find(e => e.id === s.era);
    await ev.cutscene('stamp', { name: stamp.name, title: era.title, icon: stamp.icon });
    if (!s.stamps.includes(s.era)) s.stamps.push(s.era);
    HG.giveTitle(era.title);
    ev.setFlag(s.era + 'Clear');
    ev.heal();
  }
};

// 대화 미션: 질문에 하나씩 답하기 (틀려도 설명을 듣고 넘어감). 끝까지 하면 'win'
HG.talkQuiz = async function (ev, speaker, cases) {
  let ok = 0;
  for (const q of cases) {
    const opts = HG.shuffle(q.options);
    const pick = await ev.choose(q.q, opts, 'none', { noDefault: true });
    if (opts[pick] === q.options[0]) { ok++; HG.Score.markQuiz(q, true); HG.Sound.sfx('correct'); await ev.say(`${speaker}: ${q.good || '바로 그거다!'}`); }
    else { HG.Sound.sfx('wrong'); await ev.say(`${speaker}: 음… '${q.options[0]}'${HG.josa(q.options[0], '이', '가')} 알맞단다.`, q.why); }
  }
  const g = HG.miniExp({ scene: { key: 'talkQuiz' }, p: { title: speaker } }, 40);
  await ev.say(`${cases.length}개 중 ${ok}개를 맞혔다! ` + HG.expMsg(g, 40));
  return 'win';
};
