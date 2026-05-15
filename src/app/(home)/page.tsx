import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@agendadearte/sketchbox";

import { buildEventsService, IEvent } from "@/lib/services";
import { MasonryWrapper } from "./components/Masonry";

const PAGE_TITLE = "Eventos";

export const metadata: Metadata = { title: PAGE_TITLE };

export const revalidate = 86400; // invalidate every day

export default async function HomePage() {
  const eventsService = buildEventsService();
  const dates: IEvent[] = await eventsService.getAllEvents();

  return (
    <MasonryWrapper>
      {dates.map((date) => (
        <Link
          key={date.id}
          href={`/evento/${date.id}`}
          style={{ textDecoration: "none" }}
        >
          <Card
            title={date.title}
            author={date.author}
            dates={{
              initialString: date.initialString,
              initialUTF: date.initialUTF,
              finalString: date.finalString,
              finalUTF: date.finalUTF,
            }}
            images={date.images}
          />
        </Link>
      ))}
    </MasonryWrapper>
  );
}
