import PageShell from "@/components/PageShell";
import FeatureRow from "@/components/FeatureRow";
import ScrollJourneyLazy from "@/components/ScrollJourneyLazy";
import PinSection from "@/components/PinSection";
import { ScheduleClip, InventoryClip, RecipeClip, FinanceClip } from "@/components/FeatureClips";

export default function Home() {
  return (
    <>
      <ScrollJourneyLazy />
      <PageShell>
        <PinSection heightVh={175}>
          <div className="relative max-w-3xl mx-auto px-6 text-center w-full">
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
        </PinSection>

        <section className="max-w-4xl mx-auto px-6 pb-24">
          <PinSection heightVh={175}>
            <FeatureRow
              index={1}
              title="Scheduling & timesheets"
              body="Build the schedule, track availability and shift swaps, and clock in and out — all reconciled against real payroll data."
              clip={<ScheduleClip />}
            />
          </PinSection>
          <PinSection heightVh={175}>
            <FeatureRow
              index={2}
              title="Inventory & ordering"
              body="Count stock, track par levels, and turn a count into a supplier order without a manual text list."
              clip={<InventoryClip />}
            />
          </PinSection>
          <PinSection heightVh={175}>
            <FeatureRow
              index={3}
              title="Recipes & production"
              body="Batch-scale recipes accurately, schedule production, and print tub labels and market placards straight from the app."
              clip={<RecipeClip />}
            />
          </PinSection>
          <PinSection heightVh={175}>
            <FeatureRow
              index={4}
              title="Wholesale & finances"
              body="Track wholesale deliveries and invoices, and mirror your Square and QuickBooks data into one financial picture."
              clip={<FinanceClip />}
            />
          </PinSection>
        </section>
      </PageShell>
    </>
  );
}
