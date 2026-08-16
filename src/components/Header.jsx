import React, { useState } from "react";

import {
  LuBell,
  LuChevronDown,
  LuPackage,
  LuReceipt,
  LuX,
  LuMenu,
} from "react-icons/lu";

import { useProducts } from "../context/ProductContext";
import { useSales } from "../context/SalesContext";

function Header({
  setActivePage,
  setSidebarOpen,
}) {
  const { products } = useProducts();
  const { sales } = useSales();

  const [showNotifications, setShowNotifications] =
    useState(false);

  // ==========================================
  // LOW STOCK
  // ==========================================

  const lowStockProducts = products
    .filter(
      (product) =>
        Number(product.stock) <= 10
    )
    .slice(0, 5);

  // ==========================================
  // RECENT SALES
  // ==========================================

  const recentSales = [...sales]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 5);

  // ==========================================
  // NOTIFICATION COUNT
  // ==========================================

  const notificationCount =
    lowStockProducts.length +
    recentSales.length;

  // ==========================================
  // CLOSE
  // ==========================================

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  // ==========================================
  // GO TO PAGE
  // ==========================================

  const goToPage = (page) => {
    if (setActivePage) {
      setActivePage(page);
    }

    setShowNotifications(false);
  };

  return (
    <header className="top-header">

      {/* MOBILE MENU */}
      <button
        className="mobile-menu"
        type="button"
        aria-label="Open menu"
        onClick={() =>
          setSidebarOpen(
            (current) => !current
          )
        }
      >
        <LuMenu size={22} />
      </button>

      {/* SPACER */}
      <div className="header-spacer" />

      {/* NOTIFICATION */}
      <div className="notification-wrapper">

        <button
          className="notification-button"
          type="button"
          onClick={() =>
            setShowNotifications(
              (current) => !current
            )
          }
        >
          <LuBell size={21} />

          {notificationCount > 0 && (
            <span>
              {notificationCount > 9
                ? "9+"
                : notificationCount}
            </span>
          )}
        </button>

        {/* NOTIFICATION PANEL */}
        {showNotifications && (
          <div className="notification-panel">

            {/* HEADER */}
            <div className="notification-header">

              <div>
                <h3>
                  Notifications
                </h3>

                <small>
                  {notificationCount}{" "}
                  notification
                  {notificationCount !== 1
                    ? "s"
                    : ""}
                </small>
              </div>

              <button
                className="notification-close"
                type="button"
                onClick={
                  closeNotifications
                }
              >
                <LuX size={18} />
              </button>

            </div>

            {/* LIST */}
            <div className="notification-list">

              {notificationCount === 0 ? (
                <div className="no-notifications">

                  <LuBell size={32} />

                  <strong>
                    All caught up!
                  </strong>

                  <span>
                    No new notifications.
                  </span>

                </div>
              ) : (
                <>
                  {/* LOW STOCK */}
                  {lowStockProducts.map(
                    (product) => (
                      <button
                        key={`stock-${product.id}`}
                        className="notification-item warning"
                        type="button"
                        onClick={() =>
                          goToPage(
                            "Inventory"
                          )
                        }
                      >
                        <div className="notification-icon warning-icon">
                          <LuPackage
                            size={19}
                          />
                        </div>

                        <div className="notification-content">

                          <strong>
                            Low Stock
                          </strong>

                          <p>
                            {product.name}{" "}
                            has only{" "}
                            <b>
                              {product.stock}
                            </b>{" "}
                            items left.
                          </p>

                        </div>
                      </button>
                    )
                  )}

                  {/* RECENT SALES */}
                  {recentSales.map(
                    (sale) => (
                      <button
                        key={`sale-${sale.id}`}
                        className="notification-item"
                        type="button"
                        onClick={() =>
                          goToPage(
                            "Sales"
                          )
                        }
                      >
                        <div className="notification-icon sale-icon">
                          <LuReceipt
                            size={19}
                          />
                        </div>

                        <div className="notification-content">

                          <strong>
                            Sale Completed
                          </strong>

                          <p>
                            {
                              sale.invoiceNumber
                            }{" "}
                            · ₹
                            {Number(
                              sale.total || 0
                            ).toFixed(2)}
                          </p>

                        </div>
                      </button>
                    )
                  )}
                </>
              )}

            </div>

            {/* FOOTER */}
            {notificationCount > 0 && (
              <div className="notification-footer">
                <button
                  type="button"
                  onClick={
                    closeNotifications
                  }
                >
                  Close
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ADMIN PROFILE */}
      <div className="admin-profile">

        <div className="admin-avatar">
          A
        </div>

        <div className="admin-info">

          <strong>
            Admin
          </strong>

          <small>
            <i></i>
            Online
          </small>

        </div>

        <LuChevronDown size={18} />

      </div>

    </header>
  );
}

export default Header;