'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalReservations: 0,
    totalUsers: 0,
    publishedEvents: 0
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/evenementes/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Welcome to Admin Dashboard</h2>
          
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db', margin: 0 }}>
                {stats.totalEvents}
              </h3>
              <p style={{ color: '#7f8c8d', marginTop: '0.5rem', marginBottom: 0 }}>Total Events</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71', margin: 0 }}>
                {stats.totalReservations}
              </h3>
              <p style={{ color: '#7f8c8d', marginTop: '0.5rem', marginBottom: 0 }}>Total Reservations</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c', margin: 0 }}>
                {stats.totalUsers}
              </h3>
              <p style={{ color: '#7f8c8d', marginTop: '0.5rem', marginBottom: 0 }}>Total Users</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12', margin: 0 }}>
                {stats.publishedEvents}
              </h3>
              <p style={{ color: '#7f8c8d', marginTop: '0.5rem', marginBottom: 0 }}>Published Events</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/dashboard/admin/evenements/create" className="btn btn-primary">
                ➕ Create New Event
              </Link>
              <Link href="/dashboard/admin/evenements" className="btn btn-outline-primary">
                📋 View All Events
              </Link>
              <Link href="/dashboard/admin/reservations" className="btn btn-outline-success">
                📊 View Reservations
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}