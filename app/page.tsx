import PageShell from "@/components/PageShell";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div
          className="glow-blob pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full blur-[90px]"
          style={{ background: "var(--glow-pink)", animationName: "drift-a" }}
          aria-hidden="true"
        />
        <div
          className="glow-blob pointer-events-none absolute top-10 -right-24 h-[380px] w-[380px] rounded-full blur-[90px]"
          style={{ background: "var(--glow-cyan)", animationName: "drift-b" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64 overflow-hidden"
          style={{ perspective: "500px" }}
          aria-hidden="true"
        >
          <div
            className="grid-floor absolute inset-0"
            style={{
              transform: "rotateX(60deg)",
              transformOrigin: "bottom",
              backgroundImage: `repeating-linear-gradient(to right, var(--grid-line) 0 1px, transparent 1px 56px), repeating-linear-gradient(to bottom, var(--grid-line) 0 1px, transparent 1px 56px)`,
              maskImage: "linear-gradient(to top, black, transparent)",
              WebkitMaskImage: "linear-gradient(to top, black, transparent)",
            }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
          <h1
            className="fade-up text-5xl font-bold leading-tight mb-6"
            style={{ color: "var(--ink)" }}
          >
            Everything that converges before it goes out.
          </h1>
          <p
            className="fade-up text-xl leading-relaxed mb-10"
            style={{ color: "var(--ink-muted)", animationDelay: "80ms" }}
          >
            The Pass is an operations platform for restaurants and bakeries —
            scheduling, inventory, checklists, wholesale orders, recipes, and
            payroll, all in one place.
          </p>
          <a
            href="mailto:support@thepass.cloud"
            className="cta-sweep fade-in inline-block font-sans-ui text-sm font-bold px-6 py-3 rounded-full"
            style={{
              backgroundImage: "var(--accent-gradient)",
              color: "#0d0716",
              boxShadow: "0 0 40px -10px var(--glow-pink)",
              animationDelay: "160ms",
            }}
          >
            Get in touch
          </a>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <FeatureCard
            index={0}
            title="Scheduling & timesheets"
            body="Build the schedule, track availability and shift swaps, and clock in and out — all reconciled against real payroll data."
          />
          <FeatureCard
            index={1}
            title="Inventory & ordering"
            body="Count stock, track par levels, and turn a count into a supplier order without a manual text list."
          />
          <FeatureCard
            index={2}
            title="Recipes & production"
            body="Batch-scale recipes accurately, schedule production, and print tub labels and market placards straight from the app."
            gridLines
          />
          <FeatureCard
            index={3}
            title="Wholesale & finances"
            body="Track wholesale deliveries and invoices, and mirror your Square and QuickBooks data into one financial picture."
          />
        </div>
      </section>
    </PageShell>
  );
}
