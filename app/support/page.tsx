import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = { title: "Support — The Pass" };

// Support URL for the App Store and Google Play listings.
export default function Support() {
  return (
    <LegalPageShell title="Support" lastUpdated="November 10, 2026">
      <p>
        The Pass runs restaurants and bakeries: The Pass Crew for the team,
        The Pass Admin for owners and managers.
      </p>
      <p>
        For help, email{" "}
        <a href="mailto:support@thepass.cloud" className="underline">support@thepass.cloud</a>.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Can&apos;t sign in?
      </h2>
      <p>
        Your account comes from the business you work for. Ask your manager to
        check that your phone number is on the team, then sign in with that
        number and the code we text you.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        More
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><a href="/privacy" className="underline">Privacy policy</a></li>
        <li><a href="/terms" className="underline">Terms</a></li>
        <li><a href="/delete-account" className="underline">Delete your account</a></li>
      </ul>
    </LegalPageShell>
  );
}
