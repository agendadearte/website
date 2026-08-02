import type { Metadata } from "next";
import { notFound } from "next/navigation";
import parse from "html-react-parser";

import { buildEventsService } from "@/lib/services";
import { getImageUrl } from "@/lib/adapters";

import "./styles.scss";

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
    <article className="page-content">
      <header className="event__header">
        <h1 className="event__author">{event.author}</h1>
        <h2 className="event__title">{event.title}</h2>
      </header>
      <div className="event__container">
        <aside className="event__aside">
          {event.images.length && (
            <img // eslint-disable-line @next/next/no-img-element
              src={getImageUrl(event.images[0])}
              alt={`${event.author} - ${event.title}`}
            />
          )}
        </aside>
        <section className="event__section">
          <ul className="event__places">
            <li>
              <i
                className="material-icons-outlined event__icon "
                aria-hidden="true"
              >
                place
              </i>
              <address className="event__address">
                {event.venue.name}
                <br />
                <small>{event.venue.address}</small>
              </address>
            </li>
            <li>
              <i
                className="material-icons-outlined event__icon"
                aria-hidden="true"
              >
                calendar_today
              </i>
              <span>
                Del{" "}
                <time dateTime={event.initialDate}>{event.initialString}.</time>{" "}
                al <time dateTime={event.finalDate}>{event.finalString}.</time>
              </span>
            </li>
            <li>
              <i
                className="material-icons-outlined event__icon"
                aria-hidden="true"
              >
                link
              </i>
              <a href={event.venue.web} target="_blank" rel="noreferrer">
                {event.venue.web}
              </a>
            </li>
          </ul>
          <article className="event__description">
            {parse(event.description)}
          </article>
        </section>
      </div>
    </article>
  );
}
