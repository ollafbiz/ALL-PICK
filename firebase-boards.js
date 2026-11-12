const CFG = {
  apiKey: "AIzaSyBBe_bBWdzqHm341U5QspxM413XMXvK-7o",
  authDomain: "gen-lang-client-0652554137.firebaseapp.com",
  projectId: "gen-lang-client-0652554137",
  storageBucket: "gen-lang-client-0652554137.firebasestorage.app",
  messagingSenderId: "771974106359",
  appId: "1:771974106359:web:2b9312d69acf3f9967d7f2"
};

const ADMIN_EMAILS = ['ollafbiz@gmail.com'];
const SITE = 'allpick';
const V = '11.3.1';

let mods = null;
async function load() {
  if (mods) return mods;
  const [app, fs, auth] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`)
  ]);
  const instance = app.getApps().length ? app.getApp() : app.initializeApp(CFG);
  mods = { fs, auth, db: fs.getFirestore(instance), adminDb: fs.getFirestore(instance, 'ai-studio-17a97ac4-a769-4c9a-b823-6bda3b219e41'), authInstance: auth.getAuth(instance) };
  return mods;
}

function toMs(v) {
  if (!v) return Date.now();
  if (typeof v.toDate === 'function') return v.toDate().getTime();
  if (typeof v === 'number') return v;
  const t = new Date(v).getTime();
  return isNaN(t) ? Date.now() : t;
}

// 게시판도 관리자 DB 사용 (기본 DB는 이 프로젝트에 없어 응답이 없음). 올라프 글과 섞이지 않게 site로 구분
export async function fetchCollection(name) {
  const { fs, adminDb: db } = await load();
  const snap = await fs.getDocs(fs.query(fs.collection(db, name), fs.where('site', '==', SITE)));
  const out = [];
  snap.forEach(d => {
    const o = d.data() || {};
    if (o.isDeleted) return;
    out.push({
      id: d.id,
      title: o.title || '',
      author: o.author || '익명',
      content: o.content || '',
      category: o.category || '기타',
      views: o.views || 0,
      rating: o.rating || 5,
      imageUrl: o.imageUrl || '',
      password: o.password || '',
      is_private: !!(o.is_private || o.isPrivate),
      adminResponse: o.adminResponse || '',
      createdAtMs: toMs(o.createdAt)
    });
  });
  return out;
}

export async function addEntry(name, payload) {
  const { fs, adminDb: db } = await load();
  const clean = Object.assign({}, payload);
  ['isDeleted', 'adminResponse', 'adminReply', 'status'].forEach(k => { delete clean[k]; });
  clean.title = String(clean.title || '').slice(0, 100);
  clean.author = String(clean.author || '익명').slice(0, 50);
  clean.content = String(clean.content || '').slice(0, name === 'reviews' ? 5000 : 2000);
  const write = fs.addDoc(fs.collection(db, name), Object.assign(clean, {
    site: SITE,
    createdAt: fs.serverTimestamp(),
    views: 0
  }));
  return await Promise.race([
    write.then(ref => ref.id),
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 12000))
  ]);
}

// ===== 상담 접수: 올픽 전용 Firebase(allpick-43f78) 'consultations'에 저장 =====
// 게시판(질문답변·후기)은 위의 기존 DB를 그대로 사용
const CONSULT_CFG = {
  apiKey: "AIzaSyCoFzuFZ-P6-__pBhoIvN0Vb8DGOnEIUOk",
  authDomain: "allpick-43f78.firebaseapp.com",
  projectId: "allpick-43f78",
  storageBucket: "allpick-43f78.firebasestorage.app",
  messagingSenderId: "322141661314",
  appId: "1:322141661314:web:0d79be5b0f079ec30aec9b"
};
let consultMods = null;
async function loadConsult() {
  if (consultMods) return consultMods;
  const [app, fs] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
  ]);
  const inst = app.getApps().find(x => x.name === 'allpick') || app.initializeApp(CONSULT_CFG, 'allpick');
  consultMods = { fs, db: fs.getFirestore(inst) };
  return consultMods;
}

// 광고 클릭값은 첫 방문 주소에만 붙으므로 처음 본 값을 기억해 둠
const TRACK_KEYS = ['utm_source', 'nclid', 'gclid'];
function remember() {
  try {
    const qs = new URLSearchParams(location.search);
    TRACK_KEYS.forEach(k => { const v = qs.get(k); if (v) sessionStorage.setItem('ap_' + k, v.slice(0, 200)); });
  } catch (e) {}
}
remember();
function tracking(k) {
  try { return new URLSearchParams(location.search).get(k) || sessionStorage.getItem('ap_' + k) || ''; } catch (e) { return ''; }
}

const CARRIER_NAME = { 'KT': 'KT', 'LG': 'LGU+', 'LG U+': 'LGU+', 'LGU+': 'LGU+', 'LG유플러스': 'LGU+', 'SK': 'SK', 'SKB': 'SK', 'SK브로드밴드': 'SK', 'LG헬로비전': '헬로비전', '헬로비전': '헬로비전', 'KT스카이라이프': '스카이라이프', '스카이라이프': '스카이라이프' };

export async function addConsult(payload) {
  const phone = String(payload.phone || '').replace(/[^0-9]/g, '');
  if (!/^01[016789][0-9]{7,8}$/.test(phone)) throw new Error('invalid phone');
  const sel = payload.sel || {};
  const detail = String(payload.detail || '').trim();
  const parts = detail.split('/').map(s => s.trim()).filter(Boolean);
  const head = parts.find(p => CARRIER_NAME[p]) || '';
  const s = (v, n) => String(v == null ? '' : v).slice(0, n);
  const message = [payload.memo, detail ? '선택 조건: ' + detail : ''].filter(Boolean).join('\n');

  const data = {
    name: s(payload.name, 50),
    phone: phone,
    carrier: s(CARRIER_NAME[sel.carrier] || sel.carrier || CARRIER_NAME[head] || payload.carrier || '', 20),
    productCondition: s(sel.productCondition, 20),
    internetSpeed: s(sel.internetSpeed, 50),
    tvProduct: s(sel.tvProduct, 100),
    bundleDiscount: s(sel.bundleDiscount, 100),
    estimatedMonthly: s(sel.estimatedMonthly, 30),
    message: s(message, 2000),
    source: 'allpick',
    formType: s(payload.source || '상담신청', 50),
    pageUrl: s(location.href, 500),
    referrer: s(document.referrer, 500),
    utm_source: tracking('utm_source'),
    nclid: tracking('nclid'),
    gclid: tracking('gclid')
  };

  // 1) 메일 알림 + 사무실 서버 전달 (기존과 동일, 병렬 실행·keepalive)
  try {
    const office = {
      phoneHyphen: phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3'),
      carrier: data.carrier,
      serviceType: data.formType,
      serviceDetail: detail ? '[선택 상품]\n- ' + parts.join('\n- ') : '(선택 상품 없음)',
      interest: detail || data.formType,
      memo: String(payload.memo || '')
    };
    fetch('/api/send-inquiry-mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({}, data, office, { source: data.formType, consent: true })),
      keepalive: true
    }).catch(e => console.warn('mail api', e));
  } catch (e) { console.warn('mail api', e); }

  // 2) Firestore 저장 (allpick-43f78). 최대 8초만 기다리고, 이후엔 SDK가 재시도
  const { fs, db } = await loadConsult();
  const write = fs.addDoc(fs.collection(db, 'consultations'), Object.assign({}, data, { createdAt: fs.serverTimestamp() }));
  write.catch(e => console.error('consultations write', e && e.code, e && e.message));
  return await Promise.race([
    write.then(ref => ref.id),
    new Promise(r => setTimeout(() => r('queued'), 8000))
  ]);
}

export async function bumpViews(name, id, current) {
  try {
    const { fs, adminDb: db } = await load();
    await fs.updateDoc(fs.doc(db, name, id), { views: (current || 0) + 1 });
  } catch (e) {}
}

export async function replyTo(name, id, text) {
  const { fs, adminDb: db } = await load();
  await fs.updateDoc(fs.doc(db, name, id), { adminResponse: text, status: 'answered' });
}

export async function uploadImage(file, pathPrefix) {
  const [app, st] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-storage.js`)
  ]);
  const instance = app.getApps().length ? app.getApp() : app.initializeApp(CFG);
  const storage = st.getStorage(instance);
  const safe = (file.name || 'photo').replace(/[^\w.\-]/g, '_');
  const ref = st.ref(storage, `${pathPrefix}/${Date.now()}_${safe}`);
  await st.uploadBytes(ref, file);
  return await st.getDownloadURL(ref);
}

export async function watchAuth(cb) {
  const { auth, authInstance } = await load();
  return auth.onAuthStateChanged(authInstance, (u) => {
    cb(u ? { email: u.email, name: u.displayName, isAdmin: ADMIN_EMAILS.includes(u.email) } : null);
  });
}

export async function signInGoogle() {
  const { auth, authInstance } = await load();
  await auth.signInWithPopup(authInstance, new auth.GoogleAuthProvider());
}

export async function signOutNow() {
  const { auth, authInstance } = await load();
  await auth.signOut(authInstance);
}
