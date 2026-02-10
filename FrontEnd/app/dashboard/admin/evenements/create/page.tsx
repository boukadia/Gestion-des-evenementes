'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { createEvent } from '@/services/evenements/evenements.api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast, { ToastType } from '@/components/Toast';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    dateTime: '',
    capacity: '',
    status: 'DRAFT'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createEvent({
      title: formData.title,
      description: formData.description,
      location: formData.location,
      dateTime: new Date(formData.dateTime).toISOString(),
      capacity: parseInt(formData.capacity),
      status: formData.status
    });

    setLoading(false);

    if (result.success) {
      setToast({ message: 'Event created successfully!', type: 'success' });
      setTimeout(() => router.push('/dashboard/admin/evenements'), 1500);
    } else {
      setToast({ message: result.error || 'Failed to create event', type: 'error' });
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Create New Event</h1>

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
                disabled={loading}
                style={{ padding: '0.75rem 2rem' }}
              >
                {loading ? 'Creating...' : '✅ Create Event'}
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
