// ─────────────────────────────────────────────
// 스테이지 1: 구석기 시대
// 지도 4개: 할아버지 연구실(시작) → 강가 막집 마을 → 사냥터 들판 → 큰 동굴(부족장)
// 이 파일의 대사와 역사 내용은 docs/역사내용-구석기.md 에 따로 정리
// ─────────────────────────────────────────────
(function () {
  const B = HG.MapBuilder;
  const RESPAWN = { map: 'village', x: 20, y: 14, dir: 'up' };
  const rivalPick = { handaxe: 'spear', spear: 'ember', ember: 'handaxe' };

  // ── 할아버지 연구실 (현대, 시작 장면)
  const lab = new B(10, 8, 'L');
  lab.rect(0, 0, 10, 1, 'W').rect(0, 0, 1, 8, 'W').rect(9, 0, 1, 8, 'W').rect(0, 7, 10, 1, 'W');
  lab.dots([[1, 1], [2, 1], [7, 1], [8, 1]], 'S').dots([[1, 5], [8, 5]], 'K');
  HG.maps.lab = {
    id: 'lab', name: '할아버지의 연구실', music: 'title', tiles: lab.rows(),
    objects: [{ kind: 'timemachine', x: 4, y: 2 }],
    npcs: [
      { id: 'grandpa', sprite: 'grandpa', x: 6, y: 3, dir: 'left', talk: ['할아버지: 내 평생의 발명품, 타임머신이란다!'] },
      { id: 'rival', sprite: 'rival_modern', x: 3, y: 4, dir: 'right', talk: ['하람: 우와, 진짜 멋지다!'] }
    ],
    onEnter: async ev => {
      if (ev.flag('intro')) return;
      const g = ev.npc('grandpa'), r = ev.npc('rival');
      await ev.say('할아버지: {name}야, 하람아! 이게 내가 만든 타임머신이란다.');
      ev.face(r, 'up');
      await ev.say('하람: 우와! 이 빨간 버튼은 뭐예요? 꾹!');
      ev.face(g, 'down');
      await ev.bang(g);
      ev.shake();
      await ev.say('할아버지: 안 돼…! 쿠구구궁! 타임머신이 모두를 빨아들였다!');
      ev.setFlag('intro');
      await ev.cutscene('warp');
      await ev.warp('village', 18, 13, 'right');
    }
  };

  // ── 강가 막집 마을
  const v = new B(30, 20, '.');
  v.rect(0, 0, 30, 1, 'T').rect(0, 0, 1, 16, 'T').rect(27, 0, 3, 16, '#');
  v.rect(0, 16, 30, 1, 's').rect(0, 17, 30, 3, '~');
  v.rect(13, 0, 2, 10, ':').rect(15, 9, 12, 1, ':').rect(14, 10, 1, 4, ':').rect(15, 13, 4, 1, ':');
  v.set(27, 9, 'D');
  v.rect(22, 1, 4, 2, 'T').dots([[17, 1], [1, 15], [2, 15], [26, 14], [26, 15]], 'T');
  v.dots([[5, 15], [24, 7], [9, 6]], 'o');
  v.dots([[6, 1], [10, 2], [19, 3], [17, 7], [3, 9], [21, 11], [9, 14], [24, 13], [11, 4], [16, 15], [5, 10]], '"');
  HG.maps.village = {
    id: 'village', name: '강가 막집 마을', music: 'village', tiles: v.rows(),
    waterTalk: ['맑은 강물이 흐른다.', '구석기 사람들은 강가에서 물을 마시고 물고기도 잡았다.'],
    objects: [
      { kind: 'hut', x: 3, y: 2, talk: ['나뭇가지를 세우고 짐승 가죽을 덮어 만든 막집이다.', '금방 짓고 금방 걷을 수 있다.'] },
      { kind: 'hut', x: 7, y: 2, talk: ['막집 안에 짐승 가죽 깔개가 깔려 있다.'], secret: { id: 'paleolithic_hut', item: ['meat', 2], fact: '막집은 나뭇가지로 뼈대를 세우고 짐승 가죽이나 풀을 덮어 만든 집이야. 먹을 것을 찾아 옮겨 다녔기 때문에 금방 짓고 걷을 수 있게 만들었지.' } },
      { kind: 'hut', x: 3, y: 6, talk: ['막집이다. 안에서 아기가 새근새근 자고 있다.'] },
      { kind: 'hut', x: 6, y: 11, talk: ['막집이다. 말린 고기가 걸려 있다.'] },
      { kind: 'fire', x: 10, y: 8, talk: ['모닥불이 활활 타오르고 있다. 따뜻하다!'], secret: { id: 'paleolithic_fire', mon: ['ember', 6], fact: '구석기 사람들은 불을 써서 추위를 이기고, 고기를 익혀 먹고, 사나운 짐승을 쫓았어.' } },
      { kind: 'bush', x: 2, y: 12, talk: ['빨간 열매가 주렁주렁 달려 있다.'] },
      { kind: 'bush', x: 2, y: 14, talk: ['빨간 열매가 주렁주렁 달려 있다.'], secret: { id: 'paleolithic_bush', item: ['berry', 3], fact: '구석기 사람들은 농사를 짓지 않았어. 열매를 따고, 사냥과 물고기잡이로 먹을 것을 구했지.' } },
      { kind: 'sign', x: 12, y: 1, talk: ['↑ 사냥터 들판', '긴 풀숲에 시간 괴물에게 홀린 유물이 숨어 있다.'] },
      { kind: 'sign', x: 25, y: 10, talk: ['→ 큰 동굴', '부족장이 사는 곳.'] },
      { kind: 'timemachine', x: 19, y: 12, smoke: true, talk: async ev => timeMachine(ev) }
    ],
    npcs: [
      { id: 'elder', sprite: 'npc_elder', x: 4, y: 4, dir: 'down', mark: ev => ev.flag('arrived') && !ev.flag('starter'), talk: async ev => elder(ev) },
      { id: 'builder', sprite: 'npc_builder', x: 10, y: 4, dir: 'down', mark: ev => ev.flag('starter') && !ev.flag('taskBuild'), talk: async ev => builder(ev) },
      { id: 'fire', sprite: 'npc_fire', x: 11, y: 8, dir: 'left', talk: ['불 지키는 사람: 불은 정말 소중해!', '밤에는 추위를 막아 주고, 고기를 익혀 먹을 수 있게 해 주지.', '불을 피워 두면 사나운 짐승도 가까이 오지 못한단다.'] },
      { id: 'tool', sprite: 'npc_hunter', x: 8, y: 7, dir: 'down', talk: ['돌 깨는 사람: 탁! 탁! 돌과 돌을 부딪쳐 깨뜨리거나 떼어 내면 날카로운 도구가 돼.', '이렇게 만든 도구를 「뗀석기」라고 하지.', '주먹도끼, 찍개, 긁개 모두 뗀석기란다. 쓰임새에 따라 모양이 조금씩 달라.'] },
      { id: 'gather', sprite: 'npc_woman', x: 4, y: 13, dir: 'left', mark: ev => ev.flag('starter') && !ev.flag('taskGather'), talk: async ev => gatherer(ev) },
      { id: 'kid', sprite: 'npc_kid', x: 17, y: 5, dir: 'down', wander: 2, talk: ['아이: 우리는 먹을 것이 떨어지면 다른 곳으로 옮겨 다녀.', '그래서 동굴에서 살거나, 금방 지을 수 있는 막집을 짓는 거야!'] },
      { id: 'hunter', sprite: 'npc_chief', x: 21, y: 4, dir: 'left', mark: ev => ev.flag('starter') && !ev.flag('taskHunt'), talk: async ev => hunterChief(ev) },
      { id: 'guard', sprite: 'npc_guard', x: 26, y: 8, dir: 'down', talk: async ev => guard(ev) }
    ],
    warps: [
      { x: 13, y: 0, to: 'field', tx: 13, ty: 22, dir: 'up' }, { x: 14, y: 0, to: 'field', tx: 14, ty: 22, dir: 'up' },
      { x: 27, y: 9, to: 'cave', tx: 8, ty: 18, dir: 'up' }
    ],
    triggers: [
      { x: 13, y: 1, w: 2, when: ev => !ev.flag('starter'), run: async ev => { await ev.say('마을 밖은 위험해 보인다.', '먼저 마을 어른을 만나 보자. (막집 앞에 계신다)'); await ev.stepPlayer('down'); } },
      { x: 26, y: 9, when: ev => tasksDone(ev.state) < 3, run: async ev => {
        const g = ev.npc('guard'); await ev.bang(g);
        await ev.say(`동굴지기: 잠깐! 부족장님은 마을 일을 세 가지 도운 사람만 만나 주셔. (지금 ${tasksDone(ev.state)}/3)`);
        await ev.stepPlayer('left');
      } }
    ],
    onEnter: async ev => {
      if (!ev.flag('arrived')) await arrival(ev);
    }
  };

  // ── 사냥터 들판
  const f = new B(30, 24, '.');
  f.border('T');
  f.rect(13, 2, 2, 22, ':');
  f.rect(3, 3, 8, 7, ',').rect(18, 3, 9, 7, ',').rect(2, 15, 9, 6, ',').rect(17, 15, 10, 6, ',');
  f.rect(4, 11, 5, 2, '~').rect(3, 11, 1, 2, 's').rect(9, 11, 1, 2, 's').rect(4, 13, 5, 1, 's');
  f.dots([[16, 9], [11, 13], [22, 12], [25, 11], [8, 21], [20, 22]], 'o');
  f.dots([[1, 1], [2, 1], [27, 1], [28, 1], [12, 1], [15, 1]], 'T');
  f.dots([[16, 5], [12, 7], [16, 17], [11, 11], [24, 13], [19, 11], [6, 14], [15, 21]], '"');
  HG.maps.field = {
    id: 'field', name: '사냥터 들판', music: 'field', tiles: f.rows(),
    waterTalk: ['작은 연못이다. 짐승 발자국이 잔뜩 찍혀 있다.'],
    objects: [
      { kind: 'sign', x: 12, y: 2, talk: ['↑ 북쪽 길', '시간 안개가 자욱해서 지나갈 수 없다…', '(시간 조각을 더 모으면 열릴지도?)'] },
      { kind: 'bush', x: 16, y: 13, talk: ['열매 덤불이다. 새들이 열매를 쪼아 먹고 있다.'] }
    ],
    npcs: [
      { id: 'fhunter', sprite: 'npc_hunter', x: 16, y: 11, dir: 'left', talk: ['사냥꾼: 긴 풀숲에 들어가면 홀린 유물이 튀어나와.', '이기면 정신을 차리고 동료가 되어 준다고!', '사냥꾼: 북쪽 풀숲일수록 강한 녀석이 나와. 아주 드물게 반짝이는 녀석도 있다던데…', '사냥꾼: 메뉴(Esc)에서 동료의 순서를 바꿀 수 있어. 맨 앞 동료가 먼저 싸우지.'] },
      { id: 'fkid', sprite: 'npc_kid', x: 15, y: 19, dir: 'down', talk: async ev => {
        if (!ev.flag('fieldGift')) { await ev.say('아이: 나는 열매랑 뿌리를 캐러 왔어. 이걸 채집이라고 해!', '아이: 아까 어른들이 나눠 준 고기야. 너 가져!'); await ev.give('meat', 1); ev.setFlag('fieldGift'); }
        else await ev.say('아이: 구석기 사람들은 사냥하고 채집해서 먹을 것을 구했대. 바로 우리 이야기지!');
      } }
    ],
    warps: [{ x: 13, y: 23, to: 'village', tx: 13, ty: 1, dir: 'down' }, { x: 14, y: 23, to: 'village', tx: 14, ty: 1, dir: 'down' }],
    encounterRate: 0.07,
    encounter: (x, y) => {
      const deep = y <= 10;
      const table = [['chopper', 30], ['scraper', 30], ['handaxe', 12], ['spear', 12], ['ember', 9], ['tanged', deep ? 6 : 2]];
      let r = Math.random() * table.reduce((a, t) => a + t[1], 0);
      let sp = table[0][0];
      for (const [id, w] of table) { if ((r -= w) < 0) { sp = id; break; } }
      return [sp, deep ? HG.rand(4, 6) : HG.rand(3, 5)];
    }
  };

  // ── 큰 동굴 (부족장)
  const c = new B(16, 20, '#');
  c.rect(2, 2, 12, 17, '_');
  c.rect(2, 10, 12, 2, '#').set(8, 10, '_').set(8, 11, '_').set(9, 11, '_');
  c.set(8, 19, '_');
  c.dots([[4, 1], [7, 1], [11, 1]], 'P');
  c.dots([[3, 15], [12, 6], [4, 7], [11, 16]], 'b');
  HG.maps.cave = {
    id: 'cave', name: '큰 동굴', music: 'cave', tiles: c.rows(),
    objects: [
      { kind: 'fire', x: 6, y: 4, talk: ['동굴을 밝히는 불이다.'] },
      { kind: 'fire', x: 10, y: 4, talk: ['동굴을 밝히는 불이다.'] }
    ],
    npcs: [
      { id: 'trainee2', sprite: 'npc_guard', x: 9, y: 11, dir: 'left', talk: ['수련생: 부족장님은 겨루기 전에 퀴즈를 내셔. 마을 사람들 이야기가 힌트야!'] },
      { id: 'chief', sprite: 'npc_elder', x: 8, y: 4, dir: 'down', noTurn: false, mark: ev => ['taskGather', 'taskHunt', 'taskBuild'].every(f => ev.flag(f)) && !ev.flag('paleoClear'), talk: async ev => chief(ev) }
    ],
    warps: [{ x: 8, y: 19, to: 'village', tx: 26, ty: 9, dir: 'left' }],
    tileTalk: { 'P': ['동굴 벽에 짐승과 사람 그림이 그려져 있다.', '사냥이 잘되기를 바라며 그린 것일까?'], 'b': ['짐승 뼈가 놓여 있다. 사냥한 짐승의 뼈 같다.'] }
  };

  // ─────────────────────────────────────────────
  // 이벤트
  // ─────────────────────────────────────────────
  async function arrival(ev) {
    await ev.wait(400);
    ev.playerFace('left'); await ev.wait(350); ev.playerFace('down'); await ev.wait(350); ev.playerFace('right');
    await ev.say('…여기는 어디지?', '할아버지(무전기): {name}야, 들리니? 거기는 아주 먼 옛날, 「구석기 시대」란다!');
    await ev.flash();
    ev.setOutfit('paleo');
    HG.Sound.sfx('levelup');
    await ev.say('변장 기능으로 옷이 구석기 가죽옷으로 바뀌었다!', '할아버지: 이 시대의 스승께 인정을 받으면 시간 조각을 되찾을 수 있어. 왼쪽 위 「목표」를 따라가 보렴!');
    await HG.controlsTip(ev);
    ev.setFlag('arrived');
  }

  const TASKS = ['taskGather', 'taskHunt', 'taskBuild'];
  const tasksDone = st => TASKS.filter(t => st.flags[t]).length;

  async function elder(ev) {
    if (!ev.flag('starter')) {
      await ev.say('마을 어른: 요즘 돌로 만든 도구들이 「시간 괴물」에게 홀려 날뛰고 있단다.', '마을 어른: 우리 마을의 유물 세 가지 중 하나를 골라 함께 다니렴.');
      const sp = await ev.cutscene('starter');
      ev.addMon(sp, 5);
      ev.setFlag('starter', sp);
      HG.Sound.sfx('levelup');
      await ev.say(`{name}${HG.josa(HG.state.player.name, '은', '는')} ${HG.ARTIFACTS[sp].name}${HG.josa(HG.ARTIFACTS[sp].name, '을', '를')} 첫 동료로 맞이했다!`);
      await rival1(ev);
      await ev.say('마을 어른: 부족장님은 마을 일을 잘 돕는 아이만 만나 주신단다.', '마을 어른: 채집하는 사람, 사냥꾼 대장, 막집 짓는 사람을 도와 보렴. 머리 위에 「!」가 있는 사람들이야.');
      await HG.Secret.tip(ev);
      await ev.give('meat', 2);
      return;
    }
    if (!ev.flag('paleoClear')) {
      const n = tasksDone(ev.state);
      if (n < 3) await ev.say(`마을 어른: 마을 일을 ${n}가지 도왔구나. 「!」가 있는 사람을 찾아가 보렴.`);
      else await ev.say('마을 어른: 마을 일을 모두 도왔구나! 이제 동쪽 큰 동굴의 부족장님을 찾아가 보거라.');
    } else {
      await ev.say('마을 어른: 부족장님께 인정을 받았다고? 장하구나!', '마을 어른: 앞으로 시간이 흐르면 사람들은 돌을 갈아서 더 정교한 도구를 만들게 된단다… 그건 먼 훗날의 이야기지.');
    }
  }

  async function rival1(ev) {
    const p = ev.state.player;
    const S = ev.scene;
    const spots = [[p.x + 1, p.y], [p.x - 1, p.y], [p.x, p.y + 1], [p.x + 1, p.y + 1], [p.x - 1, p.y + 1]];
    const spot = spots.find(([x, y]) => !S.solid(x, y)) || [p.x, p.y + 1];
    const r = ev.spawn({ id: 'rival', sprite: 'rival_paleo', x: spot[0], y: spot[1], dir: 'up' });
    ev.facePlayer(r);
    r.spr.setAlpha(0); S.tweens.add({ targets: r.spr, alpha: 1, duration: 300 });
    await ev.bang(r);
    await ev.say('하람: {name}! 너도 여기 있었구나! 나는 북쪽 들판에서 홀린 유물들이랑 겨루면서 동료를 모으고 있어.', '하람: 누가 먼저 부족장님께 인정받나 시합이다! 먼저 간다~');
    ev.setFlag('rival1');
    await ev.walk(r, ['down', 'down'], 150);
    ev.remove(r);
  }

  // 마을 일 1: 채집
  async function gatherer(ev) {
    if (!ev.flag('starter')) { await ev.say('채집하는 사람: 숲에서 열매를 따고 뿌리를 캐는 것을 「채집」이라고 해.'); return; }
    if (!ev.flag('taskGather')) {
      await ev.say('채집하는 사람: 숲에서 열매를 따고 뿌리를 캐는 것을 「채집」이라고 해. 사냥만으로는 먹을 것이 모자라거든.');
      const c = await ev.choose('채집하는 사람: 같이 숲에 가서 먹을거리를 모아 볼래?', ['좋아요!', '다음에요'], 1);
      if (c !== 0) return;
      const r = await ev.gather();
      if (r === 'win') { ev.setFlag('taskGather'); await doneTask(ev, '채집'); }
      return;
    }
    await ev.say('채집하는 사람: 덕분에 먹을거리가 넉넉해졌어. 열매를 먹고 기운 내렴!');
    if (ev.state.party.length) { ev.heal(); await ev.say('동료들이 모두 기운을 되찾았다!'); }
    const c = await ev.choose('채집하는 사람: 한 번 더 숲에 갈래?', ['갈래요!', '괜찮아요'], 1);
    if (c === 0) await ev.gather();
  }

  // 마을 일 2: 매머드 사냥 → 찍개가 동료로
  async function hunterChief(ev) {
    if (!ev.flag('starter')) { await ev.say('사냥꾼 대장: 사냥은 위험한 일이야. 먼저 마을 어른께 가 보렴.'); return; }
    if (!ev.flag('taskHunt')) await ev.say('사냥꾼 대장: 매머드는 덩치가 엄청나서 혼자서는 절대 못 잡아. 여럿이 힘을 모아 몰아야 하지.', '사냥꾼 대장: 잡으면 고기를 모두 나눠 갖는다. 그게 우리 무리의 규칙이야.');
    const c = await ev.choose('사냥꾼 대장: 매머드 사냥에 함께 갈래?', ['같이 간다!', '다음에'], 1);
    if (c !== 0) return;
    const r = await ev.hunt();
    if (r !== 'win') return;
    if (!ev.flag('taskHunt')) {
      ev.setFlag('taskHunt');
      await ev.say('사냥꾼 대장: 하하, 솜씨가 대단한데! 사냥한 고기를 손질하던 이 녀석이 너를 따라가고 싶대.');
      ev.addMon('chopper', 6);
      HG.Sound.sfx('levelup');
      await ev.say('찍개가 동료가 되었다! (한쪽 날로 고기를 자르고 손질하던 뗀석기)');
      await doneTask(ev, '사냥');
    } else await ev.say('사냥꾼 대장: 오늘 밤엔 모닥불에 고기를 구워 먹자!');
  }

  // 마을 일 3: 막집 만들기 → 긁개가 동료로
  async function builder(ev) {
    if (!ev.flag('starter')) { await ev.say('막집 짓는 사람: 새 막집을 지어야 하는데 일손이 모자라네.'); return; }
    if (!ev.flag('taskBuild')) {
      const c = await ev.choose('막집 짓는 사람: 새 막집을 짓는데 일손이 모자라. 도와줄래?', ['도와줄게요!', '다음에요'], 1);
      if (c !== 0) return;
      await ev.build();
      ev.setFlag('taskBuild');
      await ev.say('막집 짓는 사람: 고마워! 가죽을 다듬을 때 쓰던 이 녀석이 너랑 같이 가고 싶대.');
      ev.addMon('scraper', 6);
      HG.Sound.sfx('levelup');
      await ev.say('긁개가 동료가 되었다! (짐승 가죽을 벗기고 다듬던 뗀석기)');
      await doneTask(ev, '막집 짓기');
      return;
    }
    await ev.say('막집 짓는 사람: 막집은 금방 짓고 금방 걷을 수 있어서 옮겨 다니기 좋아. 구석기 사람들은 동굴이나 막집에서 살았지.');
  }

  async function doneTask(ev, name) {
    const n = tasksDone(ev.state);
    HG.Sound.sfx('stamp');
    if (n < 3) await ev.say(`마을 일 「${name}」 완료! (${n}/3)`);
    else await ev.say(`마을 일 「${name}」 완료! (3/3)`, '마을 일을 모두 도왔다! 이제 동쪽 큰 동굴의 부족장을 찾아가자.');
  }

  async function guard(ev) {
    if (ev.flag('paleoClear')) { await ev.say('동굴지기: 부족장님께 인정받은 아이로구나! 언제든 들어가도 좋아.'); return; }
    const n = tasksDone(ev.state);
    if (n >= 3) { await ev.say('동굴지기: 마을 일을 모두 도왔다고 들었어. 들어가도 좋아!'); return; }
    await ev.say(`동굴지기: 부족장님은 마을 일을 세 가지 도운 사람만 만나 주셔. (지금 ${n}/3)`);
  }

  const QUIZ = [
    { q: '구석기 사람들이 돌을 깨뜨리거나 떼어 내서 만든 도구는?', options: ['뗀석기', '간석기', '청동기'], why: '돌을 깨뜨려 만든 도구가 뗀석기야. 돌을 갈아서 만든 간석기는 신석기 시대에 나온단다.' },
    { q: '구석기 사람들은 주로 어디에서 살았을까?', options: ['동굴이나 막집', '움집', '기와집'], why: '구석기 사람들은 옮겨 다니며 동굴이나 막집에서 살았어. 움집은 신석기 시대의 집이란다.' },
    { q: '구석기 사람들은 먹을거리를 어떻게 구했을까?', options: ['사냥과 채집', '농사', '시장에서 사기'], why: '짐승을 사냥하고 열매와 뿌리를 채집해서 먹을거리를 구했단다. 농사는 신석기 시대부터 시작됐어.' },
    { q: '먹을거리를 찾아 이곳저곳 옮겨 다니며 사는 생활은?', options: ['이동 생활', '정착 생활', '도시 생활'], why: '구석기 사람들은 먹을 것이 떨어지면 다른 곳으로 옮겨 다녔어. 이걸 이동 생활이라고 해.' },
    { q: '구석기 사람들이 불을 써서 할 수 있게 된 일은?', options: ['음식을 익혀 먹기', '쇠를 녹여 칼 만들기', '흙으로 그릇 굽기'], why: '불로 음식을 익혀 먹고, 추위를 막고, 짐승을 쫓았어. 흙 그릇(토기)은 신석기 시대에 만들었단다.' },
    { q: '연천 전곡리에서 발견된, 여러 가지로 쓰인 대표적인 뗀석기는?', options: ['주먹도끼', '빗살무늬 토기', '비파형 동검'], why: '연천 전곡리에서 주먹도끼가 발견되었어. 사냥도 하고 가죽도 벗기는 만능 도구였지.' }
  ];

  async function chief(ev) {
    if (ev.flag('paleoClear')) {
      await ev.say('부족장: 오, 다시 왔구나. 너의 동료들은 잘 지내느냐?', '부족장: 구석기 사람들은 무리를 지어 함께 사냥하고 함께 나누며 살았다.', '부족장: 너도 친구들과 힘을 합치는 것을 잊지 말거라.');
      return;
    }
    await ev.say('부족장: 나와 겨루기 전에 구석기 사람의 지혜를 시험하겠다. 세 문제! 맞힌 만큼 네 동료가 힘을 얻는다.');
    const n = await ev.quiz(QUIZ, 3);
    const boost = n >= 3 ? 2 : n >= 2 ? 1 : 0;
    await ev.say(`부족장: ${n}개를 맞혔구나. ` + (boost ? '좋다, 이제 겨뤄 보자!' : '아쉽지만 힘으로 겨뤄 보자!'));
    const res = await ev.battle({
      trainer: { name: '부족장', sprite: 'npc_elder', team: [['chopper', 5], ['handaxe', 6]], lose: ['부족장: 훌륭하다…! 진정한 구석기의 사냥꾼이로구나.'] },
      bg: 'bb_cave', music: 'boss', atkBoost: boost
    });
    if (res !== 'win') return;
    await ev.say('부족장: 너를 인정하마. 이 인장을 받아라.');
    await ev.cutscene('stamp', { name: '뗀석기 인장', title: '구석기 사냥꾼', icon: 'mon_handaxe' });
    const s = ev.state;
    if (!s.stamps.includes('paleolithic')) s.stamps.push('paleolithic');
    HG.giveTitle('구석기 사냥꾼');
    ev.setFlag('paleoClear');
    ev.heal();
    await ev.say('할아버지(무전기): 시간 조각이 돌아왔구나! 타임머신으로 와 보렴!');
  }

  async function timeMachine(ev) {
    if (!ev.flag('arrived')) return;
    await HG.Era.timeMachine(ev, ev.flag('paleoClear'));
  }

  // 화면 왼쪽 위 「목표」
  function objective(s) {
    const f = s.flags;
    if (!f.arrived) return '';
    if (!f.starter) return '마을 어른을 만나자 (막집 앞)';
    const n = tasksDone(s);
    if (n < 3) {
      const left = [['taskGather', '채집'], ['taskHunt', '사냥'], ['taskBuild', '막집']].filter(t => !f[t[0]]).map(t => t[1]).join(' · ');
      return `마을 일 돕기 ${n}/3 (남은 일: ${left})`;
    }
    if (!f.paleoClear) return '동쪽 큰 동굴의 부족장을 만나자';
    if (!f.sawNextEra) return '타임머신으로 돌아가자';
    return '자유 탐험: 도감 채우기 · 북쪽 들판 유물';
  }

  HG.registerStage({
    id: 'paleolithic', name: '구석기', type: 'village', baseLevel: 5, teacher: '부족장', start: { map: 'village', x: 18, y: 13, dir: 'right' },
    battleBg: 'bb_paleo', respawn: RESPAWN, objective,
    maps: ['lab', 'village', 'field', 'cave'], quiz: QUIZ,
    taskFlags: ['taskGather', 'taskHunt', 'taskBuild'], devMinis: [{ name: '숲에서 채집', scene: 'Gather' }, { name: '매머드 사냥', scene: 'Hunt' }, { name: '막집 짓기', scene: 'Build' }]
  });

  // 스테이지 배경음악
  HG.Sound.TRACKS.village = { bpm: 96, melody: [['G4', 2], ['A4', 2], ['C5', 3], ['A4', 1], ['G4', 2], ['E4', 2], ['D4', 4], ['E4', 2], ['G4', 2], ['A4', 3], ['C5', 1], ['D5', 2], ['C5', 2], ['A4', 4]],
    bass: [['C3', 4], ['A2', 4], ['F2', 4], ['G2', 4], ['C3', 4], ['A2', 4], ['F2', 4], ['G2', 4]], lead: 'triangle' };
  HG.Sound.TRACKS.field = { bpm: 128, melody: [['E5', 1], ['D5', 1], ['C5', 2], ['G4', 2], ['A4', 1], ['C5', 1], ['D5', 2], ['E5', 2], ['G5', 2], ['E5', 1], ['D5', 1], ['C5', 2], ['D5', 4], ['-', 2]],
    bass: [['C3', 2], ['G3', 2], ['A2', 2], ['E3', 2], ['F2', 2], ['C3', 2], ['G2', 2], ['D3', 2]] };
  HG.Sound.TRACKS.cave = { bpm: 84, melody: [['A3', 3], ['C4', 1], ['E4', 4], ['D4', 3], ['C4', 1], ['B3', 4], ['A3', 3], ['C4', 1], ['E4', 2], ['G4', 2], ['F4', 4], ['E4', 4]],
    bass: [['A2', 8], ['G2', 8], ['F2', 8], ['E2', 8]], lead: 'triangle' };
})();
