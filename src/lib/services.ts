import { promises as fs } from "fs";
import { eventDates, IEventDates } from "@/lib/adapters";
import { getVenuesBlob } from "@/lib/blob";
import { Venue, Venues } from "@/types/venues";

const today = Math.round(new Date().getTime() / 1000);

export type IEvent = {
  id: string;
  title: string;
  author: string;
  description: string;
  images: string[];
  location: string;
  entrance?: string;
} & IEventDates;

type ISingleEvent = Omit<IEvent, "location"> & {
  location: Venue;
  location: Venue;
};

const eventsStore: IEvent[] = [];
let venuesStore: Venues = [];
let venuesStore: Venues = [];

type IEventsResponse = {
  id: string;
  author: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  initial_date: number;
  final_date: number;
  entrance?: string;
}[];

async function getAllEvents(): Promise<IEvent[]> {
  if (eventsStore.length) return eventsStore;

  const path = process.cwd() + "/src/data/events.json";
  const file = await fs.readFile(path, "utf8");
  const events: IEventsResponse = JSON.parse(file);

  events.forEach((event) => {
    if (event.final_date >= today) {
      const evetItem: IEvent = {
        ...event,
        ...eventDates(event.initial_date, event.final_date),
        images: event.images.map((image) => `/images/events/${image}`),
      };
      eventsStore.push(evetItem);
    }
  });
  return eventsStore;
}

async function getAllVenues(): Promise<Venues> {
  if (venuesStore.length) return venuesStore;
  venuesStore = await getVenuesBlob();
  return venuesStore;
}

async function getSingleEvent(id: string): Promise<ISingleEvent | null> {
  await getAllEvents();
  await getAllVenues();
  await getAllVenues();

  const event = eventsStore.find((event) => event.id === id);
  if (!event) return null;

  const location = venuesStore.find((loc) => loc.id === event.location);
  const location = venuesStore.find((loc) => loc.id === event.location);
  if (!location) return null;

  return { ...event, location };
}

export function buildEventsService() {
  return {
    getAllEvents,
    getAllVenues,
    getAllVenues,
    getSingleEvent,
  };
}
