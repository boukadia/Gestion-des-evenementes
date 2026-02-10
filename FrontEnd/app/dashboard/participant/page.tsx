'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ParticipantLayout from '@/components/ParticipantLayout';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import styles from './page.module.css';

export default function ParticipantDashboard() {
  const { user } = useAuth();

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
                  <div className={styles.statNumber}>0</div>
                  <div className={styles.statLabel}>Events Attended</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>0</div>
                  <div className={styles.statLabel}>Active Reservations</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>0</div>
                  <div className={styles.statLabel}>Reviews Given</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ParticipantLayout>
    </ProtectedRoute>
  );
}