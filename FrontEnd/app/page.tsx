import { fetchEvents } from '@/services/evenements/event.api';
import { Event } from '@/types/event';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const events: Event[] = await fetchEvents(true);

  return <HomeClient initialEvents={events} />;
}
