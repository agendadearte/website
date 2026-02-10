import { buildEventsService, ILocation } from "@/lib/services";
import { MapWrapper } from "./components/MapWrapper";
import styles from "./places.module.scss";

export default async function PlacesPage() {
  const eventsService = buildEventsService();
  const locations: ILocation[] = await eventsService.getAllLocations();

  return (
    <>
      <title>Agenda de Arte - Lugares</title>
      <h1>Lugares</h1>
      <MapWrapper locations={locations} />
      <ul className={styles.list__container}>
        {locations.map((location) => (
          <li key={`${location.id}-details`} className={styles.list__item}>
            <h3 className={styles.list__title}>{location.name}</h3>
            <div className={styles.list__address}>
              <i
                className={`material-icons-outlined ${styles.icon}`}
                aria-hidden="true"
              >
                place
              </i>
              <address>{location.address}</address>
            </div>
            <div className={styles.list__web}>
              <i
                className={`material-icons-outlined ${styles.icon}`}
                aria-hidden="true"
              >
                link
              </i>
              <a href={location.web} target="_blank" rel="noreferrer">
                {location.web}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
