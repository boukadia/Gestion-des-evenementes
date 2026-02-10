'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { getEventById, updateEvent } from '@/services/evenements/evenements.api';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Toast, { ToastType } from '@/components/Toast';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = parseInt(params.id as string);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    dateTime: '',
    capacity: '',
    status: 'DRAFT'
  });

  const fetchEvent = async () => {
    try {
      const data = await getEventById(eventId);
      
      if (!data) {
        setToast({ message: 'Event not found', type: 'error' });
        setTimeout(() => router.push('/dashboard/admin/evenements'), 1500);
        return;
      }
      
      // Format date for datetime-local input
      const dateObj = new Date(data.dateTime);
      const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      
      setFormData({
        title: data.title,
        description: data.description,
        location: data.location,
        dateTime: localDate,
        capacity: data.capacity.toString(),
        status: data.status
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      setToast({ message: 'Error loading event', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateEvent(eventId, {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        dateTime: new Date(formData.dateTime).toISOString(),
        capacity: parseInt(formData.capacity),
        status: formData.status
      });

      if (result.success) {
        setToast({ message: 'Event updated successfully!', type: 'success' });
        setTimeout(() => router.push('/dashboard/admin/evenements'), 1500);
      } else {
        setToast({ message: result.error || 'Failed to update event', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setToast({ message: 'Error updating event', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <AdminLayout>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh'
          }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Edit Event</h1>

        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '800px'
        }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 'bold' }}>Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 'bold' }}>Description</label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: 'bold' }}>Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: 'bold' }}>Date</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  className="form-control"
                  value={formData.dateTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: 'bold' }}>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  className="form-control"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 'bold' }}>Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ padding: '0.75rem 2rem' }}
              >
                {saving ? 'Saving...' : '✅ Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => router.back()}
                style={{ padding: '0.75rem 2rem' }}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
        </div>
      </AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </ProtectedRoute>
  );
}
