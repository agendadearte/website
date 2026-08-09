import type { EventDetails, Events } from "@/types/events";
import type { Venue, Venues } from "@/types/venues";
import { normalizeEvent, sortEvents } from "@/lib/adapters";
import {
  deleteImagesBlob,
  getEventsBlob,
  getVenuesBlob,
  listImagesBlob,
  putEventsBlob,
  uploadImagesBlob,
} from "@/lib/blob";
import { todayInMadrid } from "@/lib/dates";

let eventsCache: Events = [];
let venuesCache: Venues = [];
let venuesById = new Map<string, Venue>();

const getOrphanImages = (events: Events, blobImages: string[]): string[] => {
  const referencedImages = new Set(events.flatMap((event) => event.images));

  return blobImages.filter((image) => !referencedImages.has(image));
};

async function getAllEvents(): Promise<Events> {
  if (eventsCache.length) return eventsCache;

  const raw = await getEventsBlob();
  eventsCache = sortEvents(raw).map(normalizeEvent);

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

async function updateEvents(events: Events, images: File[]): Promise<void> {
  await uploadImagesBlob(images);
  await putEventsBlob(events);

  eventsCache = events;

  try {
    const blobImages = await listImagesBlob();
    const orphanImages = getOrphanImages(events, blobImages);

    if (orphanImages.length) {
      await deleteImagesBlob(orphanImages);
    }
  } catch (error) {
    console.error("Image cleanup failed", error);
  }
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
