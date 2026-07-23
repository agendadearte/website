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
  const [events, setEvents] = useState(initialEvents);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const handleRemoveEvent = (id: string) => {
    setEvents((events) => events.filter((event) => event.id !== id));
  };

  useEffect(() => {
    if (!draftLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events, draftLoaded]);

  useEffect(() => {
    try {
      const draftSaved = localStorage.getItem(STORAGE_KEY);

      if (!draftSaved) {
        setEvents(initialEvents);
        return;
      }

      const draft = JSON.parse(draftSaved);

      if (!Array.isArray(draft)) {
        localStorage.removeItem(STORAGE_KEY);
        setEvents(initialEvents);
        return;
      }

      setEvents(draft);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setEvents(initialEvents);
    } finally {
      setDraftLoaded(true);
    }
  }, [initialEvents]);

  if (!draftLoaded) {
    return <p>Loading draft…</p>;
  }

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
              onRemove={handleRemoveEvent}
            />
          );
        })}
      </tbody>
    </table>
  );
};
