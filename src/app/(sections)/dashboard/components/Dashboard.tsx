"use client";

import { useEffect, useState } from "react";
import type { Events } from "@/types/events";
import type { Venue } from "@/types/venues";
import { EventRow } from "./EventRow";

type DashboardProps = {
  initialEvents: Events;
  today: string;
  venuesById: Map<string, Venue>;
};

const STORAGE_KEY = "agenda-de-arte.events.draft";

export const Dashboard = ({
  initialEvents,
  today,
  venuesById,
}: DashboardProps) => {
  const [events] = useState<Events>(() => {
    if (typeof window === "undefined") {
      return initialEvents;
    }

    const storedDraft = localStorage.getItem(STORAGE_KEY);

    return storedDraft ? JSON.parse(storedDraft) : initialEvents;
  });

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
            <EventRow
              key={event.id}
              event={event}
              isOutdated={isOutdated}
              venue={venue}
            />
          );
        })}
      </tbody>
    </table>
  );
};
