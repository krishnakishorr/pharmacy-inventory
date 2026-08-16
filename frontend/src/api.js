const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error("Request failed");
    err.status = res.status;
    err.body = body;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  listMedicines: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/medicines/${qs ? `?${qs}` : ""}`);
  },
  dashboard: () => request("/medicines/dashboard/"),
  createMedicine: (data) => request("/medicines/", { method: "POST", body: JSON.stringify(data) }),
  updateMedicine: (id, data) => request(`/medicines/${id}/`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMedicine: (id) => request(`/medicines/${id}/`, { method: "DELETE" }),
};
