import parse from "html-react-parser";

import { buildEventsService } from "@/lib/services";
import styles from "./event.module.scss";

type EventProps = {
  params: Promise<{ id: string }>;
};

export default async function EventPage({ params }: EventProps) {
  const { id } = await params;
  const eventsService = buildEventsService();
  const event = await eventsService.getSingleEvent(id);

  if (!event) throw new Error("Page not found");

  return (
    <>
      <title>{`Agenda de Arte - ${event.author}`}</title>
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
                  {event.location.name}
                  <br />
                  <small>{event.location.address}</small>
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
                  <time dateTime={event.initialUTF}>
                    {event.initialString}.
                  </time>{" "}
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
                <a href={event.location.web} target="_blank" rel="noreferrer">
                  {event.location.web}
                </a>
              </li>
            </ul>
            <article>{parse(event.description)}</article>
          </section>
        </div>
      </article>
    </>
  );
}
