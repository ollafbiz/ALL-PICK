const nodemailer = require('nodemailer');

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const str = (v) => (v == null ? '' : String(v));

// 사무실 관리자 서버로 접수 전달 (OLLAF_API_URL 미설정 시 건너뜀)
async function forwardToOffice(b, phoneHyphen) {
  const url = process.env.OLLAF_API_URL;
  if (!url) return { skipped: true };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Ollaf-Key': process.env.OLLAF_API_KEY || 'ollaf-homepage-2026' },
      body: JSON.stringify({
        name: str(b.name),
        phone: phoneHyphen,
        carrier: str(b.carrier),
        serviceType: str(b.serviceType || b.source || '상담신청'),
        serviceDetail: str(b.serviceDetail || b.interest || '(선택 상품 없음)'),
        memo: str(b.memo),
        site: 'allpick'
      }),
      signal: ctrl.signal
    });
    return { ok: r.ok, status: r.status };
  } catch (e) {
    console.error('office api error', e && e.message);
    return { ok: false, error: e && e.message };
  } finally { clearTimeout(timer); }
}

async function sendMail(b, phoneHyphen) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.NOTIFY_TO || process.env.MAIL_TO || 'alnetreport@gmail.com';
  if (!user || !pass) return { ok: false, error: 'Missing Gmail credentials' };
  const rows = [
    ['접수 경로', b.source], ['이름', b.name || '(미입력)'], ['연락처', phoneHyphen],
    ['통신사', b.carrier || '-'], ['선택 상품', b.serviceDetail || b.interest || '-'], ['문의 내용', b.memo || b.message || '(없음)'],
    ['유입 페이지', b.pageUrl], ['이전 페이지', b.referrer || '-'], ['utm_source', b.utm_source || '-'],
    ['접수 시각', new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })]
  ];
  const html = `<div style="font-family:sans-serif"><h2 style="margin:0 0 14px;font-size:18px">올픽 상담 접수</h2><table style="border-collapse:collapse;font-size:14px">${rows.map(r => `<tr><td style="padding:7px 16px 7px 0;color:#64748b;white-space:nowrap;vertical-align:top">${r[0]}</td><td style="padding:7px 0;font-weight:600">${esc(r[1]).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table></div>`;
  try {
    const t = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
    await t.sendMail({ from: `"올픽 상담알림" <${user}>`, to, subject: `[올픽] 상담신청 - ${b.name || '무기명'} ${phoneHyphen}`, html });
    return { ok: true };
  } catch (e) {
    console.error('mail error', e);
    return { ok: false, error: 'send failed' };
  }
}

/* ───── 보안 가드 (SMTP 헤더 주입 / 공격 패턴 / Origin 체크) ───── */
const ALLOWED_ORIGINS = ['https://www.all-pick.kr', 'https://all-pick.kr'];
const ATTACK_PATTERNS = [
  /<script\b/i, /<sCRiPt/i, /javascript\s*:/i, /on(error|load|click|focus)\s*=/i,
  /<iframe\b/i, /document\.(cookie|write)/i, /\beval\s*\(/i,
  /\r\n|%0A|%0D/i,                                     /* SMTP 헤더 주입 */
  /(?:^|\n)\s*(bcc|cc|content-type|mime-version|from)\s*:/i,
  /artex[0-9]|probe-test@|maxxspace|nikto|sqlmap|@example\.(com|org|net)/i,
  /\${jndi:|union\s+select|or\s+1\s*=\s*1/i
];
function hasAttack(val) {
  if (val == null) return null;
  const s = String(val);
  if (s.length > 5000) return 'too_long';
  for (const p of ATTACK_PATTERNS) if (p.test(s)) return p.toString();
  return null;
}

/* 간단한 메모리 레이트 리미트 (Vercel 서버리스는 인스턴스별이지만 1차 방어) */
const _rl = new Map();
function rateLimit(ip) {
  const now = Date.now();
  const w = 60 * 1000, max = 10;  /* IP당 1분 10회 */
  const rec = _rl.get(ip) || { count: 0, reset: now + w };
  if (now > rec.reset) { rec.count = 0; rec.reset = now + w; }
  rec.count++;
  _rl.set(ip, rec);
  if (_rl.size > 1000) { for (const k of _rl.keys()) { _rl.delete(k); break; } }  /* LRU-ish */
  return rec.count <= max;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'POST only' });

  /* Origin 체크 */
  const origin = req.headers.origin || '';
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ success: false, error: 'forbidden origin' });
  }

  /* 레이트 리미트 */
  const ip = (req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '').split(',')[0].trim();
  if (!rateLimit(ip)) return res.status(429).json({ success: false, error: 'too many requests' });

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const phone = String(b.phone || '').replace(/[^0-9]/g, '');
  if (!/^01[016789][0-9]{7,8}$/.test(phone)) return res.status(400).json({ success: false, error: 'invalid phone' });
  if (b.consent !== true) return res.status(400).json({ success: false, error: 'consent required' });

  /* 공격 패턴 체크 — name/memo/message/interest/serviceDetail 등 모든 사용자 입력 */
  for (const field of ['name','memo','message','interest','serviceDetail','source','carrier']) {
    const hit = hasAttack(b[field]);
    if (hit) {
      console.warn('[SECURITY] attack blocked field='+field+' pattern='+hit+' ip='+ip);
      return res.status(400).json({ success: false, error: 'suspicious content' });
    }
  }

  /* Honeypot 필드 체크 (프런트에 숨겨진 input "website" 추가 시) */
  if (b.website) {
    console.warn('[SECURITY] honeypot triggered ip='+ip);
    return res.status(200).json({ success: true });  /* 봇은 성공으로 속여서 재시도 안 하게 */
  }

  const phoneHyphen = phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');

  const [mail, office] = await Promise.all([sendMail(b, phoneHyphen), forwardToOffice(b, phoneHyphen)]);
  return res.status(mail.ok || office.ok ? 200 : 500).json({ success: !!(mail.ok || office.ok), mail, office });
};
