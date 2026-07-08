import { Event, EventRaw } from "@/types/events";

const formatDate = (date: string, options?: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T00:00:00`)
    .toLocaleDateString("es-ES", options)
    .replace(".", "");

const localeToString = (date: string) =>
  formatDate(date, { month: "short", day: "numeric" });

const toImageUrl = (image: string) => `/images/${image}`;

export const normalizeEvent = (event: EventRaw): Event => ({
  ...event,
  initialString: localeToString(event.initialDate),
  finalString: localeToString(event.finalDate),
  images: event.images.map(toImageUrl),
});
