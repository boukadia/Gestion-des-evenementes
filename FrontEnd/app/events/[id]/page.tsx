import EventDetails from '@/components/EventDetails';
import { Event } from '@/types/event';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getEvent(id: string): Promise<Event | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/evenementes/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);
  
  if (!event) {
    notFound();
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link href="/" className="navbar-brand fw-bold">
            GestEvent
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/events" className="nav-link">Events</Link>
              </li>
              <li className="nav-item">
                <Link href="/auth/login" className="nav-link">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Event Details */}
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <EventDetails event={event} showBookButton={true} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} GestEvent. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
