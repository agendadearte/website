import { Venue } from "@/types/venues";

export interface EventRaw {
  id: string;
  title: string;
  author: string;
  initialDate: string;
  finalDate: string;
  images: string[];
  description: string;
  venueId: string;
}

export interface EventFormattedDates {
  initialString: string;
  finalString: string;
}

export type Event = EventRaw & EventFormattedDates;

export type Events = Event[];

export type EventDetails = Omit<Event, "venueId"> & {
  venue: Venue;
};
