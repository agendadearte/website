import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buildEventsService } from "@/lib/services";
import { todayInMadrid } from "@/lib/dates";
import { LogOut } from "./components/LogOut";

const PAGE_TITLE = "Panel de control";

export const metadata: Metadata = { title: PAGE_TITLE };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const eventsService = buildEventsService();

  const events = await eventsService.getAllEvents();
  const venues = await eventsService.getAllVenues();

  const venuesById = new Map(venues.map((venue) => [venue.id, venue]));
  const today = todayInMadrid();

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
        <table className="table table-striped">
          <thead>
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
                <tr key={event.id} className={isOutdated ? "table-danger" : ""}>
                  <td>{event.title}</td>
                  <td>{event.finalDate}</td>
                  <td>
                    <a href={venue?.web} target="_blank">
                      {venue?.name}
                    </a>
                  </td>
                  <td>{event.images}</td>
                  <td className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        isOutdated ? "btn-danger" : "btn-outline-secondary"
                      }`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </article>
  );
}
