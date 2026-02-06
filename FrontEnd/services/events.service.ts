import { Event } from '@/types/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getPublishedEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_URL}/evenementes/published`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEventById(id: number): Promise<Event | null> {
  try {
    const response = await fetch(`${API_URL}/evenementes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}