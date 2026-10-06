import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

// หน้าหลักของแต่ละบทบาท
const HOME = { customer: 'index.html', tech: 'tech.html', admin: 'admin.html' };

// ใช้ที่หัวทุกหน้าที่ต้องล็อคอิน เช่น requireRole('admin', user => { ... })
export function requireRole(role, onReady) {
  let readyUid = null;

  onAuthStateChanged(auth, async user => {
    // 1) ยังไม่ได้ล็อคอิน → ไปหน้าเข้าสู่ระบบ
    if (!user) {
      location.href = 'login.html';
      return;
    }

    // 2) ล็อคอินเปลี่ยนบัญชีจากอีกแท็บ → โหลดหน้าใหม่ให้ตรวจสิทธิ์อีกรอบ
    if (readyUid && readyUid !== user.uid) {
      location.reload();
      return;
    }
    if (readyUid) return;   // บัญชีเดิม ไม่ต้องทำซ้ำ

    // 3) ตรวจบทบาท
    const snap = await getDoc(doc(db, 'users', user.uid));
    const myRole = snap.exists() ? snap.data().role : null;

    if (myRole !== role) {
      // ไม่ออกจากระบบ แค่พากลับไปหน้าของบทบาทตัวเอง
      location.href = HOME[myRole] || 'login.html';
      return;
    }

    readyUid = user.uid;
    onReady(user);
  });
}

export function logout() {
  signOut(auth).then(() => { location.href = 'index.html'; });
}