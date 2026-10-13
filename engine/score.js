// ─────────────────────────────────────────────
// 시간 지킴이 점수 — 엔딩과 기록 카드에 보여 줌
// 많이 플레이한 것보다 「많이 알게 된 것」에 점수를 더 줌
//   퀴즈: 서로 다른 문제를 맞힌 개수 (같은 문제를 여러 번 맞혀도 한 번만)
//   숨은 보물 · 길가 보물 · 모은 유물(도감) · 시대 인장 · 동료 전투력(레벨+경험치)
// ─────────────────────────────────────────────
HG.Score = {
  W: { quiz: 40, secret: 30, road: 50, dex: 20, stamp: 30, power: 2 },

  // 퀴즈를 맞혔을 때 기록 (문제 글로 구분)
  markQuiz(q, ok) {
    if (!ok || !HG.state || !q) return;
    const f = HG.state.flags;
    f.quizOk = f.quizOk || {};
    f.quizOk[q.q || q] = 1;
  },

  calc() {
    const s = HG.state, W = this.W;
    const quiz = Object.keys(s.flags.quizOk || {}).length;
    const all = HG.Secret.all();
    const secret = all.filter(x => !x.roadside && HG.Secret.found(x.id)).length;
    const road = all.filter(x => x.roadside && HG.Secret.found(x.id)).length;
    const dex = HG.dexList().filter(id => s.dex.caught[id]).length;
    const stamp = s.stamps.length;
    // 전투력: 함께 다니는 동료(최대 6)의 레벨 + 다음 레벨까지 채운 경험치
    const power = Math.round(s.party.reduce((t, m) => {
      const a = HG.expFor(m.level), b = HG.expFor(m.level + 1);
      return t + m.level + Math.max(0, Math.min(1, (m.exp - a) / Math.max(1, b - a)));
    }, 0));
    const parts = {
      quiz: { name: '퀴즈 정답', n: quiz, unit: '문제', pt: quiz * W.quiz },
      treasure: { name: '숨은 보물', n: secret + road, unit: '개', pt: secret * W.secret + road * W.road },
      dex: { name: '모은 유물', n: dex, unit: '종', pt: dex * W.dex },
      stamp: { name: '시대 인장', n: stamp, unit: '개', pt: stamp * W.stamp },
      power: { name: '동료 전투력', n: power, unit: '', pt: power * W.power }
    };
    const total = Object.values(parts).reduce((t, p) => t + p.pt, 0);
    return { parts, total, title: this.title(parts, total), grade: this.grade(total) };
  },

  // 가장 잘한 부문으로 칭호
  title(p) {
    const cand = [
      ['역사 박사', p.quiz.pt / 1200],
      ['보물 탐험가', p.treasure.pt / 900],
      ['유물 수집가', p.dex.pt / 900],
      ['시간 용사', p.power.pt / 500]
    ].sort((a, b) => b[1] - a[1]);
    return cand[0][0];
  },
  // 총점 등급
  grade(t) {
    if (t >= 3500) return '전설의 시간 지킴이';
    if (t >= 2500) return '역사 수호자';
    if (t >= 1500) return '시간 탐험가';
    return '꼬마 시간 여행자';
  }
};
