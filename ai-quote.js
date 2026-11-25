// 올픽 AI 3초 견적 — 채팅형 견적 위젯
// 요금·지원금은 사이트의 요금표(window.__AP)로 계산하고, 상담 접수는 firebase-boards.js의 addConsult를 그대로 사용
(function () {
  if (window.__apqLoaded) return;
  window.__apqLoaded = true;

  const BLUE = '#2563eb';
  const CSS = `
.apq-launch{position:fixed;right:92px;bottom:28px;z-index:950;display:flex;align-items:center;gap:8px;height:52px;padding:0 18px 0 8px;border:none;border-radius:999px;background:linear-gradient(135deg,#3b82f6,#4f46e5);color:#fff;font:700 15px/1 Pretendard,-apple-system,sans-serif;letter-spacing:-.3px;box-shadow:0 10px 24px rgba(37,99,235,.35);cursor:pointer}
.apq-launch img{width:36px;height:36px;border-radius:50%;background:#fff;padding:5px;box-sizing:border-box}
.apq-launch b{font-weight:800}
.is-phone .apq-launch{right:12px;bottom:200px;height:46px;padding:0 14px 0 6px;font-size:14px}
.is-phone .apq-launch img{width:34px;height:34px}
.apq-launch.hide{display:none}
.apq-panel{position:fixed;right:92px;bottom:24px;z-index:2000;width:390px;height:min(680px,calc(100vh - 48px));display:flex;flex-direction:column;background:#f5f6f8;border-radius:22px;box-shadow:0 24px 60px rgba(15,23,42,.28);overflow:hidden;font-family:Pretendard,-apple-system,sans-serif;color:#111827;letter-spacing:-.3px;opacity:0;transform:translateY(16px);pointer-events:none;transition:opacity .2s,transform .2s}
.apq-panel.open{opacity:1;transform:none;pointer-events:auto}
.is-phone .apq-panel{inset:0;width:auto;height:auto;border-radius:0}
.apq-head{display:flex;align-items:center;gap:10px;padding:16px 16px 12px;background:#fff;border-bottom:1px solid #eef0f3}
.apq-head img{width:38px;height:38px;border-radius:11px;background:#eef3ff;padding:6px;box-sizing:border-box}
.apq-head .t{flex:1;min-width:0}
.apq-head .t b{display:block;font-size:17px;font-weight:800}
.apq-head .t span{display:block;font-size:12px;color:#6b7280;margin-top:2px}
.apq-x{width:34px;height:34px;border:none;background:#f1f3f6;border-radius:50%;font-size:18px;color:#475569;cursor:pointer}
.apq-body{flex:1;overflow-y:auto;padding:16px 14px 24px;scroll-behavior:smooth}
.apq-row{display:flex;gap:8px;margin-bottom:12px;align-items:flex-start}
.apq-av{flex-shrink:0;width:32px;height:32px;border-radius:10px;background:#fff;border:1px solid #e5e7eb;padding:4px;box-sizing:border-box}
.apq-col{min-width:0;max-width:calc(100% - 44px)}
.apq-name{font-size:12px;color:#6b7280;margin:0 0 4px 2px}
.apq-msg{background:#fff;border-radius:4px 16px 16px 16px;padding:12px 14px;font-size:14.5px;line-height:1.55;white-space:pre-line;word-break:keep-all;box-shadow:0 1px 2px rgba(15,23,42,.05)}
.apq-msg b{font-weight:800}
.apq-msg .hl{color:${BLUE};font-weight:800}
.apq-me{display:flex;justify-content:flex-end;margin:0 0 12px}
.apq-me div{max-width:78%;background:${BLUE};color:#fff;border-radius:16px 4px 16px 16px;padding:10px 14px;font-size:14.5px;line-height:1.45;font-weight:600}
.apq-chips{display:flex;flex-wrap:wrap;gap:7px;margin:2px 0 14px 40px}
.apq-chip{border:1.5px solid #c7d6fb;background:#fff;color:#1e3a8a;border-radius:999px;padding:9px 14px;font:600 14px/1.2 inherit;font-family:inherit;cursor:pointer}
.apq-chip:hover{background:#eef3ff}
.apq-chip.wide{width:100%;text-align:left;border-radius:12px;padding:11px 14px}
.apq-chip.wide small{display:block;font-size:12px;font-weight:500;color:#64748b;margin-top:3px}
.apq-cta{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:12px;height:48px;border:none;border-radius:14px;background:linear-gradient(135deg,#3b82f6,#4f46e5);color:#fff;font:700 15.5px inherit;font-family:inherit;cursor:pointer}
.apq-typing{display:inline-flex;gap:4px;padding:14px 16px}
.apq-typing i{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:apqb 1s infinite}
.apq-typing i:nth-child(2){animation-delay:.15s}.apq-typing i:nth-child(3){animation-delay:.3s}
@keyframes apqb{0%,60%,100%{opacity:.3;transform:none}30%{opacity:1;transform:translateY(-3px)}}
.apq-card{background:#fff;border:1.5px solid #e5e9f2;border-radius:14px;padding:13px 14px;margin-top:9px;font-size:14px;line-height:1.55}
.apq-card.best{border-color:#93b4fb;background:#f6f9ff}
.apq-card .h{display:flex;align-items:center;gap:6px;font-weight:800;font-size:15px;margin-bottom:4px}
.apq-card .tag{font-size:11px;font-weight:700;color:#fff;background:${BLUE};border-radius:6px;padding:2px 6px}
.apq-card .r{display:flex;justify-content:space-between;gap:8px;color:#475569}
.apq-card .r b{color:#111827}
.apq-card .r b{white-space:nowrap;text-align:right}
.apq-card .r .apq-cash{color:${BLUE};font-weight:800;background:none;padding:0;white-space:nowrap}
.apq-form{background:#fff;border-radius:16px;padding:14px;margin:4px 0 14px 40px;box-shadow:0 1px 2px rgba(15,23,42,.05)}
.apq-form label{display:block;font-size:13px;font-weight:700;color:#334155;margin:0 0 6px}
.apq-form input[type=text],.apq-form input[type=tel]{width:100%;box-sizing:border-box;height:44px;border:1.5px solid #e2e8f0;border-radius:10px;padding:0 12px;font:500 15px inherit;font-family:inherit;margin-bottom:12px;outline:none}
.apq-form input:focus{border-color:#93b4fb}
.apq-agree{display:flex;align-items:flex-start;gap:7px;font-size:12.5px;color:#475569;line-height:1.45;margin-bottom:4px}
.apq-agree input{margin-top:2px;width:16px;height:16px;flex-shrink:0}
.apq-err{color:#e11d48;font-size:12.5px;min-height:16px;margin:2px 0}
.apq-foot{padding:8px 14px 12px;background:#fff;border-top:1px solid #eef0f3;font-size:11.5px;color:#94a3b8;text-align:center}
`;

  const CN = { kt: 'KT', lg: 'LG U+', sk: 'SK브로드밴드', hello: 'LG헬로비전', skylife: '스카이라이프' };
  const CN_SHORT = { kt: 'KT', lg: 'LGU+', sk: 'SK', hello: '헬로비전', skylife: '스카이라이프' };
  const TV_BRAND = { kt: '지니 TV', lg: 'U+tv', sk: 'B tv', hello: '헬로tv', skylife: 'TV' };
  const SPEED = {
    100: { label: '100M', who: '1~2인 가구', why: '100M — 필요한 만큼만, 실속 있게\n✔ 이런 분께: 1~2인 가구, 유튜브·넷플릭스·웹서핑 위주\n💡 동시에 쓰는 기기가 많지 않으면 100M로도 영상이 끊김 없이 충분해요.\n💰 요금은 가장 낮아서 필요 이상으로 내지 않는 선택이에요.' },
    500: { label: '500M', who: '3~4인 가구', why: '500M — 가족이 함께 써도 넉넉하게\n✔ 이런 분께: 3~4인 가구, 여러 기기를 동시에 쓰는 집\n💡 TV·휴대폰·PC를 한꺼번에 써도 속도가 잘 안 떨어져요.\n💰 요금 차이는 크지 않은데 체감은 확실한, 가장 많이 고르는 구간이에요.' },
    1000: { label: '1G', who: '5인 이상·게임·재택', why: '1G — 빠른 속도가 꼭 필요할 때\n✔ 이런 분께: 5인 이상, 온라인 게임, 대용량 업·다운로드, 재택근무\n💡 큰 파일이나 고화질 스트리밍을 여러 대에서 동시에 해도 여유 있어요.\n💰 지원금도 속도가 높을수록 커지는 경우가 많아요.' }
  };

  const won = (n) => Math.round(n).toLocaleString('ko-KR') + '원';
  const man = (n) => (n * 10000).toLocaleString('ko-KR') + '원';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------- 요금 계산 (사이트 요금표와 동일한 방식) ----------
  function data() { return window.__AP || null; }
  function mbOf(p) { return p.nameSuffix === 'Gbps' ? Number(p.name) * 1000 : Number(p.name); }
  function quote(c, speed, tv, phone) {
    const D = data();
    const nets = D.INTERNET_PLANS[c] || [];
    if (!nets.length) return null;
    // 고른 속도에 가장 가까운 상품 (높은 속도는 넘지 않는 쪽 우선)
    const net = nets.slice().sort((a, b) => Math.abs(Math.log(mbOf(a) / speed)) - Math.abs(Math.log(mbOf(b) / speed)))[0];
    const tvp = tv ? (D.TV_PLANS[c] || [])[0] || null : null;
    const dis = D.DISCOUNT_PLANS[c] || [];
    const phoneMatch = { kt: 'kt', lg: 'lg', sk: 'sk' }[phone] === c;
    const d = (phoneMatch ? dis.find((x) => x.price < 0 || x.bySpeed) : null) || dis[0] || null;
    const solo = !tv;
    const netPrice = (solo && net.soloPrice) ? net.soloPrice : (net.price || 0);
    const tvPrice = tvp ? (tvp.price || 0) : 0;
    let disc = 0;
    if (d) {
      if (!solo && d.bySpeedTv && d.bySpeedTv[net.id] != null) disc = d.bySpeedTv[net.id];
      else if (d.bySpeed && d.bySpeed[net.id] != null) disc = d.bySpeed[net.id];
      else disc = d.price || 0;
    }
    const before = netPrice + tvPrice + (net.promo || 0) + ((!solo && net.promoTv) || 0);
    const total = before + disc;
    const cash = D.getCashBenefitAmount(c, tv ? '인터넷 + TV' : '인터넷만', net.name || '100');
    const netLabel = net.name + (net.nameSuffix === 'Gbps' ? 'G' : 'M');
    return {
      c, net, tvp, d, disc, before, total, cash, phoneMatch,
      title: CN_SHORT[c] + ' ' + netLabel + (tvp ? ' + ' + (c === 'hello' ? '' : TV_BRAND[c] + ' ') + tvp.name : ''),
      cost3y: total * 36 - cash * 10000
    };
  }
  function todayPick() {
    const list = ['kt', 'lg', 'sk', 'hello', 'skylife'].map((c) => quote(c, 500, true, '')).filter(Boolean);
    list.sort((a, b) => b.cash - a.cash);
    return list[0];
  }

  // ---------- 화면 ----------
  let panel, body, launch, started = false, busy = false;
  const st = {};

  function build() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    launch = document.createElement('button');
    launch.className = 'apq-launch';
    launch.type = 'button';
    launch.setAttribute('aria-label', '올픽 AI 3초 견적 열기');
    launch.innerHTML = '<img src="images/allpick-symbol-sm.png" alt=""><span><b>AI</b> 3초 견적</span>';
    launch.onclick = open;
    document.body.appendChild(launch);

    panel = document.createElement('section');
    panel.className = 'apq-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '올픽 AI 3초 견적');
    panel.innerHTML = '<div class="apq-head"><img src="images/allpick-symbol-sm.png" alt=""><div class="t"><b>올픽 AI</b><span>요금·지원금을 한 번에 비교해 드려요</span></div><button type="button" class="apq-x" aria-label="닫기">✕</button></div><div class="apq-body"></div><div class="apq-foot">안내 금액은 올픽 요금표 기준 예상치이며, 정확한 금액은 상담 시 확정돼요.</div>';
    body = panel.querySelector('.apq-body');
    panel.querySelector('.apq-x').onclick = close;
    document.body.appendChild(panel);
  }

  function open() {
    panel.classList.add('open');
    launch.classList.add('hide');
    if (!started) { started = true; intro(); }
  }
  function close() {
    panel.classList.remove('open');
    launch.classList.remove('hide');
  }
  function scroll() { requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; }); }

  function bot(html) {
    const row = document.createElement('div');
    row.className = 'apq-row';
    row.innerHTML = '<img class="apq-av" src="images/allpick-symbol-sm.png" alt=""><div class="apq-col"><div class="apq-name">올픽 AI</div><div class="apq-msg">' + html + '</div></div>';
    body.appendChild(row);
    scroll();
    return row.querySelector('.apq-msg');
  }
  async function say(html, wait) {
    const row = document.createElement('div');
    row.className = 'apq-row';
    row.innerHTML = '<img class="apq-av" src="images/allpick-symbol-sm.png" alt=""><div class="apq-col"><div class="apq-msg apq-typing"><i></i><i></i><i></i></div></div>';
    body.appendChild(row);
    scroll();
    await sleep(wait == null ? 650 : wait);
    row.remove();
    return bot(html);
  }
  function me(text) {
    const d = document.createElement('div');
    d.className = 'apq-me';
    d.innerHTML = '<div>' + esc(text) + '</div>';
    body.appendChild(d);
    scroll();
  }
  function choose(options, wide) {
    return new Promise((resolve) => {
      const box = document.createElement('div');
      box.className = 'apq-chips';
      options.forEach((o) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'apq-chip' + (wide ? ' wide' : '');
        b.innerHTML = esc(o.label) + (o.sub ? '<small>' + esc(o.sub) + '</small>' : '');
        b.onclick = () => { box.remove(); me(o.label); resolve(o.value); };
        box.appendChild(b);
      });
      body.appendChild(box);
      scroll();
    });
  }

  function card(q, opts) {
    const o = opts || {};
    const discLine = q.disc < 0 ? '<div class="r"><span>월 요금</span><b>' + won(q.before) + ' → 결합 후 ' + won(q.total) + '</b></div>' : '<div class="r"><span>월 요금</span><b>' + won(q.total) + '</b></div>';
    const cashLine = o.keep ? '<div class="r"><span>혜택</span><b>재약정 시 할인·상품권 (상담 시 안내)</b></div>'
      : '<div class="r"><span>현금 지원금</span><b class="apq-cash">' + man(q.cash) + ' + 비밀지원금</b></div>';
    const install = o.keep ? '<div class="r"><span>설치비</span><b>없음 (기존 장비 그대로)</b></div>' : '<div class="r"><span>설치비</span><b>상담 시 안내</b></div>';
    return '<div class="apq-card' + (o.best ? ' best' : '') + '"><div class="h">' + (o.rank ? o.rank + ' ' : '') + esc(q.title) + (o.best ? ' <span class="tag">AI 추천</span>' : '') + '</div>' + discLine + cashLine + install + '</div>';
  }

  // ---------- 대화 흐름 ----------
  async function intro() {
    const p = data() && todayPick();
    const pickLine = p ? '\n500M+TV 기준 현금 지원금은 <span class="hl">' + CN_SHORT[p.c] + ' ' + man(p.cash) + '</span>으로 지금 가장 높아요.' : '';
    await say('<b>오늘의 올픽 AI 분석 \'픽\' 📈</b>\n올픽 요금표의 5개 통신사를 비교한 결과예요.' + pickLine + '\n다른 조건이 궁금하면 아래에서 바로 견적을 받아보세요 👇', 300);
    const go = document.createElement('button');
    go.type = 'button';
    go.className = 'apq-cta';
    go.textContent = 'AI 3초 견적 받기';
    body.lastElementChild.querySelector('.apq-col').appendChild(go);
    go.onclick = () => { go.remove(); me('AI 3초 견적 받기'); flow(); };
    scroll();
  }

  async function flow() {
    if (busy) return;
    busy = true;
    if (!data()) { await say('요금표를 불러오는 중이에요. 잠시 후 다시 시도해 주세요.'); busy = false; return; }
    await say('💡 인터넷은 약정이 끝날 때마다 통신사를 바꾸면 지원금을 다시 받을 수 있어요.\n지금 유지하는 게 나은지, 바꾸는 게 나은지 AI가 바로 비교해 드릴게요.\nAI 분석을 시작합니다 ⚡');
    await say('지금 사용 중인 <b>인터넷 통신사</b>를 골라주세요 📶');
    st.cur = await choose([
      { label: 'KT', value: 'kt' }, { label: 'LG U+', value: 'lg' }, { label: 'SK브로드밴드', value: 'sk' },
      { label: 'LG헬로비전', value: 'hello' }, { label: '스카이라이프', value: 'skylife' }, { label: '없음 (새로 설치)', value: 'none' }
    ]);
    await say('가구 인원과 쓰는 용도에 맞는 <b>속도</b>를 골라주세요 😊');
    st.speed = await choose([
      { label: '1~2인 가구 → 100M', sub: '영상·웹서핑 위주', value: 100 },
      { label: '3~4인 가구 → 500M', sub: '여러 기기를 동시에', value: 500 },
      { label: '5인 이상·게임 → 1G', sub: '대용량·재택근무', value: 1000 }
    ], true);
    await say(SPEED[st.speed].why, 800);
    await say('AI가 결합 조건을 분석하고 있어요.\n<b>TV</b>도 함께 이용하실 건가요? 📺');
    st.tv = await choose([{ label: '네, TV도 함께', value: true }, { label: '아니요, 인터넷만', value: false }]);
    await say('지금 쓰는 <b>휴대폰 통신사</b>를 골라주세요 📱\n같은 통신사로 맞추면 결합할인이 붙어요.');
    st.phone = await choose([
      { label: 'SKT', value: 'sk' }, { label: 'KT', value: 'kt' }, { label: 'LG U+', value: 'lg' },
      { label: '알뜰폰', value: 'mvno' }, { label: '기타', value: 'etc' }
    ]);

    if (st.cur !== 'none') {
      await say('지금 쓰는 <b>' + CN[st.cur] + '</b> 인터넷을 그대로 유지하실 건가요,\n아니면 통신사를 바꾸고 <b>현금 지원금</b>을 받아보실 건가요?');
      const keep = await choose([{ label: '지금 통신사 유지 (지원금 없음)', value: true }, { label: '통신사 바꾸고 혜택 받기', value: false }], true);
      if (keep) {
        await analyzing();
        const k = quote(st.cur, st.speed, st.tv, st.phone);
        const m = await say('지금 <b>' + CN[st.cur] + '</b>을 쓰시는 기준으로 안내드려요.\n지금 조건을 유지할 때 가장 효율적인 구성은 아래와 같아요 👇', 300);
        m.insertAdjacentHTML('beforeend', card(k, { keep: true }));
        m.insertAdjacentHTML('beforeend', '\n같은 조건으로 다른 통신사로 바꿨을 때 받을 수 있는 혜택도 비교해 드릴게요 😊');
        scroll();
        await choose([{ label: '통신사 변경 혜택 비교하기', value: 1 }]);
      }
    }
    await analyzing();
    const list = ['kt', 'lg', 'sk', 'hello', 'skylife'].filter((c) => c !== st.cur)
      .map((c) => quote(c, st.speed, st.tv, st.phone)).filter(Boolean)
      .sort((a, b) => a.cost3y - b.cost3y);
    const top = list.slice(0, 2);
    st.result = top;
    const head = st.cur === 'none' ? '새로 설치하시는 기준으로' : '지금 <b>' + CN[st.cur] + '</b>을 쓰시는 고객님께';
    const m = await say(head + ' 가장 유리한 조합은 아래와 같아요 👇', 300);
    top.forEach((q, i) => m.insertAdjacentHTML('beforeend', card(q, { rank: ['①', '②'][i], best: i === 0 })));
    if (top[0]) {
      const y3 = Math.max(0, Math.round((top[1] ? top[1].cost3y - top[0].cost3y : 0) / 10000));
      m.insertAdjacentHTML('beforeend', '\n🤖 <b>올픽 AI 추천</b>\n→ 3년 총비용(월요금 − 지원금) 기준으로 <span class="hl">' + CN_SHORT[top[0].c] + '</span>가 가장 유리해요' + (y3 > 0 ? ' (2위보다 약 ' + y3 + '만원 이득).' : '.') + '\n\n표에 없는 <b>비밀지원금</b>까지 받고 싶으면 문의를 남겨주세요.\n상담사가 추가 혜택을 바로 찾아드려요 😊');
    }
    scroll();
    await choose([{ label: '혜택 문의하기', value: 1 }]);
    await say('이름과 연락처만 남겨주시면 오늘 기준으로 가장 좋은 요금과 혜택을 안내해 드릴게요.\nAI가 먼저 조건을 확인하고, 상담사가 가장 이득인 선택만 골라드려요 ✨');
    form();
    busy = false;
  }

  async function analyzing() {
    await say('올픽 AI가 통신사별 요금과 지원금을 비교하고 있어요.\n잠시만 기다려주세요 👀', 500);
    await sleep(1100);
  }

  function summary() {
    const sp = SPEED[st.speed].label;
    const lines = [
      '[AI 3초 견적]',
      '현재 인터넷: ' + (st.cur === 'none' ? '없음(신규)' : CN[st.cur]),
      '속도: ' + sp + ' / TV: ' + (st.tv ? '함께' : '인터넷만'),
      '휴대폰: ' + ({ sk: 'SKT', kt: 'KT', lg: 'LG U+', mvno: '알뜰폰', etc: '기타' }[st.phone] || '-')
    ];
    (st.result || []).forEach((q, i) => lines.push((i + 1) + '순위: ' + q.title + ' 월 ' + won(q.total) + ' / 지원금 ' + man(q.cash)));
    return lines.join('\n');
  }

  function form() {
    const f = document.createElement('div');
    f.className = 'apq-form';
    f.innerHTML = '<label>이름 *</label><input type="text" autocomplete="name" placeholder="이름을 입력해주세요" maxlength="20">'
      + '<label>연락처 *</label><input type="tel" inputmode="numeric" autocomplete="tel" placeholder="010-0000-0000" maxlength="13">'
      + '<label class="apq-agree"><input type="checkbox" checked> 상담 안내를 위해 이름·연락처를 수집·이용하는 데 동의합니다. (필수)</label>'
      + '<div class="apq-err"></div><button type="button" class="apq-cta">상담 신청하기</button>';
    const [nameEl, telEl] = f.querySelectorAll('input[type=text],input[type=tel]');
    const agree = f.querySelector('input[type=checkbox]');
    const err = f.querySelector('.apq-err');
    const btn = f.querySelector('button');
    telEl.addEventListener('input', () => {
      const d = telEl.value.replace(/[^0-9]/g, '').slice(0, 11);
      telEl.value = d.length < 4 ? d : d.length < 8 ? d.slice(0, 3) + '-' + d.slice(3) : d.slice(0, 3) + '-' + d.slice(3, d.length - 4) + '-' + d.slice(-4);
    });
    btn.onclick = async () => {
      const name = nameEl.value.trim();
      const phone = telEl.value.replace(/[^0-9]/g, '');
      if (!name) { err.textContent = '이름을 입력해주세요.'; return; }
      if (!/^01[016789][0-9]{7,8}$/.test(phone)) { err.textContent = '휴대폰 번호를 정확히 입력해주세요.'; return; }
      if (!agree.checked) { err.textContent = '개인정보 수집·이용에 동의해주세요.'; return; }
      err.textContent = '';
      btn.disabled = true;
      btn.textContent = '접수 중...';
      const best = (st.result || [])[0];
      const payload = {
        name, phone, source: 'AI 3초 견적', memo: summary(),
        detail: best ? [st.tv ? '인터넷 + TV' : '인터넷 단독', CN_SHORT[best.c], SPEED[st.speed].label].join(' / ') : '',
        sel: best ? {
          carrier: CN_SHORT[best.c], productCondition: st.tv ? '인터넷+TV' : '인터넷단독',
          internetSpeed: best.net.name + (best.net.nameSuffix === 'Gbps' ? 'Gbps' : 'Mbps'),
          tvProduct: best.tvp ? best.tvp.name : '', bundleDiscount: best.disc < 0 && best.d ? best.d.name : '',
          estimatedMonthly: won(best.total)
        } : {}
      };
      try {
        const fb = await import(new URL('firebase-boards.js?v=20261112b', document.baseURI).href);
        await fb.addConsult(payload);
        f.remove();
        await say('✅ 상담 신청이 접수됐어요!\n<b>' + esc(name) + '</b>님, 곧 전문 상담사가 연락드릴게요.\n급하시면 1800-9774로 바로 전화 주셔도 돼요.');
        if (window.gtag) try { window.gtag('event', 'generate_lead', { method: 'ai_quote' }); } catch (e) {}
      } catch (e) {
        console.error('ai quote consult', e);
        btn.disabled = false;
        btn.textContent = '상담 신청하기';
        err.textContent = '접수 중 문제가 생겼어요. 다시 눌러주시거나 1800-9774로 전화 주세요.';
      }
    };
    body.appendChild(f);
    scroll();
  }

  window.openAiQuote = function () { if (panel) open(); };
  function init() {
    build();
    try { if (/[?&]ai=1\b/.test(location.search)) open(); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
