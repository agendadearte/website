import type { Metadata } from "next";
import { notFound } from "next/navigation";
import parse from "html-react-parser";

import { buildEventsService } from "@/lib/services";
import styles from "./event.module.scss";

type EventProps = {
  params: Promise<{ id: string }>;
};

function cleanDescription(html: string, maxLength = 160) {
  const text = html
    .replace(/<[^>]*>/g, " ") // remove HTML tags
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > maxLength
    ? text.slice(0, maxLength).trim() + "..."
    : text;
}

async function getEvent(id: string) {
  const eventsService = buildEventsService();
  const event = await eventsService.getEventDetails(id);

  if (!event) {
    notFound();
  }

  return event;
}

export async function generateMetadata({
  params,
}: EventProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  const title = `${event.author} - ${event.title}`;
  const description = cleanDescription(event.description);
  const openGraph = {
    title,
    description,
    images: event.images?.[0],
    url: `/event/${id}`,
    siteName: "Agenda de Arte",
    type: "article",
  };

  return { title, description, openGraph };
}

export default async function EventPage({ params }: EventProps) {
  const { id } = await params;
  const event = await getEvent(id);

  return (
    <article>
      <header className={styles.header}>
        <h1 className={styles.author}>{event.author}</h1>
        <h2 className={styles.title}>{event.title}</h2>
      </header>
      <div className={styles.container}>
        <aside className={styles.aside}>
          {event.images.length && (
            <img // eslint-disable-line @next/next/no-img-element
              src={event.images[0]}
              alt={`${event.author} - ${event.title}`}
            />
          )}
        </aside>
        <section className={styles.section}>
          <ul className={styles.places}>
            <li>
              <i
                className={`${styles.icon} material-icons-outlined`}
                aria-hidden="true"
              >
                place
              </i>
              <address className={styles.address}>
                {event.venue.name}
                <br />
                <small>{event.venue.address}</small>
              </address>
            </li>
            <li>
              <i
                className={`${styles.icon} material-icons-outlined`}
                aria-hidden="true"
              >
                calendar_today
              </i>
              <span>
                Del{" "}
                <time dateTime={event.initialUTF}>{event.initialString}.</time>{" "}
                al <time dateTime={event.finalUTF}>{event.finalString}.</time>
              </span>
            </li>
            <li>
              <i
                className={`${styles.icon} material-icons-outlined`}
                aria-hidden="true"
              >
                link
              </i>
              <a href={event.venue.web} target="_blank" rel="noreferrer">
                {event.venue.web}
              </a>
            </li>
          </ul>
          <article>{parse(event.description)}</article>
        </section>
      </div>
    </article>
  );
}
