// 연표 — 연표 진행 바, 칭호, 시대별 옷. stage 는 그 시대 스테이지 id
HG.ERAS = [
  { id: 'paleolithic', short: '구석기', name: '구석기', stage: 'paleolithic', title: '구석기 사냥꾼', outfit: 'paleo' },
  { id: 'neolithic', short: '신석기', name: '신석기', stage: 'neolithic', title: '신석기 농부', outfit: 'neo' },
  { id: 'gojoseon', short: '고조선', name: '청동기·고조선', stage: 'gojoseon', title: '고조선 전사', outfit: 'bronze' },
  { id: 'threekingdoms', short: '삼국', name: '삼국·가야', stage: 'threekingdoms', title: '삼국 영웅', outfit: 'three' },
  { id: 'unifiedsilla', short: '남북국', name: '남북국', stage: 'unifiedsilla', title: '바다의 상인', outfit: 'silla' },
  { id: 'goryeo', short: '고려', name: '고려', stage: 'goryeo', title: '고려 장인', outfit: 'goryeo' },
  { id: 'joseon', short: '조선', name: '조선', stage: 'joseon', title: '조선 선비', outfit: 'joseon' },
  { id: 'latejoseon', short: '조선 후기', name: '조선 후기', stage: 'latejoseon', title: '실학자', outfit: 'latejoseon' },
  { id: 'colonial', short: '일제강점기', name: '일제강점기', stage: 'colonial', title: '독립의 등불', outfit: 'colonial' },
  { id: 'modern', short: '현대', name: '광복·현대', stage: 'modern', title: '평화 지킴이', outfit: 'modern' }
];
HG.eraIndex = id => HG.ERAS.findIndex(e => e.id === id);
