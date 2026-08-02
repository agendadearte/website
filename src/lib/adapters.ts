import { Event, EventRaw } from "@/types/events";
import { BLOB_BASE_URL, BLOB_PATHS } from "./blob";

const formatDate = (date: string, options?: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T00:00:00`)
    .toLocaleDateString("es-ES", options)
    .replace(".", "");

export const getImageUrl = (image: string) =>
  `${BLOB_BASE_URL}/${BLOB_PATHS.images}/${image}`;

const localeToString = (date: string) =>
  formatDate(date, { month: "short", day: "numeric" });

export const normalizeEvent = (event: EventRaw): Event => ({
  ...event,
  initialString: localeToString(event.initialDate),
  finalString: localeToString(event.finalDate),
});
