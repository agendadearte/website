import { get, put } from "@vercel/blob";
import type { EventRaw, VenueRaw } from "@/types";

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

async function putBlobJson(key: BlobKey, data: unknown) {
  await put(BLOB_PATHS[key], JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function getBlobJson<T>(path: string): Promise<T> {
  const stream = await getBlobStream(path);
  const data = await new Response(stream).json();
  return data as T;
}

export const getEventsBlob = () =>
  getBlobJson<EventRaw[]>(getBlobUrl("events"));

export const getVenuesBlob = () =>
  getBlobJson<VenueRaw[]>(getBlobUrl("venues"));

export const putEventsBlob = (events: EventRaw[]) =>
  putBlobJson("events", events);
