export const getEventsClient = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    credentials: "include",
  });
  return res.json();
};