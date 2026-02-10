import { promises as fs } from "fs";
import { eventDates, IEventDates } from "@/lib/adapters";

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
  location: ILocation;
};

export type ILocation = {
  id: string;
  name: string;
  address: string;
  web: string;
  position?: {
    lat: number;
    lng: number;
  };
};

const eventsStore: IEvent[] = [];
const locationsStore: ILocation[] = [];

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

type LocationsResponse = {
  id: string;
  name: string;
  address: string;
  web: string;
  position?: {
    latitude?: number;
    longitude?: number;
  };
}[];

async function getAllLocations(): Promise<ILocation[]> {
  if (locationsStore.length) return locationsStore;

  const path = process.cwd() + "/src/data/locations.json";
  const file = await fs.readFile(path, "utf8");
  const locations: LocationsResponse = JSON.parse(file);

  locations.forEach((loc) => {
    const { position, ...props } = loc;
    const location: ILocation = props;
    if (position?.latitude && position?.longitude)
      location.position = {
        lat: position.latitude,
        lng: position.longitude,
      };
    locationsStore.push(location);
  });
  return locationsStore;
}

async function getSingleEvent(id: string): Promise<ISingleEvent | null> {
  await getAllEvents();
  await getAllLocations();

  const event = eventsStore.find((event) => event.id === id);
  if (!event) return null;

  const location = locationsStore.find((loc) => loc.id === event.location);
  if (!location) return null;

  return { ...event, location };
}

export function buildEventsService() {
  return {
    getAllEvents,
    getAllLocations,
    getSingleEvent,
  };
}
