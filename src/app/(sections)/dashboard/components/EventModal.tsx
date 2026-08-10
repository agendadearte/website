import { useEffect, useMemo, useState } from "react";

import type { EventRaw, Venues } from "@/types";
import { todayInMadrid } from "@/lib/dates";
import { formatEventId } from "@/lib/adapters";
import { resizeImage } from "@/lib/images";
import { TextInput } from "./TextInput";
import { SelectInput } from "./SelectInput";
import { DateInput } from "./DateInput";
import { TextArea } from "./TextArea";
import { ImageInput } from "./ImageInput";
import { getImageUrl } from "@/lib/blob";

type EventModalProps = {
  event?: EventRaw;
  venues: Venues;
  onClose: () => void;
  onSave: (event: EventRaw, images: File[]) => void;
};

export const EventModal = ({
  event,
  venues,
  onClose,
  onSave,
}: EventModalProps) => {
  const [title, setTitle] = useState(event?.title ?? "");
  const [author, setAuthor] = useState(event?.author ?? "");
  const [venueId, setVenueId] = useState(event?.venueId ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [initialDate, setInitialDate] = useState(
    event?.initialDate ?? todayInMadrid(),
  );
  const [finalDate, setFinalDate] = useState(
    event?.finalDate ?? todayInMadrid(),
  );
  const [currentImages, setCurrentImages] = useState(event?.images ?? []);
  const [newImages, setNewImages] = useState<File[]>([]);

  const imagesNames = useMemo(
    () => [
      ...new Set([...currentImages, ...newImages.map((image) => image.name)]),
    ],
    [currentImages, newImages],
  );

  const formIsValid = [
    title,
    author,
    initialDate,
    finalDate,
    imagesNames.length > 0,
    description,
    venueId,
  ].every(Boolean);

  const handleIncludeImages = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    const resized = await Promise.all(files.map(resizeImage));

    setNewImages((prevImages) => {
      const existingNames = new Set(prevImages.map((image) => image.name));

      return [
        ...prevImages,
        ...resized.filter((image) => !existingNames.has(image.name)),
      ];
    });

    e.target.value = "";
  };

  const handleRemoveImage = (imageName: string) => {
    setCurrentImages((images) => images.filter((image) => image !== imageName));
    setNewImages((images) => images.filter((file) => file.name !== imageName));
  };

  const handleSave = () => {
    if (!formIsValid) return;

    const newEvent: EventRaw = {
      id: event?.id ?? formatEventId(title),
      title,
      author,
      initialDate,
      finalDate,
      images: imagesNames,
      description,
      venueId,
    };

    onSave(newEvent, newImages);
    onClose();
  };

  const previews = useMemo(
    () => [
      ...currentImages.map((name) => ({
        name,
        url: getImageUrl(name),
        isObjectUrl: false,
      })),
      ...newImages.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        isObjectUrl: true,
      })),
    ],
    [currentImages, newImages],
  );

  useEffect(() => {
    return () => {
      previews.forEach(({ url, isObjectUrl }) => {
        if (isObjectUrl) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

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
              <ImageInput
                name="images"
                label="Images"
                onChange={handleIncludeImages}
                placeholder="Images"
                value=""
              />
              <div className="row g-3 mt-1">
                {previews.map(({ name, url }) => (
                  <div key={name} className="col-4 col-md-3 position-relative">
                    <button
                      type="button"
                      className="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-1"
                      aria-label="Close"
                      onClick={() => handleRemoveImage(name)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <img
                      src={url}
                      alt={name}
                      className="img-thumbnail w-100"
                      style={{
                        aspectRatio: "1",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
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
                onClick={handleSave}
              >
                {event ? "Save changes" : "Create event"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};
