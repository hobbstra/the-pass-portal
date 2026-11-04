import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

// The account-deletion page Google Play asks every app with sign-in to link (owner, 2026-11-04).
export const metadata: Metadata = { title: "Delete your account · The Pass" };

const h2 = "text-xl font-semibold pt-4";

export default function DeleteAccount() {
  return (
    <LegalPageShell title="Delete your account" lastUpdated="November 4, 2026">
      <p>
        If you use The Pass crew app through your job, you can delete your account at any time.
      </p>

      <h2 className={h2} style={{ color: "var(--ink)" }}>In the app</h2>
      <p>Open The Pass crew app on your iPhone or Android phone, then go to <strong>Settings → Delete account</strong> and confirm.</p>

      <h2 className={h2} style={{ color: "var(--ink)" }}>Without the app</h2>
      <p>
        Email <a href="mailto:support@thepass.cloud?subject=Delete%20my%20account" className="underline">support@thepass.cloud</a>{" "}
        from the email on your account, or include your name, your workplace and the phone number you sign in with.
        We pass it to your workplace&apos;s owner, who deletes it in The Pass, and we confirm with you when it&apos;s
        done, within 30 days. You can also ask the owner directly.
      </p>

      <h2 className={h2} style={{ color: "var(--ink)" }}>What&apos;s deleted</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Your sign-in: you can&apos;t sign in again.</li>
        <li>The email address and phone number on your login.</li>
        <li>Your clock-in PIN, two-factor settings, and the app&apos;s notification tokens on your devices.</li>
        <li>You&apos;re taken off future shifts.</li>
      </ul>

      <h2 className={h2} style={{ color: "var(--ink)" }}>What your employer keeps</h2>
      <p>
        Your name and your work records (shifts, timecards, pay, and messages you posted to team channels) stay with your
        employer. Employment and payroll laws require businesses to keep these records. So do the job application you sent
        them, and your employer&apos;s payroll or point-of-sale system (such as Square), which keeps its own copy of your
        contact details. Ask your employer about their policies for those records.
      </p>

      <p>
        Owners: an owner&apos;s account runs the business, so it can&apos;t be deleted in the app. Email{" "}
        <a href="mailto:support@thepass.cloud" className="underline">support@thepass.cloud</a>. See also our{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </LegalPageShell>
  );
}
