'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireParticipant?: boolean;
  allowedRoles?: ('ADMIN' | 'PARTICIPANT')[];
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireParticipant = false,
  allowedRoles 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else {
        // Check role-based access
        if (requireAdmin && user?.role !== 'ADMIN') {
          router.push('/');
        } else if (requireParticipant && user?.role !== 'PARTICIPANT') {
          router.push('/');
        } else if (allowedRoles && !allowedRoles.includes(user?.role as 'ADMIN' | 'PARTICIPANT')) {
          router.push('/');
        }
      }
    }
  }, [isAuthenticated, user, isLoading, requireAdmin, requireParticipant, allowedRoles, router]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check access permissions
  const hasAccess = () => {
    if (!isAuthenticated) return false;
    
    if (requireAdmin) return user?.role === 'ADMIN';
    if (requireParticipant) return user?.role === 'PARTICIPANT';
    if (allowedRoles) return allowedRoles.includes(user?.role as 'ADMIN' | 'PARTICIPANT');
    
    return true; // Default: any authenticated user
  };

  if (!hasAccess()) {
    return null;
  }

  return <>{children}</>;
}