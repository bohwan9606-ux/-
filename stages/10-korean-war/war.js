// ─────────────────────────────────────────────
// 6·25 전쟁 (광복·현대 스테이지에서 쓰는 작전 지도 이야기 + 피란민 돕기)
// 표현 원칙: 사람끼리 싸우는 장면은 넣지 않음. 막아 내는 적은 「시간 괴물」.
// 역사 내용은 docs/역사내용-6.25전쟁.md 에 따로 정리
// ─────────────────────────────────────────────
(function () {
  const P = HG.KMap.P;
  const { big, countdown, finish } = HG.Mini;
  const CITY = {
    평양: [125.75, 39.03], 서울: [126.98, 37.57], 인천: [126.63, 37.46], 대전: [127.38, 36.35],
    대구: [128.6, 35.87], 부산: [129.07, 35.18]
  };
  const DMZ = [[125.9, 37.72], [126.7, 37.95], [127.1, 38.25], [127.6, 38.3], [128.3, 38.62], [128.5, 38.62]];
  const PERIM = [[128.42, 35.12], [128.45, 35.6], [128.38, 36.0], [128.9, 36.15], [129.45, 36.12]];

  // ─────────────────────────────────────────────
  // ① 피란민 돕기
  // ─────────────────────────────────────────────
  HG.RefugeeScene = class extends Phaser.Scene {
    constructor() { super('Refugee'); }
    init(d) { this.onEnd = d.onEnd; }
    create() {
      this.keys = new HG.Keys(this); this.dlg = new HG.UI.Dialog(this, this.keys);
      const key = 'refugee_bg';
      if (!this.textures.exists(key)) {
        const { c, ctx } = HG.Pixel.canvas(HG.W, HG.H);
        for (let y = 0; y < 12; y++) for (let x = 0; x < 20; x++) {
          let t = x >= 6 && x <= 13 ? 't_path' : ((x * 7 + y) % 5 === 0 ? 't_grass2' : 't_grass');
          if ((x <= 1 || x >= 18) && y % 2 === 0) t = 't_tree';
          ctx.drawImage(this.textures.get(t).getSourceImage(), x * 16, y * 16);
        }
        this.textures.addCanvas(key, c);
      }
      this.add.image(0, 0, key).setOrigin(0).setDepth(-10);
      this.need = 8; this.helped = 0; this.time0 = 30; this.left = this.time0; this.on = false; this.over = false;
      this.people = []; this.spawnT = 0;
      this.player = this.add.sprite(160, 150, HG.heroKey(), 2).setOrigin(0.5, 1); this.pdir = 'up';
      this.hud = HG.UI.text(this, 6, 4, '', { depth: 900, color: '#e9e2d0', stroke: '#1a1410' });
      this.cnt = HG.UI.text(this, HG.W - 6, 4, '', { depth: 900, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(1, 0);
      HG.UI.text(this, HG.W / 2, HG.H - 14, '방향키 이동 · 도움이 필요한 사람 옆에서 스페이스', { depth: 900, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
      this.keys.push(a => { if (a === 'ok' && this.on && !this.over) this.help(); });
      this.upd(); HG.Sound.play('mission'); this.cameras.main.fadeIn(250);
      this.run();
    }
    upd() { this.hud.setText('남은 시간 ' + Math.ceil(this.left)); this.cnt.setText('도운 사람 ' + this.helped + ' / ' + this.need); }
    async run() {
      await this.dlg.say('할아버지: 전쟁이 나자 많은 사람이 짐을 지고 남쪽으로 피란을 떠났단다.', '목마르거나 배고픈 사람 머리 위에 물과 주먹밥이 보일 거야. 옆에 가서 스페이스로 나눠 주렴!');
      await countdown(this); this.on = true;
    }
    spawn() {
      const kinds = ['war_man', 'war_woman', 'war_kid', 'war_grandma'];
      const spr = this.add.sprite(HG.rand(104, 216), -4, HG.pick(kinds), 0).setOrigin(0.5, 1);
      spr.speed = HG.rand(16, 26);
      spr.needs = Math.random() < 0.55 ? HG.pick(['i_water', 'i_rice']) : null;
      if (spr.needs) spr.icon = this.add.image(spr.x, spr.y - 30, spr.needs).setDepth(800);
      this.people.push(spr);
    }
    help() {
      const t = this.people.find(p => p.needs && !p.done && Math.abs(p.x - this.player.x) < 16 && Math.abs(p.y - this.player.y) < 16);
      if (!t) return;
      t.done = true; HG.Sound.sfx('heal');
      t.icon.setTexture('i_heart');
      this.helped++; this.upd();
      const msg = HG.UI.text(this, t.x, t.y - 44, HG.pick(['고맙구나!', '살았다…', '고마워요!']), { depth: 950, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
      this.tweens.add({ targets: msg, y: msg.y - 8, alpha: 0, delay: 500, duration: 500, onComplete: () => msg.destroy() });
      if (this.helped >= this.need) this.end(true);
    }
    update(time, delta) {
      if (!this.on || this.over) return;
      const dt = delta / 1000;
      this.left -= dt; if (this.left <= 0) { this.left = 0; this.upd(); return this.end(false); }
      this.upd();
      this.spawnT -= dt; if (this.spawnT <= 0) { this.spawnT = 1.1; this.spawn(); }
      this.people = this.people.filter(p => {
        p.y += p.speed * dt; HG.setFace(p, 'down', Math.floor((time + p.x * 10) / 250) % 2 === 0, Math.floor((time + p.x * 10) / 500) % 2 === 0);
        p.setDepth(p.y); if (p.icon) { p.icon.x = p.x; p.icon.y = p.y - 30; }
        if (p.y > HG.H + 30) { if (p.icon) p.icon.destroy(); p.destroy(); return false; }
        return true;
      });
      const d = this.keys.held();
      if (d) {
        const [dx, dy] = HG.DIRS[d]; this.pdir = d;
        this.player.x = HG.clamp(this.player.x + dx * 90 * dt, 20, HG.W - 20);
        this.player.y = HG.clamp(this.player.y + dy * 90 * dt, 30, HG.H - 16);
        HG.setFace(this.player, d, Math.floor(time / 150) % 2 === 0, Math.floor(time / 300) % 2 === 0);
      } else HG.setFace(this.player, this.pdir);
      this.player.setDepth(this.player.y);
    }
    async end(ok) {
      if (this.over) return; this.over = true;
      if (ok) { HG.Sound.play('victory'); await big(this, '임무 완료!', 800); await this.dlg.say(`피란민 ${this.helped}명에게 물과 먹을 것을 나눠 주었다!`); }
      else { await big(this, '시간 끝!', 800); await this.dlg.say(`피란민 ${this.helped}명을 도왔다. 모두가 힘든 피란길이었다…`); }
      await finish(this, ok ? 'win' : 'lose');
    }
  };

  // ─────────────────────────────────────────────
  // 작전 지도 — 전쟁의 흐름
  // ─────────────────────────────────────────────
  HG.WarScene = class extends Phaser.Scene {
    constructor() { super('War'); }
    init(d) { d = d || {}; this.onEnd = d.onEnd; this.missionMode = !!d.onEnd; }
    create() {
      this.keys = new HG.Keys(this);
      this.dlg = new HG.UI.Dialog(this, this.keys);
      this.add.rectangle(0, 0, HG.W, HG.H, 0x12100e).setOrigin(0).setDepth(-20);
      this.v = HG.KMap.build(this, 'kmap_full', 'full', 140, HG.H);
      this.add.image(0, 0, 'kmap_full').setOrigin(0).setDepth(-10);
      // 도시
      for (const nm in CITY) {
        const [x, y] = P(this.v, ...CITY[nm]);
        this.add.rectangle(x, y, 3, 3, 0xe9e2d0).setStrokeStyle(1, 0x1a1410).setDepth(5);
        const left = nm === '인천' || nm === '대전';
        HG.UI.text(this, left ? x - 3 : x + 3, left ? y - 1 : y - 7, nm, { depth: 6, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(left ? 1 : 0, 0);
      }
      const [dx, dy] = P(this.v, 131.87, 37.24);
      HG.UI.text(this, dx, dy + 2, '독도', { depth: 6, small: true, color: '#e9e2d0', stroke: '#1a1410' }).setOrigin(0.5, 0);
      const [yx, yy] = P(this.v, 124.6, 40.25);
      HG.UI.text(this, yx, yy - 12, '압록강', { depth: 6, small: true, color: '#7fb0c8', stroke: '#1a1410' }).setOrigin(0.5, 0);
      this.line38 = this.add.graphics().setDepth(4);
      this.front = this.add.graphics().setDepth(7);
      this.arrows = this.add.graphics().setDepth(8);
      // 오른쪽 이야기 상자
      HG.UI.box(this, 142, 4, 174, 172, 100);
      this.date = HG.UI.text(this, 229, 10, '', { depth: 101, color: '#7d2a22' }).setOrigin(0.5, 0);
      this.panel = HG.UI.text(this, 151, 30, '', { depth: 101, wrap: 158, lineSpacing: 5 });
      this.arrow = HG.UI.text(this, 302, 160, '▼', { depth: 101, small: true }).setVisible(false);
      this.tweens.add({ targets: this.arrow, y: 162, yoyo: true, repeat: -1, duration: 300 });
      this.draw38(true);
      HG.Sound.play('war');
      this.cameras.main.fadeIn(400);
      this.events.on('resume', () => { this.keys.down = {}; HG.Sound.play('war'); });
      this.run().catch(e => console.error(e));
    }

    // 오른쪽 상자에 글 쓰기 (스페이스로 넘김)
    say(...lines) {
      return lines.reduce((pr, line) => pr.then(() => new Promise(res => {
        let n = 0, done = false, skip = false;
        this.arrow.setVisible(false);
        const h = this.keys.push(a => { if (a !== 'ok' && a !== 'cancel') return; if (!done) skip = true; else { this.keys.pop(h); HG.Sound.sfx('cursor'); res(); } });
        const ev = this.time.addEvent({ delay: 18, loop: true, callback: () => {
          n = skip ? line.length : n + 1; this.panel.setText(HG.fill(line).slice(0, n));
          if (n % 3 === 0) HG.Sound.sfx('talk');
          if (n >= line.length) { ev.remove(); done = true; this.arrow.setVisible(true); }
        } });
      })), Promise.resolve());
    }
    setDate(t) { this.date.setText(t); this.tweens.add({ targets: this.date, scale: 1.3, yoyo: true, duration: 150 }); HG.Sound.sfx('select'); }

    // 38도선 / 휴전선
    draw38(show) {
      const g = this.line38; g.clear(); if (!show) return;
      const y = P(this.v, 0, 38)[1];
      for (let x = 0; x < 140; x += 4) if (HG.KMap.isLand('kmap_full', x, y)) { g.fillStyle(0xe9e2d0, 0.9).fillRect(x, y, 2, 1); }
      if (!this.l38) this.l38 = HG.UI.text(this, 2, y - 12, '38도선', { depth: 6, small: true, color: '#e9e2d0', stroke: '#1a1410' });
    }
    // 전선: 위도 하나(가로선) 또는 점 목록
    drawFront(lat, pts, color) {
      const g = this.front; g.clear();
      const col = color || 0xbf4436;
      const plot = (x, y, i) => { if (HG.KMap.isLand('kmap_full', x, y) && i % 5 < 3) { g.fillStyle(0x1a1410).fillRect(x - 1, y - 1, 3, 3); g.fillStyle(col).fillRect(x, y, 2, 2); } };
      if (pts) {
        let i = 0;
        for (let k = 1; k < pts.length; k++) {
          const [x0, y0] = P(this.v, ...pts[k - 1]), [x1, y1] = P(this.v, ...pts[k]);
          const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 1.5);
          for (let s = 0; s <= n; s++) plot(Math.round(x0 + (x1 - x0) * s / n), Math.round(y0 + (y1 - y0) * s / n), i++);
        }
      } else {
        const y = Math.round(P(this.v, 0, lat)[1]);
        for (let x = 0, i = 0; x < 140; x += 1.5, i++) plot(Math.round(x), y, i);
      }
    }
    tweenFront(from, to, ms) {
      return new Promise(r => { const o = { v: from }; this.tweens.add({ targets: o, v: to, duration: ms, ease: 'Sine.inOut', onUpdate: () => this.drawFront(o.v), onComplete: r }); });
    }
    // 화살표 (from → to, 경위도)
    arrowAnim(list, ms) {
      return new Promise(r => {
        const o = { t: 0 };
        this.tweens.add({ targets: o, t: 1, duration: ms, onUpdate: () => {
          const g = this.arrows; g.clear();
          list.forEach(([a, b, col]) => {
            const [x0, y0] = P(this.v, ...a), [x1, y1] = P(this.v, ...b);
            const x = x0 + (x1 - x0) * o.t, y = y0 + (y1 - y0) * o.t;
            g.lineStyle(4, 0x1a1410).lineBetween(x0, y0, x, y); g.lineStyle(2, col).lineBetween(x0, y0, x, y);
            const ang = Math.atan2(y1 - y0, x1 - x0);
            g.fillStyle(col).fillTriangle(x + Math.cos(ang) * 5, y + Math.sin(ang) * 5, x + Math.cos(ang + 2.4) * 5, y + Math.sin(ang + 2.4) * 5, x + Math.cos(ang - 2.4) * 5, y + Math.sin(ang - 2.4) * 5);
          });
        }, onComplete: r });
      });
    }
    mission(key) {
      return new Promise(res => {
        this.scene.pause();
        this.scene.launch(key, { onEnd: r => { this.scene.stop(key); this.scene.resume(); this.cameras.main.fadeIn(250); res(r); } });
        this.scene.bringToTop(key);
      });
    }
    legend(items) {
      if (this.leg) this.leg.forEach(o => o.destroy());
      this.leg = [];
      items.forEach(([c, t], i) => {
        this.leg.push(this.add.rectangle(4, 9 + i * 11, 8, 3, c).setOrigin(0, 0.5).setStrokeStyle(1, 0x1a1410).setDepth(102));
        this.leg.push(HG.UI.text(this, 15, 3 + i * 11, t, { depth: 102, small: true, color: '#e9e2d0', stroke: '#1a1410' }));
      });
    }

    async run() {
      const RED = 0xbf4436, BLUE = 0x3a6aa8, CHN = 0xd684aa;   // 중국군: 지도 초록과 구분되는 분홍
      this.setDate('19??년');
      if (this.missionMode) await this.say('할아버지(무전기): 광복 5년 뒤인 1950년, 우리 역사에서 가장 아픈 일 가운데 하나가 일어났단다.', '「6·25 전쟁」이야. 잘 보고 기억해 두렴.');
      else await this.say('타임머신이 크게 흔들리더니… 지도 하나가 떠올랐다.', '할아버지(무전기): {name}야, 여기는 아주 먼 미래인 1950년의 한반도란다. 맛보기로 「6·25 전쟁」을 보여 줄게.', '우리 역사에서 가장 아픈 일 가운데 하나야. 잘 보고 기억해 두렴.');
      this.setDate('1950년 6월 25일');
      this.legend([[RED, '북한군'], [BLUE, '국군·국제 연합군'], [0xbf4436, '- - 전선']]);
      this.drawFront(38);
      await this.say('1950년 6월 25일 새벽, 북한군이 38도선을 넘어 남쪽으로 쳐들어왔어요. 6·25 전쟁의 시작이에요.');
      await this.arrowAnim([[[126.9, 38.4], [127.0, 37.0], RED], [[128.2, 38.6], [128.6, 36.9], RED]], 1400);
      this.setDate('1950년 6월 28일');
      await this.tweenFront(38, 37.2, 1000);
      await this.say('전쟁이 일어난 지 사흘 만에 서울을 빼앗겼어요.');
      this.setDate('1950년 8월');
      await this.tweenFront(37.2, 36.1, 1600);
      this.arrows.clear(); this.drawFront(0, PERIM);
      await this.say('국군은 낙동강까지 밀려났어요.', '많은 사람이 집을 떠나 남쪽으로 피란을 갔고, 부산은 임시 수도가 되었어요.');
      await this.say('먼저 피란길의 사람들을 도와주러 가 보자!');
      await this.mission('Refugee');

      this.setDate('1950년 8~9월');
      await this.say('국제 연합(유엔)이 군대를 보내 우리나라를 도왔어요.', '국군과 국제 연합군은 낙동강 방어선을 끝까지 지켰어요.');
      await this.mission('Defense');

      this.setDate('1950년 9월 15일');
      await this.say('반격의 시작! 국군과 국제 연합군은 바다를 돌아 인천에 내리는 「인천 상륙 작전」을 펼쳤어요.');
      await this.arrowAnim([[[129.3, 34.9], [126.0, 34.3], BLUE]], 900);
      await this.mission('Landing');
      await this.arrowAnim([[[125.8, 37.1], [126.55, 37.45], BLUE], [[128.5, 35.7], [127.5, 36.8], BLUE]], 1200);
      this.setDate('1950년 9월 28일');
      await this.tweenFront(36.1, 38, 1400);
      await this.say('9월 28일, 서울을 다시 되찾았어요!');
      this.setDate('1950년 10월');
      await this.arrowAnim([[[126.6, 38.2], [125.4, 40.0], BLUE], [[127.8, 38.8], [128.4, 40.6], BLUE]], 1200);
      await this.tweenFront(38, 40.6, 1500);
      await this.say('국군과 국제 연합군은 38도선을 넘어 압록강 근처까지 올라갔어요. 통일이 눈앞에 온 것 같았지요.');

      this.setDate('1951년 1월 4일');
      this.legend([[RED, '북한군'], [BLUE, '국군·국제 연합군'], [CHN, '중국군']]);
      await this.arrowAnim([[[125.0, 40.8], [126.4, 38.3], CHN], [[127.0, 41.3], [127.6, 38.6], CHN]], 1300);
      await this.tweenFront(40.6, 37.0, 1600);
      await this.say('그런데 중국군이 전쟁에 끼어들었어요.', '국군과 국제 연합군은 다시 밀려 내려와 1951년 1월 4일 서울을 다시 내주었어요. 이것을 「1·4 후퇴」라고 해요.');
      this.setDate('1951 ~ 1953년');
      this.arrows.clear();
      await this.tweenFront(37.0, 38.3, 1200);
      await this.tweenFront(38.3, 37.9, 700); await this.tweenFront(37.9, 38.4, 700);
      await this.say('다시 서울을 되찾은 뒤, 38도선 부근에서 밀고 밀리는 싸움이 2년 넘게 이어졌어요.');

      this.setDate('1953년 7월 27일');
      this.draw38(false); if (this.l38) this.l38.setVisible(false);
      this.drawFront(0, DMZ, 0xdcbc48);
      this.legend([[0xdcbc48, '휴전선']]);
      HG.Sound.play('peace');
      await this.say('1953년 7월 27일, 싸움을 멈추자는 「정전 협정」을 맺었어요.', '이때 그어진 휴전선이 지금까지 남북을 나누고 있어요. 전쟁이 완전히 끝난 것이 아니라 잠시 멈춘 것이에요.');

      // 이산가족 이야기
      const gm = this.add.sprite(22, 176, 'war_grandma', 0).setOrigin(0.5, 1).setScale(2).setDepth(105);
      await this.say('피란민 할머니: 나는 피란길에서 동생 손을 놓쳤단다…', '그 뒤로 70년이 넘도록 소식을 모르지. 이렇게 전쟁으로 가족과 헤어진 사람들을 「이산가족」이라고 해.');
      gm.destroy();
      await this.say('할아버지: 6·25 전쟁으로 아주 많은 사람이 목숨을 잃거나 다쳤고, 집과 학교, 다리가 무너졌단다.', '그래서 우리는 평화를 소중히 지켜야 해. 마지막으로 퀴즈 3문제!');

      // 퀴즈
      this.panel.setText(''); this.arrow.setVisible(false);
      const QUIZ = [
        { q: '6·25 전쟁이 시작된 날은?', options: ['1950년 6월 25일', '1945년 8월 15일', '1953년 7월 27일'], why: '1945년 8월 15일은 광복, 1953년 7월 27일은 정전 협정을 맺은 날이야.' },
        { q: '국군과 국제 연합군이 서울을 되찾는 계기가 된 작전은?', options: ['인천 상륙 작전', '살수 대첩', '귀주 대첩'], why: '바다를 돌아 인천에 내린 인천 상륙 작전 덕분에 서울을 되찾았어.' },
        { q: '국군이 밀려 내려가 끝까지 지켜 낸 강은?', options: ['낙동강', '압록강', '대동강'], why: '국군과 국제 연합군은 낙동강 방어선을 지켜 내고 반격했어.' },
        { q: '중국군이 끼어들어 1951년 1월 4일 서울을 다시 내준 일은?', options: ['1·4 후퇴', '3·1 운동', '인천 상륙 작전'], why: '1951년 1월 4일에 서울을 다시 내준 일을 1·4 후퇴라고 해.' },
        { q: '전쟁으로 가족과 헤어져 서로 소식을 모르는 사람들은?', options: ['이산가족', '독립운동가', '실학자'], why: '전쟁 때 헤어진 가족들을 이산가족이라고 해. 아직도 많은 분이 가족을 기다리고 있어.' },
        { q: '1953년 정전 협정 뒤 남북을 나누게 된 선은?', options: ['휴전선', '38도선', '국경선'], why: '정전 협정 때 그어진 휴전선이 지금까지 남북을 나누고 있어.' }
      ];
      let ok = 0;
      const qs = HG.shuffle(QUIZ).slice(0, 3);
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i], opts = HG.shuffle(q.options);
        const pick = await this.dlg.choose(`[문제 ${i + 1}] ${q.q}`, opts, 'none', { noDefault: true });
        if (opts[pick] === q.options[0]) { ok++; HG.Sound.sfx('correct'); await this.dlg.say('정답이야!'); }
        else { HG.Sound.sfx('wrong'); await this.dlg.say(`정답은 '${q.options[0]}'이야.`, q.why); }
      }
      if (this.missionMode) {
        this.setDate('1953년 이후');
        await this.say(`퀴즈 ${ok}/3 맞힘!`, '할아버지: 전쟁의 아픔을 딛고 우리나라는 다시 일어섰단다. 이제 평화를 지키는 건 너희들의 몫이야.');
        HG.state.party.forEach(m => HG.gainExp(m, 60));
        HG.Sound.stop(); this.cameras.main.fadeOut(300); await HG.UI.wait(this, 320);
        this.onEnd('win'); return;
      }
      this.setDate('맛보기 끝');
      await this.say(`퀴즈 ${ok}/3 맞힘!`, '6·25 전쟁 스테이지 맛보기는 여기까지예요. 본편에서는 구석기부터 차례로 시대를 지나 이곳에 오게 돼요.', '스페이스를 누르면 첫 화면으로 돌아가요.');
      HG.Sound.stop();
      this.cameras.main.fadeOut(400);
      await HG.UI.wait(this, 420);
      window.location.reload();
    }
  };
})();
