import LegalPageShell from "@/components/LegalPageShell";

export default function Terms() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated="August 28, 2026">
      <p>
        These Terms of Service ("Terms") govern access to and use of The
        Pass's software platform (the "Service"). By using the Service, you
        agree to these Terms. If you're using the Service on behalf of a
        business ("Customer"), you're agreeing on that business's behalf,
        and "you" refers to that Customer and its authorized users.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        The Service
      </h2>
      <p>
        The Pass provides operations software for restaurants and bakeries,
        including scheduling, inventory management, checklists, recipe and
        production management, wholesale order tracking, crew messaging,
        and financial dashboards built from data mirrored out of
        third-party services the Customer authorizes (such as Square and
        QuickBooks).
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Accounts and access
      </h2>
      <p>
        A Customer's owners/managers control who has access to the Service
        under their account, and at what level (owner, manager, or
        employee). You're responsible for keeping your sign-in credentials
        and any device used to access the Service reasonably secure, and
        for the activity that happens under your account.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Acceptable use
      </h2>
      <p>You agree not to:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Use the Service for any purpose other than operating your own restaurant or bakery business.</li>
        <li>Attempt to access another Customer's data, or any part of the Service you're not authorized to access.</li>
        <li>Interfere with or disrupt the Service's operation or security.</li>
        <li>Use the Service in a way that violates any applicable law.</li>
      </ul>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Your data
      </h2>
      <p>
        You (the Customer) retain ownership of the business data you put
        into the Service — your schedules, inventory, recipes, and
        financial information. You're responsible for the accuracy of the
        information you and your team enter. See the{" "}
        <a href="/privacy" className="underline">Privacy Policy</a> for how
        we collect, use, and protect that information.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Third-party services
      </h2>
      <p>
        Some Service features depend on third-party providers (Square,
        QuickBooks/Intuit, Twilio/Bird, Apple, and our infrastructure
        providers Supabase and Vercel). Those providers have their own
        terms and availability, and we're not responsible for their
        outages, changes, or errors, though we'll make a reasonable effort
        to keep Service features that depend on them working.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Availability and changes
      </h2>
      <p>
        We aim to keep the Service available and reliable, but we don't
        guarantee uninterrupted access, and we may modify, add, or remove
        features over time. We'll make a reasonable effort to communicate
        material changes that affect how you use the Service.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Disclaimer of warranties
      </h2>
      <p>
        The Service is provided "as is," without warranties of any kind,
        express or implied, including any implied warranty of
        merchantability, fitness for a particular purpose, or
        non-infringement.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Limitation of liability
      </h2>
      <p>
        To the maximum extent permitted by law, The Pass is not liable for
        any indirect, incidental, special, or consequential damages arising
        from your use of the Service, including lost profits or lost data,
        even if advised of the possibility of such damages.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Termination
      </h2>
      <p>
        Either party may stop using/providing the Service at any time. Upon
        termination, we'll make a reasonable effort to make your data
        available for export for a limited period, after which it may be
        deleted per the retention terms in the Privacy Policy.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Governing law
      </h2>
      <p>These Terms are governed by the laws of the State of California, without regard to its conflict-of-laws principles.</p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Changes to these Terms
      </h2>
      <p>
        If we make material changes to these Terms, we'll update the "last
        updated" date above and, where appropriate, notify Customers
        directly.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Contact
      </h2>
      <p>
        Questions about these Terms can be sent to{" "}
        <a href="mailto:support@thepass.cloud" className="underline">support@thepass.cloud</a>.
      </p>
    </LegalPageShell>
  );
}
