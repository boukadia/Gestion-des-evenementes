'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Event } from '@/types/event';
import { getPublishedEvents } from '@/services/evenements/evenements.api';
import { createReservation } from '@/services/reservations/reservations.api';
import styles from './page.module.css';
import ParticipantLayout from '@/components/ParticipantLayout';

export default function ParticipantEvenementsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEvents = async () => {
    try {
      const data = await getPublishedEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleReserve = async (eventId: number) => {
    const result = await createReservation(eventId);
    
    if (result.success) {
      alert('Reservation submitted successfully! ✅');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, events]);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['PARTICIPANT']}>
        <ParticipantLayout>
          <div className={styles.loading}>Loading events...</div>
        </ParticipantLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['PARTICIPANT']}>
      <ParticipantLayout>
        <div className={styles.pageContainer}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>🎪 Available Events</h1>
            <p className={styles.pageSubtitle}>Discover and book amazing events happening near you</p>
          </div>

          <div className={styles.searchSection}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search events by title, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <span className={styles.searchIcon}>🔍</span>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className={styles.noEvents}>
              <div className={styles.noEventsIcon}>🎭</div>
              <h3>No events found</h3>
              <p>Try adjusting your search criteria or check back later for new events.</p>
            </div>
          ) : (
            <div className={styles.eventsGrid}>
              {filteredEvents.map((event) => (
                <div key={event.id} className={styles.eventCard}>
                  <div className={styles.eventHeader}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <span className={styles.eventStatus}>
                      {event.status === 'PUBLISHED' ? '🟢 Available' : '🔴 Not Available'}
                    </span>
                  </div>
                  
                  <div className={styles.eventDetails}>
                    <div className={styles.eventInfo}>
                      <span className={styles.eventInfoIcon}>📅</span>
                      <span>{new Date(event.dateTime).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    
                    <div className={styles.eventInfo}>
                      <span className={styles.eventInfoIcon}>📍</span>
                      <span>{event.location}</span>
                    </div>
                    
                    <div className={styles.eventInfo}>
                      <span className={styles.eventInfoIcon}>👥</span>
                      <span>Capacity: {event.capacity} people</span>
                    </div>
                  </div>

                  <div className={styles.eventDescription}>
                    <p>{event.description}</p>
                  </div>

                  <div className={styles.eventActions}>
                    <button
                      onClick={() => handleReserve(event.id)}
                      className={styles.reserveButton}
                      disabled={event.status !== 'PUBLISHED'}
                    >
                      {event.status === 'PUBLISHED' ? 'Reserve Now 🎫' : 'Not Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ParticipantLayout>
    </ProtectedRoute>
  );
}
