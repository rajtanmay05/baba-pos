import {
  LuLayoutDashboard,
  LuReceiptText,
  LuPackage,
  LuChartNoAxesCombined,
  LuSettings,
  LuCloud,
  LuLogOut,
  LuX,
} from "react-icons/lu";

import logo from "../assets/logo.png";

const menuItems = [
  { label: "Dashboard", icon: LuLayoutDashboard },
  { label: "Billing", icon: LuReceiptText },
  { label: "Inventory", icon: LuPackage },
  { label: "Sales", icon: LuChartNoAxesCombined },
  { label: "Settings", icon: LuSettings },
  { label: "Backup", icon: LuCloud },
];

function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
}) {
  const handlePageClick = (page) => {
    setActivePage(page);

    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "open" : ""
      }`}
    >
      {/* MOBILE CLOSE */}
      <button
        className="sidebar-close"
        type="button"
        onClick={() => setSidebarOpen(false)}
      >
        <LuX size={22} />
      </button>

      {/* LOGO */}
      <div className="sidebar-logo">
        <img
          src={logo}
          alt="BABA Logo"
        />
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active =
            activePage === item.label;

          return (
            <button
              key={item.label}
              type="button"
              className={`sidebar-item ${
                active ? "active" : ""
              }`}
              onClick={() =>
                handlePageClick(item.label)
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <button
        className="logout-button"
        type="button"
        onClick={onLogout}
      >
        <LuLogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;