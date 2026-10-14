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

  // 길에서 우연히 발견하는 보물: 나무·바위·풀숲(대부분), 물(주령구·신안선), 땅바닥(무령왕릉)을 살펴볼 때 (maps: 그 보물이 나오는 지역) 아주 낮은 확률로 나옴 (tiles: 그 보물이 나오는 땅)
  // 같은 자리는 그 맵을 떠났다 올 때까지 한 번만 기회가 있음 (연타 막기)
  ROADSIDE: {
    paleolithic: [{ id: 'paleolithic_road', roadside: true, where: '주먹도끼: 나무·바위·풀숲', mark: ['「구석기 유적 발굴 터」 표지판이다.', '이곳에서 주먹도끼 같은 뗀석기가 발견되었다.'], tiles: 'To,', mon: ['handaxe', 6], fact: '1978년, 한 미군 병사가 연천 한탄강 가에서 데이트를 하다가 이상하게 생긴 돌을 주웠어. 그 돌이 바로 「전곡리 주먹도끼」! 이 발견으로 동아시아의 구석기 역사가 새로 쓰였단다.' }],
    neolithic: [{ id: 'neolithic_road', roadside: true, where: '빗살무늬 토기: 나무·바위·풀숲', mark: ['「신석기 유적 발굴 터」 표지판이다.', '이곳에서 빗살무늬 토기 조각이 나왔다.'], tiles: 'To,', mon: ['combpot', 9], fact: '1925년 큰 홍수로 한강 둑의 흙이 깎여 나가자, 서울 암사동 땅속에 묻혀 있던 빗살무늬 토기 조각들이 모습을 드러냈어.' }],
    threekingdoms: [
      { id: 'threekingdoms_road1', roadside: true, where: '금동대향로: 백제 땅 나무·바위·풀숲', mark: ['「백제 유적 발굴 터」 표지판이다.', '진흙 속에서 백제 금동대향로가 나온 곳이다.'], tiles: 'To,', maps: ['tk_bj'], mon: ['incense', 15], fact: '1993년 부여 능산리, 주차장을 만들려던 땅을 조사하다가 진흙 속에서 「백제 금동대향로」가 나왔어. 진흙이 공기를 막아 1400년 동안 반짝임을 지켜 주었지.' },
      { id: 'threekingdoms_road2', roadside: true, where: '무령왕릉: 백제 땅 꽃밭', tiles: 'h', maps: ['tk_bj'], place: 'muryeong', mon: ['jinmyosu', 15], fact: '1971년 공주 송산리 고분군에서 무덤에 물이 스며들지 않게 배수로를 파던 중, 땅속에서 벽돌무덤 입구가 드러났어. 도굴되지 않고 남아 있던 백제 「무령왕릉」이었지! 무덤 주인을 알려 주는 돌판(지석)과, 무덤을 지키던 돌짐승 「진묘수」도 함께 나왔단다.' }],
    unifiedsilla: [{ id: 'unifiedsilla_road', roadside: true, where: '주령구: 서라벌 월지 연못 물', mark: ['「월지 발굴 터」 부표가 떠 있다.', '연못 바닥 진흙에서 14면체 주사위 주령구가 나왔다.'], tiles: '~', maps: ['us_gyeong'], mon: ['juryeonggu', 18], fact: '1975년 경주 월지(안압지)를 정비하려고 물을 빼고 바닥 진흙을 걷어 내자 유물이 3만 점 넘게 나왔어. 그중 14면체 나무 주사위 「주령구」에는 「노래 한 곡 부르기」, 「얼굴을 간질여도 꾹 참기」 같은 놀이 벌칙이 새겨져 있었단다.' }],
    goryeo: [{ id: 'goryeo_road', roadside: true, where: '신안 무역선: 물(강·바다)', mark: ['「바닷속 유적 발굴 터」 부표가 떠 있다.', '이 아래에서 700여 년 전 무역선과 도자기가 발견되었다.'], tiles: '~', mon: ['celadon', 21], fact: '1975년 전라남도 신안 앞바다에서 어부의 그물에 도자기가 걸려 올라왔어. 바닷속에는 700여 년 전(1323년) 무역선과 도자기 2만여 점이 잠들어 있었단다.' }],
    joseon: [{ id: 'joseon_road', roadside: true, where: '훈민정음 해례본: 나무·바위·풀숲', mark: ['「훈민정음 해례본 발견 터」 표지판이다.', '훈민정음을 만든 원리를 적은 책이 다시 세상에 나온 것을 기념하는 곳이다.'], tiles: 'To,', mon: ['hunmin', 24], fact: '훈민정음을 만든 원리를 적은 책 「훈민정음 해례본」은 오랫동안 사라진 줄 알았는데, 1940년 경상북도 안동의 한 집에서 발견되었어.' }]
  },
  CHANCE: 0.05,   // 한 번 살펴볼 때 나올 확률 (5%)
  roadside(spot, ch) {
    if (!HG.state || !ch || !'To~,".:h'.includes(ch)) return null;
    const mapId = spot.split('@')[1];
    // 이 자리에서 나올 수 있는 보물이 있을 때만 주사위를 굴림
    const left = (this.ROADSIDE[HG.state.era] || []).filter(s => !this.found(s.id) && (!s.tiles || s.tiles.includes(ch)) && (!s.maps || s.maps.includes(mapId)));
    if (!left.length) return null;
    // 같은 자리는 그 맵을 떠났다 올 때까지 한 번만 굴림 (한 자리에서 연타해도 소용없고, 여기저기 살펴봐야 함)
    if (this._checkedMap !== mapId) { this._checkedMap = mapId; this._checked = new Set(); }
    if (this.CHANCE < 1 && this._checked.has(spot)) return null;
    this._checked.add(spot);
    if (Math.random() > this.CHANCE) return null;
    const xy = spot.split('@')[0].split(',').map(Number);
    return Object.assign({}, left[0], { _at: xy });
  },

  async check(ev, sec) {
    if (!sec || this.found(sec.id)) return;
    HG.state.flags['secret_' + sec.id] = true;
    if (sec.roadside) return this.national(ev, sec);
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
  },

  // ── 길에서 발견하는 국보급 보물: 특별한 연출 → 신고하기 선택 → 감사장 → ★★★ 동료
  async national(ev, sec) {
    const S = ev.scene, sp = sec.mon && sec.mon[0];
    await this.discoverFx(S, sp);
    if (sec._at) { if (sec.place) this.placeAt(S, sec.place, sec._at); else if (sec.mark) this.markAt(S, sec, sec._at); }
    if (sec.fact) await ev.say(sec.fact);
    while (true) {
      const c = await ev.choose('이 귀한 문화유산을 어떻게 할까?', ['몰래 집에 가져간다', '국가유산청에 신고한다'], 'none', { noDefault: true });
      if (c === 1) break;
      HG.Sound.sfx('wrong');
      await ev.say('할아버지(무전기): 잠깐! 땅속이나 물속에서 나온 문화유산은 우리 모두의 것이란다.', '할아버지: 몰래 가져가면 법을 어기는 일이고, 그 유물에 담긴 역사도 영영 사라질 수 있어. 다시 생각해 보렴.');
    }
    HG.Sound.sfx('select');
    await ev.say('국가유산청에 발견한 곳과 유물을 알렸다.', '국가유산청: 소중한 문화유산을 알려 줘서 정말 고마워요! 전문가들이 잘 조사하고 지킬게요.');
    await this.certificate(S, ev);
    if (sec.mon) {
      const [m, lv] = sec.mon, nm = HG.ARTIFACTS[m].name;
      HG.addToParty(HG.makeMon(m, lv, { national: true }));
      HG.Sound.sfx('levelup');
      await ev.say(`유물의 기운을 받은 ${nm}★★★${HG.josa(nm, '이', '가')} 동료가 되었다!`, '(국보급 발견 동료는 능력치가 특별히 높아요)');
    }
    await ev.say('할아버지: 이처럼 국보급 보물도 우연히 발견될 때가 많단다. 문화유산을 발견하면 손대지 말고 꼭 신고하자!');
  },

  // 발견한 자리에 유적(무령왕릉 등)이 생김: 2×2가 들어갈 빈 땅을 그 자리 근처에서 찾음
  PLACED_TALK: {
    muryeong: ['무령왕릉이다! 벽돌을 아치 모양으로 쌓아 만든 백제의 무덤이다.', '무덤길 가운데에서는 돌짐승 진묘수가 무덤을 지키고 있었다고 한다.']
  },
  placeAt(S, kind, at) {
    if (!S || !S.map || !S.objects) return;
    const [fx, fy] = at, M = S.map, p = HG.state.player;
    // 길(:)은 막지 않도록 풀밭(. ")에만, 출구·사람·물건·주인공 자리는 피해서
    const free = (x, y) => { const t = M.tiles[y] && M.tiles[y][x]; return t && '."h'.includes(t) && !S.objectAt(x, y) && !S.npcAt(x, y) && !(x === p.x && y === p.y) && !(M.warps || []).some(w => Math.abs(w.x - x) <= 1 && Math.abs(w.y - y) <= 1); };
    const cand = [];
    for (let r = 0; r <= 3; r++) for (let dy = -r - 1; dy <= r; dy++) for (let dx = -r - 1; dx <= r; dx++) cand.push([fx + dx, fy + dy]);
    const spot = cand.find(([x, y]) => free(x, y) && free(x + 1, y) && free(x, y + 1) && free(x + 1, y + 1));
    if (!spot) return;
    const f = HG.state.flags; f.placed = f.placed || [];
    const rec = { map: M.id, kind, x: spot[0], y: spot[1] };
    f.placed.push(rec);
    const ob = S.addObject({ kind, x: rec.x, y: rec.y, talk: this.PLACED_TALK[kind] });
    if (ob && ob.img) { ob.img.setAlpha(0); S.tweens.add({ targets: ob.img, alpha: 1, duration: 900, delay: 600 }); }
  },
  // 개발자 확인용: 이 시대에 아직 못 찾은 길가 보물과 나오는 곳
  whereLeft() {
    const l = (this.ROADSIDE[HG.state.era] || []).filter(s => !this.found(s.id));
    return l.length ? '여기선 안 나와요\n' + l.map(s => s.where).join('\n') : '이 시대 길가 보물은 모두 찾았어요';
  },
  // 찾은 바로 그 자리(나무·바위·물 위)에 발굴 터 표지판이나 부표를 남김
  markAt(S, sec, at) {
    if (!S || !S.map || !S.objects) return;
    const [x, y] = at, M = S.map;
    if (S.objectAt(x, y)) return;
    const kind = M.tiles[y][x] === '~' ? 'buoy' : 'excav';
    const f = HG.state.flags; f.placed = f.placed || [];
    const rec = { map: M.id, kind, x, y, talk: sec.mark };
    f.placed.push(rec);
    const ob = S.addObject({ kind, x, y, talk: rec.talk });
    if (ob && ob.img) { ob.img.setAlpha(0); S.tweens.add({ targets: ob.img, alpha: 1, duration: 900, delay: 600 }); }
  },
  placedFor(mapId) { return ((HG.state && HG.state.flags.placed) || []).filter(r => r.map === mapId).map(r => ({ kind: r.kind, x: r.x, y: r.y, talk: r.talk || this.PLACED_TALK[r.kind] })); },

  // 금빛이 퍼지며 유물이 떠오르는 장면
  discoverFx(S, sp) {
    return new Promise(res => {
      const W = HG.W, H = HG.H, objs = [];
      const dim = S.add.rectangle(0, 0, W, H, 0x000000, 0).setOrigin(0).setScrollFactor(0).setDepth(6000); objs.push(dim);
      S.tweens.add({ targets: dim, fillAlpha: 0.6, duration: 400 });
      HG.Sound.sfx('levelup');
      const rays = S.add.graphics().setScrollFactor(0).setDepth(6001).setPosition(W / 2, H / 2 - 6); objs.push(rays);
      rays.fillStyle(0xffe14a, 0.35);
      for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; rays.fillTriangle(0, 0, Math.cos(a - 0.12) * 120, Math.sin(a - 0.12) * 120, Math.cos(a + 0.12) * 120, Math.sin(a + 0.12) * 120); }
      rays.setScale(0.1).setAlpha(0);
      S.tweens.add({ targets: rays, scale: 1, alpha: 1, duration: 600, delay: 200 });
      S.tweens.add({ targets: rays, angle: 360, duration: 6000, repeat: -1 });
      if (sp && S.textures.exists('mon_' + sp + '_s')) {
        const img = S.add.image(W / 2, H / 2 + 30, 'mon_' + sp + '_s').setScrollFactor(0).setDepth(6002).setAlpha(0).setScale(1.5); objs.push(img);
        S.tweens.add({ targets: img, y: H / 2 - 6, alpha: 1, scale: 2, duration: 900, delay: 300, ease: 'Back.out' });
      }
      for (let k = 0; k < 18; k++) {
        const st = HG.UI.text(S, W / 2 + HG.rand(-90, 90), H / 2 + HG.rand(-50, 40), '✦', { depth: 6003, small: true, color: '#fff4a8' }).setScrollFactor(0).setAlpha(0); objs.push(st);
        S.tweens.add({ targets: st, alpha: 1, y: st.y - 10, yoyo: true, duration: 500, delay: 300 + k * 60, repeat: 1 });
      }
      const ban = HG.UI.text(S, W / 2, 14, '✨ 국보급 문화유산 발견! ✨', { depth: 6004, color: '#ffe14a', stroke: '#1a1410' }).setOrigin(0.5, 0).setScrollFactor(0).setScale(0.2).setAlpha(0); objs.push(ban);
      S.tweens.add({ targets: ban, scale: 1.3, alpha: 1, duration: 450, delay: 700, ease: 'Back.out', onComplete: () => { HG.Sound.sfx('stamp'); S.cameras.main.shake(200, 0.01); } });
      S.time.delayedCall(2600, () => {
        S.tweens.add({ targets: objs, alpha: 0, duration: 400, onComplete: () => { objs.forEach(o => o.destroy()); res(); } });
      });
    });
  },

  // 감사장
  async certificate(S, ev) {
    const W = HG.W, objs = [], nm = HG.state.player.name;
    const d = new Date(), ds = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
    const g = S.add.graphics().setScrollFactor(0).setDepth(6000); objs.push(g);
    g.fillStyle(0x000000, 0.5).fillRect(0, 0, W, HG.H);
    g.fillStyle(0xf3ead2).fillRect(28, 4, 264, 128);
    g.lineStyle(3, 0xb08a3a).strokeRect(32, 8, 256, 120);
    g.lineStyle(1, 0xb08a3a).strokeRect(36, 12, 248, 112);
    const T = (y, t, o) => { const x = HG.UI.text(S, W / 2, y, t, Object.assign({ depth: 6001, color: '#3a2a18', align: 'center' }, o || {})).setOrigin(0.5, 0).setScrollFactor(0); objs.push(x); return x; };
    T(15, '감 사 장', { color: '#7d2a22' }).setScale(1.3);
    T(36, `${nm} 어린이`);
    T(52, '위 어린이는 소중한 문화유산을 발견하고\n바르게 신고하여 우리 역사를 지키는 데\n큰 도움을 주었기에 이 감사장을 드립니다.', { small: true });
    T(96, ds, { small: true });
    T(109, '국가유산청', { small: true, color: '#7d2a22' });
    g.fillStyle(0xbf4436, 0.8).fillCircle(196, 114, 7);
    HG.Sound.play && HG.Sound.sfx('stamp');
    await ev.say('감사장을 받았다!');
    objs.forEach(o => o.destroy());
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
