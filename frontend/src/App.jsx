import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [autoOpenForm, setAutoOpenForm] = useState(false);

  const goToInventoryAndAdd = () => {
    setPage("inventory");
    setAutoOpenForm(true);
  };

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <main className="main">
        {page === "dashboard" && <Dashboard onNavigateInventory={goToInventoryAndAdd} />}
        {page === "inventory" && (
          <Inventory autoOpenForm={autoOpenForm} onAutoOpenHandled={() => setAutoOpenForm(false)} />
        )}
      </main>
    </div>
  );
}
