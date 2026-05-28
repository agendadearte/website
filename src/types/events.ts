import { Venue } from "@/types/venues";

export interface EventRaw {
  id: string;
  title: string;
  author: string;
  initialDate: number;
  finalDate: number;
  images: string[];
  description: string;
  venueId: string;
}

export interface EventDates {
  initialString: string;
  initialUTF: string;
  finalString: string;
  finalUTF: string;
}

export type Event = EventRaw & EventDates;

export type Events = Event[];

export type EventDetails = Omit<Event, "venueId"> & {
  venue: Venue;
};
