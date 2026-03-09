'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './navbar.css';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="top-nav">
      <Link href="/" className="brand-logo">REROLL</Link>
      
      <div className="nav-links">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Gacha</Link>
          <Link href="/collection" className={`nav-link ${pathname === '/collection' ? 'active' : ''}`}>Collection</Link>
          <Link href="/upload" className={`nav-link ${pathname === '/upload' ? 'active' : ''}`}>Upload</Link>
      </div>

      <div className="nav-balance" title="Simulated user balance">
          <span>Credits:</span>
          <strong>12,500</strong>
      </div>
    </nav>
  );
}
