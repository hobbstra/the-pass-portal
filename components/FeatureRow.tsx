export default function FeatureRow({
  index,
  title,
  body,
  clip,
}: {
  index: number;
  title: string;
  body: string;
  clip?: React.ReactNode;
}) {
  return (
    <div
      className="fade-in relative border-b py-12 overflow-hidden sm:flex sm:items-center sm:gap-10 w-full"
      style={{ borderColor: "var(--border)", animationDelay: `${160 + index * 90}ms` }}
    >
      <span
        className="pointer-events-none absolute -top-6 right-0 text-[7rem] sm:text-[9rem] font-black leading-none select-none"
        style={{ color: "transparent", WebkitTextStroke: "1px var(--border)" }}
        aria-hidden="true"
      >
        {String(index).padStart(2, "0")}
      </span>

      <div className="relative flex-1">
        <h3
          className="text-4xl sm:text-5xl font-black leading-[1.05] mb-4 max-w-xl"
          style={{
            backgroundImage: "var(--accent-gradient)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </h3>
        <p className="max-w-lg text-base sm:text-lg leading-relaxed" style={{ color: "var(--ink-muted)" }}>
          {body}
        </p>
      </div>

      {clip && <div className="relative mt-8 sm:mt-0 shrink-0">{clip}</div>}
    </div>
  );
}
