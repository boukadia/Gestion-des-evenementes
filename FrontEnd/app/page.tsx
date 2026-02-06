import { fetchEvents } from '@/services/evenements/event.api';
import { getPublishedEvents } from '@/services/events.service';
import { Event } from '@/types/event';
import Link from 'next/link';

export default async function Home() {
  const events: Event[] = await fetchEvents(true);
  console.log("eve",events);
  
  

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link href="/" className="navbar-brand fw-bold">
            🎉 GestEvent
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link href="/" className="nav-link active">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/events" className="nav-link">
                  Events
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/auth/login" className="nav-link">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold text-primary mb-3">
            Discover Amazing Events
          </h1>
          <p className="lead text-muted mb-4">
            Find and book the best events in your area. Concerts, conferences, workshops and more!
          </p>
          <Link href="/events" className="btn btn-primary btn-lg">
            Browse All Events
          </Link>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Upcoming Events</h2>
          
          {events.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted">
                <i className="bi bi-calendar-x fs-1"></i>
                <p className="mt-3">No events available at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {events.slice(0, 6).map((event) => (
                <div key={event.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm hover-shadow">
                    <div className="card-body">
                      <span className="badge bg-success mb-2">Published</span>
                      <h5 className="card-title text-primary">{event.title}</h5>
                      <p className="card-text text-muted">
                        {event.description.length > 80
                          ? `${event.description.substring(0, 80)}...`
                          : event.description}
                      </p>
                      <hr />
                      <div className="d-flex justify-content-between text-muted small">
                        <div>
                          <span className="me-1">📅</span>
                          {new Date(event.dateTime).toLocaleDateString('fr-FR')}
                        </div>
                        <div>
                          <span className="me-1">📍</span>
                          {event.location.length > 15 
                            ? `${event.location.substring(0, 15)}...` 
                            : event.location}
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-0 pb-3">
                      <Link
                        href={`/events/${event.id}`}
                        className="btn btn-outline-primary w-100"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {events.length > 6 && (
            <div className="text-center mt-4">
              <Link href="/events" className="btn btn-primary">
                View All Events
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} GestEvent. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
