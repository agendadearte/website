import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@agendadearte/sketchbox";

import { buildEventsService } from "@/lib/services";
import { MasonryWrapper } from "./components/Masonry";

const PAGE_TITLE = "Eventos";

export const metadata: Metadata = { title: PAGE_TITLE };

export const revalidate = 3600; // every hour

export default async function HomePage() {
  const eventsService = buildEventsService();
  const events = await eventsService.getActiveEvents();

  return (
    <MasonryWrapper>
      {events.map((event) => (
        <Link
          key={event.id}
          href={`/evento/${event.id}`}
          style={{ textDecoration: "none" }}
        >
          <Card
            title={event.title}
            author={event.author}
            dates={{
              initialString: event.initialString,
              initialUTF: event.initialDate,
              finalString: event.finalString,
              finalUTF: event.finalDate,
            }}
            images={event.images}
          />
        </Link>
      ))}
    </MasonryWrapper>
  );
}
