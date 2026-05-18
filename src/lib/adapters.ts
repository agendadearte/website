import type { Venue, VenueRaw } from "@/types";

export type IEventDates = {
  initialString: string;
  initialUTF: string;
  finalString: string;
  finalUTF: string;
};

const parseDate = (date: number, options?: object) =>
  new Date(date * 1000).toLocaleDateString("es-ES", options).replace(".", "");

const localeToString = (date: number) =>
  parseDate(date, { month: "short", day: "numeric" });

const localeToUTF = (date: number) => parseDate(date);

export const eventDates = (
  initialDate: number,
  finalDate: number,
): IEventDates => ({
  initialString: localeToString(initialDate),
  initialUTF: localeToUTF(initialDate),
  finalString: localeToString(finalDate),
  finalUTF: localeToUTF(finalDate),
});

export function normalizeLocation(loc: VenueRaw): Venue {
  const { position, ...props } = loc;

  return {
    ...props,
    ...(position?.lat != null && position?.lng != null
      ? {
          position: {
            lat: position.lat,
            lng: position.lng,
          },
        }
      : {}),
  } satisfies Venue;
}
