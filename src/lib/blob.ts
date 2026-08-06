import type { EventRaw, VenueRaw } from "@/types";
import { del, get, list, put } from "@vercel/blob";

export const BLOB_BASE_URL = process.env.BLOB_BASE_URL!;

export const BLOB_PATHS = {
  venues: "venues.json",
  events: "events.json",
  images: "images",
} as const;

type BlobKey = keyof typeof BLOB_PATHS;

function getBlobUrl(key: BlobKey): string {
  return `${BLOB_BASE_URL}/${BLOB_PATHS[key]}`;
}

async function getBlobStream(path: string) {
  const result = await get(path, { access: "public" });

  if (!result) {
    throw new Error(`Blob returned null for path: ${path}`);
  }

  if (result.statusCode !== 200) {
    throw new Error(`Blob not found (status ${result.statusCode}): ${path}`);
  }

  return result.stream;
}

async function getBlobJson<T>(path: string): Promise<T> {
  const stream = await getBlobStream(path);
  const data = await new Response(stream).json();
  return data as T;
}

async function putBlobJson(key: BlobKey, data: unknown): Promise<void> {
  await put(BLOB_PATHS[key], JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function putBlobImage(image: File): Promise<string> {
  await put(`${BLOB_PATHS.images}/${image.name}`, image, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return image.name;
}

async function listBlobNames(prefix: string): Promise<string[]> {
  const { blobs } = await list({ prefix });

  return blobs
    .filter((blob) => !blob.pathname.endsWith("/"))
    .map((blob) => blob.pathname.split("/").at(-1)!);
}

async function deleteBlobFiles(paths: string[]): Promise<void> {
  await del(paths);
}

export const getEventsBlob = () =>
  getBlobJson<EventRaw[]>(getBlobUrl("events"));

export const getVenuesBlob = () =>
  getBlobJson<VenueRaw[]>(getBlobUrl("venues"));

export const putEventsBlob = (events: EventRaw[]) =>
  putBlobJson("events", events);

export const putImagesBlob = (images: File[]) =>
  Promise.all(images.map(putBlobImage));

export const listImagesBlob = () => listBlobNames(BLOB_PATHS.images);

export const deleteImagesBlob = (images: string[]) =>
  deleteBlobFiles(images.map((image) => `${BLOB_PATHS.images}/${image}`));

export const getImageUrl = (image: string) =>
  `${BLOB_BASE_URL}/${BLOB_PATHS.images}/${image}`;
