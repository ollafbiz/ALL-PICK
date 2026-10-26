const KEY = '78fa068d51dc31dea4c63bd4185b2151';
const HOST = 'www.all-pick.kr';

module.exports = async function handler(req, res) {
  const q = req.query || {};
  if (q.run !== '1') return res.status(200).json({ ok: true, usage: 'https://' + HOST + '/api/indexnow?run=1' });
  try {
    const sm = await fetch('https://' + HOST + '/sitemap.xml').then(r => r.text());
    const urlList = Array.from(sm.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]).slice(0, 10000);
    const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: 'https://' + HOST + '/' + KEY + '.txt', urlList });
    const targets = ['https://api.indexnow.org/indexnow', 'https://searchadvisor.naver.com/indexnow'];
    const results = await Promise.all(targets.map(async (t) => {
      try {
        const r = await fetch(t, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body });
        return { target: t, status: r.status, ok: r.status === 200 || r.status === 202 };
      } catch (e) { return { target: t, error: String(e) }; }
    }));
    return res.status(200).json({ submitted: urlList.length, results });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
};
