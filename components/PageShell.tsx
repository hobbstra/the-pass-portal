import Link from "next/link";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-10 border-b backdrop-blur"
        style={{ borderColor: "var(--border)", background: "rgba(13, 7, 22, 0.72)" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between font-sans-ui">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
            The Pass
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t font-sans-ui" style={{ borderColor: "var(--border)" }}>
        <div
          className="max-w-4xl mx-auto px-6 py-8 text-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ color: "var(--ink-muted)" }}
        >
          <span>&copy; {new Date().getFullYear()} The Pass</span>
          <nav className="flex gap-6">
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
