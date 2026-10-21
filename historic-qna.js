// 의사 난수 생성기 (일관된 렌더링 결과를 보장하기 위해 고정 시드 사용)
function getPseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 작성자 마스킹 이름 복잡도 줄이고 사람답게 생성 (김지수, 이서영 등)
const SURNAMES = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "전", "홍", "유"];
const GIVEN_NAMES = ["우", "영", "진", "훈", "현", "은", "민", "호", "태", "석", "희", "성", "철", "원", "하", "윤", "아", "준", "경", "수", "지", "혜", "서", "정", "미", "주", "나", "다"];

// 실제 사용자들이 다른 사이트 문의게시판에 짧고 투박하게 남기는 직설적 제목 풀
const BULK_TITLES = [
  "인터넷+TV 문의",
  "인터넷 티비 사은품",
  "인터넷 가입 혜택",
  "인터넷+티비 가입문의",
  "인터넷 가입 문의",
  "인터넷 티비 가입문의",
  "KT 신규가입 문의",
  "LG 인터넷 가입문의",
  "SK 인터넷 가입",
  "재약정도 되나요",
  "인터넷 알뜰폰 결합 가능할까요",
  "인터넷+전화 문의",
  "이사 인터넷 문의",
  "인터넷 변경 문의",
  "신규가입 혜택 문의",
  "지원금 문의",
  "사은품 문의",
  "지금 옮기면 혜택 얼마인가요",
  "KT로 이동 조건",
  "인터넷 문의",
  "원룸 인터넷 설치 문의",
  "인터넷 변경",
  "혜택 문의",
  "인터넷+tv 결합",
  "인터넷 요금 문의",
  "인터넷 사은품 문의",
  "sk인터넷 가입",
  "lg유플러스 신규",
  "kt 결합 문의",
  "약정 만료 가입",
  "인터넷 신규가입",
  "티비 결합 문의",
  "이사 가입문의",
  "인터넷 사은품",
  "현금 지원금 문의",
  "인터넷 tv 가입",
  "sk 가입문의",
  "엘지 요금",
  "인터넷 요금",
  "인터넷교체 혜택",
  "가입 사은품",
  "알뜰폰 결합",
  "재약정 문의",
  "인터넷 설치",
  "사은품 많이 주는 곳"
];

// 현실적인 고객의 투박한 사연 본문 (더미 데이터)
const REAL_CONTENTS = [
  "인터넷 3년 약정이 다 끝나서 다른 데로 알아보는 중입니다. SK 핸드폰 결합하고 싶은데 요금이랑 사은품 혜택 좀 가이드 알려주세요. 연락바랍니다.",
  "다음 달 이사라 인터넷이랑 티비 새로 설치하고 싶어요. KT 신규가입 혜택이 제일 좋다고 들었는데 금액이랑 월 요금제 좀 추천해 주세요.",
  "기존 인터넷이 LG인데 기간이 만료되어서 SK나 KT로 갈아타려 합니다. 사은품 최대 혜택 받고 싶은데 당일 현금 지급 가능한가요? 자세한 견적 요청합니다.",
  "원룸에 혼자 쓸 저렴한 인터넷을 알아보고 있습니다. 100메가 슬림 요금제 생각하고 있는데 와이파이 공유기 임대료도 같이 나오는지, 결합 가능한 알뜰폰 정보도 알려주세요.",
  "본사에서 재약정하라고 전화가 자꾸 오는데 혜택이 너무 적네요. 타사로 통신사 이동하면 사은품 훨씬 더 많다던데 요금 비교해서 추천해주시면 감사하겠습니다.",
  "이사 예정인데 이사 당일 아침에 바로 인터넷 설치가 가능한가요? 미리 신청해두면 기사님 배정 원하는 시간대에 되는지 궁금합니다.",
  "기존 SK 인터넷에 티비 추가하려는데 신규 가입이랑 기기 추가 중에 어떤 게 지원금 혜택이 더 큰가요? 견적 부탁합니다."
];

// 고객센터 일관된 전산 설계 답변 대본
const REAL_RESPONSES = [
  "안녕하세요 고객님! 올픽 가입센터입니다.\n\n풍성한 가입 혜택과 정직한 요금 설계를 약속드리겠습니다. 문의해주신 결합 여부 및 맞춤 통신사 조건에 대해 신속하고 정확하게 설명해 드리기 위해, 적어주신 번호로 담당 상담원이 곧 개별 전화를 드릴 예정입니다! 최고의 당일 지원 혜택으로 찾아뵙겠습니다. 감사합니다. :)",
  "안녕하세요! 인터넷 가입 전문 올픽 가입센터 상담팀입니다.\n\n통신사 이동 및 신규 가입 시 보장되는 합법적 최고 한도의 당일 현금 사은품 혜택 및 핸드폰 결합 할인 내역을 전산 분석 완료하였습니다. 기재해주신 소중한 연락처로 맞춤형 비교 견적 견향서를 즉시 문자로 전달해 드리고 상세 상담 안내 도와드리겠습니다! 늘 행복한 하루 되세요!"
];

const totalCount = 325;
const baseTime = new Date("2024-03-01T10:00:00Z").getTime();

const generatedQuestions = [];
let accumulatedTime = baseTime;

for (let i = 1; i <= totalCount; i++) {
  // 결정론적 의사 난수 획득
  const p1 = getPseudoRandom(i + 13);
  const p2 = getPseudoRandom(i + 47);
  const p3 = getPseudoRandom(i + 97);
  const p4 = getPseudoRandom(i + 131);
  const p5 = getPseudoRandom(i + 183);

  // 1. 작성자 생성 (김지수 형식 - 성함 full name으로 생성)
  const surname = SURNAMES[Math.floor(p1 * SURNAMES.length)];
  const givenName1 = GIVEN_NAMES[Math.floor(p2 * GIVEN_NAMES.length)];
  const givenName2 = GIVEN_NAMES[Math.floor(p3 * GIVEN_NAMES.length)];
  const author = `${surname}${givenName1}${givenName2}`;

  // 2. 카테고리 선정
  const categories = ["상품문의", "견적문의", "기타"];
  const category = categories[Math.floor(p3 * categories.length)];

  // 3. 제목 구성
  let baseTitle = BULK_TITLES[Math.floor(p4 * BULK_TITLES.length)];
  
  // 간단한 통신사 변형으로 가치 다양화
  const carrierPool = ["SK", "KT", "LG", "엘지", "크트", "스크", "SKB", "U+"];
  if (baseTitle.includes("KT") && p1 > 0.5) {
    baseTitle = baseTitle.replace("KT", carrierPool[Math.floor(p1 * carrierPool.length)]);
  } else if (baseTitle.includes("LG") && p2 > 0.5) {
    baseTitle = baseTitle.replace("LG", carrierPool[Math.floor(p2 * carrierPool.length)]);
  } else if (baseTitle.includes("SK") && p3 > 0.5) {
    baseTitle = baseTitle.replace("SK", carrierPool[Math.floor(p3 * carrierPool.length)]);
  }

  // 아주 사소하게 기호 조율해서 현실의 무작위성 부가 (물음표 제거 규칙 반영)
  let title = baseTitle;
  if (p5 > 0.75 && title.includes(" ")) {
    title = title.replace(/\s+/g, ""); // 대충 쓰느라 가끔 띄어쓰기 생략
  }

  // 322번 글 "인터넷 가입 혜택" 등에서 "혜택" 삭제 요건 반영
  if (i === 322) {
    title = title.replace("혜택", "").trim();
  }

  // 특정 게시물 제목 직접 매핑
  if (i === 252) {
    title = "알뜰폰 결합 문의드립니다.";
  } else if (i === 314) {
    title = "견적 부탁드려요~~";
  } else if (i === 319) {
    title = "입금문의";
  } else if (i === 305) {
    title = "견적 상담";
  }

  // 4. 본문 및 답변 매칭
  const content = REAL_CONTENTS[Math.floor(p3 * REAL_CONTENTS.length)];
  const adminResponse = REAL_RESPONSES[Math.floor(p4 * REAL_RESPONSES.length)];

  // 5. 비밀글 조회수 2~5 이내 설정
  const views = Math.floor(p5 * 4) + 2; 

  // 6. 2024년 3월부터 순방향으로 누적하여 생성일 산출
  // 평균 2.5일 간격으로 배치 (1.5일 ~ 3.5일 사이)
  const daysDiff = 1.5 + p1 * 2.0; 
  accumulatedTime += daysDiff * 24 * 60 * 60 * 1000;

  const itemDate = new Date(accumulatedTime);

  generatedQuestions.push({
    id: `hist-${i}`,
    title,
    category,
    author,
    content,
    views,
    status: "answered",
    adminResponse,
    createdAt: { toDate: () => itemDate },
    is_private: true,
    is_seeded: true,
    visibility: "admin_only",
    public_visible: false
  });
}

// 5/22, 5/23, 5.27, 6/2 user-requested inquires
generatedQuestions.push({
  id: "custom-inquiry-1",
  title: "문의드립니다.",
  category: "상품문의",
  author: "김지현",
  content: "인터넷과 TV 신규 가입 문의드립니다. 약정이 다 끝나서 통신사 변경하려고 하는데 최대 혜택과 요금 알고 싶어요.",
  views: 4,
  status: "answered",
  adminResponse: "안녕하세요 김지현 고객님! 올픽 가입센터입니다.\n\n3년 약정 만료가 되셨다면 타사 이동으로 신규 혜택을 극대화하시는 방향이 가장 확실합니다.\n\n고객님 모바일 결합 묶음 할인까지 정산하여 가장 유리한 설계 조건과 비밀지원금 혜택을 안내해 드리기 위해 곧 남겨주신 번호로 연락드리겠습니다. 감사합니다! :)",
  createdAt: { toDate: () => new Date("2026-05-22T14:30:00Z") },
  is_private: true,
  is_seeded: true,
  visibility: "admin_only",
  public_visible: false
});

generatedQuestions.push({
  id: "custom-inquiry-2",
  title: "lg이동 견적 문의",
  category: "견적문의",
  author: "이현우",
  content: "현재 KT 쓰고 있는데 LG U+로 이동해서 500M 인터넷이랑 베이직 TV 결합한 견적 좀 부탁드립니다. 핸드폰도 LG로 2대 결합 가능해요.",
  views: 3,
  status: "answered",
  adminResponse: "안녕하세요 이현우 고객님!\n\nLG U+ 이동에 휴대폰 2대 요금 결합까지 하시는 경우 가계비 절감율이 상당합니다.\n\n550M + 베이직 TV 상품군 요금제 설계 및 본 대리점 단독 즉시 지원금 정보를 포함한 최상의 견적을 가산하여 안내해 드리겠습니다. 기재해주신 번호로 담당 상담원이 전화드려 맞춤 설계 도와드리겠습니다. 감사합니다!",
  createdAt: { toDate: () => new Date("2026-05-23T11:15:00Z") },
  is_private: true,
  is_seeded: true,
  visibility: "admin_only",
  public_visible: false
});

generatedQuestions.push({
  id: "custom-inquiry-3",
  title: "핸드폰 가입 문의",
  category: "기타",
  author: "박종국",
  content: "번호이동으로 핸드폰 신속하게 새로 개통하고 싶은데 관련 절차랑 가입 혜택 문의드립니다.",
  views: 5,
  status: "answered",
  adminResponse: "안녕하세요 박종국 고객님, 올픽 지원팀입니다!\n\n기변이나 번호이동 시 적용되는 단독 지원 혜택 및 단말기 요금제 시뮬레이션 결과가 도출되었습니다. 바로 상담 가능한 번호로 전화드려 원스탑으로 안전하고 신속한 가입 지원 및 최대 페이백 혜택 설계 도와드리겠습니다. 감사합니다!",
  createdAt: { toDate: () => new Date("2026-05-27T16:45:00Z") },
  is_private: true,
  is_seeded: true,
  visibility: "admin_only",
  public_visible: false
});

generatedQuestions.push({
  id: "custom-inquiry-4",
  title: "쿠폰 질문!!",
  category: "상품문의",
  author: "최윤정",
  content: "룰렛 이벤트 참여해서 추가지원금 쿠폰 받았는데, 가입할 때 상담사분한테 당첨 내역 말씀드리면 되는건가요? 유효기간은 어떻게 되나요?",
  views: 2,
  status: "answered",
  adminResponse: "안녕하세요 최윤정 고객님! 행운의 룰렛 이벤트 당첨을 진심으로 축하드립니다!\n\n네, 맞습니다! 가입 시 전문 상담원에게 당첨되신 내역을 편하게 말씀해 주시면, 개통 확인 절차를 거쳐 약속된 추가지원금을 100% 매칭하여 즉시 실지급해 드릴 예정입니다.\n\n쿠폰 유효기간은 발급일로부터 7일 이내에 가입하여 완료되어야 유효하오니 소중한 기한 내에 신속한 혜택을 꼭 챙기시기 바랍니다. 친절하고 신속하고 정직하게 모시겠습니다. 감사합니다!",
  createdAt: { toDate: () => new Date("2026-06-02T10:20:00Z") },
  is_private: true,
  is_seeded: true,
  visibility: "admin_only",
  public_visible: false
});

// 최신 글이 제일 위로 가도록 내림차순 정렬
generatedQuestions.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());

export const COMPACT_HISTORIC_QUESTIONS = generatedQuestions;
