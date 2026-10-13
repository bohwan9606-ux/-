// ─────────────────────────────────────────────
// 스테이지 8: 조선 후기 — 한반도 지도
// 거점: 수원 화성(거중기) · 김정호의 답사길(지도 조각) · 장터(보부상) · 씨름판(김홍도 그림) → 강진 다산 초당의 정약용
// ─────────────────────────────────────────────
(function () {
  HG.Art.register(function (scene) {
    const Px = HG.Pixel;
    HG.Art.person(scene, 'lj_builder', { hair: 'k', shirt: 'w', pants: 'n', band: 'w', goreum: 'n', hat: 'sangtu' });
    HG.Art.person(scene, 'lj_kimjeongho', { hair: 'k', shirt: 'n', pants: 'b', robe: 'n', belt: 'B', beard: true, pack: true, hat: 'gat' });
    HG.Art.person(scene, 'lj_bobusang', { hair: 'k', shirt: 'w', pants: 'l', band: 'k', pack: true, goreum: 'n', hat: 'sangtu' });
    HG.Art.person(scene, 'lj_kimhongdo', { hair: 'k', shirt: 'c', pants: 'w', robe: 'c', belt: 'u', beard: true, hat: 'gat' });
    HG.Art.person(scene, 'lj_ssireum', { hair: 'k', shirt: 's', pants: 'w', band: 'r', hat: 'sangtu' });
    HG.Art.person(scene, 'lj_jeongyakyong', { hair: 'k', shirt: 'w', pants: 'l', robe: 'w', belt: 'u', beard: true, glasses: true, hat: 'gat' });
    Px.draw(scene, 'g_mappiece', 12, 12, (p, ctx) => { Px.rect(p, 1, 2, 10, 8, 'Y'); Px.poly(p, [[3, 3], [7, 4], [6, 8], [3, 8]], 'e'); Px.rect(p, 7, 5, 3, 1, 'u'); p(5, 5, 'r'); Px.outline(ctx, 12, 12); });
    Px.draw(scene, 'g_stone', 12, 12, (p, ctx) => { Px.ellipse(p, 6, 8, 5, 3, 'g'); Px.ellipse(p, 5, 7, 2, 1, 'l'); Px.outline(ctx, 12, 12); });
  });

  const QUIZ = [
    { q: '정약용이 만들어 수원 화성을 쌓을 때 무거운 돌을 쉽게 들어 올린 기구는?', options: ['거중기', '측우기', '앙부일구'], why: '거중기는 도르래의 원리로 무거운 돌을 적은 힘으로 들어 올렸어.' },
    { q: '우리나라 곳곳을 살펴 「대동여지도」를 만든 사람은?', options: ['김정호', '김홍도', '정약용'], why: '김정호는 대동여지도를 만들었어. 여러 장으로 나누어 접어서 들고 다니기 편했지.' },
    { q: '씨름, 서당처럼 백성들의 생활 모습을 그린 그림을 무엇이라고 할까?', options: ['풍속화', '산수화', '벽화'], why: '김홍도와 신윤복은 사람들이 살아가는 모습을 풍속화로 그렸어.' },
    { q: '물건을 지고 이 장터 저 장터를 돌아다니며 판 상인은?', options: ['보부상', '장보고', '역관'], why: '보부상은 장시를 돌아다니며 물건을 팔고 소식도 전해 주었어.' },
    { q: '백성의 생활에 실제로 도움이 되는 학문을 연구하자는 것은?', options: ['실학', '불교', '성리학'], why: '정약용, 박지원 같은 실학자들은 백성의 삶을 낫게 할 방법을 연구했어.' },
    { q: '정조가 거중기 같은 새 기술을 써서 쌓은 성은?', options: ['수원 화성', '남한산성', '경복궁'], why: '수원 화성은 정조 때 새로운 기술로 튼튼하고 아름답게 쌓은 성이야.' }
  ];

  HG.registerStage({
    id: 'latejoseon', name: '조선 후기', type: 'map', baseLevel: 26, music: 'war', quiz: QUIZ, teacher: '정약용',
    banners: [['조선', 129.0, 37.9, 0x3a6aa8]],
    labels: [],
    tm: [127.75, 38.3],
    intro: [
      '할아버지(무전기): 여기는 조선 후기! 전쟁의 상처를 딛고 농업과 상업이 다시 활발해진 때란다.',
      '할아버지: 장터가 늘어나고, 백성의 삶에 도움이 되는 학문인 「실학」이 생겼지. 정조는 수원에 화성을 쌓았단다.',
      '할아버지: 네 곳을 돌아본 뒤 강진 다산 초당의 정약용 선생님을 찾아가 보렴.'
    ],
    nodes: [
      {
        id: 'hwaseong', name: '수원 화성', lon: 127.01, lat: 37.28, who: 'lj_builder', desc: '조선 후기 · 화성 쌓기\n성벽 쌓기',
        story: ['일꾼: 정조 임금님의 명으로 수원에 새 성을 쌓고 있어요!', '일꾼: 정약용 선생님이 만든 거중기 덕분에 무거운 돌도 거뜬하지. 성벽 쌓는 걸 도와줘요!'],
        after: ['일꾼: 거중기 덕분에 성 쌓는 기간이 훨씬 줄었대요.'],
        mission: { scene: 'Wall', p: { title: '수원 화성 쌓기', npc: 'lj_builder', goal: 5, time: 150, exp: 80,
          intro: ['일꾼: 정조 임금님의 명으로 수원에 새 성을 쌓고 있어요! 정약용 선생님의 거중기 덕분에 무거운 돌도 거뜬하지요.', '일꾼: 떨어지는 돌을 빈틈없이 쌓아 가로 한 줄을 꽉 채우면 성벽 한 층이 완성돼요. 5층을 쌓아 봐요!', '← → 옮기기, ↑ 돌리기, ↓ 빨리 내리기, 스페이스 바로 내리기!'],
          outro: ['튼튼한 성벽이 높이 올라갔다!', '일꾼: 수원 화성은 지금 세계 유산이 되었대요.'] } },
        reward: { mon: ['geojunggi', 26], text: '도르래의 힘' }
      },
      {
        id: 'kimjeongho', name: '김정호의 답사길', lon: 128.0, lat: 39.6, who: 'lj_kimjeongho', desc: '조선 후기 · 김정호\n지도 조각 퍼즐',
        story: ['김정호: 나는 김정호요. 우리 땅의 산줄기와 물줄기를 빠짐없이 지도에 담고 싶다오.', '김정호: 발로 걷고 옛 지도를 모아 맞춰 가며 지도를 만들었지. 지도 맞추기를 도와주겠소?'],
        after: ['김정호: 대동여지도는 22첩으로 나누어 접을 수 있어 들고 다니기 편하다오.'],
        mission: { scene: 'Slide', p: { title: '지도 조각 맞추기', npc: 'lj_kimjeongho', shuffle: 12, exp: 80,
          intro: ['김정호: 나는 우리 땅의 산줄기와 물줄기를 빠짐없이 지도에 담았다오. 대동여지도는 여러 장으로 나누어 접을 수 있지.', '김정호: 그런데 바람에 지도 조각이 뒤섞여 버렸소! 빈칸 옆 조각을 밀어서 오른쪽 그림처럼 맞춰 주시오.', '조각의 숫자를 1부터 8까지 차례로 맞추면 된다오. 막히면 X를 눌러 보시오, 다음에 밀 조각이 반짝일 것이오.'],
          outro: ['우리 땅의 모습이 한눈에 보인다!', '김정호: 대동여지도는 22첩으로 나누어 접을 수 있어 들고 다니기 편하다오.'] } },
        reward: { mon: ['daedong', 26], text: '우리 땅을 담은 지도' }
      },
      {
        id: 'jangsi', name: '안성 장터', lon: 127.85, lat: 36.5, who: 'lj_bobusang', desc: '조선 후기 · 보부상\n장터 돌며 장사하기',
        story: ['보부상: 어이쿠, 반갑소! 나는 등짐을 지고 이 장 저 장을 도는 보부상이오.', '보부상: 장터마다 물건값이 달라서, 싸게 사서 비싸게 팔면 돈을 벌 수 있지. 같이 돌아 보겠소?'],
        after: ['보부상: 장터에서는 물건뿐 아니라 여러 고을의 소식도 오갔다오.'],
        mission: { scene: 'Trade', p: { title: '보부상의 장터 돌기', move: '걸어서', money: 20, goal: 95, trips: 4, cargo: 5, exp: 80,
          intro: ['보부상: 돈 20냥으로 시작해서 95냥을 만들어 봅시다. 네 번 안에 해내려면 길을 잘 짜야 하오. 등짐에는 5개까지 넣을 수 있소.', '보부상: 바닷가 장에서는 소금과 생선이 싸고, 산골 장에서는 비싸다오!'],
          goods: { salt: { name: '소금', icon: 'gd_salt' }, fish: { name: '생선', icon: 'gd_fish' }, fabric: { name: '무명', icon: 'gd_fabric' } },
          ports: [
            { name: '강경 장(바닷가)', buy: { salt: 3, fish: 4 }, sell: { fabric: 10 } },
            { name: '안성 장', buy: { fabric: 4 }, sell: { salt: 7, fish: 8 } },
            { name: '산골 장', buy: {}, sell: { salt: 10, fish: 11, fabric: 7 } }
          ],
          outro: ['보부상: 장사 솜씨가 대단하오! 장터가 늘어나며 조선 후기의 상업은 크게 발달했다오.'] } },
        reward: { item: ['meat', 3] }
      },
      {
        id: 'ssireum', name: '씨름판', lon: 128.9, lat: 36.3, who: 'lj_kimhongdo', desc: '조선 후기 · 김홍도\n풍속화 속 씨름',
        story: ['김홍도: 나는 백성들이 살아가는 모습을 그리는 화가 김홍도라네.', '김홍도: 오늘은 단오날 씨름판을 그리려 하는데, 자네가 한판 붙어 주겠나? 멋진 장면을 그려 주지!'],
        after: ['김홍도: 내 그림 「씨름」에는 구경꾼들의 표정까지 생생하게 담겨 있다네.'],
        mission: { scene: 'Timing', p: { mode: 'mash', title: '단오 씨름판', npc: 'lj_ssireum', foeName: '마을 장사', mashTime: 8, exp: 80, bg: 'village',
          intro: ['마을 장사: 허허, 꼬마 장사가 나왔구먼! 스페이스를 빠르게 연타해서 힘을 겨뤄 보자!', '세 판 중 두 판을 먼저 이기면 승리!'],
          outro: ['김홍도가 쓱쓱 붓을 놀렸다. 생생한 씨름 그림이 완성되었다!'] } },
        reward: { mon: ['ssireum', 26], text: '김홍도의 풍속화 「씨름」' }
      }
    ],
    boss: {
      id: 'boss', name: '정약용', lon: 126.77, lat: 34.62, who: 'lj_jeongyakyong', desc: '조선 후기 · 강진 다산 초당\n실학의 스승',
      story: ['정약용: 어서 오게. 나는 정약용, 이곳 강진에서 오랫동안 책을 쓰며 지냈다네.', '정약용: 학문은 백성의 삶을 낫게 하는 데 쓰여야 한다고 믿었지. 그대가 보고 온 것을 시험해 보겠네!'],
      team: [['daedong', 26], ['geojunggi', 27]], bg: 'bb_village',
      lose: ['정약용: 허허, 훌륭하네! 그대야말로 진정한 실학자로군.'],
      win: ['정약용: 그 뒤 조선은 문을 굳게 닫았다가, 바깥 나라들이 몰려오며 큰 어려움을 겪게 된다네.', '정약용: 다음 시대는 많이 아픈 시간이지만, 그 속에서 나라를 되찾으려 애쓴 사람들을 꼭 만나 보게.'],
      after: ['정약용: 늘 백성을 먼저 생각하게.'],
      quiz: QUIZ, stamp: { name: '실학 인장', icon: 'mon_geojunggi' }
    }
  });
})();
