import PageShell from "./PageShell";

export default function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
          {title}
        </h1>
        <p className="text-sm mb-8 font-sans-ui" style={{ color: "var(--ink-muted)" }}>
          Last updated {lastUpdated}
        </p>
        <div className="prose-legal leading-relaxed space-y-4">{children}</div>
      </div>
    </PageShell>
  );
}
