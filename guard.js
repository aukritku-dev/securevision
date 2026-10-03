import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// ใช้ที่ต้นหน้า: requireRole('admin', ฟังก์ชันที่จะทำเมื่อผ่าน)
export function requireRole(roleNeeded, onReady) {
  onAuthStateChanged(auth, async (user) => {
    // 1) ยังไม่ล็อกอิน → ส่งไปหน้าล็อกอินของบทบาทนั้น
    if (!user) {
      window.location.href = 'login.html?role=' + roleNeeded;
      return;
    }

    // 2) ล็อกอินแล้ว → ไปดูบทบาทจริงในฐานข้อมูล
    const snap = await getDoc(doc(db, 'users', user.uid));
    const role = snap.exists() ? snap.data().role : null;

    // 3) บทบาทไม่ตรง → ออกจากระบบ แล้วกลับหน้าแรก
    if (role !== roleNeeded) {
      await signOut(auth);
      window.location.href = 'index.html';
      return;
    }

    // 4) ผ่าน → ให้หน้านั้นแสดงผล
    onReady(user);
  });
}

// ปุ่มออกจากระบบ
export async function logout() {
  await signOut(auth);
  window.location.href = 'index.html';
}