import LegalPageShell from "@/components/LegalPageShell";

export default function PrivacyPolicy() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="August 28, 2026">
      <p>
        This Privacy Policy describes how The Pass ("we," "us," "our")
        collects, uses, and shares information when a restaurant or bakery
        business ("Customer") and its employees use The Pass's software
        (the "Service").
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Who this applies to
      </h2>
      <p>
        The Pass is business software: a restaurant or bakery signs up as a
        Customer, and that Customer's owners, managers, and employees use
        the Service under the Customer's account. If you're an employee
        using The Pass through your employer, your employer is the
        Customer, and this policy describes what The Pass itself collects —
        your employer may have its own policies about how it uses your
        information internally.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Information we collect
      </h2>
      <p>We collect the following categories of information as part of operating the Service:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Account and identity information:</strong> name, phone
          number, and role/position, used to create your account and sign
          you in. Employee sign-in uses a one-time code sent by SMS to your
          phone number; a short numeric PIN may also be set as a
          convenience re-lock on a shared device (this does not replace
          your real sign-in, it just re-locks the app after it's been idle).
        </li>
        <li>
          <strong>Location information:</strong> with your device's
          permission, we check your GPS location specifically to confirm
          you're on the Customer's premises before showing certain
          restricted content (currently: recipes). We do not use location
          data for general tracking, and it is not collected unless you're
          actively trying to view that restricted content.
        </li>
        <li>
          <strong>Work and scheduling information:</strong> shifts,
          availability, time-off requests, clock-in/clock-out times,
          checklist and task completion, and inventory counts.
        </li>
        <li>
          <strong>Financial information (business-level, not personal):</strong>{" "}
          the Customer's own sales and payroll data (mirrored from Square)
          and financial reports (mirrored from QuickBooks) — this is the
          Customer business's own financial data, used to power dashboards
          and reports for the Customer's owners/managers.
        </li>
        <li>
          <strong>Messages and photos:</strong> if the Customer uses The
          Pass's crew messaging feature, we store the text and any photos
          sent between team members using that feature.
        </li>
        <li>
          <strong>Device and notification data:</strong> a push-notification
          token, if you enable notifications, used only to deliver
          notifications to your device (e.g. a new message).
        </li>
      </ul>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        How we use this information
      </h2>
      <p>
        We use the information above to operate the Service: authenticating
        you, showing you your schedule and tasks, enforcing on-premises-only
        access to certain content, powering the Customer's own dashboards
        and reports, delivering messages and notifications, and providing
        customer support. We do not sell any of this information.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Who we share information with
      </h2>
      <p>The Service relies on a small number of infrastructure and integration providers to work:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Square</strong> — as the source of the Customer's sales and payroll data, which we mirror into the Service.</li>
        <li><strong>Intuit / QuickBooks</strong> — as the source of the Customer's financial reports, which we mirror into the Service with the Customer's authorization.</li>
        <li><strong>Twilio / Bird</strong> — to deliver the SMS one-time codes used for employee sign-in.</li>
        <li><strong>Supabase</strong> — our database and backend infrastructure provider, which stores the data described above.</li>
        <li><strong>Vercel</strong> — our application hosting provider.</li>
        <li><strong>Apple</strong> — for the iOS version of the Service, distributed through the App Store.</li>
      </ul>
      <p>
        We do not share your information with any other third party except
        as required by law, or with your (or the Customer's) explicit
        consent.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Data retention
      </h2>
      <p>
        We retain information for as long as the Customer's account is
        active, and for a reasonable period afterward to allow account
        recovery and to meet legal/record-keeping obligations. A Customer
        or individual user may request deletion of their data by contacting
        us at the address below, subject to any legal retention
        requirements (for example, payroll and financial records may need
        to be retained for a minimum period regardless of a deletion
        request).
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Security
      </h2>
      <p>
        We use industry-standard practices to protect information,
        including encryption in transit, access controls that isolate each
        Customer's data from every other Customer's, and role-based
        permissions within a Customer's own account. No system is perfectly
        secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Your choices
      </h2>
      <p>
        You can decline location permission (certain content simply won't
        be available) and notification permission (you won't receive push
        notifications) at the device level at any time. To request access
        to, correction of, or deletion of your information, contact us at
        the address below.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Changes to this policy
      </h2>
      <p>
        If we make material changes to this policy, we'll update the "last
        updated" date above and, where appropriate, notify Customers
        directly.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Contact
      </h2>
      <p>
        Questions about this policy or your information can be sent to{" "}
        <a href="mailto:support@thepass.cloud" className="underline">support@thepass.cloud</a>.
      </p>
    </LegalPageShell>
  );
}
