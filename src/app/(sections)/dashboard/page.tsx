import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buildEventsService } from "@/lib/services";
import { todayInMadrid } from "@/lib/dates";
import { Dashboard, LogOut } from "./components";

const PAGE_TITLE = "Panel de control";

export const metadata: Metadata = { title: PAGE_TITLE };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const eventsService = buildEventsService();

  const events = await eventsService.getAllEvents();
  const venues = await eventsService.getAllVenues();

  const today = todayInMadrid();
  const venuesById = new Map(venues.map((venue) => [venue.id, venue]));

  return (
    <article>
      <header className="d-flex justify-content-between align-items-center">
        <h1>{PAGE_TITLE}</h1>
        <div className="d-flex gap-3 align-items-center">
          <p className="mb-0">Loged user: {session.user?.name}</p>
          <LogOut />
        </div>
      </header>
      <section>
        <Dashboard
          initialEvents={events}
          today={today}
          venuesById={venuesById}
        />
      </section>
    </article>
  );
}
