import { Metadata } from "next";
import { buildEventsService } from "@/lib/services";
import { MapWrapper } from "./components/MapWrapper";
import styles from "./styles.module.scss";

const PAGE_TITLE = "Lugares";

export const metadata: Metadata = { title: PAGE_TITLE };

export default async function VenuesPage() {
  const eventsService = buildEventsService();
  const venues = await eventsService.getAllVenues();

  return (
    <>
      <h1>{PAGE_TITLE}</h1>
      <MapWrapper venues={venues} />
      <ul className={styles.list__container}>
        {venues.map((venue) => (
          <li key={`${venue.id}-details`} className={styles.list__item}>
            <h3 className={styles.list__title}>{venue.name}</h3>
            <div className={styles.list__address}>
              <i
                className={`material-icons-outlined ${styles.icon}`}
                aria-hidden="true"
              >
                place
              </i>
              <address>{venue.address}</address>
            </div>
            <div className={styles.list__web}>
              <i
                className={`material-icons-outlined ${styles.icon}`}
                aria-hidden="true"
              >
                link
              </i>
              <a href={venue.web} target="_blank" rel="noreferrer">
                {venue.web}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
