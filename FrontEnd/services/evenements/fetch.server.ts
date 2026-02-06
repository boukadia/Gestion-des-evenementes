export const getEventsServer = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/evenementes/published`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      console.error('Failed to fetch events:', res.status);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};