import { getEventsClient } from "./fetch.client";
import { getEventsServer } from "./fetch.server";

export const fetchEvents = async (isServer: boolean) => {
  if (isServer) {
    return getEventsServer();
  } else {
    return getEventsClient();
  }
};