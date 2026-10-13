// 장사 장면 (거상식) — 항구·장터를 오가며 싸게 사서 비싸게 팔기
// p: { title, intro:[], ports:[{name, buy:{물건:값}, sell:{물건:값}}], goods:{키:{name, icon}}, money, goal, trips, cargo,
//      move:'배'|'걸어서', outro:[], exp, bg }
HG.TradeScene = class extends Phaser.Scene {
  constructor() { super('Trade'); }
  init(d) { this.onEnd = d.onEnd; this.p = Object.assign({ money: 20, goal: 60, trips: 5, cargo: 5, move: '배', exp: 40, bg: 'sea', outro: [] }, d.p || {}); }
  create() {
    const p = this.p;
    this.keys = new HG.Keys(this); this.dlg = new HG.UI.Dialog(this, this.keys);
    HG.miniBg(this, p.bg);
    this.money = p.money; this.trips = p.trips; this.load = {}; this.port = 0;
    HG.UI.box(this, 4, 4, HG.W - 8, 30, 100);
    this.stat = HG.UI.text(this, 12, 10, '', { depth: 101 });
    this.portTxt = HG.UI.text(this, HG.W / 2, 34, '', { depth: 101, color: '#e3d49a', stroke: '#1a1410' }).setOrigin(0.5, 0).setScale(1.5);
    this.priceObjs = [];
    this.ship = this.add.image(160, 112, p.move === '배' ? 'ship' : 'gd_rice').setDepth(20).setAngle(p.move === '배' ? 90 : 0).setScale(p.move === '배' ? 1.5 : 2);
    if (p.move !== '배') this.ship.setTexture('p_merchant', 4).setAngle(0);
    HG.Sound.play('mission');
    this.cameras.main.fadeIn(250);
    this.run().catch(e => console.error(e));
  }
  carried() { return Object.values(this.load).reduce((a, b) => a + b, 0); }
  upd() {
    const p = this.p;
    const loadTxt = Object.keys(this.load).filter(k => this.load[k]).map(k => p.goods[k].name + ' ' + this.load[k]).join(', ') || '없음';
    this.stat.setText(`돈 ${this.money}/${p.goal}냥  남은 이동 ${this.trips}번  짐: ${loadTxt}`);
    const port = p.ports[this.port];
    this.portTxt.setText(port.name);
    this.priceObjs.forEach(o => o.destroy()); this.priceObjs = [];
    const keys = Object.keys(p.goods);
    keys.forEach((k, i) => {
      const x = 22 + i * Math.floor((HG.W - 44) / keys.length), y = 58;
      this.priceObjs.push(this.add.image(x + 8, y + 6, p.goods[k].icon).setDepth(30));
      this.priceObjs.push(HG.UI.text(this, x + 18, y, p.goods[k].name, { depth: 30, small: true, color: '#e9e2d0', stroke: '#1a1410' }));
      const b = port.buy[k], s = port.sell[k];
      this.priceObjs.push(HG.UI.text(this, x + 18, y + 12, (b ? '살 때 ' + b : '살 수 없음'), { depth: 30, small: true, color: b ? '#e9e2d0' : '#b3ac9c', stroke: '#1a1410' }));
      this.priceObjs.push(HG.UI.text(this, x + 18, y + 24, (s ? '팔 때 ' + s : '팔 수 없음'), { depth: 30, small: true, color: s ? '#e3d49a' : '#b3ac9c', stroke: '#1a1410' }));
    });
  }
  async run() {
    const p = this.p;
    await this.dlg.say(...p.intro);
    this.upd();
    while (true) {
      if (this.money >= p.goal) return this.win();
      if (this.trips <= 0 && !this.canSellHere()) return this.lose();
      const port = p.ports[this.port];
      const items = ['물건 사기', '물건 팔기', p.move === '배' ? '다른 항구로 떠나기' : '다른 장터로 가기'];
      const i = await HG.UI.choice(this, this.keys, items, { x: HG.W - 8, y: HG.H - 6, alignRight: true, noCancel: true, depth: 200 });
      if (i === 0) await this.buy(port);
      if (i === 1) await this.sell(port);
      if (i === 2) {
        if (this.trips <= 0) { await this.dlg.say('더 이상 이동할 수 없다! 이곳에서 팔 수 있는 것을 팔자.'); if (!this.canSellHere()) return this.lose(); continue; }
        const others = p.ports.map((pt, k) => k).filter(k => k !== this.port);
        const j = await HG.UI.choice(this, this.keys, others.map(k => p.ports[k].name).concat(['그만두기']), { x: HG.W - 8, y: HG.H - 6, alignRight: true, depth: 210 });
        if (j < 0 || j >= others.length) continue;
        this.trips--;
        await this.travel(others[j]);
      }
      this.upd();
    }
  }
  canSellHere() { const port = this.p.ports[this.port]; return Object.keys(this.load).some(k => this.load[k] && port.sell[k]); }
  async buy(port) {
    const p = this.p;
    const ks = Object.keys(port.buy);
    const j = await HG.UI.choice(this, this.keys, ks.map(k => `${p.goods[k].name} (${port.buy[k]}냥)`).concat(['그만두기']), { x: HG.W - 8, y: HG.H - 6, alignRight: true, depth: 210 });
    if (j < 0 || j >= ks.length) return;
    const k = ks[j];
    const n = Math.min(p.cargo - this.carried(), Math.floor(this.money / port.buy[k]));
    if (n <= 0) { HG.Sound.sfx('wrong'); await this.dlg.say(this.carried() >= p.cargo ? '짐이 가득 찼다!' : '돈이 모자란다!'); return; }
    this.money -= n * port.buy[k]; this.load[k] = (this.load[k] || 0) + n;
    HG.Sound.sfx('item');
    this.upd();
    await this.dlg.say(`${p.goods[k].name} ${n}개를 샀다.`);
  }
  async sell(port) {
    const p = this.p;
    const ks = Object.keys(this.load).filter(k => this.load[k] && port.sell[k]);
    if (!ks.length) { HG.Sound.sfx('wrong'); await this.dlg.say('이곳에서 팔 수 있는 물건이 없다.'); return; }
    let got = 0;
    ks.forEach(k => { got += this.load[k] * port.sell[k]; this.load[k] = 0; });
    this.money += got;
    HG.Sound.sfx('levelup');
    this.upd();
    await this.dlg.say(`물건을 팔아 ${got}냥을 벌었다!`);
  }
  async travel(to) {
    HG.Sound.sfx('throw');
    this.portTxt.setText('');
    this.priceObjs.forEach(o => o.setVisible(false));
    await new Promise(r => this.tweens.add({ targets: this.ship, x: HG.W + 30, duration: 600, ease: 'Quad.in', onComplete: r }));
    this.ship.x = -30;
    this.port = to; this.upd();
    await new Promise(r => this.tweens.add({ targets: this.ship, x: 160, duration: 600, ease: 'Quad.out', onComplete: r }));
  }
  async win() {
    HG.Sound.play('victory');
    HG.state.party.forEach(m => HG.gainExp(m, this.p.exp));
    await this.dlg.say(`목표 ${this.p.goal}냥 달성!`, ...this.p.outro, `동료들이 경험치를 ${this.p.exp}씩 얻었다!`);
    await this.end('win');
  }
  async lose() {
    await this.dlg.say(`돈 ${this.money}냥… 목표에 조금 모자랐다. 다시 도전해 보자!`);
    await this.end('lose');
  }
  async end(r) {
    HG.Sound.stop(); this.cameras.main.fadeOut(250); await HG.UI.wait(this, 260); HG.Save.save();
    const cb = this.onEnd; this.onEnd = null; if (cb) cb(r);
  }
};
