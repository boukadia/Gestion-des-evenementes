'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { getPublishedEvents } from '@/services/evenements/evenements.api';
import EventCard from '@/components/EventCard';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, events]);

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
    if (!searchTerm.trim()) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  return (
    <>
      <Navbar />
      
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>All Events</h1>
          <p className={styles.subtitle}>Discover amazing events happening near you</p>
        </div>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search events by title, location, or description..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className={styles.clearButton}
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className={styles.resultsCount}>
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className={styles.loadingText}>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              {searchTerm ? '🔍' : '📅'}
            </div>
            <h3 className={styles.emptyTitle}>
              {searchTerm ? 'No events found' : 'No events available'}
            </h3>
            <p className={styles.emptyText}>
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Check back later for new events'
              }
            </p>
            {searchTerm && (
              <button 
                className={styles.clearSearchButton}
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className={styles.eventsGrid}>
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} GestEvent. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
