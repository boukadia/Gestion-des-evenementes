'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ParticipantLayout from '@/components/ParticipantLayout';
import { Ticket } from '@/types/ticket';
import { getMyTickets, downloadTicket } from '@/services/tickets/tickets.api';
import Toast, { ToastType } from '@/components/Toast';
import styles from './page.module.css';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchTickets = async () => {
    try {
      const data = await getMyTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (ticketId: number) => {
    const result = await downloadTicket(ticketId);
    
    if (result.success) {
      setToast({ message: 'Ticket downloaded successfully!', type: 'success' });
    } else {
      setToast({ message: result.error || 'Failed to download ticket', type: 'error' });
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['PARTICIPANT']}>
        <ParticipantLayout>
          <div className={styles.loading}>Loading tickets...</div>
        </ParticipantLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['PARTICIPANT']}>
      <ParticipantLayout>
        <div className={styles.pageContainer}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>My Tickets</h1>
            <p className={styles.pageSubtitle}>Download and manage your event tickets</p>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>{tickets.length}</span>
                <span className={styles.statLabel}>Total Tickets</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {tickets.filter(t => t.reservation?.status === 'CONFIRMED').length}
                </span>
                <span className={styles.statLabel}>Confirmed</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {tickets.filter(t => {
                    const eventDate = new Date(t.event?.dateTime || '');
                    return eventDate > new Date();
                  }).length}
                </span>
                <span className={styles.statLabel}>Upcoming Events</span>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          {tickets.length === 0 ? (
            <div className={styles.noTickets}>
              <h3>No tickets found</h3>
              <p>You don't have any tickets yet. Book an event to get your first ticket!</p>
            </div>
          ) : (
            <div className={styles.ticketsGrid}>
              {tickets.map((ticket) => (
                <div key={ticket.id} className={styles.ticketCard}>
                  <div className={styles.ticketHeader}>
                    <div className={styles.ticketNumber}>
                      <span className={styles.ticketLabel}>Ticket #</span>
                      <span className={styles.ticketId}>{ticket.id}</span>
                    </div>
                    <span className={`${styles.statusBadge} ${
                      ticket.reservation?.status === 'CONFIRMED' ? styles.statusConfirmed : styles.statusPending
                    }`}>
                      {ticket.reservation?.status === 'CONFIRMED' ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>

                  <div className={styles.eventInfo}>
                    <h3 className={styles.eventTitle}>{ticket.event?.title}</h3>
                    
                    <div className={styles.eventDetails}>
                      <div className={styles.detailItem}>
                        <span>{ticket.event?.dateTime ? new Date(ticket.event.dateTime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}</span>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <span>{ticket.event?.location || 'Location not specified'}</span>
                      </div>

                      <div className={styles.detailItem}>
                        <span>Issued: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.ticketFooter}>
                    <button
                      onClick={() => handleDownload(ticket.id)}
                      className={styles.downloadButton}
                    >
                      Download PDF
                    </button>
                    
                    {ticket.pdfUrl && (
                      <div className={styles.ticketInfo}>
                        <span className={styles.infoIcon}>📄</span>
                        <span className={styles.infoText}>PDF Available</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ParticipantLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </ProtectedRoute>
  );
}