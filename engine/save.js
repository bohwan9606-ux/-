// 저장 — 학생 기기의 브라우저에 자동 저장. 버전 표시로 업데이트 후에도 이어서 하기
HG.SAVE_VERSION = 1;
HG.SAVE_KEY = 'sigan-jogak-save';

HG.Save = {
  _lastTick: Date.now(),

  has() { try { return !!localStorage.getItem(HG.SAVE_KEY); } catch (e) { return false; } },

  save() {
    if (!HG.state || this.disabled) return false;
    this.tickTime();
    try { localStorage.setItem(HG.SAVE_KEY, JSON.stringify(HG.state)); return true; } catch (e) { return false; }
  },

  load() {
    try {
      const raw = localStorage.getItem(HG.SAVE_KEY);
      if (!raw) return null;
      return this.migrate(JSON.parse(raw));
    } catch (e) { return null; }
  },

  // 예전 버전 저장을 지금 버전에 맞게 고침. 새 버전이 나오면 여기에 단계를 추가
  migrate(s) {
    if (!s || typeof s !== 'object') return null;
    const fresh = HG.newState();
    // 빠진 칸은 새 기본값으로 채움 (새 기능이 추가돼도 기존 저장이 깨지지 않게)
    for (const k in fresh) if (!(k in s)) s[k] = fresh[k];
    for (const k in fresh.stats) if (!(k in s.stats)) s.stats[k] = 0;
    for (const k in fresh.settings) if (!(k in s.settings)) s.settings[k] = fresh.settings[k];
    // 예전에 찾은 길가 보물 동료 → ★★★ 국보급 동료로
    if (HG.Secret && s.flags) Object.values(HG.Secret.ROADSIDE).forEach(l => l.forEach(sec => {
      if (!s.flags['secret_' + sec.id] || !sec.mon) return;
      const all = (s.party || []).concat(s.box || []);
      if (all.some(m => m.national && m.species === sec.mon[0])) return;
      const m = all.find(m => m.shiny && !m.national && m.species === sec.mon[0]);
      if (m) m.national = true;
    }));
    // if (s.version < 2) { ... 버전 2로 올릴 때 바꿀 내용 ... }
    s.version = HG.SAVE_VERSION;
    return s;
  },

  tickTime() {
    const now = Date.now();
    if (HG.state) HG.state.stats.playMs += Math.min(now - this._lastTick, 60000);
    this._lastTick = now;
  },

  wipe() { try { localStorage.removeItem(HG.SAVE_KEY); } catch (e) {} },

  // 저장 코드: 기기를 바꾸거나 기록이 지워졌을 때 옮기는 용도
  exportCode() {
    this.tickTime();
    const json = JSON.stringify(HG.state);
    return btoa(unescape(encodeURIComponent(json)));
  },
  importCode(code) {
    try {
      const s = this.migrate(JSON.parse(decodeURIComponent(escape(atob(code.trim())))));
      if (!s || !s.player) return false;
      HG.state = s; this.save(); return true;
    } catch (e) { return false; }
  }
};
