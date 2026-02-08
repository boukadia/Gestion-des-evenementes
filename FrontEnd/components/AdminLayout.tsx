'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFBFC' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        background: 'linear-gradient(180deg, #6366F1 0%, #8B5CF6 100%)',
        color: 'white',
        padding: '0',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        boxShadow: '0 4px 24px rgba(99, 102, 241, 0.15)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo Section */}
        <div style={{
          padding: '2rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '2rem' }}>🎉</span>
            GestEvent
          </h3>
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '0.5rem',
            marginBottom: 0,
            letterSpacing: '0.5px'
          }}>
            ADMIN DASHBOARD
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link
                href="/dashboard/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  color: pathname === '/dashboard/admin' ? '#FFFFFF' : 'rgba(255,255,255,0.85)',
                  backgroundColor: pathname === '/dashboard/admin' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: pathname === '/dashboard/admin' ? '600' : '500',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  border: pathname === '/dashboard/admin' ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                  boxShadow: pathname === '/dashboard/admin' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (pathname !== '/dashboard/admin') {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== '/dashboard/admin') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>📊</span>
                Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link
                href="/dashboard/admin/evenements"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  color: isActive('/dashboard/admin/evenements') ? '#FFFFFF' : 'rgba(255,255,255,0.85)',
                  backgroundColor: isActive('/dashboard/admin/evenements') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: isActive('/dashboard/admin/evenements') ? '600' : '500',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  border: isActive('/dashboard/admin/evenements') ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                  boxShadow: isActive('/dashboard/admin/evenements') ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/dashboard/admin/evenements')) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/dashboard/admin/evenements')) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>🎫</span>
                Events
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link
                href="/dashboard/admin/reservations"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  color: isActive('/dashboard/admin/reservations') ? '#FFFFFF' : 'rgba(255,255,255,0.85)',
                  backgroundColor: isActive('/dashboard/admin/reservations') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: isActive('/dashboard/admin/reservations') ? '600' : '500',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  border: isActive('/dashboard/admin/reservations') ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                  boxShadow: isActive('/dashboard/admin/reservations') ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/dashboard/admin/reservations')) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/dashboard/admin/reservations')) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>📝</span>
                Reservations
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link
                href="/dashboard/admin/tickets"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  color: isActive('/dashboard/admin/tickets') ? '#FFFFFF' : 'rgba(255,255,255,0.85)',
                  backgroundColor: isActive('/dashboard/admin/tickets') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: isActive('/dashboard/admin/tickets') ? '600' : '500',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  border: isActive('/dashboard/admin/tickets') ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                  boxShadow: isActive('/dashboard/admin/tickets') ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/dashboard/admin/tickets')) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/dashboard/admin/tickets')) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>🎟️</span>
                Tickets
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(0,0,0,0.08)'
        }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              color: 'rgba(255,255,255,0.9)',
              textDecoration: 'none',
              borderRadius: '8px',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🏠</span>
            Back to Home
          </Link>
          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC2626';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#EF4444';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: '280px',
        flex: 1,
        backgroundColor: '#FAFBFC',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          padding: '1.25rem 2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Admin Panel
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              color: 'white',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1F2937' }}>
                {user?.name}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'white',
                backgroundColor: '#06B6D4',
                padding: '3px 10px',
                borderRadius: '12px',
                display: 'inline-block',
                fontWeight: '500'
              }}>
                {user?.role}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
