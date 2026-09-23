import { createFileRoute } from "@tanstack/react-router";
import { Card, CardTitle, Chip, PopButton, SectionNote, Stat } from "@/components/sim/ui";
import { redeemReward, setCurrentCustomer } from "@/lib/simulation/engine";
import { useSim } from "@/lib/simulation/react";
import { simDate } from "@/lib/simulation/format";
import { REWARD_PRODUCTS } from "@/lib/simulation/config";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Simulated Rewards — EcoCycle" },
      {
        name: "description",
        content:
          "Simulated reward points, demo reward store and simulated redemptions. No real purchases or payments occur.",
      },
      { property: "og:title", content: "Simulated Rewards — EcoCycle" },
      { property: "og:description", content: "Earn and redeem simulated EcoCycle points in the demo reward store." },
    ],
  }),
  component: RewardsPage,
});

function RewardsPage() {
  const s = useSim();
  const customer = s.customers.find((c) => c.id === s.currentCustomerId) ?? s.customers[0];
  const txns = customer ? s.rewards.filter((r) => r.customerId === customer.id) : [];
  const earned = txns.filter((r) => r.type === "EARN").reduce((t, r) => t + r.points, 0);
  const redeemed = txns.filter((r) => r.type === "REDEEM").reduce((t, r) => t + Math.abs(r.points), 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl font-bold">Simulated Rewards</h1>
        <SectionNote>
          1 simulated kg = {s.settings.pointsPerKg} simulated points. Redemptions are simulated — nothing is purchased
          or shipped.
        </SectionNote>
      </header>

      <Card>
        <CardTitle title="Demo Customer" badge={<Chip tone="cream">Demo Data</Chip>} />
        <div className="flex flex-wrap gap-2">
          {s.customers.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCurrentCustomer(c.id)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                c.id === customer?.id ? "bg-ink text-ink-foreground" : "bg-cream text-ink"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </Card>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Simulated Balance" value={customer?.points ?? 0} tone="text-leaf" />
        <Stat label="Simulated Points Earned" value={earned} />
        <Stat label="Simulated Points Redeemed" value={redeemed} />
        <Stat label="Simulated Transactions" value={txns.length} />
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardTitle title="Simulated Reward Store" badge={<Chip tone="sun">Simulation Reward</Chip>} />
          <div className="grid gap-3 sm:grid-cols-2">
            {REWARD_PRODUCTS.map((p) => {
              const affordable = (customer?.points ?? 0) >= p.points;
              return (
                <div key={p.id} className="rounded-2xl bg-cream p-4">
                  <div className="text-2xl">{p.emoji}</div>
                  <div className="mt-1 text-sm font-bold">{p.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">{p.points} simulated points</div>
                  <PopButton
                    className="mt-3 w-full"
                    tone={affordable ? "ink" : "outline"}
                    disabled={!affordable || !customer}
                    onClick={() => customer && redeemReward(customer.id, p.id)}
                  >
                    Simulate Redemption
                  </PopButton>
                </div>
              );
            })}
          </div>
          <SectionNote>No real purchase, payment or delivery takes place.</SectionNote>
        </Card>

        <Card className="lg:col-span-5">
          <CardTitle title="Simulated Point Transactions" badge={<Chip tone="cream">Simulated</Chip>} />
          <div className="max-h-[420px] space-y-2 overflow-auto">
            {txns.length === 0 ? (
              <SectionNote>No simulated transactions yet.</SectionNote>
            ) : null}
            {txns.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold">{r.note}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">
                    {r.id} · {simDate(r.at)}
                  </div>
                </div>
                <span className={`font-mono text-sm font-bold ${r.points >= 0 ? "text-leaf" : "text-coral"}`}>
                  {r.points >= 0 ? "+" : ""}
                  {r.points}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
