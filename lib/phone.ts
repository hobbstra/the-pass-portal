// "6195550100" or "+16195550100" -> "(619) 555-0100"; anything else is shown as typed.
export function formatPhone(p: string | null | undefined) {
  const d = (p ?? "").replace(/\D/g, "");
  const n = d.length === 11 && d[0] === "1" ? d.slice(1) : d;
  return n.length === 10 ? `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}` : (p ?? "");
}
