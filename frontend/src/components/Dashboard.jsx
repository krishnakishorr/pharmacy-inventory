import { useEffect, useState } from "react";
import { api } from "../api";

const currency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function Dashboard({ onNavigateInventory }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.dashboard().then(setData).catch((e) => setError(e));
  }, []);

  if (error) {
    return (
      <div className="panel">
        <p>Could not reach the backend. Make sure the Django server is running at http://127.0.0.1:8000.</p>
      </div>
    );
  }

  if (!data) return <div className="panel">Loading dashboard…</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>A snapshot of current stock health across the pharmacy.</p>
        </div>
        <button className="btn btn-primary" onClick={onNavigateInventory}>+ Add Medicine</button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Items</div>
          <div className="value">{data.total_items}</div>
        </div>
        <div className="stat-card">
          <div className="label">Stock Value</div>
          <div className="value">{currency(data.total_stock_value)}</div>
        </div>
        <div className="stat-card warn">
          <div className="label">Low Stock</div>
          <div className="value">{data.low_stock_count}</div>
        </div>
        <div className="stat-card danger">
          <div className="label">Expired / Expiring</div>
          <div className="value">{data.expired_count + data.expiring_soon_count}</div>
        </div>
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h2>Low Stock — reorder soon</h2>
          {data.low_stock_items.length === 0 && <p style={{ color: "var(--muted)", fontSize: "0.87rem" }}>Nothing below reorder level.</p>}
          {data.low_stock_items.map((m) => (
            <div className="mini-row" key={m.id}>
              <span className="name">{m.name}</span>
              <span className="meta">{m.stock_quantity} left / reorder at {m.reorder_level}</span>
            </div>
          ))}
        </div>
        <div className="panel">
          <h2>Expiring Within 60 Days</h2>
          {data.expiring_soon_items.length === 0 && <p style={{ color: "var(--muted)", fontSize: "0.87rem" }}>Nothing expiring soon.</p>}
          {data.expiring_soon_items.map((m) => (
            <div className="mini-row" key={m.id}>
              <span className="name">{m.name}</span>
              <span className="meta">{m.days_to_expiry}d left · {m.batch_number}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
