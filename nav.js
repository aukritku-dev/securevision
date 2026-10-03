// แถบเมนูด้านล่าง ใช้ร่วมกันทุกหน้า
// วิธีใช้: renderNav('home') ← ใส่ชื่อแท็บของหน้านั้น เพื่อให้แท็บนั้นเป็นสีฟ้า

const tabs = [
  { key: 'home',     href: 'index.html',    icon: '🏠', label: 'หน้าแรก' },
  { key: 'products', href: 'products.html', icon: '🏪', label: 'สินค้า' },
  { key: 'cart',     href: 'cart.html',     icon: '🛒', label: 'ตะกร้า' },
  { key: 'help',     href: 'help.html',     icon: '❓', label: 'ช่วยเหลือ' },
  { key: 'profile',  href: 'profile.html',  icon: '👤', label: 'โปรไฟล์' }
];

const css = `
  body { padding-bottom: 76px; }
  .tabbar {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 480px;
    background: white; border-top: 1px solid #e5e9f2;
    display: flex; padding: 8px 0 10px; z-index: 10;
  }
  .tabbar a {
    flex: 1; text-align: center; text-decoration: none;
    font-size: 12px; color: #94a3b8;
  }
  .tabbar a span { display: block; font-size: 22px; filter: grayscale(1); opacity: .6; }
  .tabbar a.active { color: #2563eb; font-weight: 600; }
  .tabbar a.active span { filter: none; opacity: 1; }
`;

export function renderNav(active) {
  // ใส่ CSS ของเมนู
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // สร้างแถบเมนูแล้วติดไว้ท้ายหน้า
  const nav = document.createElement('nav');
  nav.className = 'tabbar';
  nav.innerHTML = tabs.map(t => `
    <a href="${t.href}" class="${t.key === active ? 'active' : ''}">
      <span>${t.icon}</span>${t.label}
    </a>`).join('');
  document.body.appendChild(nav);
}