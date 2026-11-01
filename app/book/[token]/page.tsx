import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { brandVars } from "@/lib/brand";
import { fetchBooking, meetingWord, whenText } from "@/lib/booking";
import Picker from "./Picker";

export const dynamic = "force-dynamic";
// A private link: never indexed, never sent on as a referrer.
export const metadata: Metadata = { title: "Pick a time", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function BookPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const b = await fetchBooking(token);
  const box = (title: string, body: React.ReactNode) => (
    <div className="max-w-xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-medium mb-3" style={{ color: "var(--ink)" }}>{title}</h1>
      <p className="font-sans-ui" style={{ color: "var(--ink-muted)" }}>{body}</p>
    </div>
  );
  if (b === "error") return <PageShell>{box("Something went wrong", "We couldn't load your times. Refresh to try again.")}</PageShell>;
  if (!b) return <PageShell>{box("This link doesn't work", "Check you opened the whole link from your text, or ask us for a new one.")}</PageShell>;
  const what = meetingWord(b.kind);
  if (!b.live) {
    return (
      <PageShell>
        {box("This link has expired", b.booked_at
          ? `You're booked for ${whenText(b.booked_at, b.timezone)}. To change it, reply to our text.`
          : `Ask ${b.org_name} for a new link to pick a time.`)}
      </PageShell>
    );
  }
  return (
    <PageShell>
      <div className="max-w-xl mx-auto px-6 py-10" style={brandVars(b.brand_color)}>
        <p className="text-sm font-semibold uppercase tracking-wider font-sans-ui mb-2" style={{ color: "var(--brand-accent)" }}>{b.org_name}</p>
        <h1 className="text-3xl font-medium mb-2" style={{ color: "var(--ink)" }}>
          {b.first_name ? `Hi ${b.first_name}, pick` : "Pick"} a time for your {what}
        </h1>
        <p className="font-sans-ui mb-8" style={{ color: "var(--ink-muted)" }}>
          {[b.job_title, `${b.minutes} minutes`, b.host_first_name && `with ${b.host_first_name}`].filter(Boolean).join(" · ")}
        </p>
        <Picker token={token} booking={b} />
      </div>
    </PageShell>
  );
}
