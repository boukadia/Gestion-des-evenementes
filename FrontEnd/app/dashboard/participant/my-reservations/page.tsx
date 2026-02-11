"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ParticipantLayout from "@/components/ParticipantLayout";
import { Reservation } from "@/types/reservation";
import {
  getMyReservations,
  cancelMyReservation,
} from "@/services/reservations/reservations.api";
import Toast, { ToastType } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import styles from "./page.module.css";

export default function MyReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    reservationId: number;
  } | null>(null);

  const fetchReservations = async () => {
    try {
      const data = await getMyReservations();
      setReservations(data);
      setFilteredReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = reservations;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((res) => res.status === statusFilter);
    }

    setFilteredReservations(filtered);
  };

  const handleViewTicket = (ticketId: number) => {
    router.push(`/dashboard/participant/my-tickets/${ticketId}`);
  };

  const handleCancelClick = (reservationId: number) => {
    setConfirmDialog({ reservationId });
  };

  const handleCancelConfirm = async () => {
    if (!confirmDialog) return;

    const result = await cancelMyReservation(confirmDialog.reservationId);
    setConfirmDialog(null);

    if (result.success) {
      setToast({
        message: "Reservation cancelled successfully!",
        type: "success",
      });
      // Update local state
      setReservations(
        reservations.map((res) =>
          res.id === confirmDialog.reservationId
            ? { ...res, status: "CANCELED" as const }
            : res,
        ),
      );
    } else {
      setToast({
        message: result.error || "Failed to cancel reservation",
        type: "error",
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return styles.statusConfirmed;
      case "PENDING":
        return styles.statusPending;
      case "REFUSED":
        return styles.statusRefused;
      case "CANCELED":
        return styles.statusCanceled;
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    return "";
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, reservations])

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["PARTICIPANT"]}>
        <ParticipantLayout>
          <div className={styles.loading}>Loading reservations...</div>
        </ParticipantLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["PARTICIPANT"]}>
      <ParticipantLayout>
        <div className={styles.pageContainer}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>My Reservations</h1>
            <p className={styles.pageSubtitle}>
              Manage your event reservations
            </p>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>{reservations.length}</span>
                <span className={styles.statLabel}>Total Reservations</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {reservations.filter((r) => r.status === "CONFIRMED").length}
                </span>
                <span className={styles.statLabel}>Confirmed</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {reservations.filter((r) => r.status === "PENDING").length}
                </span>
                <span className={styles.statLabel}>Pending</span>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className={styles.filterSection}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.statusFilter}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="REFUSED">Refused</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>

          {/* Reservations List */}
          {filteredReservations.length === 0 ? (
            <div className={styles.noReservations}>
              <h3>No reservations found</h3>
              <p>
                You haven't made any reservations yet. Browse events to get
                started!
              </p>
            </div>
          ) : (
            <div className={styles.reservationsGrid}>
              {filteredReservations.map((reservation) => (
                <div key={reservation.id} className={styles.reservationCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.eventTitle}>
                      {reservation.event.title}
                    </h3>
                    <span
                      className={`${styles.statusBadge} ${getStatusBadgeClass(reservation.status)}`}
                    >
                      {getStatusIcon(reservation.status)} {reservation.status}
                    </span>
                  </div>

                  <div className={styles.eventDetails}>
                    <div className={styles.detailItem}>
                      <span>
                        {new Date(
                          reservation.event.dateTime,
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span>{reservation.event.location}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span>
                        Reserved on:{" "}
                        {new Date(reservation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    {reservation.status === "CONFIRMED" &&
                      reservation.ticket && (
                        <button
                          onClick={() =>
                            handleViewTicket(reservation.ticket!.id)
                          }
                          className={styles.ticketButton}
                        >
                          View Ticket
                        </button>
                      )}
                    {reservation.status === "PENDING" && (
                      <button
                        onClick={() => handleCancelClick(reservation.id)}
                        className={styles.cancelButton}
                      >
                        Cancel Reservation
                      </button>
                    )}
                    {reservation.status === "REFUSED" && (
                      <span className={styles.refusedMessage}>
                        This reservation was refused by the admin
                      </span>
                    )}
                    {reservation.status === "CANCELED" && (
                      <span className={styles.canceledMessage}>
                        You canceled this reservation
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ParticipantLayout>
      {confirmDialog && (
        <ConfirmDialog
          title="Cancel Reservation"
          message="Are you sure you want to cancel this reservation? You may not be able to book it again if the event is full."
          confirmText="Yes, Cancel"
          cancelText="Keep It"
          type="warning"
          onConfirm={handleCancelConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ProtectedRoute>
  );
}
