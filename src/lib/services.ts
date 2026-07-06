import { normalizeEvent } from "@/lib/adapters";
import { getEventsBlob, getVenuesBlob } from "@/lib/blob";
import type { EventDetails, Events } from "@/types/events";
import type { Venue, Venues } from "@/types/venues";

const todayInMadrid = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
  }).format(new Date());

let eventsCache: Events = [];
let venuesCache: Venues = [];
let venuesById = new Map<string, Venue>();

async function getAllEvents(): Promise<Events> {
  if (eventsCache.length) return eventsCache;

  const today = todayInMadrid();
  const raw = await getEventsBlob();

  eventsCache = raw
    .filter((event) => event.finalDate >= today)
    .sort((a, b) => a.finalDate.localeCompare(b.finalDate))
    .map(normalizeEvent);

  return eventsCache;
}

async function getAllVenues(): Promise<Venues> {
  if (venuesCache.length) return venuesCache;

  venuesCache = await getVenuesBlob();
  venuesById = new Map(venuesCache.map((venue) => [venue.id, venue]));

  return venuesCache;
}

async function getEventDetails(id: string): Promise<EventDetails | null> {
  await Promise.all([getAllEvents(), getAllVenues()]);

  const event = eventsCache.find((event) => event.id === id);
  if (!event) return null;

  const venue = venuesById.get(event.venueId);
  if (!venue) return null;

  return {
    ...event,
    venue,
  };
}

export function buildEventsService() {
  return {
    getAllEvents,
    getAllVenues,
    getEventDetails,
  };
}
