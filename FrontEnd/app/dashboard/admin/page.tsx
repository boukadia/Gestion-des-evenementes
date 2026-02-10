'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

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
          <h2 className={styles.pageTitle}>Welcome to Admin Dashboard</h2>
          
          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3 className={`${styles.statValue} ${styles.blue}`}>
                {stats.totalEvents}
              </h3>
              <p className={styles.statLabel}>Total Events</p>
            </div>

            <div className={styles.statCard}>
              <h3 className={`${styles.statValue} ${styles.green}`}>
                {stats.totalReservations}
              </h3>
              <p className={styles.statLabel}>Total Reservations</p>
            </div>

            <div className={styles.statCard}>
              <h3 className={`${styles.statValue} ${styles.red}`}>
                {stats.totalUsers}
              </h3>
              <p className={styles.statLabel}>Total Users</p>
            </div>

            <div className={styles.statCard}>
              <h3 className={`${styles.statValue} ${styles.orange}`}>
                {stats.publishedEvents}
              </h3>
              <p className={styles.statLabel}>Published Events</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActionsCard}>
            <h3 className={styles.quickActionsTitle}>Quick Actions</h3>
            <div className={styles.quickActionsButtons}>
              <Link href="/dashboard/admin/evenements/create" className="btn btn-primary">
                Create New Event
              </Link>
              <Link href="/dashboard/admin/evenements" className="btn btn-outline-primary">
                View All Events
              </Link>
              <Link href="/dashboard/admin/reservations" className="btn btn-outline-success">
                View Reservations
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}