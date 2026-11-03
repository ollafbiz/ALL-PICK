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
  const to = process.env.NOTIFY_TO || process.env.MAIL_TO || 'ollafmail@gmail.com';
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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'POST only' });

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const phone = String(b.phone || '').replace(/[^0-9]/g, '');
  if (!/^01[016789][0-9]{7,8}$/.test(phone)) return res.status(400).json({ success: false, error: 'invalid phone' });
  if (b.consent !== true) return res.status(400).json({ success: false, error: 'consent required' });
  const phoneHyphen = phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');

  const [mail, office] = await Promise.all([sendMail(b, phoneHyphen), forwardToOffice(b, phoneHyphen)]);
  return res.status(mail.ok || office.ok ? 200 : 500).json({ success: !!(mail.ok || office.ok), mail, office });
};
