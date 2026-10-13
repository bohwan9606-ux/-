// 시작 준비 — 글꼴을 기다리고 모든 그림을 만듦
HG.BootScene = class extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    const t = this.add.text(HG.W / 2, HG.H / 2, 'Loading...', { fontFamily: 'monospace', fontSize: '10px', color: '#e9e2d0' }).setOrigin(0.5);
    const fonts = document.fonts ? Promise.all([document.fonts.load('12px Galmuri11'), document.fonts.load('10px Galmuri9')]) : Promise.resolve();
    Promise.race([fonts, new Promise(r => setTimeout(r, 3000))]).then(() => {
      HG.Art.buildAll(this);
      t.destroy();
      this.scene.start('Title');
    });
  }
};
