const nodemailer = require('nodemailer');

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'POST only' });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.NOTIFY_TO || 'ollafmail@gmail.com';
  if (!user || !pass) return res.status(500).json({ success: false, error: 'Missing Gmail credentials' });

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const phone = String(b.phone || '').replace(/[^0-9]/g, '');
  if (!/^01[016789][0-9]{7,8}$/.test(phone)) return res.status(400).json({ success: false, error: 'invalid phone' });
  if (b.consent !== true) return res.status(400).json({ success: false, error: 'consent required' });

  const rows = [
    ['접수 경로', b.source], ['이름', b.name || '(미입력)'], ['연락처', phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')],
    ['상담 구분', b.interest], ['문의 내용', b.message || '(없음)'],
    ['유입 페이지', b.pageUrl], ['이전 페이지', b.referrer || '-'], ['utm_source', b.utm_source || '-'],
    ['접수 시각', new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })]
  ];
  const html = `<div style="font-family:sans-serif"><h2 style="margin:0 0 14px;font-size:18px">올픽 상담 접수</h2><table style="border-collapse:collapse;font-size:14px">${rows.map(r => `<tr><td style="padding:7px 16px 7px 0;color:#64748b;white-space:nowrap;vertical-align:top">${r[0]}</td><td style="padding:7px 0;font-weight:600">${esc(r[1]).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table></div>`;

  try {
    const t = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
    await t.sendMail({ from: `"올픽 상담알림" <${user}>`, to, subject: `[올픽] 상담신청 - ${b.name || '무기명'} ${phone}`, html });
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('mail error', e);
    return res.status(500).json({ success: false, error: 'send failed' });
  }
};
