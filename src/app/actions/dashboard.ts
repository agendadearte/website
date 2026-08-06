"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import type { Events } from "@/types";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buildEventsService } from "@/lib/services";

export async function updateEventsAction(events: Events, images: File[]) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const service = buildEventsService();

  await service.updateEvents(events, images);

  revalidatePath("/dashboard");
}
