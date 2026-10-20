// 개발자에게 후기 보내기 — 엔딩 점수 카드 뒤에 별점·좋았던 시대·학년·한마디를 고르고,
// 그 내용이 미리 채워진 설문(구글 폼)을 학생이 직접 열어 '제출'을 누르는 방식.
// 게임이 몰래 보내는 것은 없음. 이름·학교는 묻지 않음(익명).

// ▼ 설문 설정: 구글 폼의 「미리 채워진 링크」에서 주소와 entry 번호를 옮겨 적기
//   url이 비어 있으면 후기 화면은 나오지 않음
HG.REVIEW_FORM = {
  url: '',                 // 예: 'https://docs.google.com/forms/d/e/1FAIpQL.../viewform'
  entries: {
    stars: '',             // 예: 'entry.1111111'  (별점)
    era: '',               // 가장 재미있던 시대
    grade: '',             // 학년
    comment: '',           // 한마디
    record: ''             // 게임 기록 (도감·점수·플레이 시간)
  }
};

HG.Review = {
  ready() { const f = HG.REVIEW_FORM; return !!(f && f.url && f.entries && f.entries.comment); },

  // 설문 주소 만들기 (미리 채운 값 포함)
  link(ans) {
    const f = HG.REVIEW_FORM, q = ['usp=pp_url'];
    for (const k of Object.keys(f.entries)) if (f.entries[k] && ans[k]) q.push(f.entries[k] + '=' + encodeURIComponent(ans[k]));
    return f.url + (f.url.includes('?') ? '&' : '?') + q.join('&');
  },

  // 왼쪽에 질문, 오른쪽에 선택지 (선택지가 많아도 화면에 들어가게)
  async pick(scene, keys, title, options) {
    const bg = scene.add.rectangle(0, 0, HG.W, HG.H, 0x12100e, 0.92).setOrigin(0).setDepth(2050);
    const t = HG.UI.text(scene, 12, 14, title, { depth: 2051, color: '#e3d49a', wrap: 140 });
    const tip = HG.UI.text(scene, 12, HG.H - 14, '↑↓ 고르기 · 스페이스 결정 · X 그만두기', { depth: 2051, small: true, color: '#b3ac9c' }).setOrigin(0, 1);
    const bh = options.length * 15 + 10;
    const i = await HG.UI.choice(scene, keys, options, { x: HG.W - 8, y: Math.max(4 + bh, (HG.H + bh) / 2), alignRight: true, cancelIndex: -1 });
    [bg, t, tip].forEach(o => o.destroy());
    return i;
  },

  // 마지막 확인: 진짜 링크(<a>)를 눌러 새 창으로 설문 열기 — 태블릿에서도 막히지 않음
  confirm(ans) {
    return new Promise(res => {
      HG.Keys.typing = true;
      const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:40;';
      const btn = 'font-family:Galmuri11,sans-serif;font-size:20px;padding:10px 22px;border:3px solid #1a1410;border-radius:8px;text-decoration:none;display:inline-block;cursor:pointer;';
      wrap.innerHTML = '<div style="background:#e9e2d0;border:4px solid #6b4a2b;outline:3px solid #1a1410;padding:20px 24px;font-family:Galmuri11,sans-serif;color:#1a1410;font-size:17px;line-height:1.6;max-width:92vw;width:420px;box-sizing:border-box">' +
        '<div style="font-size:22px;margin-bottom:10px;text-align:center">✉️ 개발자에게 후기 보내기</div>' +
        '<div>별점: ' + esc(ans.stars) + '</div><div>재미있던 시대: ' + esc(ans.era) + '</div><div>학년: ' + esc(ans.grade) + '</div>' +
        '<div style="word-break:break-all">한마디: ' + (ans.comment ? esc(ans.comment) : '(없음)') + '</div>' +
        '<div style="margin-top:10px;font-size:14px;color:#6b4a2b">이름은 보내지 않아요. 버튼을 누르면 설문 창이 열리고, 거기서 <b>제출</b>을 눌러야 도착해요.</div>' +
        '<div style="margin-top:14px;text-align:center"><a id="hgsend" target="_blank" rel="noopener" href="' + esc(HG.Review.link(ans)) + '" style="' + btn + 'background:#bf4436;color:#e9e2d0">보내러 가기</a> ' +
        '<button type="button" id="hgno" style="' + btn + 'background:#7d776c;color:#e9e2d0">안 보낼래</button></div></div>';
      document.body.appendChild(wrap);
      const a = wrap.querySelector('#hgsend'), no = wrap.querySelector('#hgno');
      let done = false;
      const end = v => { if (done) return; done = true; wrap.remove(); document.removeEventListener('keydown', key, true); setTimeout(() => { HG.Keys.typing = false; }, 60); res(v); };
      const key = e => { e.stopPropagation(); if (e.key === 'Escape' || e.code === 'KeyX') { e.preventDefault(); end(false); } else if (e.key === 'Enter' || e.code === 'Space') { e.preventDefault(); a.click(); } };
      document.addEventListener('keydown', key, true);
      a.addEventListener('click', () => setTimeout(() => end(true), 50));
      no.addEventListener('click', () => end(false));
      setTimeout(() => a.focus(), 30);
    });
  },

  // 엔딩 끝에서 호출
  async ask(scene, keys, dlg) {
    if (!HG.Review.ready()) return;
    const s = HG.state;
    const cover = scene.add.rectangle(0, 0, HG.W, HG.H, 0x12100e, 0.85).setOrigin(0).setDepth(1990);
    const yes = await dlg.choose('하나 더! 이 게임을 만든 선생님께 후기를 보내 줄래? (이름은 보내지 않아요)', ['보낼래!', '다음에'], 1);
    if (yes !== 0) { cover.destroy(); return; }
    const STARS = ['★★★★★ 최고!', '★★★★ 재미있어', '★★★ 괜찮아', '★★ 그저 그래', '★ 별로야'];
    const si = await HG.Review.pick(scene, keys, '이 게임 몇 점?', STARS);
    if (si < 0) { cover.destroy(); return; }
    const eras = HG.ERAS.map(e => e.short || e.name).concat(['모두 좋았어']);
    const ei = await HG.Review.pick(scene, keys, '가장 재미있던 시대는?', eras);
    if (ei < 0) { cover.destroy(); return; }
    const GRADES = ['3학년', '4학년', '5학년', '6학년', '그 밖에', '비밀'];
    const gi = await HG.Review.pick(scene, keys, '몇 학년이야?', GRADES);
    if (gi < 0) { cover.destroy(); return; }
    const c = await HG.UI.prompt(scene, '만든 선생님께 한마디!', '', 100, { cancel: true, hint: '좋았던 점, 고쳐 줬으면 하는 점, 새로 넣었으면 하는 것 (이름은 쓰지 마세요)' });
    const caught = HG.dexList().filter(id => s.dex.caught[id]).length, mins = Math.floor(s.stats.playMs / 60000);
    const ans = {
      stars: String(5 - si), era: eras[ei], grade: GRADES[gi], comment: (c || '').trim(),
      record: `도감 ${caught}/${HG.dexList().length} · 점수 ${s.flags.finalScore != null ? s.flags.finalScore : '-'} · 플레이 ${Math.floor(mins / 60)}시간 ${mins % 60}분`
    };
    const sent = await HG.Review.confirm(ans);
    if (sent) { s.flags.reviewSent = true; HG.Save.save(); }
    await dlg.say(sent ? '고마워! 설문 창에서 「제출」을 누르면 선생님께 도착해.' : '괜찮아! 끝까지 해 줘서 고마워.');
    cover.destroy();
  }
};
