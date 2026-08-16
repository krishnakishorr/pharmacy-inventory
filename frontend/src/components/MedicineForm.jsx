import { useState } from "react";

const CATEGORIES = [
  "Analgesic", "Antibiotic", "Antiseptic", "Antiviral", "Cardiac",
  "Dermatological", "Gastrointestinal", "Respiratory", "Supplement", "Other",
];

const emptyForm = {
  name: "", category: "Other", batch_number: "", stock_quantity: "",
  reorder_level: "20", unit_price: "", supplier: "", expiry_date: "",
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.batch_number.trim()) errors.batch_number = "Batch number is required.";
  if (form.stock_quantity === "" || Number(form.stock_quantity) < 0)
    errors.stock_quantity = "Enter a stock quantity of 0 or more.";
  if (form.reorder_level === "" || Number(form.reorder_level) < 0)
    errors.reorder_level = "Enter a reorder level of 0 or more.";
  if (form.unit_price === "" || Number(form.unit_price) < 0)
    errors.unit_price = "Enter a valid unit price.";
  if (!form.supplier.trim()) errors.supplier = "Supplier is required.";
  if (!form.expiry_date) errors.expiry_date = "Expiry date is required.";
  return errors;
}

export default function MedicineForm({ initial, onCancel, onSubmit }) {
  const [form, setForm] = useState(initial ? { ...initial } : emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSaving(true);
    setServerError("");
    try {
      await onSubmit({
        ...form,
        stock_quantity: Number(form.stock_quantity),
        reorder_level: Number(form.reorder_level),
        unit_price: Number(form.unit_price),
      });
    } catch (err) {
      if (err.body) {
        const firstKey = Object.keys(err.body)[0];
        setServerError(firstKey ? `${firstKey}: ${err.body[firstKey]}` : "Could not save. Check the fields and try again.");
      } else {
        setServerError("Could not save. Check the fields and try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initial ? "Edit Medicine" : "Add Medicine"}</h2>
        <p className="sub">Fields marked required must be filled before saving.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field full">
              <label>Medicine Name</label>
              <input className={errors.name ? "error" : ""} value={form.name} onChange={set("name")} placeholder="e.g. Paracetamol 500mg" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label>Category</label>
              <select value={form.category} onChange={set("category")}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-field">
              <label>Batch Number</label>
              <input className={errors.batch_number ? "error" : ""} value={form.batch_number} onChange={set("batch_number")} placeholder="e.g. BN2045-11" />
              {errors.batch_number && <span className="field-error">{errors.batch_number}</span>}
            </div>

            <div className="form-field">
              <label>Stock Quantity</label>
              <input type="number" min="0" className={errors.stock_quantity ? "error" : ""} value={form.stock_quantity} onChange={set("stock_quantity")} />
              {errors.stock_quantity && <span className="field-error">{errors.stock_quantity}</span>}
            </div>

            <div className="form-field">
              <label>Reorder Level</label>
              <input type="number" min="0" className={errors.reorder_level ? "error" : ""} value={form.reorder_level} onChange={set("reorder_level")} />
              {errors.reorder_level && <span className="field-error">{errors.reorder_level}</span>}
            </div>

            <div className="form-field">
              <label>Unit Price (₹)</label>
              <input type="number" min="0" step="0.01" className={errors.unit_price ? "error" : ""} value={form.unit_price} onChange={set("unit_price")} />
              {errors.unit_price && <span className="field-error">{errors.unit_price}</span>}
            </div>

            <div className="form-field">
              <label>Expiry Date</label>
              <input type="date" className={errors.expiry_date ? "error" : ""} value={form.expiry_date} onChange={set("expiry_date")} />
              {errors.expiry_date && <span className="field-error">{errors.expiry_date}</span>}
            </div>

            <div className="form-field full">
              <label>Supplier</label>
              <input className={errors.supplier ? "error" : ""} value={form.supplier} onChange={set("supplier")} placeholder="e.g. Kerala State Drugs Ltd" />
              {errors.supplier && <span className="field-error">{errors.supplier}</span>}
            </div>
          </div>

          {serverError && <p className="field-error" style={{ marginTop: 12 }}>{serverError}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : initial ? "Save Changes" : "Add Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
