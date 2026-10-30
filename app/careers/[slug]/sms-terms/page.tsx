import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { employers, getEmployer } from "@/lib/jobs";

// Campaign-specific terms for the employer's own 10DLC brand. Carriers reject
// a terms URL that is a generic policy section (Twilio 30882, 2026-10-30).

export const dynamicParams = false;

export function generateStaticParams() {
  return employers.filter((e) => e.smsNumber).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const employer = getEmployer((await params).slug);
  return employer ? { title: `${employer.name} Applicant Text Messaging Terms` } : {};
}

export default async function SmsTerms({ params }: { params: Promise<{ slug: string }> }) {
  const employer = getEmployer((await params).slug);
  if (!employer?.smsNumber) notFound();
  const sender = employer.legalName ? `${employer.legalName}, doing business as ${employer.name}` : employer.name;

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-12 leading-relaxed space-y-4">
        <h1 className="text-3xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
          {employer.name} Applicant Text Messaging Terms
        </h1>
        <p className="text-sm font-sans-ui" style={{ color: "var(--ink-muted)" }}>Last updated October 30, 2026</p>

        <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>Program</h2>
        <p>
          {sender} (&ldquo;{employer.name}&rdquo;) sends text messages from {employer.smsNumber} to
          people who apply for a job at {employer.name}. Messages are about your application only:
          scheduling a call, interview or working trial, changing that time, and answering your
          questions. We do not send marketing or promotional messages through this program.
        </p>

        <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>How you opt in</h2>
        <p>
          You opt in by giving your mobile number when you apply on our{" "}
          <Link href={`/careers/${employer.slug}`} className="underline">jobs page</Link>, next to a
          notice that you agree to receive texts from {employer.name} about your application, or by
          texting {employer.smsNumber} first. Consent is not a condition of applying or of employment.
        </p>

        <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>Frequency and cost</h2>
        <p>
          Message frequency varies with your application, usually a few messages per application.
          Message and data rates may apply.
        </p>

        <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>Help and opting out</h2>
        <p>
          Reply <strong>STOP</strong> at any time to stop all texts from {employer.smsNumber}. You will
          get one message confirming you are opted out. Reply <strong>START</strong> to opt back in.
          Reply <strong>HELP</strong> for help, or email{" "}
          <a href={`mailto:${employer.applyEmail}`} className="underline">{employer.applyEmail}</a>.
        </p>
        <p>Carriers are not liable for delayed or undelivered messages.</p>

        <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>Your information</h2>
        <p>
          No mobile information will be shared with third parties or affiliates for marketing or
          promotional purposes. Text messaging opt-in data and consent will not be shared with any
          third parties. See our{" "}
          <Link href="/privacy#applicant-texts" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </PageShell>
  );
}
