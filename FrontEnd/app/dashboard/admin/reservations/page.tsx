'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { Reservation } from '@/types/reservation';
import { getAllReservations, updateReservationStatus as updateStatus } from '@/services/reservations/reservations.api';
import { useEffect, useState } from 'react';
import Toast, { ToastType } from '@/components/Toast';
import styles from './page.module.css';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);
  console.log('reservation',reservations);
  

  const fetchReservations = async () => {
    try {
      const data = await getAllReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: number, status: 'PENDING' | 'CONFIRMED' | 'REFUSED' | 'CANCELED') => {
    const result = await updateStatus(id, status);
    
    if (result.success) {
      setReservations(reservations.map(res => 
        res.id === id ? { ...res, status } : res
      ));
      setToast({ message: 'Reservation status updated!', type: 'success' });
    } else {
      setToast({ message: result.error || 'Error updating reservation', type: 'error' });
    }
  };

  const getStatusClass = (status: string) => {
    if (status === 'CONFIRMED') return styles.confirmed;
    if (status === 'CANCELED') return styles.canceled;
    return styles.pending;
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <h1 className={styles.pageTitle}>Reservations Management</h1>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : reservations.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>No reservations found</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className="table table-hover" style={{ marginBottom: 0 }}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableCellHeader}>User</th>
                  <th className={styles.tableCellHeader}>Event</th>
                  <th className={styles.tableCellHeader}>Event Date</th>
                  <th className={styles.tableCellHeader}>Tickets</th>
                  <th className={styles.tableCellHeader}>Status</th>
                  <th className={styles.tableCellHeader}>Booked At</th>
                  <th className={`${styles.tableCellHeader} ${styles.actionsCell}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className={styles.tableCell}>
                      <div className={styles.userInfo}>{reservation.user.name}</div>
                      <div className={styles.userEmail}>{reservation.user.email}</div>
                    </td>
                    <td className={`${styles.tableCell} ${styles.eventTitle}`}>
                      {reservation.event.title}
                    </td>
                    <td className={styles.tableCell}>
                      {new Date(reservation.event.dateTime).toLocaleDateString()}
                    </td>
                    <td className={styles.tableCell}>
                      {reservation.ticket ? '1 ticket' : 'No ticket'}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.statusBadge} ${getStatusClass(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {new Date(reservation.createdAt).toLocaleDateString()}
                    </td>
                    <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                      {reservation.status === 'PENDING' && (
                        <div className={styles.buttonGroup}>
                          <button
                            onClick={() => updateReservationStatus(reservation.id, 'CONFIRMED')}
                            className="btn btn-sm btn-success"
                          >
                            ✅ Confirm
                          </button>
                          <button
                            onClick={() => updateReservationStatus(reservation.id, 'CANCELED')}
                            className="btn btn-sm btn-danger"
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </ProtectedRoute>
  );
}
