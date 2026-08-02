"use client";

import { useEffect, useState } from "react";

import type { Events } from "@/types/events";
import type { Venue } from "@/types/venues";
import { updateEventsAction } from "@/app/actions/dashboard";
import { EventRow } from "./EventRow";
import { Footer } from "./Footer";

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
  const [isUpdating, setIsUpdating] = useState(false);

  const isDirty = JSON.stringify(events) !== JSON.stringify(initialEvents);

  const handleRemoveEvent = (id: string) => {
    setEvents((events) => events.filter((event) => event.id !== id));
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEvents(initialEvents);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      await updateEventsAction(events);

      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error(error);
      // TODO: show a toast or error message
    } finally {
      setIsUpdating(false);
    }
  };

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

  useEffect(() => {
    if (!draftLoaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events, draftLoaded]);

  if (!draftLoaded) {
    return <p>Loading draft…</p>;
  }

  return (
    <>
      <section className="dashboard__container">
        <table className="table table-striped">
          <thead className="table__head">
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
      </section>
      <Footer
        isDirty={isDirty}
        isUpdating={isUpdating}
        onReset={handleReset}
        onUpdate={handleUpdate}
      />
    </>
  );
};
