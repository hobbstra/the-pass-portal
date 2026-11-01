import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { brandOf, brandVars } from "@/lib/brand";
import { fetchBooking, meetingWord, whenText } from "@/lib/booking";
import { formatPhone } from "@/lib/phone";
import Picker from "./Picker";

export const dynamic = "force-dynamic";

// A private link: never indexed, never sent on as a referrer. The preview a text app builds names the business.
export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const b = await fetchBooking((await params).token);
  const base: Metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };
  if (!b || b === "error") return { ...base, title: "Pick a time" };
  const title = `Pick a time for your ${meetingWord(b.kind)} with ${b.org_name}`;
  return { ...base, title, description: b.job_title ? `${b.job_title} at ${b.org_name}` : b.org_name, openGraph: { title, siteName: b.org_name } };
}

export default async function BookPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const b = await fetchBooking(token);
  const employer = b && b !== "error" && b.careers_slug ? { name: b.org_name, slug: b.careers_slug } : undefined;
  const brand = brandOf(b && b !== "error" ? b.brand_color : null);
  const message = (title: string, body: React.ReactNode, action?: React.ReactNode) => (
    <div className="max-w-xl mx-auto px-6 py-14">
      {b && b !== "error" && <p className="text-sm font-semibold uppercase tracking-wider font-sans-ui mb-2" style={{ color: brand.accent }}>{b.org_name}</p>}
      <h1 className="text-3xl font-medium mb-3" style={{ color: "var(--ink)" }}>{title}</h1>
      <p className="font-sans-ui" style={{ color: "var(--ink-muted)" }}>{body}</p>
      {action}
    </div>
  );
  if (b === "error") return <PageShell>{message("Something went wrong", "We couldn't load your times. Refresh to try again.")}</PageShell>;
  if (!b) return <PageShell>{message("This link doesn't work", "Check you opened the whole link from your text, or reply to the text to ask for a new one.")}</PageShell>;
  const textUs = b.sms_number && (
    <a href={`sms:${b.sms_number}`} className="inline-flex items-center min-h-11 rounded-full px-5 py-2 mt-6 font-sans-ui font-semibold text-sm"
       style={{ background: brand.fill, color: brand.ink }}>
      Text {b.org_name} at {formatPhone(b.sms_number)}
    </a>
  );
  if (!b.live) {
    return (
      <PageShell employer={employer}>
        {message("This link has expired", b.booked_at
          ? `You're still booked for ${whenText(b.booked_at, b.timezone)}. To change it, text us.`
          : `Text us and we'll send you a new one.`, textUs)}
      </PageShell>
    );
  }
  return (
    <PageShell employer={employer}>
      <div className="max-w-xl mx-auto px-6 py-10" style={brandVars(b.brand_color)}>
        <Picker token={token} booking={b} />
      </div>
    </PageShell>
  );
}
