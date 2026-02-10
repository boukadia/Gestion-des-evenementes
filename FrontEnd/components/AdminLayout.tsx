'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <h3 className={styles.logoTitle}>
            GestEvent
          </h3>
          <p className={styles.logoSubtitle}>
            ADMIN DASHBOARD
          </p>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link
                href="/dashboard/admin"
                className={`${styles.navLink} ${pathname === '/dashboard/admin' ? styles.active : ''}`}
              >
                Dashboard
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                href="/dashboard/admin/evenements"
                className={`${styles.navLink} ${isActive('/dashboard/admin/evenements') ? styles.active : ''}`}
              >
                Events
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                href="/dashboard/admin/reservations"
                className={`${styles.navLink} ${isActive('/dashboard/admin/reservations') ? styles.active : ''}`}
              >
                Reservations
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                href="/dashboard/admin/tickets"
                className={`${styles.navLink} ${isActive('/dashboard/admin/tickets') ? styles.active : ''}`}
              >
                Tickets
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className={styles.bottomSection}>
          <Link href="/" className={styles.homeLink}>
            Back to Home
          </Link>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>
            Admin Panel
          </h1>
          <div className={styles.userSection}>
            <span className={styles.userAvatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userRole}>{user?.role}</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
