import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function MainLayout({
  children,
  activePage,
  setActivePage,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
      />

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* MAIN AREA */}
      <div className="main-area">

        <Header
          setActivePage={setActivePage}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="page-content">
          {children}
        </div>

      </div>
    </div>
  );
}

export default MainLayout;