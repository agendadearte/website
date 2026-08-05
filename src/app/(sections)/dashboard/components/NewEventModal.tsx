import { useState } from "react";

import type { EventRaw, Venues } from "@/types";
import { todayInMadrid } from "@/lib/dates";
import { formatEventId } from "@/lib/adapters";
import { TextInput } from "./TextInput";
import { SelectInput } from "./SelectInput";
import { DateInput } from "./DateInput";
import { TextArea } from "./TextArea";

type NewEventModalProps = {
  onClose: () => void;
  onCreate: (event: EventRaw) => void;
  venues: Venues;
};

export const NewEventModal = ({
  onClose,
  onCreate,
  venues,
}: NewEventModalProps) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [venueId, setVenueId] = useState("");
  const [description, setDescription] = useState("");
  const [initialDate, setInitialDate] = useState(todayInMadrid());
  const [finalDate, setFinalDate] = useState(todayInMadrid());

  const newEvent: EventRaw = {
    id: formatEventId(title),
    title,
    author,
    initialDate,
    finalDate,
    images: [],
    description,
    venueId,
  };

  const formIsValid = [
    title,
    author,
    initialDate,
    finalDate,
    description,
    venueId,
  ].every(Boolean);

  const handleCreate = () => {
    if (!formIsValid) return;

    onCreate(newEvent);
    onClose();
  };

  return (
    <>
      <div
        className="modal fade show"
        id="newEventModal"
        tabIndex={-1}
        aria-labelledby="newEventModalLabel"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 id="newEventModalLabel" className="modal-title">
                New event
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              <TextInput
                name="author"
                placeholder="Author"
                label="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              <TextInput
                name="title"
                placeholder="Title"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextArea
                name="description"
                label="Description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                value={description}
              />
              <SelectInput
                name="venue"
                label="Venue"
                onChange={(e) => setVenueId(e.target.value)}
                options={venues}
                placeholder="Venue"
                value={venueId}
              />
              <div className="row">
                <div className="col">
                  <DateInput
                    name="initialDate"
                    label="Starts"
                    onChange={(e) => setInitialDate(e.target.value)}
                    placeholder="Starts"
                    value={initialDate}
                  />
                </div>
                <div className="col">
                  <DateInput
                    name="finalDate"
                    label="Ends"
                    onChange={(e) => setFinalDate(e.target.value)}
                    placeholder="Ends"
                    value={finalDate}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!formIsValid}
                onClick={handleCreate}
              >
                Create event
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};
