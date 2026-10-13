// ─────────────────────────────────────────────
// 숨은 보물 (이스터에그)
// 마을의 집·물건·사람에 secret 을 붙여 두면, 처음 말을 걸거나 살펴볼 때 보물이 나옴.
// secret: { id: '시대_이름', item: ['meat', 2] | mon: ['handaxe', 8] (숨은 동료), fact: '알게 되는 내용' }
// 맵의 아무 땅(나무·바위·논 등)에도 숨길 수 있음: map.tileSecrets = { 'x,y': secret }
// id 는 반드시 '시대id_' 로 시작 (시대별 개수 세기에 씀)
// ─────────────────────────────────────────────
HG.Secret = {
  all() {
    const out = [];
    Object.values(HG.maps || {}).forEach(m => { (m.objects || []).concat(m.npcs || []).forEach(o => { if (o.secret) out.push(o.secret); }); Object.values(m.tileSecrets || {}).forEach(s => out.push(s)); });
    Object.values(this.ROADSIDE).forEach(l => l.forEach(s => out.push(s)));
    return out;
  },
  list(era) { return this.all().filter(s => s.id.startsWith(era + '_')); },
  found(id) { return !!(HG.state && HG.state.flags['secret_' + id]); },
  count(era) { const l = era ? this.list(era) : this.all(); return { got: l.filter(s => this.found(s.id)).length, total: l.length }; },

  // 처음 들르는 시대에 한 번 알려 주기
  async tip(ev) {
    await HG.controlsTip(ev);
    if (ev.flag('secretTip')) return;
    ev.setFlag('secretTip');
    await ev.say('할아버지(무전기): 아, 그리고 하나 더! 집이나 물건, 나무나 바위, 사람 앞에서 A(스페이스)를 눌러 이것저것 살펴보렴.', '할아버지: 구석구석 살펴보다 보면 뜻밖의 것을 발견할지도 모른단다.');
  },

  // 길에서 우연히 발견하는 보물: 나무·바위·물 같은 자연물을 살펴볼 때 아주 낮은 확률로 나옴
  // 같은 자리를 연달아 살펴보거나, 몇 걸음 걷지 않고 또 살펴보면 나오지 않음 (연타 막기)
  ROADSIDE: {
    paleolithic: [{ id: 'paleolithic_road', roadside: true, mon: ['handaxe', 6], fact: '1978년, 한 미군 병사가 연천 한탄강 가에서 데이트를 하다가 이상하게 생긴 돌을 주웠어. 그 돌이 바로 「전곡리 주먹도끼」! 이 발견으로 동아시아의 구석기 역사가 새로 쓰였단다.' }],
    neolithic: [{ id: 'neolithic_road', roadside: true, mon: ['combpot', 9], fact: '1925년 큰 홍수로 한강 둑의 흙이 깎여 나가자, 서울 암사동 땅속에 묻혀 있던 빗살무늬 토기 조각들이 모습을 드러냈어.' }],
    threekingdoms: [
      { id: 'threekingdoms_road1', roadside: true, mon: ['incense', 15], fact: '1993년 부여 능산리, 주차장을 만들려던 땅을 조사하다가 진흙 속에서 「백제 금동대향로」가 나왔어. 진흙이 공기를 막아 1400년 동안 반짝임을 지켜 주었지.' },
      { id: 'threekingdoms_road2', roadside: true, mon: ['goldcrown', 15], fact: '1921년 경주에서 집을 짓던 중 땅속에서 금관이 나왔어. 그래서 그 무덤 이름이 「금관총」이 되었단다.' }],
    unifiedsilla: [{ id: 'unifiedsilla_road', roadside: true, item: ['meat', 3], fact: '1966년 불국사 석가탑을 고치다가 탑 안에서 두루마리 하나가 나왔어. 바로 세계에서 가장 오래된 목판 인쇄물로 꼽히는 「무구정광대다라니경」이야.' }],
    goryeo: [{ id: 'goryeo_road', roadside: true, mon: ['celadon', 21], fact: '1975년 전라남도 신안 앞바다에서 어부의 그물에 도자기가 걸려 올라왔어. 바닷속에는 700여 년 전(1323년) 무역선과 도자기 2만여 점이 잠들어 있었단다.' }],
    joseon: [{ id: 'joseon_road', roadside: true, mon: ['hunmin', 24], fact: '훈민정음을 만든 원리를 적은 책 「훈민정음 해례본」은 오랫동안 사라진 줄 알았는데, 1940년 경상북도 안동의 한 집에서 발견되었어.' }]
  },
  CHANCE: 0.05,   // 한 번 살펴볼 때 나올 확률 (5%)
  roadside(spot, ch) {
    if (!HG.state || !'To~RF,s#"'.includes(ch)) return null;
    const st = HG.state.stats, f = HG.state.flags;
    const fresh = this.CHANCE >= 1 || (spot !== this._lastSpot && st.steps - (this._lastSteps || 0) >= 6);
    this._lastSpot = spot; this._lastSteps = st.steps;
    if (!fresh || Math.random() > this.CHANCE) return null;
    const left = (this.ROADSIDE[HG.state.era] || []).filter(s => !this.found(s.id));
    return left.length ? left[0] : null;
  },

  async check(ev, sec) {
    if (!sec || this.found(sec.id)) return;
    HG.state.flags['secret_' + sec.id] = true;
    HG.Sound.sfx('levelup');
    await ev.say('어? 여기에 무언가 있다!');
    if (sec.item) await ev.give(sec.item[0], sec.item[1]);
    if (sec.mon) {
      const [sp, lv] = sec.mon, nm = HG.ARTIFACTS[sp].name;
      HG.addToParty(HG.makeMon(sp, lv, { shiny: true }));
      HG.Sound.sfx('item');
      await ev.say(`숨어 있던 ${nm}${HG.josa(nm, '이', '가')} 동료가 되었다!`);
    }
    if (sec.fact) await ev.say(sec.fact);
    if (sec.roadside) await ev.say('이처럼 국보급 보물도 우연히 발견될 때가 많아. 문화유산을 발견하면 손대지 말고 꼭 신고해야 해. 우리 모두의 보물이니까!');
  }
};

// 아무 땅이나 살펴봤을 때 나오는 말 (맵에 따로 정하지 않았을 때)
HG.TILE_TALK = {
  'T': ['나무가 우거져 있다.', '잎이 무성한 나무다.', '나뭇가지 사이로 새가 지저귄다.'],
  'o': ['커다란 바위다.', '이끼 낀 바위다.'],
  '#': ['가파른 절벽이다. 올라갈 수 없다.'],
  'R': ['논에 벼가 자라고 있다.', '논물이 찰랑거린다.'],
  'F': ['밭에 곡식이 자라고 있다.'],
  '=': ['단단하게 쌓은 돌담이다.', '돌을 차곡차곡 쌓은 담이다.'],
  ',': ['풀숲이 바스락거린다.'],
  's': ['고운 모래다.'],
  'W': ['벽이다.'], 'S': ['책과 물건이 꽂힌 선반이다.'],
  '~': ['물결이 반짝인다.', '맑은 물이 흐른다.'], 'K': ['책상이다.'], 'P': ['벽에 그림이 그려져 있다.']
};

// 조작법 안내 (처음 한 번)
HG.controlsTip = async function (ev) {
  if (ev.flag('controlsTip')) return;
  ev.setFlag('controlsTip');
  await ev.say('[조작법] 방향키: 걷기\nX를 누른 채 방향키: 빨리 달리기', '[조작법] 스페이스: 말 걸기 · 살펴보기 · 결정\nX: 취소 · Esc: 메뉴(동료·가방·저장)');
};
