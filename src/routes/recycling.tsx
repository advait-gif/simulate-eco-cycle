import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardTitle, Chip, PopButton, SectionNote, Stat } from "@/components/sim/ui";
import { generateCertificateFor, runRecycling, totals } from "@/lib/simulation/engine";
import { useSim } from "@/lib/simulation/react";
import { kg, simDate } from "@/lib/simulation/format";

export const Route = createFileRoute("/recycling")({
  head: () => ({
    meta: [
      { title: "Simulated Recycling Batches — EcoCycle" },
      {
        name: "description",
        content:
          "Simulated recycling batches, demo recovered materials and estimated environmental impact from the EcoCycle simulator.",
      },
      { property: "og:title", content: "Simulated Recycling Batches — EcoCycle" },
      {
        property: "og:description",
        content: "Run demo recycling batches and view simulated material recovery and estimated CO₂e.",
      },
    ],
  }),
  component: RecyclingPage,
});

const STAGES = ["Collected", "Sorted", "Processed", "Materials Recovered", "Residual Disposed"];

function RecyclingPage() {
  const s = useSim();
  const t = totals(s);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl font-bold">Simulated Recycling</h1>
        <SectionNote>
          Recycling factors are simulation parameters only — they are not verified real-world recovery rates.
        </SectionNote>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Simulated Batches" value={t.batches} />
        <Stat label="Simulated Recycled" value={kg(t.recycledKg)} tone="text-leaf" />
        <Stat label="Simulated Recovery Rate" value={`${t.recoveryPct}%`} />
        <Stat label="Estimated CO₂e Avoided" value={`${t.co2eKg} kg`} sub="Estimate only" tone="text-sky-foreground" />
      </section>

      <Card>
        <CardTitle title="Simulated Recycling Pipeline" badge={<Chip tone="sun">Simulated</Chip>} />
        <div className="flex flex-wrap items-center gap-2">
          {STAGES.map((st, i) => (
            <div key={st} className="flex items-center gap-2">
              <span className="rounded-2xl bg-cream px-3 py-2 text-xs font-semibold">{st}</span>
              {i < STAGES.length - 1 ? <span className="text-muted-foreground">→</span> : null}
            </div>
          ))}
        </div>
      </Card>

      <section className="space-y-4">
        {s.batches.length === 0 ? (
          <Card>
            <SectionNote>No simulated batches yet — launch the demo or create a batch from a center.</SectionNote>
          </Card>
        ) : null}
        {s.batches.slice(0, 12).map((b) => {
          const recycler = s.recyclers.find((r) => r.id === b.recyclerId);
          const center = s.centers.find((c) => c.id === b.centerId);
          return (
            <Card key={b.id}>
              <CardTitle
                title={b.id}
                badge={<Chip tone={b.status === "COMPLETED" ? "lime" : "sun"}>{b.status}</Chip>}
              />
              <div className="grid gap-4 md:grid-cols-12">
                <div className="space-y-1 text-sm md:col-span-4">
                  <div className="text-muted-foreground text-xs">
                    {center?.name} → {recycler?.name}
                  </div>
                  <div className="font-mono text-xs">Input (simulated): {kg(b.inputKg)}</div>
                  <div className="font-mono text-xs">Created: {simDate(b.createdAt)}</div>
                  {b.sorting ? (
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                      <span>Reusable</span>
                      <span className="font-mono">{kg(b.sorting.reusable)}</span>
                      <span>Recovered</span>
                      <span className="font-mono">{kg(b.sorting.recyclable)}</span>
                      <span>Hazardous</span>
                      <span className="font-mono">{kg(b.sorting.hazardous)}</span>
                      <span>Residual</span>
                      <span className="font-mono">{kg(b.sorting.residual)}</span>
                    </div>
                  ) : null}
                </div>

                <div className="md:col-span-5">
                  <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    Simulated Recovery Result
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {Object.entries(b.materials ?? {}).map(([name, v]) => (
                      <div key={name} className="rounded-xl bg-cream px-3 py-2">
                        <div className="text-xs font-semibold">{name}</div>
                        <div className="font-mono text-sm">{kg(v)}</div>
                      </div>
                    ))}
                    {!b.materials ? (
                      <SectionNote>Not processed yet.</SectionNote>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-3">
                  <div className="rounded-xl bg-cream px-3 py-2 text-xs">
                    Estimated CO₂e avoided
                    <div className="font-mono text-sm font-bold">{b.co2eKg ?? 0} kg</div>
                    <span className="text-muted-foreground">Estimate, not verified</span>
                  </div>
                  {b.status !== "COMPLETED" ? (
                    <PopButton tone="ink" onClick={() => runRecycling(b.id)}>
                      Run Recycling Simulation
                    </PopButton>
                  ) : b.certificateId ? (
                    <Link
                      to="/verify/simulation/$certificateId"
                      params={{ certificateId: b.certificateId }}
                      className="font-display rounded-2xl border-2 border-input bg-card px-5 py-3 text-center text-sm font-bold"
                    >
                      View Simulation Certificate
                    </Link>
                  ) : (
                    <PopButton tone="outline" onClick={() => generateCertificateFor(b.id)}>
                      Generate Simulation Certificate
                    </PopButton>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
