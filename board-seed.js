const SURNAMES = ['김','이','박','최','정','강','조','윤','장','임','한','오','서','신','권','황','안','송','전','홍','유'];
const GIVEN = ['우영','지훈','현우','민서','서연','태현','은지','준호','예린','성민','하늘','정우','수아','도현','지민','채원','건우','유진','서준','나연'];

function mask(name) {
  const t = (name || '').trim();
  if (t === '익명' || t === '관리자' || t === '올픽') return t;
  if (t.length <= 1) return t;
  if (t.length === 2) return t[0] + '*';
  return t[0] + '*'.repeat(t.length - 2) + t[t.length - 1];
}

function rnd(seed) { const x = Math.sin(seed) * 10000; return x - Math.floor(x); }

const Q_TITLES = [
  '인터넷+TV 문의', '인터넷 티비 사은품', '인터넷 가입 혜택', 'KT 신규가입 문의', 'LG 인터넷 가입문의',
  'SK 인터넷 가입', '재약정도 되나요', '인터넷 알뜰폰 결합 가능할까요', '이사 인터넷 문의', '인터넷 변경 문의',
  '신규가입 혜택 문의', '지원금 문의', '사은품 문의', '지금 옮기면 혜택 얼마인가요', 'KT로 이동 조건',
  '원룸 인터넷 설치 문의', '인터넷+tv 결합', '인터넷 요금 문의', '스카이라이프 문의', '현금 사은품 언제 주나요',
  '설치 기사님 방문 시간 조정되나요', '위약금 대신 내주시나요', '기존 통신사 해지 대행 되나요',
  '전화까지 같이 묶으면 얼마인가요', '자영업자인데 사업자용도 되나요', '2년 약정도 가능한가요',
  '인터넷만 단독 가입 문의', '가족 결합 조건 문의', 'TV 채널 몇 개인가요', '설치비 따로 드나요'
];

const Q_BODIES = [
  '현재 쓰는 인터넷 약정이 곧 끝나는데 옮기면 혜택이 어느 정도 되는지 알고 싶습니다.',
  '인터넷과 TV를 같이 가입하려고 합니다. 사은품이랑 월 요금 알려주세요.',
  '이사 예정이라 설치 날짜를 맞춰야 하는데 가능한지 문의드립니다.',
  '휴대폰이 알뜰폰인데 결합이 되는지 궁금합니다.',
  '원룸에 혼자 살고 있어서 인터넷만 저렴하게 쓰고 싶습니다.',
  '가족 4명 모두 같은 통신사인데 결합하면 얼마나 저렴해지나요?',
  '현금 사은품은 언제 입금되는지, 조건이 따로 있는지 알려주세요.',
  '기존 통신사 위약금이 남아 있는데 지원되는지 문의드립니다.'
];

const Q_ANSWERS = [
  '문의 감사합니다. 남겨주신 연락처로 상담원이 연락드려 조건에 맞는 최대 혜택을 안내해 드리겠습니다.',
  '안녕하세요. 사용 중인 통신사와 요금제에 따라 지원금이 달라집니다. 상담 시 정확한 금액을 안내해 드립니다.',
  '설치 일정은 지역과 기사님 일정에 따라 조정 가능합니다. 희망 날짜를 남겨주시면 맞춰 진행해 드립니다.',
  '현금 사은품은 설치 완료 당일 등록해 주신 계좌로 입금됩니다.',
  '알뜰폰도 통신망에 따라 결합이 가능합니다. 사용 중인 알뜰폰 요금제를 알려주시면 확인해 드립니다.'
];

const CATS = ['상품문의', '견적문의', '기타'];

export function seedQuestions(count) {
  const out = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const r1 = rnd(i + 1), r2 = rnd(i + 51), r3 = rnd(i + 101), r4 = rnd(i + 151);
    const answered = r3 > 0.22;
    out.push({
      id: 'seed-q-' + i,
      title: Q_TITLES[Math.floor(r1 * Q_TITLES.length)],
      author: SURNAMES[Math.floor(r2 * SURNAMES.length)] + GIVEN[Math.floor(r4 * GIVEN.length)],
      content: Q_BODIES[Math.floor(r2 * Q_BODIES.length)],
      category: CATS[Math.floor(r4 * CATS.length)],
      isPrivate: r1 > 0.62,
      password: '',
      seeded: true,
      answer: answered ? Q_ANSWERS[Math.floor(r3 * Q_ANSWERS.length)] : '',
      views: 4 + Math.floor(r2 * 180),
      createdAt: now - Math.floor((i + 1) * 5.4 + r1 * 9) * 86400000
    });
  }
  return out;
}

const R_TITLES = [
  '상담부터 설치까지 깔끔했어요', '사은품 당일 입금 확인했습니다', '설명이 정말 자세해서 좋았어요',
  '다른 곳보다 조건이 좋았습니다', '이사 일정에 딱 맞춰주셨어요', '가족 결합으로 요금 많이 줄었어요',
  '처음 가입인데 어렵지 않았습니다', '기사님도 친절하셨어요', '약정 조건 꼼꼼히 확인해주셨어요',
  '위약금까지 챙겨주셔서 감사합니다', '통신사 비교가 편했어요', '재약정 상담 받고 잘 옮겼습니다'
];

const R_BODIES = [
  '* 개통 지역 : 경기 수원시\n* 개통 일자 : 이번 주\n* 요금 상품 : 인터넷 + TV\n\n다른 곳 몇 군데 알아봤는데 조건이 가장 좋아서 진행했습니다. 설치도 빨랐고 사은품도 약속한 날에 들어왔습니다.',
  '* 개통 지역 : 서울 강서구\n* 개통 일자 : 지난주\n* 요금 상품 : 기가 인터넷\n\n요금제 설명을 하나하나 비교해서 알려주셔서 결정하기 편했습니다.',
  '* 개통 지역 : 인천 남동구\n* 개통 일자 : 2주 전\n* 요금 상품 : 인터넷 + TV + 전화\n\n이사 날짜에 맞춰 설치해 주셔서 불편함 없이 옮겼습니다.',
  '* 개통 지역 : 부산 해운대구\n* 개통 일자 : 이번 달\n* 요금 상품 : 인터넷 + TV\n\n가족 결합까지 정리해 주셔서 매달 나가는 요금이 확 줄었습니다.'
];

const R_CARRIERS = ['KT', 'LGU+', 'SK', '기타'];

export function seedReviews(count) {
  const out = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const r1 = rnd(i + 7), r2 = rnd(i + 77), r3 = rnd(i + 177);
    out.push({
      id: 'seed-r-' + i,
      title: R_TITLES[Math.floor(r1 * R_TITLES.length)],
      author: SURNAMES[Math.floor(r2 * SURNAMES.length)] + GIVEN[Math.floor(r3 * GIVEN.length)],
      content: R_BODIES[Math.floor(r3 * R_BODIES.length)],
      category: R_CARRIERS[Math.floor(r1 * R_CARRIERS.length)],
      rating: r2 > 0.25 ? 5 : 4,
      seeded: true,
      answer: r3 > 0.5 ? '소중한 후기 남겨주셔서 감사합니다. 이용 중 궁금한 점 있으시면 언제든 연락 주세요.' : '',
      views: 10 + Math.floor(r1 * 240),
      createdAt: now - Math.floor((i + 1) * 4.2 + r2 * 6) * 86400000
    });
  }
  return out;
}

export { mask };
