import { Event, EventRaw } from "@/types/events";

const replacementRules = {
  "": '"|’|[.]|:|,|[(]|[)]|[[]|]|¡|!|¿|[?]|#|=',
  "-": " |/|'",
  a: "á|à|ã|â",
  e: "é|è|ê",
  i: "í|ì|î",
  o: "ó|ò|ô|õ",
  u: "ú|ù|û|ü",
  c: "ç",
  n: "ñ",
};

export const formatEventId = (text: string) => {
  let value = text.trim().toLowerCase();

  value = Object.keys(replacementRules).reduce(
    (acc, cur) =>
      acc.replace(
        new RegExp(replacementRules[cur as keyof typeof replacementRules], "g"),
        cur,
      ),
    value,
  );

  value = value.replace(/--+/g, "-");

  return value;
};

const formatSpanishDate = (
  date: string,
  options?: Intl.DateTimeFormatOptions,
) =>
  new Date(`${date}T00:00:00`)
    .toLocaleDateString("es-ES", options)
    .replace(".", "");

const formatShortSpanishDate = (date: string) =>
  formatSpanishDate(date, { month: "short", day: "numeric" });

export const normalizeEvent = (event: EventRaw): Event => ({
  ...event,
  initialString: formatShortSpanishDate(event.initialDate),
  finalString: formatShortSpanishDate(event.finalDate),
});

export const sortEvents = <T extends { finalDate: string }>(events: T[]): T[] =>
  events.sort((a, b) => a.finalDate.localeCompare(b.finalDate));
