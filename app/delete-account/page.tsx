import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = { title: "Delete your account — The Pass" };

// The web half of the App Store / Google Play account-deletion rule. What
// deleting does is supabase/functions/delete-account (mise repo): sign-in,
// PIN, push tokens, email and phone go; name and work records stay with the
// employer for payroll law. Keep this copy matching the in-app dialog.
export default function DeleteAccount() {
  return (
    <LegalPageShell title="Delete your account" lastUpdated="November 10, 2026" draft={false}>
      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        In the app
      </h2>
      <p>
        In The Pass Crew, open <strong>Settings</strong> and tap{" "}
        <strong>Delete Account</strong>, then confirm. You&apos;re signed out
        and can&apos;t sign in again.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Without the app
      </h2>
      <p>
        Email{" "}
        <a href="mailto:support@thepass.cloud?subject=Delete%20my%20account" className="underline">
          support@thepass.cloud
        </a>{" "}
        from the email on your account, or with the phone number you sign in
        with and the business you work for. We confirm with that business and
        delete the account within 30 days.
      </p>
      <p>
        Owners: your account is the business&apos;s, so it can&apos;t be
        deleted in the app. Email us and we&apos;ll close it with you.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        What&apos;s deleted, and what&apos;s kept
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Deleted:</strong> your sign-in, the email and phone number on
          it, your PIN, and the devices registered for notifications.
        </li>
        <li>
          <strong>Kept by your employer:</strong> your name, shifts, timecards,
          pay and team messages, because payroll and employment law require
          employers to keep them (in California, generally up to four years).
        </li>
      </ul>
    </LegalPageShell>
  );
}
