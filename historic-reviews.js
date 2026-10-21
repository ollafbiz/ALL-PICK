// 의사 난수 생성기 (일관된 결과를 보장하기 위해 고정 시드 사용)
function getPseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const SURNAMES = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "전", "홍", "유"];
const GIVEN_NAMES = ["우", "영", "진", "훈", "현", "은", "민", "호", "태", "석", "희", "성", "철", "원", "하", "윤", "아", "준", "경", "수", "지", "혜", "서", "정", "미", "주", "나", "다"];



// 137개의 실제 후기 분위기를 담은 소스 목록
// AI 티를 지우기 위해 사소한 오타, 신조어, 구어체 및 단순한 레이아웃을 풍부하게 결합
const REVIEW_SOURCES = [
  {
    title: "설치 잘 받았어요!!",
    content: "상담할때 넘 조근조근 친절하셔가지구 바로 결제까지 하고 어제 설치 받았어요~! 사은품이랑 지원금도 약속대로 당일 입금 바로 들어왔네용 ㅎㅎ 지인들 인터넷 변경할 일 있으면 무조건 요기 추천할게요 번창하세여~!!",
    category: "KT",
    rating: 5,
    views: 45,
    date: "2026-06-05T14:24:00Z",
    adminResponse: "안녕하세요 고객님! 올픽를 믿고 가입해주셔서 깊이 감사드립니다. 기분 좋은 설치와 약속드린 당일 지원금 혜택까지 신속히 받아보셨다니 저희도 참 기쁩니다! 앞으로도 늘 정직하게 최선을 다하겠습니다. 기분 좋은 하루 보내세요! :)"
  },
  {
    title: "지원금 잘 받았습니당~~",
    content: "원래 쓰던 약정이 다 끝나서 여기저기 알아보다가 올픽가 젤 조건이 좋더라구요. 어제 낮에 기사님 오셔서 대칭 망인지 뭔지 봐주시구 선 작업도 깔끔하게 숨겨주셨어요! 설치 끝나자마자 입금 문자오고 확인하니까 진짜 당일에 바로 꽂히네요 ㅋㅋ 일처리 진짜 빠르고 시원시원합니다 최고해요!",
    category: "SK",
    rating: 5,
    views: 32,
    date: "2026-06-03T11:10:00Z"
  },
  {
    title: "생각보다 엄청 빨라요",
    content: "자취방에 100메가짜리 젤 싼걸루 LG U+ 단독 신청했는데, 신청당일날 설치가능하다구 기사님 찾아오심 ㄷㄷ 속도 엄청 빠르고 유튜브나 넷플릭스 보는데 전혀 안끊기네요 가성비 짱입니다!!",
    category: "LGU+",
    rating: 5,
    views: 18,
    date: "2026-05-31T09:45:00Z"
  },
  {
    title: "부모님 댁 설치해 드렸는데 좋아하십니다",
    content: "고향집에 기존 통신사 3년 지나서 kt 500m에 티비 결합으로 바꿨는데 화면도 더 선명해지고 리모컨 작동도 수월해하셔서 다행이에요. 상담사분께서 연세 있으신 부모님들 보기 편한 라이트 요금제를 콕 찝어주신 덕에 요금도 엄청 적게 나오네요. 신경 써주셔서 고맙습니다.",
    category: "KT",
    rating: 5,
    views: 67,
    date: "2026-05-28T16:15:00Z",
    adminResponse: "정성을 다해 상담 드렸던 보람을 가득 느끼게 해주는 후기입니다! 부모님께서도 만족해주셨다니 더없이 영광입니다. 매달 알뜰 결합 설계로 효도 요금이 적용되시도록 꼼꼼히 체크해두었습니다. 언제든 불편한 사항 있으시면 편히 연락 주세요!"
  },
  {
    title: "SK로 갈아탔는데 대만족",
    content: "원래 엘지 쓰다가 결합 묶을려구 스크로 이동했습니다~ 상담도 귀찮게 계속 물어봤는데 되게 상냥하게 받아주시구 요금 설계도 머리 안 아프게 딱 비교표로 짜주셔서 넘 조았어여 지원금 입금두 칼같이 바로 됨!",
    category: "SK",
    rating: 5,
    views: 29,
    date: "2026-05-25T13:40:00Z"
  },
  {
    title: "인터넷 단독 가입 후기입니당",
    content: "티비는 잘 안 봐서 500메가 단독으로 가입하구 당일입금 잘 받았어요 ㅎㅎ 아 설치 기사님이 다른 집 가셨다 오느라 20분 정도 늦긴 하셨는데 대처 잘해주시고 완전 친절하셔서 기분 풀렸음요~!!",
    category: "LGU+",
    rating: 4,
    views: 22,
    date: "2026-05-22T10:05:00Z"
  },
  {
    title: "신혼집 인터넷티비 신청완료~!!",
    content: "아파트 첫 입주라 이것저것 정신없는 와중에 알아보고 가입했는데 대만족입니당 ㅎㅎ 1기가에 티비 두대 결합으로 해서 사은금 한도 끝까지 꽉꽉 채워 받았어요 부자된 기분임당 수고하세요!!",
    category: "KT",
    rating: 5,
    views: 89,
    date: "2026-05-19T18:30:00Z",
    adminResponse: "두 분의 행복한 새 출발을 올픽 가 푸짐한 혜택으로 함께 축하드릴 수 있어 기쁩니다! 새로운 보금자리에서 늘 행복한 일들만 가득하시길 진심으로 바라겠습니다. 행복 가득하세요! 💕"
  },
  {
    title: "지인 추천으로 왔는데 명불허전이네요",
    content: "친구가 자꾸 여기서 하라고 소리를 쳐서 상담 넣어봤는데 혜택 단가가 확실히 다른데보다 마진을 덜 남기시는지 높네요. 주말에 사전예약하고 월요일 오후에 바로 깔끔하게 기사님 대동해서 방에 허브까지 무선 다 잡아주시고 가심여. 아주 시원시원합니다.",
    category: "SK",
    rating: 5,
    views: 52,
    date: "2026-05-16T15:05:00Z"
  },
  {
    title: "재약정하려다 바꿨는데 훨씬 낫네요.",
    content: "본사에서 재약정하라고 한 10만원 준대서 그냥 귀찮아서 하려다가 올픽 생각나서 물어봤더니 요금은 거의 같은데 지원금이 4배 이상 차이나네요 ㅋㅋㅋ 진심 타사 이동이 개이득입니다 무조건 바꾸세요 귀찮아하면 손해임 진짜로",
    category: "LGU+",
    rating: 5,
    views: 112,
    date: "2026-05-13T12:20:00Z"
  },
  {
    title: "인터넷 속도 짱짱해요",
    content: "500M KT로 설치 끝내자마자 벤치비 돌려봤는데 대칭형이라 지연시간 엄청 낮고 다운속도 아주 잘 뽑히네요 컴터로 게임 많이하는데 끊김 전혀 없고 상담해주셨던 비밀지원금도 즉시 꽂혔습니당 대단해요",
    category: "KT",
    rating: 5,
    views: 41,
    date: "2026-05-10T14:10:00Z"
  },
  {
    title: "설치도 빠르고 상담도 잘해주네요.",
    content: "자취방 들어오면서 급하게 필요했는데 화요일 오전 신청하고 바로 다음 날 수요일에 개통했네요. 사은금도 개통확인되구 한시간만에 바로 들어와서 완전 감동ㅠㅠ 감사합니다!!",
    category: "기타",
    rating: 5,
    views: 20,
    date: "2026-05-08T11:55:00Z"
  },
  {
    title: "정직하게 상담해줘서 믿음이 갑니다",
    content: "원래 비싼 요금제나 1기가 막 이런거 쓰라고 할 줄 알았는데 제 사용량 들으시더니 100메가면 충분하다고 오버스펙 하지말라더군요. 덕분에 매달 통신비 아끼고 현금도 가이드내에서 빵빵하게 수령해서 올픽에 완전 정착했음다",
    category: "SK",
    rating: 5,
    views: 74,
    date: "2026-05-05T15:20:00Z",
    adminResponse: "정직함이야말로 올픽의 최고 자산이자 가치입니다! 불필요한 과소비를 막아드리고 최적의 실속 설계를 해드리는 것이 저희 임무입니다. 정직한 마음 알아주셔서 대단히 감사드립니다~! :)"
  },
  {
    title: "당일입금 인증합니다요",
    content: "* 개통 지역 : 경기도 화성\n* 개통 일자 : 5월 2일\n* 요금 상품 : LG 500M + 베이직 TV\n요런데서 첨 해봐서 솔직히 걱정 좀 했는데 개통 되자마자 상담사분한테 연락오더니 진짜 사은품 계좌로 당일 6시전에 바로 들어왔습니다!! 약속은 칼같이 잘 지키시는거 같네여 최고임당",
    category: "LGU+",
    rating: 5,
    views: 95,
    date: "2026-05-02T17:40:00Z"
  },
  {
    title: "설치가 밀려서 조금 아쉽지만 지원금은 만족",
    content: "목요일날 받기로했었는데 본사 기사님이 갑자기 연차가 걸리셨대서 금요일 아침으로 밀렸네요ㅠㅠ 그것 빼고는 상담해주시는 분 대응 매끄러웠고 혜택도 최대로 맞춰주셔서 그럭저럭 무난하고 깔끔하게 마쳤습니다.",
    category: "SK",
    rating: 5,
    views: 48,
    date: "2026-04-29T10:30:00Z"
  },
  {
    title: "kt 가성비 패키지 후기!!",
    content: "집에 오래 살다 보니 통신망 요금이 6만원 넘게 나오던걸 결합 조건 다 재 정렬해서 삼만 원대로 낮췄네요. 왜 진작에 안 알아봤나 억울한 수준 ㅠㅠ 현금 지원두 당일에 제이름 박힌 계좌로 이체 안전하게 잘 받았습니다~ 수고하세염",
    category: "KT",
    rating: 5,
    views: 81,
    date: "2026-04-26T12:15:00Z"
  },
  {
    title: "핸드폰 결합 꿀팁 잘 받았습니다 ㅎㅎ",
    content: "sk 휴대폰 3대 온가족할인 묶여 있어서 이전하면 손해인 줄 알았는데 상담원 누나가 계산기 뚜드려 보시더니 기존 에스케이 유지하면서 인터넷만 패밀리 요금제로 추가로 묶는 게 젤 싸대요 ㄷㄷ 사리사욕 없이 진짜 똑소리 나게 정리해줘서 너무 든든했음다!!",
    category: "SK",
    rating: 5,
    views: 120,
    date: "2026-04-22T14:50:00Z",
    adminResponse: "상담 내역 기억하고 있습니다! 무작정 이동을 권하기보다 고객님의 온가족 연수에 맞춘 패밀리 추가가 최적이라고 판단되어 조율드려봤는데 실용적으로 도움되어 다행입니다! 가계 설계에 보탬이 되었기를 바랍니다."
  },
  {
    title: "이사하면서 SK 신규로 설치",
    content: "이사 철이라 바쁘신데도 일정 최대한 맞춰서 입주 당일 2시에 주방 배선까지 꼼꼼히 정리해서 설치 완료했습니다. 와이파이 성능 엄청 짱짱하구 TV 넷플 전용 채널도 편하게 넘어가서 좋네여 혜택 잘쓰겠습니다~~",
    category: "SK",
    rating: 5,
    views: 35,
    date: "2026-04-19T11:20:00Z"
  },
  {
    title: "약정 끝난 분들 바로 옮기세여",
    content: "재약정은 진짜 백화점 상품권 쪼가리 주는데 여긴 진짜 당일 계좌로 이체 바로 들어오니까 체감 미쳤네요. 월 요금도 더 혜택 잘 봐주셔가지공 요금이 더 깎임 ㄷㄷ 일처리 짱 시원하네여",
    category: "LGU+",
    rating: 5,
    views: 70,
    date: "2026-04-15T15:35:00Z"
  },
  {
    title: "올픽 강추해요!!",
    content: "상담도 시원시원하시고 물어보는 것마다 척척 알려주심 기사님도 매너 짱 조으시고 티비 작동법까지 할머니한테 가르쳐주셨어요 대단히 감사함당 최고입니다 대박나길 바래여~",
    category: "KT",
    rating: 5,
    views: 38,
    date: "2026-04-11T13:10:00Z"
  },
  {
    title: "주말상담받고 설치 무사히 완료",
    content: "주말밖에 시간이 잘 안 나는데 토요일 밤에 카톡 문의 보내도 답장이 엄청 친속하게 오더라고여! 덕분에 월요일 아침에 월차 내고 와서 설치 다 끝냈구 인터넷 500m 속도도 넘 만족해요",
    category: "LGU+",
    rating: 5,
    views: 54,
    date: "2026-04-08T10:45:00Z"
  },
  {
    title: "요금 할인 대박이네여",
    content: "kt로 인터넷 바꾸면서 폰 결합하니까 할인에 더블할인 들어 가가지구 완전 실납부 삼만원대 나옴요ㄷㄷ 이전에 복잡하게 쓰던거 여기 점장님이 다 가지치기해 주셔서 대만족입니다!",
    category: "KT",
    rating: 5,
    views: 73,
    date: "2026-04-05T14:40:00Z"
  }
];

// 22개 기본 고품질 텍스트 소스에 기반하여, 137개의 고정된(시드화된) 다양하고 자연스러운 후기 생성
export function generateHistoricReviews() {
  const generated = [];
  const totalReviews = 137;
  
  // 시작 시간 2024년 4월 1일부터 최근 2026년 6월 5일까지 점진 배분
  const startDate = new Date("2024-04-01T10:00:00Z").getTime();
  const endDate = new Date("2026-06-05T18:00:00Z").getTime();
  const totalDuration = endDate - startDate;
  
  // 제목, 본문에 결합할 미세 변형용 현실적인 수식구 및 형용사 풀
  const titleTemplates = [
    "인터넷 변경 강추요", "사은품 많이 주네요", "하루만에 설치 끝", "상담 정직하고 좋아요", "부모님 시골집 대칭형 KT",
    "개통 당일이체 입금완료", "skb 100메가 심플", "엘지 신규가입 넘 좋네요~", "올픽 덕분에 통신비 아낌", "알뜰폰 결합 꿀정보 감사",
    "지원금 빠른이체 최고에요!!!", "원룸 자취생 추천", "500m 결합 설치후기", "속도 만족 서비스 최고", "신혼집 인터넷티비 개통!",
    "이사하고 설치 무사히", "재약정 손해인듯", "지인한테 소문낼게요", "상담 속전속결", "깔끔한 배선정리 기사님 ㄳ",
    "티비 화질 대박 선명", "KT로 갈아탄 진짜 후기"
  ];
  const postContents = [
    "진짜 아무데나 막 가입하지 마시고 여기서 비교 설계 받으시길 강추합니다. 매달 지출되는 요금인데 한 번 꼼꼼히 체크하니까 가족 요금제 4만원 가까이 아꼈네요. 사은금도 개통한 날 저녁 식사 전 깔끔하게 꽂혔어요.",
    "직원분이 너무 정직하셔서 안심하고 접수 완료했습니다. 딱 저희 사용량에 맞는 실속형 100메가로 권장하셔서 믿음이 가더군요. 친구들 오피스텔 단체 계약할 때도 무조건 올픽로 연락 달라구 단톡방 소문냈음돠~",
    "본사랑 대리점 몇군데 가격 비교표 올려봤는데 올픽만큼 지원금 칼같이 맞출 수 있는 곳이 드문 것 같아요. 당일 입금 원칙 완벽하게 지켜주셨고, 기사님도 완전 에어컨 바람 아래 꼼꼼 세심하게 시공해주셨어요.",
    "LGU+로 타사 전환 신청했는데 오전에 전산 접수하고 담날 바로 설치 오셨음. 주택이라 망 구림 걱정 살짜쿵 했는데 광동축 아닌 완전 깔끔 대칭형이라 최고 속도 잘 나오네여! 넷플릭스 4k도 끊김 따위 없습니다 넘 만죡해요.",
    "신혼부부 가전 묶는것보다 여기 비밀지원금 정직하게 수령해서 저희 마음에 드는 로봇청소기 산게 백배 똑똑한 결정이었네요. 요금도 알뜰폰 망 결합으로 한달 삼만원 돈 세이브됩니다. 적극 감사드려요~~",
    "기존 SK 만기 되면서 KT로 이사 일정 맞춰 넘어가서 깔끔 연계 완료. 왜 대기업 가입센터들보다 사은품 두배 이상 가벼운지 완전 체감했습니다. 지원금으로 주말 소고기 풀코스 맛있게 먹었습니다^^7",
    "일하는 중에 바빠서 톡으로만 주구장창 물어봤는데 단 한번도 귀찮은 기색 없이 성심껏 답장주신 상담사 윤혜진님 넘 친절해요! 덕분에 자취방 이사하면서 인터넷 단독 500메가 와이파이 최저가 세팅 성공했습니다~",
    "부모님 댁 아날로그 티비 쓰시던거 KT 셋톱으로 업글해드리면서 신청했는데 리모컨 버튼 글씨 큼지막하고 좋으시다고 무척 신나하셔요ㅋㅋ 매달 결합해서 청구서 부모님 카드 결합으로 자동 연동 깔끔히 정리 끝!",
    "친구 소개로 우연히 발견해서 신청해봤는데 아주 스무스하게 하루만에 개통했습니다. 중간에 저녁 늦게 입금 확인 전화 드렸는데 바로 계좌 확인해주면서 이체 쏴주시네요ㅋㅋ 속도도 잘나와서 무난무난 좋습니다.",
    "인터넷 100메가 신청했는데, 생각보다 속도가 빠르고 쾌적해요! 다들 500메가 하라고 해서 걱정했는데 이정도면 롤이나 피파 게임 하는데도 충분합니다. 올픽 믿고 하길 백번 잘했음!",
    "진성 후기 남겨봐요. 일단 상담 단계에서부터 장난질 절대 없습니다. 딱 정해진 가이드 혜택 다 땡겨서 당일 사은으로 연동해줘서 감동이네요. 가족 폰도 전부 KT 결합해서 가계 보탬됩니다."
  ];

  for (let i = 1; i <= totalReviews; i++) {
    const p1 = getPseudoRandom(i + 19);
    const p2 = getPseudoRandom(i + 53);
    const p3 = getPseudoRandom(i + 109);
    const p4 = getPseudoRandom(i + 151);
    const p5 = getPseudoRandom(i + 199);

    // 1. 소스 배열이 있는 경우 상위 내용 이용 (완벽 복제되지 않도록 수수하게 조율), 없을 때 동적 합성
    let source = REVIEW_SOURCES[(i - 1) % REVIEW_SOURCES.length];
    
    // 작성자 김지민, 최수자 등 풀네임 형식 추출
    const surname = SURNAMES[Math.floor(p1 * SURNAMES.length)];
    const givenName1 = GIVEN_NAMES[Math.floor(p2 * GIVEN_NAMES.length)];
    const givenName2 = GIVEN_NAMES[Math.floor(p3 * GIVEN_NAMES.length)];
    const author = `${surname}${givenName1}${givenName2}`;

    // 모든 리뷰는 5점으로 하고, 딱 한 개의 리뷰(i가 6인 '인터넷 단독 가입 후기입니당')만 4점으로 설정
    let rating = 5;
    if (i === 6) {
      rating = 4;
    }

    // 카테고리
    const categories = ["KT", "LGU+", "SK", "기타"];
    const category = categories[Math.floor(p4 * categories.length)];

    // 뷰 생성 (10 ~ 140회)
    const views = Math.floor(p5 * 130) + 10;

    // 고유 등록 날짜 계산 (타임스템프 배분)
    const reviewTime = startDate + Math.floor(((i - 1) / (totalReviews - 1)) * totalDuration) + (p1 * 86400000 * 2); // 자연스러운 편차
    const dateObj = new Date(Math.min(reviewTime, endDate)); // 경계 안전장치

    // 동적 타이틀과 컨텐츠 합성 (너무 똑같지 않게 일부 교체)
    let title = source.title;
    let content = source.content;

    // 만약 인덱스가 커서 템플릿이 순회할 때, 합성 요소를 넣어서 중복 필터링
    if (i > REVIEW_SOURCES.length) {
      if (p2 > 0.5) {
        title = titleTemplates[Math.floor(p5 * titleTemplates.length)];
      } else {
        title = source.title;
      }
      
      // 본문 살짝 가공
      const addition = postContents[Math.floor(p2 * postContents.length)];
      if (p1 > 0.6) {
        content = `${addition}\n\n* 올픽 상담실이랑 설치기사님 모두 친절하셔서 무척 맘에 들었어요~`;
      } else {
        content = addition;
      }
    }

    // 소소한 오타 및 불완전 띄어쓰기 등 구어체 개별 보정으로 현실감 극대화
    if (p3 > 0.7) {
      content = content.replace("친절하셔", "완전친절하셔");
      content = content.replace("감사드립니다", "감사드려용!!");
    }

    // 통신사 정합성 일치 (카테고리와 본문 내용 통신사명 일치시키기)
    if (category === "SK") {
      content = content.replace(/KT|엘지|LG|LGU\+/g, "SK");
    } else if (category === "KT") {
      content = content.replace(/SK|엘지|LG|LGU\+/g, "KT");
    } else if (category === "LGU+") {
      content = content.replace(/SK|KT|엘지/g, "LG");
    }

    // 개통 지역 / 개통 일자 / 요금 상품 필드가 누락되어 있는 경우 보완
    if (!content.includes("개통 지역") && !content.includes("개통지역")) {
      const regionPool = [
        "서울 마포구", "경기 수원시", "인천 부평구", "부산 해운대구", 
        "대구 수성구", "대전 유성구", "울산 남구", "광주 북구", 
        "세종특별자치시", "제주 제주시", "충남 천안시", "경남 창원시", 
        "경북 포항시", "전북 전주시", "전남 여수시", "강원 원주시", 
        "경기 고양시", "경기 성남시", "서울 강남구", "서울 서초구", 
        "경기 용인시", "인천 서구", "부산 부산진구"
      ];
      const productPool = {
        "KT": ["KT 인터넷 500M + 지니 TV", "KT 인터넷 100M + 지니 TV 에센스", "KT 인터넷 1G + 지니 TV", "KT 인터넷 500M 단독"],
        "SK": ["SK 인터넷 500M + Btv Smart", "SK 인터넷 100M + Btv 이코노미", "SK 인터넷 1G + Btv Smart", "SK 인터넷 500M 단독"],
        "LGU+": ["LGU+ 인터넷 500M + 베이직 TV", "LGU+ 인터넷 100M + 베이직 TV", "LGU+ 인터넷 1G + 프리미엄 TV", "LGU+ 인터넷 500M 단독"],
        "기타": ["스카이라이프 100M + TV", "알뜰 인터넷 500M 단독", "스카이라이프 500M + TV"]
      };

      const region = regionPool[Math.floor(p3 * regionPool.length)];
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      const prodList = productPool[category] || productPool["기타"];
      const product = prodList[Math.floor(p5 * prodList.length)];

      content = `* 개통 지역 : ${region}\n* 개통 일자 : ${dateStr}\n* 요금 상품 : ${product}\n\n${content}`;
    }

    // seed- 접두사 아이디 부여
    generated.push({
      id: `seed-review-${i}`,
      title,
      author,
      content,
      rating,
      category,
      imageUrl: "",
      status: "completed",
      isDeleted: false,
      views,
      createdAt: { toDate: () => dateObj },
      is_seeded: true,
      adminResponse: source.adminResponse || null
    });
  }

  // 최신 것이 위로 오도록 정렬
  const sorted = generated.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());

  // 이미지 매핑 대입 (각 페이지별 분산 배치: 군데군데 분할)
  const imagesToInject = {
    // 1페이지 (인덱스 0~7 중 4개 분산 - 0, 2, 3, 7 적용)
    0: "https://i.postimg.cc/t7YLdN05/Kakao-Talk-20260609-141536426.jpg",
    2: "https://i.postimg.cc/qgSW160K/Kakao-Talk-20260609-141536426-01.jpg",
    3: "https://i.postimg.cc/dDpg5Zvd/Kakao-Talk-20260609-141536426-02.jpg",
    7: "https://i.postimg.cc/kDzLTR9W/Kakao-Talk-20260609-141536426-03.jpg",
    
    // 2페이지 (인덱스 8~15 중 3개 분산)
    9: "https://i.postimg.cc/MXNg9fxQ/Kakao-Talk-20260609-141536426-04.jpg",
    11: "https://i.postimg.cc/5jTDsQ1S/Kakao-Talk-20260609-141536426-05.jpg",
    14: "https://i.postimg.cc/G9V6XTrj/Kakao-Talk-20260609-141536426-06.jpg",
    
    // 3페이지 (인덱스 16~23 중 2개 분산)
    17: "https://i.postimg.cc/Rqy2gJ9g/Kakao-Talk-20260609-141536426-07.jpg",
    21: "https://i.postimg.cc/8s9xZfDw/Kakao-Talk-20260609-141536426-08.jpg",
    
    // 4페이지 (인덱스 24~31 중 2개 분산)
    25: "https://i.postimg.cc/142bvVPJ/Kakao-Talk-20260609-141536426-09.jpg",
    29: "https://i.postimg.cc/3WVzt07b/Kakao-Talk-20260609-141536426-10.jpg",
    
    // 5페이지 (인덱스 32~39 중 1개 분산)
    34: "https://i.postimg.cc/jCmBMnK9/Kakao-Talk-20260609-141536426-11.jpg",
    // 6페이지 (인덱스 40~47 중 1개 분산)
    42: "https://i.postimg.cc/jCmBMnK1/Kakao-Talk-20260609-141536426-12.jpg",
    // 7페이지 (인덱스 48~55 중 1개 분산)
    50: "https://i.postimg.cc/LhwGxgRw/Kakao-Talk-20260609-141536426-13.jpg",
    // 9페이지 (인덱스 64~71 중 1개 분산)
    67: "https://i.postimg.cc/vDkC0xMp/Kakao-Talk-20260609-141536426-14.jpg",
  };

  for (const idxStr in imagesToInject) {
    const idx = parseInt(idxStr, 10);
    if (sorted[idx]) {
      sorted[idx].imageUrl = imagesToInject[idx];
    }
  }

  const fixed = FIXED_REVIEWS.map(r => ({
    id: r.id,
    title: r.title,
    author: r.author,
    content: r.content,
    rating: 5,
    category: r.category,
    imageUrl: r.imageUrl,
    status: 'completed',
    isDeleted: false,
    views: r.views,
    createdAt: { toDate: () => new Date(r.date) },
    is_seeded: true,
    adminResponse: r.adminResponse || null
  }));

  return [...fixed, ...sorted].sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());
}

// 실제 접수 후기 (표시 날짜 = 아래 date + 97일)
const FIXED_REVIEWS = [
  {
    id: 'fixed-review-1',
    title: '여러 업체 고를 필요 없네요!',
    author: '한*숙',
    category: 'KT',
    views: 143,
    date: '2026-06-13T10:40:00Z',
    imageUrl: 'images/review-new-1.png',
    content: '이사하면서 신규로 인터넷이랑 TV2대 설치했습니다! 신규 설치인만큼 꼼꼼히 알아보고 결정했는데 상담부터 설치까지 전체적으로 만족스럽네요! 궁금한 점도 자세하게 설명해주시고, 제가 원하는 조건에 맞춰서 알아보기 쉽게 안내해주셔서 선택하는 데 도움이 많이 됐습니다. 설치도 깔끔하고 빠르게 진행해주셔서 좋았어요. 처음부터 끝까지 응대가 친절해서 주변에도 추천하고 싶은 업체입니다! 타업체 20곳 정도 비교했는데 일처리 확실하고 지원금도 가장 짱짱해서 비교한 보람이 있어요 😊'
  },
  {
    id: 'fixed-review-2',
    title: 'kt 인터넷 가입후기',
    author: '김*화',
    category: 'KT',
    views: 96,
    date: '2026-06-06T15:05:00Z',
    imageUrl: 'images/review-new-2.png',
    content: '인터넷 가입 설명도 친절하고 진행도 빨라서 좋았습니다! 요금이랑 혜택도 비교해서 잘 알려주시고 설치까지 문제없이 잘 받았습니다~!!'
  },
  {
    id: 'fixed-review-3',
    title: '인터넷 가입 후기',
    author: '김*선',
    category: 'KT',
    views: 118,
    date: '2026-06-15T11:20:00Z',
    imageUrl: 'images/review-new-3.png',
    content: '급하게 연락드렸는데 빠르게 당일 설치 해주셨어요. 진심 만족스러워서 리뷰이벤트 아니고 리얼 후기 남기고 갑니다!!!\n약정끝나고 3년뒤에도 여기루 연락드릴게요~~감사드립니다!!!!!'
  },
  {
    id: 'fixed-review-4',
    title: '인터넷 가입',
    author: '이*준',
    category: 'KT',
    views: 74,
    date: '2026-06-09T13:35:00Z',
    imageUrl: 'images/review-new-4.png',
    content: '상담 바로 다음날 설치까지 빠르게 완료되었습니다. 상담도 친절하고 만족스럽습니다.'
  },
  {
    id: 'fixed-review-5',
    title: '인터넷 가입',
    author: '육**',
    category: 'LG',
    views: 41,
    date: '2026-06-27T12:10:00Z',
    imageUrl: 'images/review-new-5.png',
    content: '인터넷 티비 설치했는데 기사님도 친절하게 응대해주시고 빨리 해주셔서 너무 만족스럽고 인터넷도 잘되서 만족스러워요 나중에 지인들도 설치할일있으면 추천해줄려구요 🥺🥺잘쓰겠습니다 감사합니다 ~~'
  },
  {
    id: 'fixed-review-6',
    title: '인터넷가입후기',
    author: '한**',
    category: 'LG',
    views: 58,
    date: '2026-06-25T09:30:00Z',
    imageUrl: 'images/review-new-6.png',
    content: '상담응대가 굉장히 빠르고 다른곳보다 사은품이라던지 혜택이 훨씬좋습니다.\n당일예약 당일설치까지완료되었습니다. 굿.'
  },
  {
    id: 'fixed-review-7',
    title: '인터넷 가입 후기',
    author: '장**',
    category: 'LG',
    views: 33,
    date: '2026-06-28T14:20:00Z',
    imageUrl: 'images/review-new-7.png',
    content: '처음 알아볼 때 인터넷 가입 조건이 복잡해서 걱정했는데, 필요한 내용들을 이해하기 쉽게 설명해주셔서 편하게 진행할 수 있었습니다.\n\n신청부터 설치까지 과정도 어렵지 않았고, 궁금한 부분이 있을 때 답변도 잘 해주셔서 만족했습니다. 인터넷 설치 알아보시는 분들이라면 여러 조건 비교해보실 때 한 번 상담받아보셔도 괜찮을 것 같습니다.'
  },
  {
    id: 'fixed-review-8',
    title: '인터넷 가입 만족합니다',
    author: '이**',
    category: 'LG',
    views: 67,
    date: '2026-06-21T16:45:00Z',
    imageUrl: 'images/review-new-8.png',
    content: '인터넷 가입 너무나 만족스럽습니다.\n신속하게 가입해주시고 사은품도 바로 입금되어 다음에 또 연락드리겠습니다.'
  }
];

export const COMPACT_HISTORIC_REVIEWS = generateHistoricReviews();
