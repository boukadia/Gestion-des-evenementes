import { Event } from '@/types/event';
import Link from 'next/link';

interface EventDetailsProps {
  event: Event;
  showBookButton?: boolean;
  showAdminActions?: boolean;
}

export default function EventDetails({ 
  event, 
  showBookButton = true,
  showAdminActions = false 
}: EventDetailsProps) {
  return (
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        <h1 className="mb-0 h3">{event.title}</h1>
        <span className={`badge mt-2 ${
          event.status === 'PUBLISHED' ? 'bg-success' : 
          event.status === 'CANCELED' ? 'bg-danger' : 'bg-warning'
        }`}>
          {event.status}
        </span>
      </div>
      
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-6">
            <h6 className="text-primary">Date & Time</h6>
            <p className="mb-3">
              {new Date(event.dateTime).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          
          <div className="col-md-6">
            <h6 className="text-primary">Location</h6>
            <p className="mb-3">{event.location}</p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <h6 className="text-primary">Capacity</h6>
            <p className="mb-3">{event.capacity} places</p>
          </div>
          
          <div className="col-md-6">
            <h6 className="text-primary">Organizer</h6>
            <p className="mb-3">{event.admin?.name || 'N/A'}</p>
          </div>
        </div>

        <div className="mb-4">
          <h6 className="text-primary">Description</h6>
          <p className="text-muted">{event.description}</p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          {showBookButton && event.status === 'PUBLISHED' && (
            <Link 
              href={`/events/${event.id}/book`} 
              className="btn btn-primary btn-lg"
            >
              Book Now
            </Link>
          )}
          
          {showAdminActions && (
            <>
              <Link 
                href={`/dashboard/events/${event.id}/edit`} 
                className="btn btn-warning"
              >
                Edit
              </Link>
              <button className="btn btn-danger">
                Delete
              </button>
            </>
          )}
          
          <Link href="/" className="btn btn-outline-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
