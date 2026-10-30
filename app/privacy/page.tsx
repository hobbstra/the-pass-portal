import LegalPageShell from "@/components/LegalPageShell";

export default function PrivacyPolicy() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="October 30, 2026">
      <p>
        This Privacy Policy describes how E&amp;P Boulangerie LLC, operator of The Pass
        ("The Pass," "we," "us," "our"),
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
          <strong>Bank and card account information (owners only):</strong>{" "}
          if a Customer's owner chooses to connect a bank or card account,
          we receive — through Plaid — the account's name, type, last four
          digits, balances, and posted transactions (date, description,
          amount). We never see or store bank usernames or passwords: the
          owner signs in to their bank inside Plaid's secure screen and
          chooses which accounts to share. Owners may instead upload a bank
          or card statement, which is read automatically to extract the
          same transaction details; the statement file itself is not kept.
          This information is shown only to the Customer's owners, never
          to managers or employees.
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
        and reports (for connected bank accounts: the business's cash on
        hand, a cash-flow forecast, and where its money is spent),
        delivering messages and notifications, and providing customer
        support. We do not sell any of this information, and we do not use
        bank data for advertising, marketing, or any purpose other than
        showing the Customer its own finances.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Who we share information with
      </h2>
      <p>The Service relies on a small number of infrastructure and integration providers to work:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Square</strong> — as the source of the Customer's sales and payroll data, which we mirror into the Service.</li>
        <li><strong>Intuit / QuickBooks</strong> — as the source of the Customer's financial reports, which we mirror into the Service with the Customer's authorization.</li>
        <li>
          <strong>Plaid</strong> — to connect a Customer's bank and card
          accounts at the owner's request. Plaid's handling of that data is
          described in the{" "}
          <a href="https://plaid.com/legal/#end-user-privacy-policy" className="underline">Plaid End User Privacy Policy</a>.
        </li>
        <li><strong>Anthropic</strong> — to read uploaded bank or card statements and extract their transactions. Statements are processed only to return the transactions and are not used to train models.</li>
        <li><strong>Twilio / Bird</strong> — to deliver the SMS one-time codes used for employee sign-in, and text messages between employers and job applicants.</li>
        <li><strong>Supabase</strong> — our database and backend infrastructure provider, which stores the data described above.</li>
        <li><strong>Vercel</strong> — our application hosting provider.</li>
        <li><strong>Apple</strong> — for the iOS version of the Service, distributed through the App Store.</li>
      </ul>
      <p>
        We do not share your information with any other third party except
        as required by law, or with your (or the Customer's) explicit
        consent.
      </p>

      <h2 id="applicant-texts" className="text-xl font-semibold pt-4 scroll-mt-24" style={{ color: "var(--ink)" }}>
        Text messages to job applicants
      </h2>
      <p>
        When you apply for a job listed on The Pass and give your mobile
        number, the employer you applied to may text you from its own number
        about your application: scheduling a call, interview or working
        trial, changing that time, or answering your questions. Message
        frequency varies. Message and data rates may apply. Reply HELP for
        help or STOP to stop all texts from that number; reply START to
        resume. Carriers are not liable for delayed or undelivered messages.
      </p>
      <p>
        We store these messages so the employer can see the conversation.
        No mobile information will be shared with third parties or
        affiliates for marketing or promotional purposes. Text messaging
        opt-in data and consent will not be shared with any third parties.
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
      <p>
        An owner can disconnect a bank at any time from the app.
        Disconnecting ends our access through Plaid and deletes that bank's
        accounts, balances, and transactions from The Pass.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Security
      </h2>
      <p>
        We use industry-standard practices to protect information,
        including encryption in transit (TLS) and at rest (AES-256),
        access controls that isolate each
        Customer's data from every other Customer's, and role-based
        permissions within a Customer's own account. No system is perfectly
        secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Your choices
      </h2>
      <p>
        Bank connections are always optional and can be removed at any
        time. You can decline location permission (certain content simply won't
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
