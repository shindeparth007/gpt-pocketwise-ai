'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: '🏠', label: 'Home' },
  { href: '/expenses', icon: '💸', label: 'Expenses' },
  { href: '/budget', icon: '📊', label: 'Budget' },
  { href: '/goals', icon: '🎯', label: 'Goals' },
  { href: '/finguru', icon: '🤖', label: 'FinGuru' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-item ${pathname === item.href ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
