// ข้อมูลและฟังก์ชันที่ใช้ร่วมกันทุกหน้า

// ข้อมูลร้าน: รูป QR รับเงิน (ไฟล์อยู่ในโฟลเดอร์ securevision)
export const SHOP = {
  qrImage: 'qr-payment.jpg'
};

// ---------- หมวดหมู่สินค้า ----------
export const CATEGORIES = [
  { id: 'indoor',  name: 'กล้องในบ้าน',  icon: '🏠' },
  { id: 'outdoor', name: 'กล้องภายนอก', icon: '🌲' },
  { id: 'kit',     name: 'KIT เซ็ต',     icon: '📦' },
  { id: 'fire',    name: 'ระบบดับเพลิง', icon: '🧯' },
  { id: 'acc',     name: 'อุปกรณ์เสริม', icon: '🔌' }
];

// ป้ายสี (ใช้ร่วมกันทั้งสถานะออเดอร์และสถานะงานช่าง)
function pill(st) {
  return `<span style="background:${st.bg};color:${st.color};padding:2px 10px;border-radius:999px;font-size:13px;white-space:nowrap;">${st.label}</span>`;
}

// ---------- สถานะคำสั่งซื้อ ----------
export const STATUS = {
  pending:   { label: 'รอร้านยืนยัน', color: '#b45309', bg: '#fef3c7' },
  confirmed: { label: 'ยืนยันแล้ว',   color: '#1d4ed8', bg: '#dbeafe' },
  shipping:  { label: 'กำลังจัดส่ง',  color: '#6d28d9', bg: '#ede9fe' },
  completed: { label: 'สำเร็จ',       color: '#15803d', bg: '#dcfce7' },
  cancelled: { label: 'ยกเลิก',       color: '#b91c1c', bg: '#fee2e2' }
};
export const FLOW = ['pending', 'confirmed', 'shipping', 'completed'];

export function nextStatus(s) {
  const i = FLOW.indexOf(s);
  return (i >= 0 && i < FLOW.length - 1) ? FLOW[i + 1] : null;
}
export function badge(s) {
  return pill(STATUS[s] || { label: s, color: '#475569', bg: '#f1f5f9' });
}

// ---------- สถานะงานช่าง ----------
export const JOB = {
  assigned: { label: 'มอบหมายแล้ว',     color: '#b45309', bg: '#fef3c7' },
  accepted: { label: 'ช่างรับงานแล้ว',  color: '#1d4ed8', bg: '#dbeafe' },
  onway:    { label: 'กำลังเดินทาง',    color: '#6d28d9', bg: '#ede9fe' },
  working:  { label: 'กำลังติดตั้ง',    color: '#c2410c', bg: '#ffedd5' },
  done:     { label: 'ติดตั้งเสร็จ',    color: '#15803d', bg: '#dcfce7' }
};
export const JOB_FLOW = ['assigned', 'accepted', 'onway', 'working', 'done'];

export function nextJob(s) {
  const i = JOB_FLOW.indexOf(s);
  return (i >= 0 && i < JOB_FLOW.length - 1) ? JOB_FLOW[i + 1] : null;
}
export function jobBadge(s) {
  return pill(JOB[s] || { label: 'ยังไม่มอบหมาย', color: '#475569', bg: '#f1f5f9' });
}

// ---------- อื่น ๆ ----------
export function fmtDate(ts) {
  if (!ts) return 'เมื่อสักครู่';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });
}

export function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export const PAYMENT = {
  transfer: '📱 สแกน QR โอนเงิน',
  cod: '💵 ชำระเงินปลายทาง'
};

// กัน XSS: แปลงอักขระพิเศษก่อนแสดงข้อความที่ผู้ใช้พิมพ์
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// รูปสินค้า: มีรูปใช้รูป ไม่มีรูปใช้อีโมจิ
export function productPic(p) {
  const src = String(p.image || '');
  if (src.startsWith('data:image/')) {
    return `<img src="${esc(src)}" alt="${esc(p.name)}" style="width:100%;height:100%;object-fit:contain;border-radius:inherit;background:#fff;">`;
  }
  return esc(p.icon || '📦');
}

// ย่อรูป: ด้านยาวสุดเหลือ maxSize px แล้วบีบเป็น JPEG
export function compressImage(file, maxSize = 900, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';                      // พื้นขาว (กันรูป PNG โปร่งใสกลายเป็นพื้นดำ)
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}