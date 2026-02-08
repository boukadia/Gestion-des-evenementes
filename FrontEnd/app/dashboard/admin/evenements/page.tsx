'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { Event } from '@/types/event';
import { getAllEvents, updateEventStatus, deleteEvent } from '@/services/evenements/evenements.api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleStatusChange = async (eventId: number, newStatus: 'DRAFT' | 'PUBLISHED' | 'CANCELED') => {
    const result = await updateEventStatus(eventId, newStatus);
    
    if (result.success) {
      setEvents(events.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      ));
      alert('Status updated successfully!');
    } else {
      alert(result.error || 'Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const result = await deleteEvent(id);
    
    if (result.success) {
      setEvents(events.filter(event => event.id !== id));
      alert('Event deleted successfully!');
    } else {
      alert(result.error || 'Failed to delete event');
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Events Management</h1>
          <Link
            href="/dashboard/admin/evenements/create"
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.5rem',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            ➕ Create New Event
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>No events found</p>
            <Link href="/dashboard/admin/evenements/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Create First Event
            </Link>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <table className="table table-hover" style={{ marginBottom: 0 }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '1rem' }}>Title</th>
                  <th style={{ padding: '1rem' }}>Location</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                    <th style={{ padding: '1rem' }}>Capacity</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{event.title}</td>
                    <td style={{ padding: '1rem' }}>{event.location}</td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(event.dateTime).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>{event.capacity}</td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        className="form-select form-select-sm"
                        value={event.status}
                        onChange={(e) => handleStatusChange(event.id, e.target.value as 'DRAFT' | 'PUBLISHED' | 'CANCELED')}
                        style={{
                          maxWidth: '150px',
                          backgroundColor: 
                            event.status === 'PUBLISHED' ? '#d4edda' : 
                            event.status === 'CANCELED' ? '#f8d7da' : 
                            '#fff3cd',
                          color: 
                            event.status === 'PUBLISHED' ? '#155724' : 
                            event.status === 'CANCELED' ? '#721c24' : 
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
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
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
    </ProtectedRoute>
  );
}
