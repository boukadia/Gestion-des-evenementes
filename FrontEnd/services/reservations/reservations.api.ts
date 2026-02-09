import { Reservation } from '@/types/reservation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
