import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardTitle, Chip, SectionNote } from "@/components/sim/ui";
import { useSim } from "@/lib/simulation/react";
import { kg, simDate } from "@/lib/simulation/format";

export const Route = createFileRoute("/verify/simulation/$certificateId")({
  head: () => ({
    meta: [
      { title: "Simulation Certificate Verification — EcoCycle" },
      {
        name: "description",
        content:
          "Local verification page for EcoCycle simulation certificates. Certificates represent simulated data only.",
      },
      { property: "og:title", content: "Simulation Certificate Verification — EcoCycle" },
      {
        property: "og:description",
        content: "Verify a simulated EcoCycle recycling certificate — demonstration data only.",
      },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { certificateId } = Route.useParams();
  const s = useSim();
  const cert = s.certificates.find((c) => c.id === certificateId);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-4xl font-bold">Simulation Certificate</h1>
        <SectionNote>
          This page verifies simulated records stored locally in the demo engine. It is not a real recycling
          certification service.
        </SectionNote>
      </header>

      {!cert ? (
        <Card>
          <CardTitle title="Not found" badge={<Chip tone="coral">Simulated</Chip>} />
          <p className="text-sm">
            No simulated certificate with id <span className="font-mono">{certificateId}</span> exists in the current
            simulation. Launch the demo to generate simulated certificates.
          </p>
          <Link to="/recycling" className="mt-4 inline-block text-sm font-bold underline">
            Back to Simulated Recycling
          </Link>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardTitle
            title={cert.id}
            badge={<Chip tone="lime">Status: SIMULATED / VERIFIED</Chip>}
          />
          <div className="rounded-2xl bg-coral/15 p-3 text-xs font-bold text-coral uppercase">
            Simulation certificate — not a real recycling certificate
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Customer (fictional)" value={cert.customerName} />
            <Row label="Simulated batch" value={cert.batchId} />
            <Row label="Simulated input" value={kg(cert.inputKg)} />
            <Row label="Simulated recycled" value={kg(cert.recycledKg)} />
            <Row label="Estimated CO₂e avoided" value={`${cert.co2eKg} kg (estimate)`} />
            <Row label="Simulated processing date" value={simDate(cert.issuedAt)} />
            <Row label="Environment" value={cert.environment} />
          </dl>
          <div className="mt-5 flex items-center gap-4">
            <QrPlaceholder value={cert.id} />
            <SectionNote>
              The demo QR code points at this local verification page. It represents simulated data only and carries no
              legal or environmental claim.
            </SectionNote>
          </div>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/60 pb-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono text-xs font-semibold">{value}</dd>
    </div>
  );
}

function QrPlaceholder({ value }: { value: string }) {
  // Deterministic pseudo-QR pattern derived from the certificate id (simulated).
  const cells = Array.from({ length: 49 }, (_, i) => {
    let h = i * 31;
    for (let k = 0; k < value.length; k++) h = (h * 33 + value.charCodeAt(k)) % 997;
    return h % 2 === 0;
  });
  return (
    <div className="grid size-24 shrink-0 grid-cols-7 gap-0.5 rounded-xl bg-card p-1.5 ring-2 ring-ink">
      {cells.map((on, i) => (
        <div key={i} className={on ? "bg-ink" : "bg-transparent"} />
      ))}
    </div>
  );
}
