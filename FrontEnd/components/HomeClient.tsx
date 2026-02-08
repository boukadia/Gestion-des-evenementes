'use client';

import { Event } from '@/types/event';
import Link from 'next/link';
import EventCard from '@/components/EventCard';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function HomeClient({ initialEvents }: { initialEvents: Event[] }) {
  const [events] = useState<Event[]>(initialEvents);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary py-5">
        <div className="container text-center py-5">
          <h1 className="display-3 fw-bold text-white mb-3">
            Discover Amazing Events
          </h1>
          <p className="lead text-white mb-4">
            Find and book the best events in your area
          </p>
          
          <Link href="/events" className="btn btn-light btn-lg px-5">
            Browse All Events
          </Link>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Upcoming Events</h2>
            <p className="text-muted">Don't miss out on these amazing experiences</p>
          </div>
          
          {events.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted">
                <div className="fs-1 mb-3">📅</div>
                <p className="fs-5">No events available at the moment.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {events.slice(0, 6).map((event) => (
                  <div key={event.id} className="col-md-6 col-lg-4">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
              
              {events.length > 6 && (
                <div className="text-center mt-5">
                  <Link href="/events" className="btn btn-primary btn-lg px-5">
                    View All Events
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} GestEvent. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
