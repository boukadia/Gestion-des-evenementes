import { Ticket } from '@/types/ticket';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Fetch all tickets (for admin)
export const getAllTickets = async (): Promise<Ticket[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return response.json();
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId: number): Promise<Ticket | null> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch ticket');
    return response.json();
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return null;
  }
};

// Get my tickets (for participants)
export const getMyTickets = async (): Promise<Ticket[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tickets/my`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch my tickets');
    return response.json();
  } catch (error) {
    console.error('Error fetching my tickets:', error);
    return [];
  }
};

// Download ticket PDF
export const downloadTicket = async (ticketId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('ticketId',ticketId);
    
    const token = localStorage.getItem('token');
    console.log('token',token);
    
    
    const response = await fetch(`${API_URL}/tickets/${ticketId}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = 'Failed to download ticket';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        errorMessage = response.statusText || errorMessage;
      }
      return { success: false, error: errorMessage };
    }
    

    // Get the PDF blob
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${ticketId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error: unknown) {
    console.error('Error downloading ticket:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
};

// Delete ticket
export const deleteTicket = async (ticketId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete ticket';
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
    console.error('Error deleting ticket:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
};
