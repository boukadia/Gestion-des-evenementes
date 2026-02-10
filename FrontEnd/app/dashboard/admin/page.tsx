'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllEvents } from '@/services/evenements/evenements.api';
import { getAllReservations } from '@/services/reservations/reservations.api';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalReservations: 0,
    totalUsers: 0,
    publishedEvents: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Fetch events and reservations using service functions
      const events = await getAllEvents();
      const reservations = await getAllReservations();
      
      setStats({
        totalEvents: events.length,
        totalReservations: reservations.length,
        totalUsers: new Set(reservations.map((r) => r.userId)).size,
        publishedEvents: events.filter((e) => e.status === 'PUBLISHED').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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