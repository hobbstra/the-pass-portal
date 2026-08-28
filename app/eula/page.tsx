import LegalPageShell from "@/components/LegalPageShell";

export default function Eula() {
  return (
    <LegalPageShell title="End User License Agreement" lastUpdated="August 28, 2026">
      <p>
        This End User License Agreement ("EULA") governs your use of The
        Pass's mobile and web applications (the "Software"). By installing
        or using the Software, you agree to this EULA. This EULA works
        alongside our{" "}
        <a href="/terms" className="underline">Terms of Service</a>, which
        govern the underlying Service the Software connects to.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        License grant
      </h2>
      <p>
        Subject to this EULA, The Pass grants you a limited,
        non-exclusive, non-transferable, revocable license to install and
        use the Software on devices you own or control, solely to access
        the Service as an authorized user of a Customer's account.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Restrictions
      </h2>
      <p>You agree not to:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Copy, modify, or create derivative works of the Software, except as permitted by the platform you installed it from (e.g. Apple's App Store terms).</li>
        <li>Reverse-engineer, decompile, or disassemble the Software, except to the extent applicable law expressly permits this despite the restriction.</li>
        <li>Rent, lease, sell, or sublicense the Software to any third party.</li>
        <li>Remove or obscure any proprietary notices in the Software.</li>
      </ul>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Ownership
      </h2>
      <p>
        The Software is licensed, not sold. The Pass and its licensors
        retain all right, title, and interest in the Software, including
        all intellectual property rights. This EULA doesn't grant you any
        rights to The Pass's trademarks or branding.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Third-party platforms
      </h2>
      <p>
        If you obtained the Software through a third-party platform (such
        as Apple's App Store), that platform's own terms also apply to your
        download and use of the Software, and in the event of a conflict
        between this EULA and those terms on a matter the platform's terms
        specifically govern, the platform's terms control for that matter.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Updates
      </h2>
      <p>
        The Software may update automatically or prompt you to update. We
        may add, change, or remove features as part of an update.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Disclaimer of warranties and limitation of liability
      </h2>
      <p>
        The Software is provided "as is," without warranty of any kind. To
        the maximum extent permitted by law, The Pass is not liable for any
        indirect, incidental, special, or consequential damages arising
        from your use of the Software.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Termination
      </h2>
      <p>
        This license terminates automatically if you violate this EULA, or
        if your access to the underlying Service ends for any reason. Upon
        termination, you must stop using the Software and delete it from
        your devices.
      </p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Governing law
      </h2>
      <p>This EULA is governed by the laws of the State of California, without regard to its conflict-of-laws principles.</p>

      <h2 className="text-xl font-semibold pt-4" style={{ color: "var(--ink)" }}>
        Contact
      </h2>
      <p>
        Questions about this EULA can be sent to{" "}
        <a href="mailto:support@thepass.cloud" className="underline">support@thepass.cloud</a>.
      </p>
    </LegalPageShell>
  );
}
