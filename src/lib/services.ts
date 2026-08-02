import type { EventDetails, Events } from "@/types/events";
import type { Venue, Venues } from "@/types/venues";
import { normalizeEvent } from "@/lib/adapters";
import { getEventsBlob, getVenuesBlob, putEventsBlob } from "@/lib/blob";
import { todayInMadrid } from "@/lib/dates";

let eventsCache: Events = [];
let venuesCache: Venues = [];
let venuesById = new Map<string, Venue>();

async function getAllEvents(): Promise<Events> {
  if (eventsCache.length) return eventsCache;

  const raw = await getEventsBlob();

  eventsCache = raw
    .sort((a, b) => a.finalDate.localeCompare(b.finalDate))
    .map(normalizeEvent);

  return eventsCache;
}

async function getActiveEvents(): Promise<Events> {
  const today = todayInMadrid();
  const events = await getAllEvents();

  return events.filter((event) => event.finalDate >= today);
}

async function getAllVenues(): Promise<Venues> {
  if (venuesCache.length) return venuesCache;

  venuesCache = await getVenuesBlob();
  venuesById = new Map(venuesCache.map((venue) => [venue.id, venue]));

  return venuesCache;
}

async function getEventDetails(id: string): Promise<EventDetails | null> {
  await Promise.all([getActiveEvents(), getAllVenues()]);

  const event = eventsCache.find((event) => event.id === id);
  if (!event) return null;

  const venue = venuesById.get(event.venueId);
  if (!venue) return null;

  return {
    ...event,
    venue,
  };
}

async function updateEvents(events: Events): Promise<void> {
  await putEventsBlob(events);

  eventsCache = events;

  return;
}

export function buildEventsService() {
  return {
    getAllEvents,
    getActiveEvents,
    getAllVenues,
    getEventDetails,
    updateEvents,
  };
}
