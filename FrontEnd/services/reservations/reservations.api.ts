import { Reservation } from '@/types/reservation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create a new reservation
export const createReservation = async (eventId: number): Promise<{ success: boolean; error?: string; reservation?: Reservation }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ eventId })
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        errorMessage = response.statusText || errorMessage;
      }
      return { success: false, error: errorMessage };
    }

    const reservation = await response.json();
    return { success: true, reservation };
  } catch (error: unknown) {
    console.error('Error creating reservation:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Fetch all reservations (for admin)
export const getAllReservations = async (): Promise<Reservation[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reservations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch reservations');
    return response.json();
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
};

// Get my reservations (for participants)
export const getMyReservations = async (): Promise<Reservation[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reservations/my`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch my reservations');
    return response.json();
  } catch (error) {
    console.error('Error fetching my reservations:', error);
    return [];
  }
};

// Update reservation status
export const updateReservationStatus = async (
  reservationId: number,
  status: 'PENDING' | 'CONFIRMED' | 'REFUSED' | 'CANCELED'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reservations/${reservationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    console.log("response",response);
    

     if (!response.ok) {
      // جلب رسالة الخطأ من Backend
      let errorMessage = `HTTP Error: ${response.status}`;
      
      try {
        const errorData = await response.json();
        // رسالة الخطأ من Backend
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // إذا لم يستطع parse JSON، استخدم status text
        errorMessage = response.statusText || errorMessage;
      }
      
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Error updating reservation status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
// Cancel my reservation (for participants)
export const cancelMyReservation = async (reservationId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reservations/${reservationId}/annule`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        errorMessage = response.statusText || errorMessage;
      }
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Error canceling reservation:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};