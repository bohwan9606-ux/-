// 기술 목록. kind: dmg(공격) / buff(내 능력↑) / debuff(상대 능력↓) / heal(회복)
// 기술 이름은 그 유물을 실제로 어디에 썼는지에서 따옴
HG.MOVES = {
  '몸통박치기': { type: '돌', kind: 'dmg', power: 30, acc: 100, desc: '온몸으로 부딪친다.' },
  '내려찍기':   { type: '돌', kind: 'dmg', power: 40, acc: 100, desc: '날카로운 날로 힘껏 내리찍는다.' },
  '깨뜨리기':   { type: '돌', kind: 'dmg', power: 65, acc: 90,  desc: '단단한 것도 깨뜨리는 강한 일격.' },
  '단단해지기': { type: '돌', kind: 'buff', stat: 'def', desc: '몸을 단단하게 해서 방어가 오른다.' },
  '찌르기':     { type: '돌', kind: 'dmg', power: 35, acc: 100, first: true, desc: '재빨리 찔러서 먼저 공격한다.' },
  '던지기':     { type: '돌', kind: 'dmg', power: 55, acc: 85,  desc: '멀리서 힘껏 던진다. 가끔 빗나간다.' },
  '겨누기':     { type: '돌', kind: 'buff', stat: 'atk', desc: '정신을 모아 공격이 오른다.' },
  '불꽃':       { type: '불', kind: 'dmg', power: 40, acc: 100, desc: '뜨거운 불꽃을 날린다.' },
  '연기':       { type: '불', kind: 'debuff', stat: 'atk', desc: '매운 연기로 상대의 공격을 떨어뜨린다.' },
  '활활':       { type: '불', kind: 'dmg', power: 65, acc: 90,  desc: '크게 타오르는 불길.' },
  '따뜻한 불':  { type: '불', kind: 'heal', amount: 0.4, desc: '불을 쬐어 체력을 회복한다.' },
  '찍기':       { type: '돌', kind: 'dmg', power: 40, acc: 100, desc: '한쪽 날로 찍는다.' },
  '긁기':       { type: '돌', kind: 'dmg', power: 30, acc: 100, desc: '얇은 날로 긁는다.' },
  '가죽 다듬기':{ type: '돌', kind: 'heal', amount: 0.35, desc: '가죽을 다듬어 몸을 감싸 회복한다.' },
  '슴베 꽂기':  { type: '돌', kind: 'dmg', power: 50, acc: 95, crit: true, desc: '창끝처럼 꽂힌다. 급소에 잘 맞는다.' },
  '겁주기':     { type: '시간', kind: 'debuff', stat: 'atk', desc: '무섭게 노려봐 상대 공격을 떨어뜨린다.' },
  '시간 흔들기':{ type: '시간', kind: 'dmg', power: 45, acc: 95, desc: '뒤틀린 시간의 힘으로 공격한다.' },
  '시간 폭풍':  { type: '시간', kind: 'dmg', power: 75, acc: 90, desc: '모든 시대를 뒤섞는 거센 폭풍.' },
  '시대 지우기':{ type: '시간', kind: 'debuff', stat: 'def', desc: '역사를 지우려 해 상대의 방어를 떨어뜨린다.' },
  // 돌 (간석기·청동기 돌 도구)
  '갈아 베기':  { type: '돌', kind: 'dmg', power: 50, acc: 100, desc: '갈아서 날카로워진 날로 벤다.' },
  '곡식 갈기':  { type: '돌', kind: 'heal', amount: 0.35, desc: '곡식을 갈아 먹고 힘을 낸다.' },
  '이삭 따기':  { type: '돌', kind: 'dmg', power: 45, acc: 100, first: true, desc: '반달 같은 날로 재빨리 딴다.' },
  // 흙 (토기·자기)
  '진흙 던지기':{ type: '흙', kind: 'dmg', power: 40, acc: 100, desc: '말랑한 진흙을 던진다.' },
  '단단히 굽기':{ type: '흙', kind: 'buff', stat: 'def', desc: '불에 구워 몸이 단단해진다.' },
  '곡식 담기':  { type: '흙', kind: 'heal', amount: 0.4, desc: '곡식을 가득 담아 기운을 차린다.' },
  '상감 무늬':  { type: '흙', kind: 'dmg', power: 60, acc: 95, desc: '파낸 무늬에 흙을 메우듯 정교하게 공격한다.' },
  '흙벽 쌓기':  { type: '흙', kind: 'dmg', power: 55, acc: 95, desc: '흙을 단단히 쌓아 밀어붙인다.' },
  // 청동
  '청동 베기':  { type: '청동', kind: 'dmg', power: 50, acc: 100, desc: '청동 날로 벤다.' },
  '번쩍 비추기':{ type: '청동', kind: 'debuff', stat: 'atk', desc: '햇빛을 비춰 상대의 눈을 부시게 한다.' },
  '청동 울림':  { type: '청동', kind: 'dmg', power: 65, acc: 90, desc: '맑고 큰 소리가 울려 퍼진다.' },
  // 철
  '쇠 내려치기':{ type: '철', kind: 'dmg', power: 55, acc: 100, desc: '단단한 쇠로 내려친다.' },
  '철벽 방어':  { type: '철', kind: 'buff', stat: 'def', desc: '쇠처럼 단단하게 막는다.' },
  '쇠 두드리기':{ type: '철', kind: 'dmg', power: 65, acc: 90, desc: '대장간 망치처럼 세게 두드린다.' },
  // 금
  '금빛 일격':  { type: '금', kind: 'dmg', power: 55, acc: 100, desc: '금빛으로 반짝이며 공격한다.' },
  '눈부신 빛':  { type: '금', kind: 'debuff', stat: 'atk', desc: '눈부신 금빛으로 상대의 힘을 빼앗는다.' },
  '향 피우기':  { type: '금', kind: 'heal', amount: 0.4, desc: '향을 피워 마음을 가다듬고 회복한다.' },
  // 종이 (기록)
  '먹물 튀기기':{ type: '종이', kind: 'dmg', power: 45, acc: 100, desc: '먹물을 튀긴다.' },
  '기록하기':   { type: '종이', kind: 'buff', stat: 'atk', desc: '배운 것을 기록해 지혜가 오른다.' },
  '지혜의 바람':{ type: '종이', kind: 'dmg', power: 70, acc: 90, desc: '책장이 넘어가며 지혜의 바람이 분다.' },
  '만세 외치기':{ type: '종이', kind: 'buff', stat: 'atk', desc: '힘차게 외쳐 용기가 솟는다.' },
  // 특별 기술
  '빗물 재기':  { type: '철', kind: 'heal', amount: 0.4, desc: '빗물을 재며 차분히 기운을 회복한다.' },
  '용머리 포격':{ type: '불', kind: 'dmg', power: 70, acc: 90, desc: '용머리에서 불을 뿜는다.' },
  '들어 올리기':{ type: '철', kind: 'dmg', power: 70, acc: 90, desc: '무거운 돌도 가볍게 들어 던진다.' },
  '씨름 한판':  { type: '종이', kind: 'dmg', power: 55, acc: 100, desc: '그림 속 장사가 튀어나와 넘긴다.' },
  '사냥 활쏘기':{ type: '흙', kind: 'dmg', power: 55, acc: 95, first: true, desc: '벽화 속 사냥꾼이 말 위에서 활을 쏜다.' }
};
