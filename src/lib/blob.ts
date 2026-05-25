import { get } from "@vercel/blob";
import type { EventRaw, VenueRaw } from "@/types";

const BLOB_PATHS = {
  venues: process.env.BLOB_VENUES_URL,
  events: process.env.BLOB_EVENTS_URL,
} as const;

type BlobKey = keyof typeof BLOB_PATHS;

function getBlobPath(key: BlobKey): string {
  const value = BLOB_PATHS[key];

  if (!value) {
    throw new Error(`Missing environment variable for ${key}`);
  }

  return value;
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

export async function getVenuesBlob(): Promise<VenueRaw[]> {
  return getBlobJson<VenueRaw[]>(getBlobPath("venues"));
}

export async function getEventsBlob(): Promise<EventRaw[]> {
  return getBlobJson<EventRaw[]>(getBlobPath("events"));
}
