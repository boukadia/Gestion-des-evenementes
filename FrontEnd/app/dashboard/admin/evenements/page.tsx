'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { Event } from '@/types/event';
import { getAllEvents, updateEventStatus, deleteEvent } from '@/services/evenements/evenements.api';
import { useEffect, useState } from 'react';
import Toast, { ToastType } from '@/components/Toast';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId: number, newStatus: 'DRAFT' | 'PUBLISHED' | 'CANCELLED') => {
    const result = await updateEventStatus(eventId, newStatus);
    
    if (result.success) {
      setEvents(events.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      ));
      setToast({ message: 'Status updated successfully!', type: 'success' });
    } else {
      setToast({ message: result.error || 'Failed to update status', type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const result = await deleteEvent(id);
    
    if (result.success) {
      setEvents(events.filter(event => event.id !== id));
      setToast({ message: 'Event deleted successfully!', type: 'success' });
    } else {
      setToast({ message: result.error || 'Failed to delete event', type: 'error' });
    }
  };

  const getStatusClass = (status: string) => {
    if (status === 'PUBLISHED') return styles.published;
    if (status === 'CANCELED') return styles.canceled;
    return styles.draft;
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>Events Management</h1>
            <Link href="/dashboard/admin/evenements/create" className={`btn btn-primary ${styles.createButton}`}>
              ➕ Create New Event
            </Link>
          </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>No events found</p>
            <Link href="/dashboard/admin/evenements/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Create First Event
            </Link>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className="table table-hover" style={{ marginBottom: 0 }}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableCellHeader}>Title</th>
                  <th className={styles.tableCellHeader}>Location</th>
                  <th className={styles.tableCellHeader}>Date</th>
                  <th className={styles.tableCellHeader}>Capacity</th>
                  <th className={styles.tableCellHeader}>Status</th>
                  <th className={`${styles.tableCellHeader} ${styles.actionsCell}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className={styles.tableCell}>
                      <div className={styles.eventTitle}>{event.title}</div>
                    </td>
                    <td className={styles.tableCell}>{event.location}</td>
                    <td className={styles.tableCell}>
                      {new Date(event.dateTime).toLocaleDateString()}
                    </td>
                    <td className={styles.tableCell}>{event.capacity}</td>
                    <td className={styles.tableCell}>
                      <select
                        className={`form-select form-select-sm ${styles.statusSelect}`}
                        value={event.status}
                        onChange={(e) => handleStatusChange(event.id, e.target.value as 'DRAFT' | 'PUBLISHED' | 'CANCELLED')}
                        style={{
                          maxWidth: '150px',
                          backgroundColor: 
                            event.status === 'PUBLISHED' ? '#d4edda' : 
                            event.status === 'CANCELLED' ? '#f8d7da' : 
                            '#fff3cd',
                          color: 
                            event.status === 'PUBLISHED' ? '#155724' : 
                            event.status === 'CANCELLED' ? '#721c24' : 
                            '#856404',
                          fontWeight: 'bold',
                          border: '1px solid rgba(0,0,0,0.1)'
                        }}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="CANCELED">CANCELED</option>
                      </select>
                    </td>
                    <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                      <div className={styles.buttonGroup}>
                        <Link
                          href={`/dashboard/admin/evenements/${event.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          🗑️ Delete
                        </button>
                      </div>
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
