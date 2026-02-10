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
