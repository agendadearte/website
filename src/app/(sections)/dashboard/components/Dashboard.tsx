"use client";

import { useEffect, useMemo, useState } from "react";

import type { EventRaw, Events } from "@/types/events";
import type { Venues } from "@/types/venues";
import { updateEventsAction } from "@/app/actions/dashboard";
import { normalizeEvent, sortEvents } from "@/lib/adapters";
import { EventRow } from "./EventRow";
import { Footer } from "./Footer";
import { NewEventModal } from "./NewEventModal";

type DashboardProps = {
  initialEvents: Events;
  today: string;
  venues: Venues;
};

const STORAGE_KEY = "agenda-de-arte.events.draft";

export const Dashboard = ({ initialEvents, today, venues }: DashboardProps) => {
  const [events, setEvents] = useState(initialEvents);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isNewEventOpen, setNewEventOpen] = useState(false);

  const isDirty = JSON.stringify(events) !== JSON.stringify(initialEvents);

  const venuesById = useMemo(
    () => new Map(venues.map((venue) => [venue.id, venue])),
    [venues],
  );

  const handleCreateEvent = (event: EventRaw) => {
    setEvents((events) => sortEvents([...events, normalizeEvent(event)]));
  };

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
      const savedDraft = localStorage.getItem(STORAGE_KEY);

      if (!savedDraft) return;

      const draft = JSON.parse(savedDraft);

      if (!Array.isArray(draft)) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      setEvents(draft);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
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
        onAddEvent={() => setNewEventOpen(true)}
        onReset={handleReset}
        onUpdate={handleUpdate}
      />
      {isNewEventOpen && (
        <NewEventModal
          onClose={() => setNewEventOpen(false)}
          onCreate={handleCreateEvent}
          venues={venues}
        />
      )}
    </>
  );
};
