import { Event, EventRaw } from "@/types/events";

const parseDate = (date: number, options?: object) =>
  new Date(date * 1000).toLocaleDateString("es-ES", options).replace(".", "");

const localeToString = (date: number) =>
  parseDate(date, { month: "short", day: "numeric" });

const localeToUTF = (date: number) => parseDate(date);

export function normalizeEvent(event: EventRaw): Event {
  const { initialDate, finalDate, ...restProps } = event;
  return {
    ...restProps,
    initialString: localeToString(event.initialDate),
    initialUTF: localeToUTF(event.initialDate),
    finalString: localeToString(event.finalDate),
    finalUTF: localeToUTF(event.finalDate),
  };
}
