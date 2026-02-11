'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ParticipantLayout from '@/components/ParticipantLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyReservations } from '@/services/reservations/reservations.api';
import styles from './page.module.css';

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeReservations: 0,
    totalReservations: 0,
    totalTickets: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Fetch my reservations using service function
      const reservations = await getMyReservations();
      
      setStats({
        activeReservations: reservations.filter((r) => 
          r.status === 'CONFIRMED' && new Date(r.event.dateTime) > new Date()
        ).length,
        totalReservations: reservations.length,
        totalTickets: reservations.filter((r) => r.ticket).length
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
    <ProtectedRoute allowedRoles={['PARTICIPANT']}>
      <ParticipantLayout>
        <div className={styles.welcomeContainer}>
          <div className={styles.welcomeHeader}>
            <h1 className={styles.welcomeTitle}>
              Welcome to GestEvent!
            </h1>
            <p className={styles.welcomeSubtitle}>
              Hi <strong>{user?.name}</strong>, discover amazing events and create unforgettable memories
            </p>
          </div>

          <div className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionGrid}>
              <Link href="/dashboard/participant/evenements" className={styles.actionCard}>
                <h3>Browse Events</h3>
                <p>Discover upcoming events and book your spot</p>
              </Link>

              <Link href="/dashboard/participant/my-reservations" className={styles.actionCard}>
                <h3>My Reservations</h3>
                <p>View and manage your event reservations</p>
              </Link>

              <Link href="/dashboard/participant/my-tickets" className={styles.actionCard}>
                <h3>My Tickets</h3>
                <p>Download and view your event tickets</p>
              </Link>
            </div>
          </div>

          <div className={styles.statsSection}>
            <h2 className={styles.sectionTitle}>Your Activity</h2>
            <div className={styles.statsGrid}>
              

              <div className={styles.statCard}>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{loading ? '...' : stats.activeReservations}</div>
                  <div className={styles.statLabel}>Active Reservations</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{loading ? '...' : stats.totalReservations}</div>
                  <div className={styles.statLabel}>Total Reservations</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{loading ? '...' : stats.totalTickets}</div>
                  <div className={styles.statLabel}>Total Tickets</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ParticipantLayout>
    </ProtectedRoute>
  );
}