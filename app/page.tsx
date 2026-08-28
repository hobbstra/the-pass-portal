import PageShell from "@/components/PageShell";

export default function Home() {
  return (
    <PageShell>
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold leading-tight mb-6" style={{ color: "var(--ink)" }}>
          Everything that converges before it goes out.
        </h1>
        <p className="text-xl leading-relaxed mb-10" style={{ color: "var(--ink-muted)" }}>
          The Pass is an operations platform for restaurants and bakeries —
          scheduling, inventory, checklists, wholesale orders, recipes, and
          payroll, all in one place.
        </p>
        <a
          href="mailto:support@thepass.cloud"
          className="inline-block font-sans-ui text-sm font-bold px-6 py-3 rounded-full transition hover:brightness-110"
          style={{ backgroundImage: "var(--accent-gradient)", color: "#0d0716" }}
        >
          Get in touch
        </a>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <FeatureCard
            title="Scheduling & timesheets"
            body="Build the schedule, track availability and shift swaps, and clock in and out — all reconciled against real payroll data."
          />
          <FeatureCard
            title="Inventory & ordering"
            body="Count stock, track par levels, and turn a count into a supplier order without a manual text list."
          />
          <FeatureCard
            title="Recipes & production"
            body="Batch-scale recipes accurately, schedule production, and print tub labels and market placards straight from the app."
            gridLines
          />
          <FeatureCard
            title="Wholesale & finances"
            body="Track wholesale deliveries and invoices, and mirror your Square and QuickBooks data into one financial picture."
          />
        </div>
      </section>
    </PageShell>
  );
}

function FeatureCard({
  title,
  body,
  gridLines,
}: {
  title: string;
  body: string;
  gridLines?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border p-6"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
    >
      {gridLines && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, var(--grid-line) 0 1px, transparent 1px 48px), repeating-linear-gradient(to bottom, var(--grid-line) 0 1px, transparent 1px 48px)`,
            maskImage: "linear-gradient(to top, black, transparent)",
            WebkitMaskImage: "linear-gradient(to top, black, transparent)",
          }}
          aria-hidden="true"
        />
      )}
      <h3 className="relative text-lg font-bold mb-2" style={{ color: "var(--ink)" }}>
        {title}
      </h3>
      <p className="relative text-sm leading-relaxed font-sans-ui" style={{ color: "var(--ink-muted)" }}>
        {body}
      </p>
    </div>
  );
}
