import Link from "next/link";

type Employer = { name: string; slug: string; logo?: string };

// The Pass's own pages (dark, Synth Grid) unless an employer is given: then it's that employer's applicant
// page — light, their logo in a plain header, The Pass only as "Powered by" in the footer.
export default function PageShell({ children, employer }: { children: React.ReactNode; employer?: Employer }) {
  if (employer) return <ApplicantShell employer={employer}>{children}</ApplicantShell>;
  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-10 border-b backdrop-blur"
        style={{ borderColor: "var(--border)", background: "rgba(13, 7, 22, 0.72)" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between font-sans-ui">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: "var(--ink)" }}>The Pass</Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t font-sans-ui" style={{ borderColor: "var(--border)" }}>
        <div
          className="max-w-4xl mx-auto px-6 py-8 text-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ color: "var(--ink-muted)" }}
        >
          <span>&copy; {new Date().getFullYear()} The Pass, a product of E&amp;P Boulangerie LLC</span>
          <nav className="flex gap-6">
            <Link href="/careers" className="hover:underline">Jobs</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/eula" className="hover:underline">EULA</Link>
          </nav>
          <span>
            <a href="mailto:support@thepass.cloud" className="hover:underline">support@thepass.cloud</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

function ApplicantShell({ children, employer }: { children: React.ReactNode; employer: Employer }) {
  return (
    <div className="applicant min-h-screen flex flex-col">
      <header style={{ background: "var(--pass-surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto px-6 py-3">
          {(() => {
            const mark = employer.logo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={employer.logo} alt={employer.name} className="tenant-logo" />
              : employer.slug
                ? <span className="text-xl font-bold" style={{ color: "var(--ink)" }}>{employer.name}</span>
                // No business to name (a bad link): The Pass's own small wordmark, not a second title.
                : <span className="inline-flex items-center gap-2 text-[15px] font-semibold" style={{ color: "var(--ink-muted)" }}>
                    <span aria-hidden="true" className="inline-block w-3 h-3 rounded-full" style={{ background: "var(--pass-grad)" }} />{employer.name}
                  </span>;
            return employer.slug
              ? <Link href={`/careers/${employer.slug}`} aria-label={`${employer.name} jobs`} className="inline-block">{mark}</Link>
              : mark;
          })()}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer>
        <div className="max-w-3xl mx-auto px-6 py-8 text-sm flex flex-wrap gap-x-6 gap-y-2 justify-between" style={{ color: "var(--ink-muted)" }}>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block w-3 h-3 rounded-full" style={{ background: "var(--pass-grad)" }} />
            Powered by <b style={{ color: "var(--ink)" }}>The Pass</b>
          </span>
          <nav className="flex gap-5">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            {employer.slug && <Link href={`/careers/${employer.slug}/sms-terms`} className="hover:underline">Text terms</Link>}
          </nav>
        </div>
      </footer>
    </div>
  );
}
