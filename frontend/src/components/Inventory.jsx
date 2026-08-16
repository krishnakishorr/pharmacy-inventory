import { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import ExpiryBar from "./ExpiryBar";
import MedicineForm from "./MedicineForm";

const CATEGORIES = [
  "Analgesic", "Antibiotic", "Antiseptic", "Antiviral", "Cardiac",
  "Dermatological", "Gastrointestinal", "Respiratory", "Supplement", "Other",
];

const STATUS_LABEL = {
  ok: "In Stock",
  low_stock: "Low Stock",
  expiring_soon: "Expiring Soon",
  expired: "Expired",
};

const currency = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

export default function Inventory({ autoOpenForm, onAutoOpenHandled }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (status) params.status = status;
    api.listMedicines(params)
      .then((res) => setItems(res.results ?? res))
      .finally(() => setLoading(false));
  }, [search, category, status]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (autoOpenForm) {
      setEditing(null);
      setFormOpen(true);
      onAutoOpenHandled?.();
    }
  }, [autoOpenForm, onAutoOpenHandled]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleCreate = async (data) => {
    await api.createMedicine(data);
    setFormOpen(false);
    showToast("Medicine added.");
    load();
  };

  const handleUpdate = async (data) => {
    await api.updateMedicine(editing.id, data);
    setFormOpen(false);
    setEditing(null);
    showToast("Medicine updated.");
    load();
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}" (batch ${item.batch_number})? This can't be undone.`)) return;
    await api.deleteMedicine(item.id);
    showToast("Medicine deleted.");
    load();
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>{items.length} medicine{items.length !== 1 ? "s" : ""} matching current filters.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>+ Add Medicine</button>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by name, batch or supplier…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="low_stock">Low Stock</option>
          <option value="expiring_soon">Expiring Soon</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="empty-state">Loading inventory…</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No medicines match these filters. Try clearing search or filters.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Unit Price</th>
                <th>Shelf Life</th>
                <th>Status</th>
                <th>Supplier</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="med-name">{m.name}</div>
                    <div className="med-batch">{m.batch_number}</div>
                  </td>
                  <td>{m.category}</td>
                  <td className="mono">{m.stock_quantity}</td>
                  <td className="mono">{currency(m.unit_price)}</td>
                  <td><ExpiryBar daysToExpiry={m.days_to_expiry} status={m.status} /></td>
                  <td><span className={`badge ${m.status}`}>{STATUS_LABEL[m.status]}</span></td>
                  <td>{m.supplier}</td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => { setEditing(m); setFormOpen(true); }}>Edit</button>
                      <button className="icon-btn danger" onClick={() => handleDelete(m)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {formOpen && (
        <MedicineForm
          initial={editing}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
          onSubmit={editing ? handleUpdate : handleCreate}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
