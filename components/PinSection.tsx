export default function PinSection({
  heightVh = 140,
  children,
}: {
  heightVh?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="relative" style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 min-h-screen flex items-center">{children}</div>
    </div>
  );
}
