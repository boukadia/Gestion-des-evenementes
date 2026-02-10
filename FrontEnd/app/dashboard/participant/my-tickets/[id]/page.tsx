'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ParticipantLayout from '@/components/ParticipantLayout';
import { Ticket } from '@/types/ticket';
import { getMyTickets, downloadTicket } from '@/services/tickets/tickets.api';
import Toast, { ToastType } from '@/components/Toast';
import styles from './page.module.css';

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = parseInt(params.id as string);
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      const data = await getMyTickets();
      const foundTicket = data.find(t => t.id === ticketId);
      
      if (foundTicket) {
        setTicket(foundTicket);
      } else {
        setToast({ message: 'Ticket not found', type: 'error' });
        setTimeout(() => router.push('/dashboard/participant/my-tickets'), 2000);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      setToast({ message: 'Error loading ticket', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    const result = await downloadTicket(ticketId);
    setDownloading(false);
    
    if (result.success) {
      setToast({ message: 'Ticket downloaded successfully!', type: 'success' });
    } else {
      setToast({ message: result.error || 'Failed to download ticket', type: 'error' });
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['PARTICIPANT']}>
        <ParticipantLayout>
          <div className={styles.loading}>Loading ticket details...</div>
        </ParticipantLayout>
      </ProtectedRoute>
    );
  }

  if (!ticket) {
    return (
      <ProtectedRoute allowedRoles={['PARTICIPANT']}>
        <ParticipantLayout>
          <div className={styles.error}>Ticket not found</div>
        </ParticipantLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['PARTICIPANT']}>
      <ParticipantLayout>
        <div className={styles.pageContainer}>
          <div className={styles.header}>
            <button onClick={() => router.back()} className={styles.backButton}>
              ← Back
            </button>
            <h1 className={styles.pageTitle}>Ticket Details</h1>
          </div>

          <div className={styles.ticketCard}>
            <div className={styles.ticketHeader}>
              <div className={styles.ticketNumber}>
                <span className={styles.label}>Ticket ID</span>
                <span className={styles.value}>#{ticket.id}</span>
              </div>
              <span className={`${styles.statusBadge} ${
                ticket.reservation?.status === 'CONFIRMED' ? styles.confirmed : styles.pending
              }`}>
                {ticket.reservation?.status || 'N/A'}
              </span>
            </div>

            <div className={styles.eventSection}>
              <h2 className={styles.sectionTitle}>Event Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Event Name</span>
                  <span className={styles.infoValue}>{ticket.event?.title || 'N/A'}</span>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Date & Time</span>
                  <span className={styles.infoValue}>
                    {ticket.event?.dateTime ? new Date(ticket.event.dateTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Location</span>
                  <span className={styles.infoValue}>{ticket.event?.location || 'N/A'}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Capacity</span>
                  <span className={styles.infoValue}>{ticket.event?.capacity || 'N/A'} people</span>
                </div>
              </div>
            </div>

            <div className={styles.ticketSection}>
              <h2 className={styles.sectionTitle}>Ticket Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Issued On</span>
                  <span className={styles.infoValue}>
                    {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Reservation Status</span>
                  <span className={styles.infoValue}>{ticket.reservation?.status || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className={styles.eventDescription}>
              <h2 className={styles.sectionTitle}>Event Description</h2>
              <p className={styles.description}>{ticket.event?.description || 'No description available'}</p>
            </div>

            <div className={styles.actions}>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className={styles.downloadButton}
              >
                {downloading ? 'Downloading...' : 'Download Ticket PDF'}
              </button>
              <button
                onClick={() => router.push('/dashboard/participant/my-tickets')}
                className={styles.backToListButton}
              >
                Back to My Tickets
              </button>
            </div>
          </div>
        </div>
      </ParticipantLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </ProtectedRoute>
  );
}
