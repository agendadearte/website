"use client";

import { useState } from "react";
import type { Events } from "@/types/events";
import type { Venue } from "@/types/venues";

type DashboardProps = {
  initialEvents: Events;
  today: string;
  venuesById: Map<string, Venue>;
};

export const Dashboard = ({
  initialEvents,
  today,
  venuesById,
}: DashboardProps) => {
  const [events] = useState(initialEvents);

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">End</th>
          <th scope="col">Venue</th>
          <th scope="col">Images</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => {
          const isOutdated = event.finalDate < today;
          const venue = venuesById.get(event.venueId);

          return (
            <tr key={event.id} className={isOutdated ? "table-danger" : ""}>
              <td>{event.title}</td>
              <td>{event.finalDate}</td>
              <td>
                <a href={venue?.web} target="_blank" rel="noopener noreferrer">
                  {venue?.name}
                </a>
              </td>
              <td>{event.images}</td>
              <td className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    isOutdated ? "btn-danger" : "btn-outline-secondary"
                  }`}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
