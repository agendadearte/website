"use client";

import { useEffect, useMemo, useState } from "react";

import type { EventRaw, Events } from "@/types/events";
import type { Venues } from "@/types/venues";
import { updateEventsAction } from "@/app/actions/dashboard";
import { normalizeEvent, sortEvents } from "@/lib/adapters";
import { EventRow } from "./EventRow";
import { Footer } from "./Footer";
import { EventModal } from "./EventModal";

type DashboardProps = {
  initialEvents: Events;
  today: string;
  venues: Venues;
};

const STORAGE_KEY = "agenda-de-arte.events.draft";

export const Dashboard = ({ initialEvents, today, venues }: DashboardProps) => {
  const [events, setEvents] = useState(initialEvents);
  const [images, setImages] = useState<File[]>([]);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRaw | undefined>(
    undefined,
  );

  const isDirty =
    images.length > 0 ||
    JSON.stringify(events) !== JSON.stringify(initialEvents);

  const venuesById = useMemo(
    () => new Map(venues.map((venue) => [venue.id, venue])),
    [venues],
  );

  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setEditOpen(true);
  };

  const handleEditEvent = (id: string) => {
    const event = events.find((e) => e.id === id);
    if (!event) return;

    setEditingEvent(event);
    setEditOpen(true);
  };

  const handleSaveEvent = (newEvent: EventRaw, newImages: File[]) => {
    setImages((prevImages) => {
      const imagesByName = new Map(
        prevImages.map((image) => [image.name, image]),
      );

      newImages.forEach((image) => {
        imagesByName.set(image.name, image);
      });

      return [...imagesByName.values()];
    });

    const normalizedEvent = normalizeEvent(newEvent);

    setEvents((prevEvents) => {
      const eventExists = prevEvents.some((event) => event.id === newEvent.id);

      const updatedEvents = eventExists
        ? prevEvents.map((event) =>
            event.id === newEvent.id ? normalizedEvent : event,
          )
        : [...prevEvents, normalizedEvent];

      return sortEvents(updatedEvents);
    });
  };

  const handleRemoveEvent = (id: string) => {
    const event = events.find((e) => e.id === id);
    if (!event) return;

    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id));

    setImages((prevImages) =>
      prevImages.filter((image) => !event.images.includes(image.name)),
    );
  };

  const handleCloseEdit = () => {
    setEditingEvent(undefined);
    setEditOpen(false);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEvents(initialEvents);
    setImages([]);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      await updateEventsAction(events, images);

      localStorage.removeItem(STORAGE_KEY);
      setImages([]);
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
                  onEditEvent={handleEditEvent}
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
        onAddEvent={handleCreateEvent}
        onReset={handleReset}
        onUpdate={handleUpdate}
      />
      {isEditOpen && (
        <EventModal
          event={editingEvent}
          onClose={handleCloseEdit}
          onSave={handleSaveEvent}
          venues={venues}
        />
      )}
    </>
  );
};
