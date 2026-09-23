import { createFileRoute } from "@tanstack/react-router";
import { Card, CardTitle, Chip, PopButton, SectionNote, Stat } from "@/components/sim/ui";
import { SimMap } from "@/components/sim/SimMap";
import { activePickup, runPickupSimulation } from "@/lib/simulation/engine";
import { useSim } from "@/lib/simulation/react";
import { kg } from "@/lib/simulation/format";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Simulated Agents — EcoCycle" },
      {
        name: "description",
        content: "Fictional collection agents with simulated GPS movement, distance and ETA on a demo grid map.",
      },
      { property: "og:title", content: "Simulated Agents — EcoCycle" },
      { property: "og:description", content: "Track fictional EcoCycle agents moving across a simulated map." },
    ],
  }),
  component: AgentsPage,
});

function AgentsPage() {
  const s = useSim();
  const pickup = activePickup(s);
  const totalKg = s.agents.reduce((t, a) => t + a.collectedKg, 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl font-bold">Simulated Agents</h1>
        <SectionNote>Agent positions, distance and ETA are simulated values — no real GPS is used.</SectionNote>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Simulated Agents" value={s.agents.length} />
        <Stat label="Active Simulations" value={s.agents.filter((a) => a.status !== "IDLE").length} />
        <Stat label="Completed Simulations" value={s.agents.reduce((t, a) => t + a.completed, 0)} />
        <Stat label="Simulated Weight Collected" value={kg(totalKg)} tone="text-leaf" />
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SimMap compact />
        </div>
        <Card className="lg:col-span-6">
          <CardTitle title="Agent Roster" badge={<Chip tone="sky">Simulated GPS</Chip>} />
          <div className="space-y-3">
            {s.agents.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                <div className="grid size-11 place-items-center rounded-xl bg-coral text-lg text-coral-foreground">
                  🚚
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {a.completed} simulated pickups · {kg(a.collectedKg)}
                  </div>
                </div>
                <Chip tone={a.status === "IDLE" ? "cream" : "sun"}>{a.status}</Chip>
              </div>
            ))}
          </div>
          {pickup ? (
            <PopButton className="mt-4 w-full" tone="ink" onClick={() => runPickupSimulation(pickup.id)}>
              ▶ Start Simulation for {pickup.id}
            </PopButton>
          ) : null}
        </Card>
      </section>
    </div>
  );
}
