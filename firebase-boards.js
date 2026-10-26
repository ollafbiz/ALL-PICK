const CFG = {
  apiKey: "AIzaSyBBe_bBWdzqHm341U5QspxM413XMXvK-7o",
  authDomain: "gen-lang-client-0652554137.firebaseapp.com",
  projectId: "gen-lang-client-0652554137",
  storageBucket: "gen-lang-client-0652554137.firebasestorage.app",
  messagingSenderId: "771974106359",
  appId: "1:771974106359:web:2b9312d69acf3f9967d7f2"
};

const ADMIN_EMAILS = ['ollafbiz@gmail.com'];
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
  mods = { fs, auth, db: fs.getFirestore(instance), authInstance: auth.getAuth(instance) };
  return mods;
}

function toMs(v) {
  if (!v) return Date.now();
  if (typeof v.toDate === 'function') return v.toDate().getTime();
  if (typeof v === 'number') return v;
  const t = new Date(v).getTime();
  return isNaN(t) ? Date.now() : t;
}

export async function fetchCollection(name) {
  const { fs, db } = await load();
  const snap = await fs.getDocs(fs.collection(db, name));
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
  const { fs, db } = await load();
  const clean = Object.assign({}, payload);
  ['isDeleted', 'adminResponse', 'adminReply', 'status'].forEach(k => { delete clean[k]; });
  clean.title = String(clean.title || '').slice(0, 100);
  clean.author = String(clean.author || '익명').slice(0, 50);
  clean.content = String(clean.content || '').slice(0, name === 'reviews' ? 5000 : 2000);
  const ref = await fs.addDoc(fs.collection(db, name), Object.assign(clean, {
    createdAt: fs.serverTimestamp(),
    views: 0
  }));
  return ref.id;
}

const NOTIFY_TO = 'ollafmail@gmail.com';

export async function addConsult(payload) {
  const { fs, db } = await load();
  const qs = new URLSearchParams(location.search);
  const phone = String(payload.phone || '').replace(/[^0-9]/g, '');
  if (!/^01[016789][0-9]{7,8}$/.test(phone)) throw new Error('invalid phone');
  const message = [payload.memo, payload.detail ? '선택 조건: ' + payload.detail : ''].filter(Boolean).join('\n');
  const data = {
    name: String(payload.name || '').slice(0, 50),
    phone: phone,
    interest: String(payload.detail || payload.source || '상담신청').slice(0, 200),
    message: message.slice(0, 2000),
    source: payload.source || '',
    pageUrl: location.href,
    referrer: document.referrer || '',
    utm_source: qs.get('utm_source') || '',
    status: 'pending',
    site: 'allpick',
    createdAt: fs.serverTimestamp()
  };
  // 사무실 관리자 서버용 필드 (undefined 방지)
  const detail = String(payload.detail || '').trim();
  const head = detail.split('/')[0].trim();
  const CARR = ['KT', 'SK', 'SKB', 'SK브로드밴드', 'LG', 'LG U+', 'LG유플러스', 'KT스카이라이프', '스카이라이프', 'LG헬로비전', '헬로비전'];
  const office = {
    phoneHyphen: phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3'),
    carrier: CARR.indexOf(head) >= 0 ? head : (payload.carrier || ''),
    serviceType: String(payload.source || '상담신청'),
    serviceDetail: detail ? '[선택 상품]\n- ' + detail.split('/').map(s => s.trim()).filter(Boolean).join('\n- ') : '(선택 상품 없음)',
    memo: String(payload.memo || '')
  };

  // 1) 메일 알림 + 사무실 서버 전달 (Vercel 함수가 둘 다 처리)
  try {
    const body = Object.assign({}, data, office, { createdAt: undefined, consent: true });
    fetch('/api/send-inquiry-mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true
    }).catch(e => console.warn('mail api', e));
  } catch (e) { console.warn('mail api', e); }

  // 2) Firestore 저장. 서버 응답이 늦어도 SDK가 대기열에 넣고 재시도하므로 화면은 8초 이상 붙잡지 않음
  const write = fs.addDoc(fs.collection(db, 'consultations'), data);
  const result = await Promise.race([
    write.then(ref => ref.id),
    new Promise(r => setTimeout(() => r('queued'), 8000))
  ]);
  write.catch(e => console.error('consultations write', e && e.code, e && e.message));
  return result;
}

export async function bumpViews(name, id, current) {
  try {
    const { fs, db } = await load();
    await fs.updateDoc(fs.doc(db, name, id), { views: (current || 0) + 1 });
  } catch (e) {}
}

export async function replyTo(name, id, text) {
  const { fs, db } = await load();
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
