import { Event } from '@/types/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Fetch all events (for admin)
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_URL}/evenementes`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Create new event
export const createEvent = async (eventData: {
  title: string;
  description: string;
  location: string;
  dateTime: string;
  capacity: number;
  status: string;
}): Promise<{ success: boolean; data?: Event; error?: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/evenementes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    console.error('Error creating event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Update event
export const updateEvent = async (
  eventId: number,
  eventData: {
    title: string;
    description: string;
    location: string;
    dateTime: string;
    capacity: number;
    status: string;
  }
): Promise<{ success: boolean; data?: Event; error?: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/evenementes/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    console.error('Error updating event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Get event by ID
export const getEventById = async (eventId: number): Promise<Event | null> => {
  try {
    const response = await fetch(`${API_URL}/evenementes/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch event');
    return response.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

// Update event status
export const updateEventStatus = async (
  eventId: number,
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELED'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/evenementes/${eventId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to update status' };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Error updating status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Delete event
export const deleteEvent = async (eventId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/evenementes/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to delete event' };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
