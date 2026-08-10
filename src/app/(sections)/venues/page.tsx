import { Metadata } from "next";
import { buildEventsService } from "@/lib/services";
import { MapWrapper } from "./components/MapWrapper";

import "./styles.scss";

const PAGE_TITLE = "Lugares";

export const metadata: Metadata = { title: PAGE_TITLE };

export default async function VenuesPage() {
  const eventsService = buildEventsService();
  const venues = await eventsService.getAllVenues();

  return (
    <article className="page-content">
      <header className="page-header">
        <h1 className="page-title">{PAGE_TITLE}</h1>
      </header>

      <MapWrapper venues={venues} />
      <ul className="venues-list__container">
        {venues.map((venue) => (
          <li key={`${venue.id}-details`} className="venues-list__item">
            <h3 className="venues-list__title">{venue.name}</h3>
            <div className="venues-list__address">
              <i
                className="material-icons-outlined venues-list__icon"
                aria-hidden="true"
              >
                place
              </i>
              <address>{venue.address}</address>
            </div>
            <div className="venues-list__web">
              <i
                className="material-icons-outlined venues-list__icon"
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
    </article>
  );
}
