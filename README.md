# SecureVision

เว็บแอปขายและติดตั้งกล้องวงจรปิดและระบบดับเพลิง ของบริษัทจำลอง **SecureVision Systems Co.**
ครอบคลุมตั้งแต่ลูกค้าสั่งซื้อ ชำระเงิน ช่างติดตั้ง ไปจนถึงการเคลมสินค้าหลังการขาย

🔗 **เว็บที่ใช้งานได้จริง:** https://vision-4081b.web.app

รายวิชา Business Program Design and Development · มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา

## สมาชิก

| ชื่อ | รหัสนิสิต |
|---|---|
| นายอนุพงศ์ ดวงสิมมา | 6630202813 |
| นางสาวเอมอมร สุดประสงค์ | 6630202864 |
| นางสาวพันไมล์ พันธะโคตร | 6630206525 |
| นายอุกฤษฎ์ คุ้มไพรันต์ | 6630207521 |

## เทคโนโลยีที่ใช้

- **HTML / CSS / JavaScript (ES Modules)** ไม่ใช้เฟรมเวิร์ก
- **Firebase Hosting** สำหรับโฮสต์เว็บ
- **Firebase Authentication** สำหรับสมัครสมาชิกและเข้าสู่ระบบ
- **Cloud Firestore** เป็นฐานข้อมูล (NoSQL)
- **Firestore Security Rules** คุมสิทธิ์การอ่านและเขียนฝั่งเซิร์ฟเวอร์

## ผู้ใช้ 3 บทบาท

| บทบาท | ทำอะไรได้ | หน้าที่ใช้ |
|---|---|---|
| **ลูกค้า** | เลือกซื้อสินค้า, ชำระผ่าน QR และแนบสลิป, ติดตามออเดอร์และงานติดตั้ง, แจ้งเคลม (ประกัน 1 ปี) | `index` `products` `cart` `checkout` `orders` `profile` `help` |
| **ช่าง** | รับงานติดตั้งและงานซ่อม, อัปเดตสถานะทีละขั้น, ปิดงานพร้อมหมายเหตุและลายเซ็นลูกค้า | `tech` |
| **แอดมิน** | ยืนยันออเดอร์และมอบหมายช่าง, จัดการสินค้าและสต็อก (ROP / EOQ), พิจารณาเคลม, ดูรายงานยอดขายและส่งออก CSV | `admin` `manage` `stock` `claims` `report` |

- ลูกค้าสมัครสมาชิกเองได้ที่หน้า `login`
- บัญชีช่างและแอดมินสมัครผ่านแอปไม่ได้ (อีเมล `@securevision.com` ถูกบล็อก) ต้องตั้งค่าผ่าน Firebase Console
- ทุกหน้าที่ต้องล็อกอินตรวจบทบาทผ่าน `guard.js` ถ้าบทบาทไม่ตรงจะพากลับไปหน้าของบทบาทตัวเอง

## โครงสร้างไฟล์

```
├── index.html, products.html        หน้าร้าน / สินค้าทั้งหมด
├── cart.html, checkout.html         ตะกร้า / ยืนยันคำสั่งซื้อ
├── orders.html                      คำสั่งซื้อของฉัน + แนบสลิป
├── profile.html, help.html          โปรไฟล์ / ช่วยเหลือและแจ้งเคลม
├── login.html, role.html, 404.html  เข้าสู่ระบบ / เปลี่ยนเส้นทาง / ไม่พบหน้า
├── tech.html                        หน้าช่างเทคนิค
├── admin.html                       ผู้ดูแล: ออเดอร์และมอบหมายช่าง
├── manage.html, stock.html          จัดการสินค้า / สต็อก ROP·EOQ
├── claims.html, report.html         จัดการเคลม / รายงานยอดขาย
├── firebase.js                      เชื่อมต่อ Firebase
├── guard.js                         ตรวจสิทธิ์ตามบทบาท
├── nav.js, status.js                เมนู / ค่าสถานะและหมวดหมู่ที่ใช้ร่วมกัน
├── firestore.rules                  Security Rules ของ Firestore
└── firebase.json, .firebaserc       ตั้งค่า Firebase Hosting
```

## ฐานข้อมูล (Cloud Firestore · 9 collections)

| Collection | คีย์หลัก (Document ID) | เก็บอะไร |
|---|---|---|
| `users` | uid | บัญชีและบทบาท (role) |
| `profiles` | uid | ชื่อ เบอร์ ที่อยู่ลูกค้า |
| `staff` | uid | ข้อมูลช่าง (รหัส พื้นที่ เบอร์) |
| `carts` | uid | ตะกร้า `{รหัสสินค้า: จำนวน}` |
| `products` | id | สินค้า ราคา สต็อก ROP / EOQ |
| `orders` | orderNo | คำสั่งซื้อ รายการสินค้า สถานะ และงานติดตั้ง (`job`) |
| `slips` | orderNo | รูปสลิปโอนเงิน |
| `claims` | id | เรื่องเคลม การตัดสินใจ และงานซ่อม (`job`) |
| `stockMoves` | id (auto) | ประวัติการเปลี่ยนสต็อก (sale / cancel / receive / adjust / claim) |

ความสัมพันธ์หลัก: `orders.uid` → ลูกค้า · `orders.techUid` / `claims.techUid` → ช่าง · `claims.orderId` → ออเดอร์ · `claims.productId` / `stockMoves.pid` → สินค้า

## การควบคุมใน Security Rules (`firestore.rules`)

- สมัครเองได้เฉพาะบทบาท `customer` และบล็อกอีเมล `@securevision.com`
- ลูกค้าเห็นเฉพาะออเดอร์ สลิป และเคลมของตัวเอง
- ช่างเห็นเฉพาะงานที่ได้รับมอบหมาย และแก้ได้เฉพาะฟิลด์ `job`
- เคลมต้องอ้างออเดอร์ของลูกค้าคนนั้นเท่านั้น
- `stockMoves` มีแค่แอดมินที่สร้างได้ และไม่มีใครแก้หรือลบได้ (Audit Trail)
- ห้ามลบ `orders`, `slips` และ `claims`


