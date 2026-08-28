import Link from "next/link";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between font-sans-ui">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
            The Pass
          </Link>
          <nav className="text-sm flex gap-6" style={{ color: "var(--ink-muted)" }}>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/eula" className="hover:underline">EULA</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t font-sans-ui" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto px-6 py-8 text-sm flex items-center justify-between" style={{ color: "var(--ink-muted)" }}>
          <span>&copy; {new Date().getFullYear()} The Pass</span>
          <span>
            <a href="mailto:support@thepass.cloud" className="hover:underline">support@thepass.cloud</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
