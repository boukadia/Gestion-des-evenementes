'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <nav style={{ 
      backgroundColor: '#0d6efd', 
      padding: '1rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Logo */}
        <Link 
          href="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          GestEvent
        </Link>

        {/* Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link 
            href="/" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Home
          </Link>
          <Link 
            href="/events" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Events
          </Link>

          {isLoading ? (
            <span style={{ color: 'white' }}>Loading...</span>
          ) : isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <Link 
                  href="/dashboard" 
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Dashboard
                </Link>
              )}
              <div style={{ 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  backgroundColor: 'white',
                  color: '#0d6efd',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <span>{user?.name}</span>
                <button
                  onClick={logout}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                    color: 'white',
                    padding: '0.25rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginLeft: '0.5rem'
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login"
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid white',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-block'
                }}
              >
                Login
              </Link>
              <Link 
                href="/auth/register"
                style={{
                  backgroundColor: 'white',
                  border: '2px solid white',
                  color: '#0d6efd',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-block'
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
