import { Event } from '@/types/event';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
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
            {new Date(event.dateTime).toLocaleDateString('fr-FR')}
          </div>
          <div>
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
  );
}