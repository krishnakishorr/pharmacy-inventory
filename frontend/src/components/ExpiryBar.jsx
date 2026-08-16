// Signature element: a shelf-life bar that visualises days-to-expiry at a glance,
// instead of just a text badge. Fill length + color both encode urgency.
export default function ExpiryBar({ daysToExpiry, status }) {
  const cap = 365; // scale: a full bar represents ~1 year of shelf life
  const pct = Math.max(0, Math.min(100, (daysToExpiry / cap) * 100));

  let color = "var(--green)";
  if (status === "expired") color = "var(--red)";
  else if (status === "expiring_soon") color = "var(--amber)";

  const width = status === "expired" ? 100 : pct;
  const label =
    status === "expired"
      ? `Expired ${Math.abs(daysToExpiry)}d ago`
      : `${daysToExpiry}d left`;

  return (
    <div>
      <div className="shelf-bar">
        <div className="fill" style={{ width: `${width}%`, background: color }} />
      </div>
      <div className="shelf-label">{label}</div>
    </div>
  );
}
