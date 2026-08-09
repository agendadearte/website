import type { Event } from "@/types";
import type { Venue } from "@/types";

type EventRowProps = {
  event: Event;
  isOutdated: boolean;
  venue?: Venue;
  onEditEvent(id: string): void;
  onRemove(id: string): void;
};

export const EventRow = ({
  event,
  isOutdated,
  venue,
  onEditEvent,
  onRemove,
}: EventRowProps) => (
  <tr className={isOutdated ? "table-danger" : ""}>
    <td>{event.title}</td>
    <td>{event.finalDate}</td>
    <td>
      {venue && (
        <a href={venue.web} target="_blank" rel="noopener noreferrer">
          {venue.name}
        </a>
      )}
    </td>
    <td>{event.images}</td>
    <td className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={() => onEditEvent(event.id)}
      >
        Edit
      </button>
      <button
        type="button"
        className={`btn btn-sm ${isOutdated ? "btn-danger" : "btn-outline-secondary"}`}
        onClick={() => onRemove(event.id)}
      >
        Remove
      </button>
    </td>
  </tr>
);
