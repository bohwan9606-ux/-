// 유물 동료 목록 (도감 순서)
// base: 체력·공격·방어·속도 / learn: [배우는 레벨, 기술] / evolve: 진화 (그 시대 스테이지가 생기면 연결)
// dex: 도감 설명 — 교과서 수준의 사실만 쓰기
HG.ARTIFACTS = {
  handaxe: {
    no: 1, name: '주먹도끼', era: 'paleolithic', type: '돌', rare: false,
    base: { hp: 50, atk: 55, def: 55, spd: 40 },
    learn: [[1, '몸통박치기'], [1, '내려찍기'], [6, '단단해지기'], [10, '깨뜨리기']],
    evolve: { to: 'polishedaxe', era: 'neolithic' },
    dex: '돌을 깨뜨려 만든 뗀석기. 한 손에 쥐고 사냥하거나 가죽을 벗기는 등 여러 가지로 썼다. 연천 전곡리에서 발견되었다.'
  },
  spear: {
    no: 2, name: '돌창', era: 'paleolithic', type: '돌', rare: false,
    base: { hp: 45, atk: 60, def: 40, spd: 60 },
    learn: [[1, '찌르기'], [1, '겨누기'], [7, '던지기']],
    evolve: null,
    dex: '긴 나무 막대 끝에 뾰족한 뗀석기를 묶은 사냥 도구. 멀리서 짐승을 찌르거나 던질 수 있었다.'
  },
  ember: {
    no: 3, name: '불씨', era: 'paleolithic', type: '불', rare: false,
    base: { hp: 48, atk: 58, def: 42, spd: 55 },
    learn: [[1, '불꽃'], [1, '연기'], [6, '따뜻한 불'], [10, '활활']],
    evolve: null,
    dex: '구석기 사람들은 불을 써서 추위를 이기고, 음식을 익혀 먹고, 사나운 짐승을 쫓았다.'
  },
  chopper: {
    no: 4, name: '찍개', era: 'paleolithic', type: '돌', rare: false,
    base: { hp: 55, atk: 50, def: 50, spd: 35 },
    learn: [[1, '몸통박치기'], [3, '찍기'], [8, '단단해지기']],
    evolve: null,
    dex: '돌의 한쪽 날을 떼어 내 만든 뗀석기. 무언가를 내리찍거나 자르는 데 썼다.'
  },
  scraper: {
    no: 5, name: '긁개', era: 'paleolithic', type: '돌', rare: false,
    base: { hp: 45, atk: 40, def: 45, spd: 55 },
    learn: [[1, '긁기'], [4, '가죽 다듬기'], [8, '겁주기']],
    evolve: null,
    dex: '얇고 날카로운 날을 가진 뗀석기. 짐승의 가죽을 벗기거나 다듬을 때 썼다.'
  },
  tanged: {
    no: 6, name: '슴베찌르개', era: 'paleolithic', type: '돌', rare: true,
    base: { hp: 50, atk: 70, def: 45, spd: 65 },
    learn: [[1, '찌르기'], [1, '슴베 꽂기'], [9, '겨누기']],
    evolve: null,
    dex: '창 끝에 꽂아 쓴 뾰족한 뗀석기. 아래쪽 꼬리(슴베)를 나무 자루에 끼워 썼다. 구석기 시대 끝 무렵의 도구이다.'
  },
  // ── 신석기
  polishedaxe: {
    no: 7, name: '간돌도끼', era: 'neolithic', type: '돌', rare: false,
    base: { hp: 60, atk: 70, def: 65, spd: 45 },
    learn: [[1, '내려찍기'], [1, '단단해지기'], [6, '갈아 베기'], [12, '깨뜨리기']],
    dex: '돌을 갈아서 날을 날카롭게 만든 간석기. 나무를 베거나 땅을 일구는 데 썼다.'
  },
  combpot: {
    no: 8, name: '빗살무늬 토기', era: 'neolithic', type: '흙', rare: false,
    base: { hp: 65, atk: 55, def: 70, spd: 40 },
    learn: [[1, '진흙 던지기'], [1, '단단히 굽기'], [8, '곡식 담기'], [12, '흙벽 쌓기']],
    evolve: { to: 'plainpot', era: 'gojoseon' },
    dex: '흙으로 빚어 불에 구운 그릇. 겉면에 빗살 같은 무늬를 새겼다. 곡식을 담거나 저장하는 데 썼다.'
  },
  grinder: {
    no: 9, name: '갈돌과 갈판', era: 'neolithic', type: '돌', rare: false,
    base: { hp: 70, atk: 55, def: 65, spd: 35 },
    learn: [[1, '몸통박치기'], [1, '곡식 갈기'], [9, '갈아 베기']],
    dex: '갈판 위에 곡식을 올려놓고 갈돌로 갈아 껍질을 벗기거나 가루를 냈다. 농사를 지었다는 증거이다.'
  },
  spindle: {
    no: 10, name: '가락바퀴', era: 'neolithic', type: '흙', rare: true,
    base: { hp: 55, atk: 60, def: 55, spd: 75 },
    learn: [[1, '진흙 던지기'], [1, '겨누기'], [10, '흙벽 쌓기']],
    dex: '실을 뽑을 때 쓴 도구. 신석기 사람들은 실을 뽑고 뼈바늘로 옷을 지어 입었다.'
  },
  // ── 청동기·고조선
  plainpot: {
    no: 11, name: '민무늬 토기', era: 'gojoseon', type: '흙', rare: false,
    base: { hp: 75, atk: 65, def: 80, spd: 45 },
    learn: [[1, '진흙 던지기'], [1, '단단히 굽기'], [8, '곡식 담기'], [12, '흙벽 쌓기']],
    dex: '무늬가 없는 청동기 시대의 토기. 곡식을 저장하는 데 썼다.'
  },
  bronzesword: {
    no: 12, name: '비파형 동검', era: 'gojoseon', type: '청동', rare: false,
    base: { hp: 65, atk: 85, def: 60, spd: 70 },
    learn: [[1, '청동 베기'], [1, '겨누기'], [14, '청동 울림']],
    dex: '악기 비파를 닮은 청동 칼. 고조선의 대표 유물로, 이 칼이 나온 곳을 보면 고조선의 세력 범위를 짐작할 수 있다.'
  },
  bronzemirror: {
    no: 13, name: '청동 거울', era: 'gojoseon', type: '청동', rare: false,
    base: { hp: 70, atk: 65, def: 75, spd: 60 },
    learn: [[1, '번쩍 비추기'], [1, '청동 베기'], [13, '청동 울림']],
    dex: '청동으로 만든 거울. 제사를 지내던 지배자가 지녔던 것으로 여겨진다.'
  },
  halfmoon: {
    no: 14, name: '반달 돌칼', era: 'gojoseon', type: '돌', rare: false,
    base: { hp: 60, atk: 75, def: 60, spd: 80 },
    learn: [[1, '이삭 따기'], [1, '겨누기'], [12, '갈아 베기']],
    dex: '반달 모양의 간석기. 구멍에 끈을 꿰어 손에 걸고 벼 이삭을 땄다.'
  },
  // ── 삼국·가야
  muralhunt: {
    no: 15, name: '고구려 수렵도', era: 'threekingdoms', type: '흙', rare: false,
    base: { hp: 70, atk: 85, def: 65, spd: 85 },
    learn: [[1, '사냥 활쏘기'], [1, '겨누기'], [16, '흙벽 쌓기']],
    dex: '고구려 무용총에 그려진 벽화. 말을 타고 활을 쏘며 사냥하는 모습에서 고구려 사람들의 씩씩한 기상을 볼 수 있다.'
  },
  incense: {
    no: 16, name: '금동 대향로', era: 'threekingdoms', type: '금', rare: false,
    base: { hp: 80, atk: 70, def: 80, spd: 60 },
    learn: [[1, '금빛 일격'], [1, '향 피우기'], [15, '눈부신 빛']],
    dex: '백제의 금동 대향로. 뚜껑에 산과 신선, 여러 동물이 섬세하게 새겨져 백제의 뛰어난 솜씨를 보여 준다.'
  },
  goldcrown: {
    no: 17, name: '금관', era: 'threekingdoms', type: '금', rare: false,
    base: { hp: 75, atk: 85, def: 70, spd: 70 },
    learn: [[1, '금빛 일격'], [1, '눈부신 빛'], [16, '지혜의 바람']],
    dex: '신라의 왕이 썼던 금관. 나뭇가지와 사슴뿔 모양의 장식이 달려 있다.'
  },
  ironarmor: {
    no: 18, name: '가야 철갑옷', era: 'threekingdoms', type: '철', rare: false,
    base: { hp: 85, atk: 70, def: 95, spd: 45 },
    learn: [[1, '쇠 내려치기'], [1, '철벽 방어'], [15, '쇠 두드리기']],
    dex: '가야는 철이 많이 나서 철로 갑옷과 무기를 만들었다. 덩이쇠를 만들어 다른 나라에 팔기도 했다.'
  },
  jinmyosu: {
    no: 18.5, name: '진묘수', era: 'threekingdoms', type: '돌', rare: true,
    base: { hp: 80, atk: 80, def: 90, spd: 60 },
    learn: [[1, '몸통박치기'], [1, '겁주기'], [15, '단단해지기']],
    dex: '백제 무령왕릉의 무덤길 가운데에서 무덤을 지키던 돌짐승. 머리에 뿔이 하나 달린 상상의 동물로, 나쁜 기운을 막아 준다고 믿었다.'
  },
  // ── 남북국
  dabotap: {
    no: 19, name: '다보탑', era: 'unifiedsilla', type: '돌', rare: false,
    base: { hp: 90, atk: 75, def: 95, spd: 50 },
    learn: [[1, '깨뜨리기'], [1, '단단해지기'], [18, '갈아 베기']],
    dex: '경주 불국사에 있는 통일 신라의 석탑. 석가탑과 마주 보고 서 있다.'
  },
  bell: {
    no: 20, name: '성덕 대왕 신종', era: 'unifiedsilla', type: '청동', rare: false,
    base: { hp: 95, atk: 85, def: 80, spd: 50 },
    learn: [[1, '청동 울림'], [1, '번쩍 비추기'], [19, '단단해지기']],
    dex: '통일 신라 때 만든 큰 종. 소리가 맑고 아름다우며 「에밀레종」이라고도 불린다.'
  },
  juryeonggu: {
    no: 20.3, name: '주령구', era: 'unifiedsilla', type: '흙', rare: true,
    base: { hp: 80, atk: 80, def: 75, spd: 90 },
    learn: [[1, '던지기'], [1, '겁주기'], [18, '지혜의 바람']],
    dex: '경주 월지(안압지) 바닥에서 나온 14면체 나무 주사위. 면마다 「노래 한 곡 부르기」 같은 놀이 벌칙이 새겨져 있어 신라 사람들이 놀이를 즐겼음을 알 수 있다.'
  },
  dharani: {
    no: 20.6, name: '무구정광대다라니경', era: 'unifiedsilla', type: '종이', rare: true,
    base: { hp: 85, atk: 80, def: 85, spd: 65 },
    learn: [[1, '먹물 튀기기'], [1, '기록하기'], [18, '지혜의 바람']],
    dex: '불국사 석가탑 안에서 나온 두루마리 불경. 나무판에 글자를 새겨 찍은 것으로, 세계에서 가장 오래된 목판 인쇄물로 꼽힌다.'
  },
  // ── 고려
  celadon: {
    no: 21, name: '고려청자', era: 'goryeo', type: '흙', rare: false,
    base: { hp: 85, atk: 90, def: 85, spd: 70 },
    learn: [[1, '상감 무늬'], [1, '단단히 굽기'], [21, '곡식 담기']],
    evolve: { to: 'whiteporcelain', era: 'joseon' },
    dex: '고려 사람들이 만든 푸른빛 자기. 그릇 겉면을 파내고 다른 흙을 메워 무늬를 넣는 상감 기법이 유명하다.'
  },
  metaltype: {
    no: 22, name: '금속 활자', era: 'goryeo', type: '철', rare: false,
    base: { hp: 80, atk: 95, def: 85, spd: 75 },
    learn: [[1, '쇠 내려치기'], [1, '기록하기'], [21, '지혜의 바람']],
    dex: '쇠로 만든 활자. 고려 때 금속 활자로 찍은 『직지심체요절』은 지금 남아 있는 것 가운데 가장 오래된 금속 활자 인쇄본이다.'
  },
  tripitaka: {
    no: 23, name: '팔만대장경판', era: 'goryeo', type: '종이', rare: false,
    base: { hp: 100, atk: 80, def: 90, spd: 55 },
    learn: [[1, '먹물 튀기기'], [1, '기록하기'], [21, '지혜의 바람']],
    dex: '몽골이 쳐들어왔을 때 부처의 힘으로 나라를 지키려는 마음을 담아 새긴 목판. 합천 해인사에 보관되어 있다.'
  },
  // ── 조선
  whiteporcelain: {
    no: 24, name: '조선 백자', era: 'joseon', type: '흙', rare: false,
    base: { hp: 95, atk: 100, def: 95, spd: 75 },
    learn: [[1, '상감 무늬'], [1, '단단히 굽기'], [21, '곡식 담기']],
    dex: '조선 사람들이 즐겨 쓴 흰 자기. 깨끗하고 소박한 아름다움이 있다.'
  },
  hunmin: {
    no: 25, name: '훈민정음', era: 'joseon', type: '종이', rare: false,
    base: { hp: 95, atk: 105, def: 85, spd: 85 },
    learn: [[1, '지혜의 바람'], [1, '기록하기'], [24, '먹물 튀기기']],
    dex: '세종이 백성을 위해 만든 우리 글자, 그리고 그 글자를 만든 원리를 설명한 책. 「백성을 가르치는 바른 소리」라는 뜻이다.'
  },
  raingauge: {
    no: 26, name: '측우기', era: 'joseon', type: '철', rare: false,
    base: { hp: 100, atk: 90, def: 100, spd: 65 },
    learn: [[1, '쇠 내려치기'], [1, '빗물 재기'], [24, '철벽 방어']],
    dex: '세종 때 만든, 비가 내린 양을 재는 기구. 비의 양을 알아 농사에 도움을 주었다.'
  },
  turtleship: {
    no: 27, name: '거북선', era: 'joseon', type: '불', rare: false,
    base: { hp: 105, atk: 110, def: 105, spd: 70 },
    learn: [[1, '용머리 포격'], [1, '철벽 방어'], [25, '활활']],
    dex: '임진왜란 때 이순신이 이끈 수군이 쓴 배. 지붕을 덮어 적이 배에 올라오기 어렵게 만들었다.'
  },
  // ── 조선 후기
  geojunggi: {
    no: 28, name: '거중기', era: 'latejoseon', type: '철', rare: false,
    base: { hp: 110, atk: 115, def: 105, spd: 60 },
    learn: [[1, '들어 올리기'], [1, '철벽 방어'], [27, '쇠 두드리기']],
    dex: '정약용이 만든, 무거운 돌을 들어 올리는 기계. 수원 화성을 쌓을 때 쓰여 일을 빨리 끝낼 수 있었다.'
  },
  daedong: {
    no: 29, name: '대동여지도', era: 'latejoseon', type: '종이', rare: false,
    base: { hp: 100, atk: 115, def: 95, spd: 90 },
    learn: [[1, '지혜의 바람'], [1, '기록하기'], [27, '먹물 튀기기']],
    dex: '김정호가 만든 우리나라 지도. 여러 권으로 나누어 접을 수 있게 해서 들고 다니기 편했다.'
  },
  ssireum: {
    no: 30, name: '씨름도', era: 'latejoseon', type: '종이', rare: false,
    base: { hp: 105, atk: 110, def: 100, spd: 80 },
    learn: [[1, '씨름 한판'], [1, '만세 외치기'], [27, '지혜의 바람']],
    dex: '김홍도가 그린 풍속화. 씨름하는 사람과 구경하는 사람들의 모습을 생생하게 그렸다.'
  },
  // ── 일제강점기
  declaration: {
    no: 31, name: '독립 선언서', era: 'colonial', type: '종이', rare: false,
    base: { hp: 110, atk: 120, def: 105, spd: 85 },
    learn: [[1, '지혜의 바람'], [1, '만세 외치기'], [30, '먹물 튀기기']],
    dex: '1919년 3·1 운동 때 발표한 글. 우리나라가 독립한 나라임을 세계에 알렸다.'
  },
  taegeukgi: {
    no: 32, name: '만세 태극기', era: 'colonial', type: '종이', rare: false,
    base: { hp: 115, atk: 115, def: 110, spd: 90 },
    learn: [[1, '만세 외치기'], [1, '지혜의 바람'], [30, '기록하기']],
    dex: '3·1 운동 때 사람들은 몰래 만든 태극기를 흔들며 「대한 독립 만세」를 외쳤다.'
  },
  malmoi: {
    no: 33, name: '말모이 원고', era: 'colonial', type: '종이', rare: false,
    base: { hp: 105, atk: 110, def: 115, spd: 80 },
    learn: [[1, '먹물 튀기기'], [1, '기록하기'], [30, '지혜의 바람']],
    dex: '우리말 사전을 만들려고 모은 낱말 원고. 일제가 우리말을 못 쓰게 할 때에도 우리말을 지키려 했다.'
  },
  // ── 마지막 상대 (도감에는 나오지 않음)
  timeking: {
    no: 99, name: '시간 괴물 대왕', era: 'modern', type: '시간', rare: false, hidden: true,
    base: { hp: 150, atk: 105, def: 95, spd: 80 },
    learn: [[1, '시간 흔들기'], [1, '시대 지우기'], [1, '시간 폭풍'], [1, '겁주기']],
    dex: '모든 시대를 어지럽힌 시간 괴물들의 우두머리.'
  }
};
// 도감 번호를 1부터 차례로 다시 매김 (중간에 새 유물을 넣어도 번호가 이어지게)
Object.keys(HG.ARTIFACTS).filter(k => !HG.ARTIFACTS[k].hidden).sort((a, b) => HG.ARTIFACTS[a].no - HG.ARTIFACTS[b].no).forEach((k, i) => { HG.ARTIFACTS[k].no = i + 1; });
HG.dexList = () => Object.keys(HG.ARTIFACTS).filter(k => !HG.ARTIFACTS[k].hidden).sort((a, b) => HG.ARTIFACTS[a].no - HG.ARTIFACTS[b].no);