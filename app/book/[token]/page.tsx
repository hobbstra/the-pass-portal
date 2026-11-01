import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { fetchBooking, meetingWord, whenText } from "@/lib/booking";
import { formatPhone } from "@/lib/phone";
import { getEmployer } from "@/lib/jobs";
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
  const known = b && b !== "error" && b.careers_slug ? getEmployer(b.careers_slug) : undefined;
  // Every state wears the applicant page, even a bad link (then without a business to name).
  const employer = b && b !== "error"
    ? { name: known?.name ?? b.org_name, slug: b.careers_slug ?? "", logo: known?.logo }
    : { name: "The Pass", slug: "" };
  const message = (title: string, body: React.ReactNode, action?: React.ReactNode) => (
    // Same left edge as the header (3xl column); the text keeps a readable width inside it.
    <div className="max-w-3xl mx-auto px-6 py-14"><div className="max-w-xl">
      <h1 className="text-3xl font-semibold mb-3" style={{ color: "var(--ink)" }}>{title}</h1>
      <p className="font-sans-ui" style={{ color: "var(--ink-muted)" }}>{body}</p>
      {action}
    </div></div>
  );
  if (b === "error") return <PageShell employer={employer}>{message("Something went wrong", "We couldn't load your times.",
    <a href={`/book/${token}`} className="inline-flex items-center min-h-11 rounded-full px-5 py-2 mt-6 font-semibold text-sm" style={{ background: "var(--pass-grad)", color: "#fff" }}>Try again</a>)}</PageShell>;
  if (!b) return <PageShell employer={employer}>{message("This link doesn't work", "Check you opened the whole link from your text, or reply to the text to ask for a new one.")}</PageShell>;
  const textUs = b.sms_number && (
    <a href={`sms:${b.sms_number}`} className="inline-flex items-center min-h-11 rounded-full px-5 py-2 mt-6 font-sans-ui font-semibold text-sm"
       style={{ background: "var(--pass-grad)", color: "#fff" }}>
      Text {b.org_name} at {formatPhone(b.sms_number)}
    </a>
  );
  if (!b.live) {
    return (
      <PageShell employer={employer}>
        {b.booked_at
          ? message(`You're booked for ${whenText(b.booked_at, b.timezone)}`, "This link can't change it any more. To change it, text us.", textUs)
          : message("This link has expired", "Text us and we'll send you a new one.", textUs)}
      </PageShell>
    );
  }
  return (
    <PageShell employer={employer}>
      <div className="max-w-3xl mx-auto px-6 py-10"><div className="max-w-xl">
        <Picker token={token} booking={b} />
      </div></div>
    </PageShell>
  );
}
