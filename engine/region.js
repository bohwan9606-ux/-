// ─────────────────────────────────────────────
// 걸어 다니는 「작은 한반도」 시대를 만드는 도우미
// 가운데 마을에서 여러 지역 맵으로 걸어가며 나라 일을 돕고, 스승을 만나는 구조.
// HG.Region.make({ era, nodes, boss, quiz, place }) → { mission(ev,id), boss(ev), objective(s), T }
//   nodes: 예전 지도형 거점 그대로 [{ id, name, who, story, after, mission:{scene,p} | talk, reward }]
//   boss : { name, who, story, team?, bg, lose, win, after, reward?, stamp, final?, finalLines?, where }
// ─────────────────────────────────────────────
HG.Region = {
  make(spec) {
    const ERA = spec.era, nodes = spec.nodes, b = spec.boss, N = nodes.length;
    const flag = id => ERA + '_node_' + id;            // 지도형 시절의 기록과 같은 이름 → 예전 기록도 이어짐
    const T = nodes.map(n => flag(n.id));
    const tasks = s => T.filter(f => s.flags[f]).length;
    const byId = id => nodes.find(n => n.id === id);

    async function mission(ev, id) {
      const n = byId(id);
      if (ev.flag(flag(id))) { await ev.say(...(n.after || n.story)); return; }
      await ev.say(...n.story);
      const c = await ev.choose('도와줄까?', ['도와줄게요!', '다음에요'], 1);
      if (c !== 0) return;
      const r = n.talk ? await n.talk(ev) : await ev.mini(n.mission.scene, n.mission.p);
      if (r !== 'win') { await ev.say('아쉽다! 언제든 다시 도전할 수 있어.'); return; }
      ev.setFlag(flag(id));
      const rw = n.reward || {};
      if (rw.mon) { const nm = HG.ARTIFACTS[rw.mon[0]].name; ev.addMon(rw.mon[0], rw.mon[1]); HG.Sound.sfx('levelup'); await ev.say(`${nm}${HG.josa(nm, '이', '가')} 동료가 되었다!` + (rw.text ? ` (${rw.text})` : '')); }
      if (rw.item) await ev.give(rw.item[0], rw.item[1]);
      HG.Sound.sfx('stamp');
      const d = tasks(ev.state);
      await ev.say(`「${n.name}」의 일을 도왔다! (${d}/${N})` + (d >= N ? `\n이제 ${b.where}의 ${b.name}${HG.josa(b.name, '을', '를')} 만나러 가자!` : ''));
    }

    async function boss(ev) {
      const cleared = HG.state.stamps.includes(ERA);
      if (cleared) { await ev.say(...(b.after || [b.name + ': 다시 만나 반갑구나.'])); return; }
      const d = tasks(ev.state);
      if (d < N) { await ev.say(`${b.name}: 먼저 여러 곳을 돌아보며 사람들을 도와주고 오너라. (지금 ${d}/${N})`); return; }
      // 마지막 보스는 다시 도전할 때 퀴즈를 건너뛰고 처음 맞힌 개수를 그대로 씀
      const QK = ERA + '_bossQuiz', LK = ERA + '_bossLoss', F = HG.state.flags;
      let n;
      if (b.final && F[QK] != null) {
        n = F[QK];
        await ev.say(`${b.name}: 또 왔구나, 꼬마 시간 여행자! 이번엔 그냥 넘어가지 않겠다!`, `(지난번 퀴즈에서 맞힌 ${n}개가 그대로 적용돼요.)`);
      } else {
        await ev.say(...b.story);
        n = await ev.quiz(b.quiz || spec.quiz, b.quizCount || 3);
        if (b.final) F[QK] = n;
      }
      if (!b.team) {
        if (n < 2) { await ev.say(`${b.name}: ${n}개를 맞혔구나. 조금만 더 알아보고 다시 오너라. 사람들의 이야기를 떠올려 보렴!`); return; }
        await ev.say(`${b.name}: ${n}개나 맞혔구나!`);
      } else {
        const [big, small] = b.boostAt || [3, 2];
        const boost = n >= big ? 2 : n >= small ? 1 : 0;
        await ev.say(`${b.name}: ${n}개를 맞혔구나. ` + (boost ? '좋다, 겨뤄 보자!' : '아쉽지만 힘으로 겨뤄 보자!'));
        const onLose = b.final ? async () => {
          F[LK] = (F[LK] || 0) + 1;
          await ev.say(HG.pick(['할아버지(무전기): 괜찮다, {name}! 동료들을 골고루 키워서 다시 도전해 보렴.', '할아버지(무전기): 시간 괴물 대왕은 「종이」 기록의 힘에 약하단다. 기록 유물을 데려가 보렴!', '할아버지(무전기): 들판에서 유물들과 겨루며 레벨을 올리고 다시 가 보자!']));
          if (F[LK] === 2) { await ev.say('할아버지(무전기): 이걸 가져가렴. 힘든 싸움에 도움이 될 거다.'); await ev.give('meat', 3); await ev.give('berry', 2); }
        } : null;
        const r = await ev.battle({ trainer: { name: b.name, sprite: b.who, scale: b.whoScale, team: b.team, intro: b.intro, possessed: b.possessed, phase2: b.phase2, lose: b.lose || [b.name + ': 훌륭하구나!'] }, bg: b.bg || 'bb_castle', music: 'boss', atkBoost: boost, onLose });
        if (r !== 'win') return;
      }
      await ev.say(...b.win);
      if (b.reward && b.reward.mon) { const [sp, lv] = b.reward.mon, nm = HG.ARTIFACTS[sp].name; ev.addMon(sp, lv); HG.Sound.sfx('levelup'); await ev.say(`${nm}${HG.josa(nm, '이', '가')} 동료가 되었다!` + (b.reward.text ? ` (${b.reward.text})` : '')); }
      await HG.Era.award(ev, b.stamp);
      if (b.final) { await ev.say(...(b.finalLines || [])); await ev.scene.overlay('Credits', {}); if (HG.Honor) await HG.Honor.invite(ev); return; }
      await ev.say(`할아버지(무전기): 시간 조각이 돌아왔구나! ${spec.place}의 타임머신으로 오렴!`);
    }

    function objective(s) {
      if (!s.flags[ERA + '_arrived']) return '';
      const d = tasks(s);
      if (d < N) return `${spec.goal || '돌아보기'} ${d}/${N} (${nodes.map(n => n.short || n.name).join(' · ')})`;
      if (!s.stamps.includes(ERA)) return `${b.where}의 ${b.name}${HG.josa(b.name, '을', '를')} 만나자`;
      return `${spec.place}의 타임머신으로 가자`;
    }

    // 아직 안 도운 사람 알려 주기 (안내하는 사람이 씀)
    function remaining(s) { return nodes.filter(n => !s.flags[flag(n.id)]).map(n => n.hint || n.name); }

    // 거점 사람과 스승을 맵에 놓을 때
    const npc = (id, x, y, dir) => { const n = byId(id); return { id, sprite: n.who, x, y, dir: dir || 'down', mark: ev => !ev.flag(flag(id)), talk: async ev => mission(ev, id) }; };
    const bossNpc = (x, y, dir) => ({ id: 'boss', sprite: b.who, x, y, dir: dir || 'down', mark: ev => tasks(ev.state) >= N && !HG.state.stamps.includes(ERA), talk: async ev => boss(ev) });

    return { mission, boss, objective, remaining, T, tasks, flag, npc, bossNpc };
  },

  // 가운데 마을의 첫 도착 대사
  arrive(era, lines) {
    return async ev => {
      if (!ev.flag(era + '_arrived')) {
        await ev.say(lines[0]);
        await HG.Era.showEvolutions(ev);
        if (lines.length > 1) await ev.say(...lines.slice(1));
        await HG.Secret.tip(ev);
        ev.setFlag(era + '_arrived');
      } else await HG.Era.showEvolutions(ev);
    };
  },

  enc(table, lo, hi) { return () => { let r = Math.random() * 100, sp = table[0][0]; for (const [id, w] of table) { if ((r -= w) < 0) { sp = id; break; } } return [sp, HG.rand(lo, hi)]; }; }
};

// 걷는 맵에서 같이 쓰는 그림 (건물·길·배 등)
HG.Art.register(function (scene) {
  const Px = HG.Pixel;
  const def = (key, w, h, fn) => { if (!scene.textures.exists(key)) Px.draw(scene, key, w, h, (p, ctx) => { fn(p); Px.outline(ctx, w, h); }); };
  // 땅: 포장길 · 보도블록 · 눈 · 갯벌
  Px.draw(scene, 't_road', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'G'); for (let i = 0; i < 6; i++) p((i * 7) % 16, (i * 5) % 16, 'g'); });
  Px.draw(scene, 't_walk', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'l'); Px.rect(p, 0, 7, 16, 1, 'g'); Px.rect(p, 7, 0, 1, 7, 'g'); Px.rect(p, 3, 8, 1, 8, 'g'); Px.rect(p, 11, 8, 1, 8, 'g'); });
  Px.draw(scene, 't_snow', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'w'); p(3, 4, 'l'); p(11, 9, 'l'); p(7, 13, 'l'); });
  Px.draw(scene, 't_line', 16, 16, p => { Px.rect(p, 0, 0, 16, 16, 'G'); Px.rect(p, 0, 7, 6, 2, 'y'); Px.rect(p, 10, 7, 6, 2, 'y'); });
  // 꽃밭 (들어갈 수 없음): 짙은 풀 위에 빽빽한 들꽃
  Px.draw(scene, 't_flowerbed', 16, 16, p => {
    Px.rect(p, 0, 0, 16, 16, 'E'); for (let i = 0; i < 10; i++) p((i * 5 + 1) % 16, (i * 7 + 3) % 16, 'e');
    [[2, 2, 'P'], [8, 1, 'Y'], [13, 3, 'r'], [5, 6, 'w'], [11, 7, 'P'], [1, 10, 'y'], [7, 11, 'r'], [14, 11, 'w'], [4, 14, 'Y'], [10, 14, 'P']].forEach(([x, y, c]) => { p(x, y, c); p(x + 1, y, c); p(x, y + 1, c); p(x + 1, y + 1, c); p(x, y + 2, 'f'); });
  });
  Object.assign(HG.TILES, { 'A': { tex: 't_road' }, 'v': { tex: 't_walk' }, 'n': { tex: 't_snow' }, '-': { tex: 't_line' }, 'h': { tex: 't_flowerbed', solid: true } });
  // 종각 (2×2)
  def('o_bellhouse', 32, 32, p => { Px.poly(p, [[0, 10], [16, 2], [32, 10]], 'G'); Px.rect(p, 2, 10, 28, 2, 'R'); Px.rect(p, 4, 12, 2, 18, 'R'); Px.rect(p, 26, 12, 2, 18, 'R'); Px.ellipse(p, 16, 21, 6, 7, 'f'); Px.rect(p, 10, 26, 12, 2, 'e'); Px.rect(p, 2, 30, 28, 2, 'g'); });
  // 가마 (2×1)
  def('o_kiln', 32, 16, p => { Px.ellipse(p, 16, 10, 15, 6, 'n'); Px.rect(p, 1, 10, 30, 5, 'b'); Px.rect(p, 4, 9, 4, 4, 'k'); Px.rect(p, 5, 10, 2, 2, 'o'); Px.rect(p, 24, 2, 3, 6, 'g'); });
  // 측우기 (1×1)
  def('o_raingauge', 16, 16, p => { Px.rect(p, 2, 11, 12, 4, 'l'); Px.rect(p, 3, 12, 10, 1, 'g'); Px.rect(p, 5, 2, 6, 9, 'u'); Px.rect(p, 6, 3, 1, 7, 'c'); Px.rect(p, 5, 5, 6, 1, 'U'); });
  // 거북선 (2×1, 물 위)
  def('o_turtle', 32, 16, p => { Px.ellipse(p, 16, 9, 14, 5, 'b'); Px.ellipse(p, 16, 7, 12, 4, 'G'); for (let x = 7; x < 26; x += 3) p(x, 6, 'l'); Px.rect(p, 28, 5, 4, 3, 'e'); p(31, 5, 'y'); Px.rect(p, 4, 12, 24, 2, 'B'); });
  // 근대 벽돌 건물 (2×2)
  def('o_brick', 32, 32, p => { Px.rect(p, 2, 6, 28, 25, 'r'); Px.rect(p, 2, 3, 28, 4, 'G'); for (let y = 9; y < 30; y += 3) Px.rect(p, 2, y, 28, 1, 'R'); [[6, 11], [14, 11], [22, 11], [6, 20], [22, 20]].forEach(([x, y]) => { Px.rect(p, x, y, 5, 6, 'c'); Px.rect(p, x, y + 3, 5, 1, 'w'); }); Px.rect(p, 13, 21, 6, 10, 'B'); });
  // 현대 건물 (2×2)
  def('o_building', 32, 32, p => { Px.rect(p, 3, 2, 26, 29, 'l'); for (let y = 5; y < 26; y += 5) for (let x = 6; x < 27; x += 6) Px.rect(p, x, y, 4, 3, 'c'); Px.rect(p, 12, 25, 8, 6, 'G'); Px.rect(p, 3, 2, 26, 1, 'g'); });
  // 기념관 (2×2)
  def('o_memorial', 32, 32, p => { Px.poly(p, [[0, 10], [16, 3], [32, 10]], 'l'); Px.rect(p, 2, 10, 28, 3, 'w'); [5, 11, 19, 25].forEach(x => Px.rect(p, x, 13, 3, 15, 'w')); Px.rect(p, 0, 28, 32, 4, 'g'); });
  // 발굴 터 표지판 (1×1): 나무 말뚝 + 노랑·검정 줄
  def('o_excav', 16, 16, p => { Px.rect(p, 7, 3, 2, 12, 'b'); Px.rect(p, 2, 3, 12, 6, 'Y'); Px.rect(p, 3, 4, 10, 4, 'w'); Px.rect(p, 4, 5, 8, 1, 'k'); Px.rect(p, 4, 7, 6, 1, 'g'); [0, 15].forEach(x => Px.rect(p, x, 11, 1, 4, 'b')); for (let x = 0; x < 16; x += 2) { p(x, 12, 'y'); p(x + 1, 12, 'k'); } });
  // 발굴 터 부표 (1×1, 물 위)
  def('o_buoy', 16, 16, p => { Px.ellipse(p, 8, 12, 5, 3, 'w'); Px.rect(p, 4, 9, 9, 3, 'r'); Px.rect(p, 4, 12, 9, 1, 'w'); Px.rect(p, 7, 1, 1, 8, 'G'); Px.rect(p, 8, 1, 5, 3, 'y'); Px.rect(p, 2, 14, 12, 1, 'c'); });
  // 무령왕릉 (2×2): 풀 덮인 둥근 무덤 앞에 벽돌로 쌓은 아치 입구
  def('o_muryeong', 32, 32, p => {
    Px.ellipse(p, 16, 17, 15, 12, 'e'); Px.ellipse(p, 14, 13, 10, 6, 'f'); Px.rect(p, 1, 26, 30, 5, 'n');
    Px.rect(p, 9, 14, 14, 17, 'R'); Px.ellipse(p, 16, 14, 7, 5, 'R');
    for (let y = 16; y < 31; y += 3) Px.rect(p, 9, y, 14, 1, 'b');
    for (let y = 14; y < 31; y += 6) { p(12, y + 1, 'b'); p(19, y + 1, 'b'); p(15, y + 4, 'b'); }
    Px.rect(p, 12, 19, 8, 12, 'k'); Px.ellipse(p, 16, 19, 4, 3, 'k');
    Px.rect(p, 6, 28, 20, 3, 'l'); Px.rect(p, 7, 28, 18, 1, 'w');
  });
  // 시간의 틈 (2×2)
  def('o_rift', 32, 32, p => { for (let r = 14; r > 0; r -= 3) Px.ellipse(p, 16, 16, r, r, r % 2 ? 'p' : 'P'); Px.ellipse(p, 16, 16, 3, 3, 'k'); });
  // 천막 가게 (2×1)
  def('o_stall', 32, 16, p => { Px.rect(p, 1, 1, 30, 5, 'r'); for (let x = 1; x < 31; x += 6) Px.rect(p, x, 1, 3, 5, 'w'); Px.rect(p, 3, 6, 2, 9, 'b'); Px.rect(p, 27, 6, 2, 9, 'b'); Px.rect(p, 5, 9, 22, 4, 'n'); p(9, 8, 'o'); p(15, 8, 'e'); p(21, 8, 'y'); });
  Object.assign(HG.OBJECTS, {
    bellhouse: { tex: 'o_bellhouse', w: 2, h: 2 }, kiln: { tex: 'o_kiln', w: 2, h: 1 }, raingauge: { tex: 'o_raingauge', w: 1, h: 1 },
    turtle: { tex: 'o_turtle', w: 2, h: 1 }, brick: { tex: 'o_brick', w: 2, h: 2 }, building: { tex: 'o_building', w: 2, h: 2 },
    memorial: { tex: 'o_memorial', w: 2, h: 2 }, muryeong: { tex: 'o_muryeong', w: 2, h: 2 }, excav: { tex: 'o_excav', w: 1, h: 1 }, buoy: { tex: 'o_buoy', w: 1, h: 1 }, rift: { tex: 'o_rift', w: 2, h: 2 }, stall: { tex: 'o_stall', w: 2, h: 1 }
  });
});
