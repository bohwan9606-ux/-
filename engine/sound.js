// 8비트 소리 — 음악 파일 없이 코드로 소리를 만듦
HG.Sound = {
  ctx: null, master: null, musicGain: null, sfxGain: null,
  current: null, timer: null, step: 0,

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.5; this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = 0.22; this.musicGain.connect(this.master);
      this.sfxGain = this.ctx.createGain(); this.sfxGain.gain.value = 0.5; this.sfxGain.connect(this.master);
    } catch (e) { this.ctx = null; }
  },
  resume() { this.init(); if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
  on() { return HG.state ? HG.state.settings.sound : true; },
  musicOn() { return HG.state ? (HG.state.settings.sound && HG.state.settings.music) : true; },

  tone(freq, dur, type, vol, when, slideTo, dest) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + (when || 0);
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol || 0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(dest || this.sfxGain);
    o.start(t); o.stop(t + dur + 0.02);
  },
  noise(dur, vol, when) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + (when || 0);
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain();
    s.buffer = buf; g.gain.value = vol || 0.3;
    s.connect(g); g.connect(this.sfxGain); s.start(t);
  },

  sfx(name) {
    if (!this.on()) return;
    this.resume();
    const T = (f, d, ty, v, w, sl) => this.tone(f, d, ty, v, w, sl);
    switch (name) {
      case 'cursor': T(880, 0.04, 'square', 0.15); break;
      case 'select': T(660, 0.05, 'square', 0.2); T(990, 0.07, 'square', 0.2, 0.05); break;
      case 'cancel': T(440, 0.06, 'square', 0.18); T(330, 0.08, 'square', 0.18, 0.05); break;
      case 'talk': T(520 + Math.random() * 60, 0.025, 'square', 0.06); break;
      case 'bump': T(110, 0.08, 'triangle', 0.3); break;
      case 'hit': this.noise(0.12, 0.35); T(200, 0.12, 'square', 0.2, 0, 80); break;
      case 'bighit': this.noise(0.25, 0.5); T(300, 0.2, 'sawtooth', 0.25, 0, 60); break;
      case 'miss': T(300, 0.1, 'triangle', 0.2, 0, 600); break;
      case 'buff': [523, 659, 784].forEach((f, i) => T(f, 0.08, 'square', 0.15, i * 0.06)); break;
      case 'debuff': [784, 659, 523].forEach((f, i) => T(f, 0.08, 'square', 0.15, i * 0.06)); break;
      case 'faint': T(600, 0.5, 'square', 0.2, 0, 80); break;
      case 'encounter': [0, 1, 2, 3, 4, 5].forEach(i => T(i % 2 ? 300 : 600, 0.06, 'square', 0.2, i * 0.07)); break;
      case 'levelup': [523, 659, 784, 1047].forEach((f, i) => T(f, 0.12, 'square', 0.2, i * 0.09)); break;
      case 'heal': [392, 523, 659, 784, 1047].forEach((f, i) => T(f, 0.1, 'triangle', 0.3, i * 0.08)); break;
      case 'item': [784, 988, 1175].forEach((f, i) => T(f, 0.09, 'square', 0.18, i * 0.07)); break;
      case 'throw': T(900, 0.15, 'triangle', 0.25, 0, 300); break;
      case 'stamp': [523, 523, 523, 698, 880, 1047].forEach((f, i) => T(f, i < 3 ? 0.08 : 0.25, 'square', 0.2, [0, .1, .2, .3, .55, .8][i])); break;
      case 'warp': T(200, 0.6, 'sine', 0.3, 0, 1600); T(220, 0.6, 'square', 0.08, 0, 1800); break;
      case 'stomp': this.noise(0.2, 0.4); T(70, 0.25, 'triangle', 0.5); break;
      case 'correct': T(880, 0.08, 'square', 0.2); T(1320, 0.15, 'square', 0.2, 0.08); break;
      case 'wrong': T(220, 0.25, 'square', 0.2); break;
    }
  },

  // ── 배경음악: [음이름, 박자] 목록. '-' 는 쉼표
  NOTES: (() => {
    const n = {}; const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    for (let o = 2; o <= 6; o++) names.forEach((nm, i) => { n[nm + o] = 440 * Math.pow(2, ((o - 4) * 12 + i - 9) / 12); });
    return n;
  })(),
  TRACKS: {},

  play(name) {
    if (this.current === name) return;
    this.stop();
    this.current = name;
    if (!this.musicOn() || !this.TRACKS[name]) return;
    this.resume();
    if (!this.ctx) return;
    const tr = this.TRACKS[name];
    const beat = 60 / tr.bpm / 2; // 8분음표 길이
    // 멜로디·베이스를 8분음표 칸으로 펼침
    const expand = seq => { const out = []; seq.forEach(([n, len]) => { out.push(n); for (let i = 1; i < len; i++) out.push(null); }); return out; };
    const mel = expand(tr.melody), bass = expand(tr.bass || []);
    const total = mel.length;
    this.step = 0;
    let next = this.ctx.currentTime + 0.05;
    const tick = () => {
      if (this.current !== name) return;
      while (next < this.ctx.currentTime + 0.2) {
        const i = this.step % total, when = next - this.ctx.currentTime;
        const m = mel[i]; if (m && m !== '-') this.tone(this.NOTES[m], beat * 1.6, tr.lead || 'square', 0.22, when, null, this.musicGain);
        const b = bass[i % (bass.length || 1)]; if (b && b !== '-') this.tone(this.NOTES[b], beat * 1.8, 'triangle', 0.45, when, null, this.musicGain);
        this.step++; next += beat;
      }
      this.timer = setTimeout(tick, 50);
    };
    tick();
  },
  stop() { this.current = null; if (this.timer) clearTimeout(this.timer); this.timer = null; },
  refresh() { const c = this.current; this.current = null; if (c) this.play(c); }
};

// 공용 배경음악
HG.Sound.TRACKS.title = { bpm: 110, melody: [['E4', 2], ['G4', 2], ['A4', 2], ['C5', 2], ['B4', 2], ['A4', 2], ['G4', 4], ['E4', 2], ['G4', 2], ['A4', 2], ['G4', 2], ['E4', 2], ['D4', 2], ['E4', 4]],
  bass: [['A2', 4], ['A2', 4], ['F2', 4], ['G2', 4], ['A2', 4], ['A2', 4], ['F2', 4], ['E2', 4]] };
HG.Sound.TRACKS.battle = { bpm: 160, melody: [['E5', 1], ['-', 1], ['E5', 1], ['D5', 1], ['E5', 2], ['G5', 2], ['A5', 1], ['G5', 1], ['E5', 1], ['D5', 1], ['C5', 2], ['D5', 2], ['E5', 1], ['-', 1], ['E5', 1], ['D5', 1], ['E5', 2], ['A5', 2], ['G5', 2], ['E5', 2], ['D5', 4]],
  bass: [['A2', 1], ['A3', 1], ['A2', 1], ['A3', 1], ['A2', 1], ['A3', 1], ['A2', 1], ['A3', 1], ['F2', 1], ['F3', 1], ['F2', 1], ['F3', 1], ['G2', 1], ['G3', 1], ['G2', 1], ['G3', 1]] };
HG.Sound.TRACKS.boss = { bpm: 172, melody: [['A4', 1], ['C5', 1], ['E5', 1], ['A5', 1], ['G5', 2], ['E5', 2], ['F5', 1], ['E5', 1], ['D5', 1], ['C5', 1], ['D5', 2], ['B4', 2], ['A4', 1], ['C5', 1], ['E5', 1], ['A5', 1], ['B5', 2], ['G5', 2], ['A5', 4], ['-', 4]],
  bass: [['A2', 1], ['A2', 1], ['E3', 1], ['A2', 1], ['D3', 1], ['D3', 1], ['A3', 1], ['D3', 1], ['F2', 1], ['F2', 1], ['C3', 1], ['F2', 1], ['E2', 1], ['E2', 1], ['B2', 1], ['E2', 1]] };
HG.Sound.TRACKS.victory = { bpm: 140, melody: [['C5', 1], ['E5', 1], ['G5', 1], ['C6', 3], ['B5', 1], ['A5', 1], ['G5', 2], ['A5', 1], ['G5', 1], ['E5', 2], ['G5', 4]],
  bass: [['C3', 2], ['G2', 2], ['C3', 2], ['G2', 2], ['F2', 2], ['G2', 2], ['C3', 4]] };
HG.Sound.TRACKS.hunt = { bpm: 150, melody: [['D5', 1], ['D5', 1], ['F5', 1], ['D5', 1], ['G5', 1], ['F5', 1], ['D5', 2], ['C5', 1], ['C5', 1], ['E5', 1], ['C5', 1], ['F5', 1], ['E5', 1], ['C5', 2]],
  bass: [['D3', 1], ['-', 1], ['D3', 1], ['A2', 1], ['D3', 1], ['-', 1], ['D3', 1], ['A2', 1], ['C3', 1], ['-', 1], ['C3', 1], ['G2', 1], ['C3', 1], ['-', 1], ['C3', 1], ['G2', 1]], lead: 'square' };
