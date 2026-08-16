export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="mark">Rx</span>
        RxTrack
      </div>
      <nav className="sidebar-nav">
        <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>
          Dashboard
        </button>
        <button className={page === "inventory" ? "active" : ""} onClick={() => setPage("inventory")}>
          Inventory
        </button>
      </nav>
      <div className="sidebar-footer">
        Pharmacy Inventory Prototype
        <br />
        Candidate Assessment Build
      </div>
    </aside>
  );
}
