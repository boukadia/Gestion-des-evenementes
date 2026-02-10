'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { Ticket } from '@/types/ticket';
import { getAllTickets, downloadTicket, deleteTicket } from '@/services/tickets/tickets.api';
import { useEffect, useState } from 'react';
import Toast, { ToastType } from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import styles from './page.module.css';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ ticketId: number } | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, tickets]);

  const fetchTickets = async () => {
    try {
      const data = await getAllTickets();
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.event?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.reservation?.status === statusFilter);
    }

    setFilteredTickets(filtered);
  };

  const handleDownload = async (ticketId: number) => {
    const result = await downloadTicket(ticketId);
    console.log("res",result);
    
    if (result.success) {
      setToast({ message: 'Ticket downloaded successfully!', type: 'success' });
    } else {
      setToast({ message: 'Failed to download ticket', type: 'error' });
    }
  };

  const handleDeleteClick = (ticketId: number) => {
    setConfirmDialog({ ticketId });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog) return;
    
    const result = await deleteTicket(confirmDialog.ticketId);
    setConfirmDialog(null);
    
    if (result.success) {
      setTickets(tickets.filter(ticket => ticket.id !== confirmDialog.ticketId));
      setToast({ message: 'Ticket deleted successfully!', type: 'success' });
    } else {
      setToast({ message: result.error || 'Failed to delete ticket', type: 'error' });
    }
  };

  const getStatusClass = (status?: string) => {
    if (!status) return styles.pending;
    if (status === 'CONFIRMED') return styles.confirmed;
    if (status === 'REFUSED') return styles.refused;
    if (status === 'CANCELED') return styles.canceled;
    return styles.pending;
  };

  const totalTickets = tickets.length;
  const confirmedTickets = tickets.filter(t => t.reservation?.status === 'CONFIRMED').length;

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <h1 className={styles.pageTitle}>Tickets Management</h1>

          {/* Stats Cards */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{totalTickets}</h3>
                <p className={styles.statLabel}>Total Tickets</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{confirmedTickets}</h3>
                <p className={styles.statLabel}>Confirmed Tickets</p>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className={styles.filterSection}>
            <input
              type="text"
              placeholder="Search by event, user name or email..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className={styles.statusFilter}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="REFUSED">Refused</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>
                {searchTerm || statusFilter ? 'No tickets found matching your filters' : 'No tickets found'}
              </p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className="table table-hover" style={{ marginBottom: 0 }}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableCellHeader}>Ticket ID</th>
                    <th className={styles.tableCellHeader}>Event</th>
                    <th className={styles.tableCellHeader}>User</th>
                    <th className={styles.tableCellHeader}>Event Date</th>
                    <th className={styles.tableCellHeader}>Status</th>
                    <th className={styles.tableCellHeader}>Created At</th>
                    <th className={`${styles.tableCellHeader} ${styles.actionsCell}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className={styles.tableCell}>
                        <span className={styles.ticketId}>#{ticket.id}</span>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.eventInfo}>{ticket.event?.title}</div>
                        <div className={styles.eventLocation}>{ticket.event?.location}</div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.userInfo}>{ticket.user?.name}</div>
                        <div className={styles.userEmail}>{ticket.user?.email}</div>
                      </td>
                      <td className={styles.tableCell}>
                        {ticket.event?.dateTime ? new Date(ticket.event.dateTime).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className={styles.tableCell}>
                        <span className={`${styles.statusBadge} ${getStatusClass(ticket.reservation?.status)}`}>
                          {ticket.reservation?.status || 'N/A'}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                        <div className={styles.buttonGroup}>
                          <button
                            onClick={() => handleDownload(ticket.id)}
                            className={`btn btn-sm btn-outline-primary ${styles.downloadButton}`}
                            title="Download PDF"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => handleDeleteClick(ticket.id)}
                            className={`btn btn-sm btn-outline-danger ${styles.deleteButton}`}
                            title="Delete Ticket"
                          >
                            Delete
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
      {confirmDialog && (
        <ConfirmDialog
          title="Delete Ticket"
          message="Are you sure you want to delete this ticket? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </ProtectedRoute>
  );
}