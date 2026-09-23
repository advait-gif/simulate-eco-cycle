import { useSim } from "@/lib/simulation/react";
import { simTime } from "@/lib/simulation/format";

const TONES: Record<string, string> = {
  SIM_PICKUP_CREATED: "text-lime",
  SIM_AGENT_ASSIGNED: "text-lime",
  SIM_AGENT_ARRIVED: "text-lime",
  SIM_WEIGHT_VERIFIED: "text-sun",
  SIM_BATCH_CREATED: "text-sky",
  SIM_RECYCLING_COMPLETED: "text-sky",
  SIM_CERTIFICATE_GENERATED: "text-coral",
  SIM_REWARD_CREDITED: "text-coral",
};

export function EventLog({ limit = 9, className = "" }: { limit?: number; className?: string }) {
  const s = useSim();
  const events = s.events.slice(0, limit);

  return (
    <div className={`rounded-3xl bg-ink p-6 text-ink-foreground ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="font-display text-lg font-bold">Simulation Event Log</div>
        <span className="font-mono text-[11px] opacity-50">{s.settings.running ? "live" : "paused"}</span>
      </div>
      <div className="space-y-2.5 font-mono text-[12px]">
        {events.length === 0 ? <div className="opacity-50">No simulation events yet.</div> : null}
        {events.map((e) => (
          <div key={e.id} className="flex gap-3">
            <span className="tabular-nums opacity-40">{simTime(e.at)}</span>
            <span className={TONES[e.type] ?? "text-ink-foreground"}>{e.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
