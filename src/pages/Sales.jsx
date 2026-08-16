import React, { useState } from "react";
import {
  Search,
  CalendarDays,
  Receipt,
  Banknote,
  Smartphone,
  CreditCard,
  IndianRupee,
  Printer,
  X,
  Eye,
} from "lucide-react";

import "../App.css";
import { useSales } from "../context/SalesContext";

function Sales() {
  const { sales } = useSales();

  const [filter, setFilter] = useState("Today");
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] =
    useState("All");

  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const [selectedSale, setSelectedSale] =
    useState(null);

  const now = new Date();

  // ==========================================
  // SHOP INFORMATION
  // ==========================================

  const shopName = "BABA SNACKS & BAKERY";

  const shopAddress =
    "Kamala Niswas, Pradhansahi, Jatni - Sundarpada Rd, Sundarpada, Bhubaneswar - 751002";

  const shopPhone =
    "7735369980, 7653035947";

  // ==========================================
  // DATE FILTERS
  // ==========================================

  const isToday = (date) => {
    const d = new Date(date);

    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isYesterday = (date) => {
    const d = new Date(date);

    const yesterday = new Date(now);

    yesterday.setDate(
      now.getDate() - 1
    );

    return (
      d.getDate() ===
        yesterday.getDate() &&
      d.getMonth() ===
        yesterday.getMonth() &&
      d.getFullYear() ===
        yesterday.getFullYear()
    );
  };

  const isThisWeek = (date) => {
    const d = new Date(date);

    const startOfWeek = new Date(now);

    const day = startOfWeek.getDay();

    startOfWeek.setDate(
      startOfWeek.getDate() - day
    );

    startOfWeek.setHours(
      0,
      0,
      0,
      0
    );

    return (
      d >= startOfWeek &&
      d <= now
    );
  };

  const isThisMonth = (date) => {
    const d = new Date(date);

    return (
      d.getMonth() ===
        now.getMonth() &&
      d.getFullYear() ===
        now.getFullYear()
    );
  };

  const isThisYear = (date) => {
    const d = new Date(date);

    return (
      d.getFullYear() ===
      now.getFullYear()
    );
  };

  // ==========================================
  // CUSTOM DATE RANGE
  // ==========================================

  const isInCustomRange = (date) => {
    if (!customFrom || !customTo) return false;

    const start = new Date(`${customFrom}T00:00:00`);
    const end = new Date(`${customTo}T00:00:00`);
    end.setDate(end.getDate() + 1);

    const saleDate = new Date(date);

    return saleDate >= start && saleDate < end;
  };

  // ==========================================
  // FILTER SALES
  // ==========================================

  const getFilteredSales = () => {
    return sales.filter((sale) => {
      let matchesDate = true;

      if (filter === "Today") {
        matchesDate = isToday(
          sale.date
        );
      }

      if (filter === "Yesterday") {
        matchesDate =
          isYesterday(sale.date);
      }

      if (filter === "This Week") {
        matchesDate =
          isThisWeek(sale.date);
      }

      if (filter === "This Month") {
        matchesDate =
          isThisMonth(sale.date);
      }

      if (filter === "This Year") {
        matchesDate =
          isThisYear(sale.date);
      }

      if (filter === "Custom Range") {
        matchesDate =
          isInCustomRange(sale.date);
      }

      const invoiceNumber =
        sale.invoiceNumber || "";

      const matchesSearch =
        invoiceNumber
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesPayment =
        paymentFilter === "All" ||
        sale.paymentMethod ===
          paymentFilter;

      return (
        matchesDate &&
        matchesSearch &&
        matchesPayment
      );
    });
  };

  const filteredSales =
    getFilteredSales();

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalSales =
    filteredSales.reduce(
      (sum, sale) =>
        sum + Number(sale.total || 0),
      0
    );

  const totalBills =
    filteredSales.length;

  const totalItems =
    filteredSales.reduce(
      (sum, sale) =>
        sum +
        (sale.items || []).reduce(
          (itemSum, item) =>
            itemSum +
            Number(
              item.quantity || 0
            ),
          0
        ),
      0
    );

  // ==========================================
  // PAYMENT ICON
  // ==========================================

  const getPaymentIcon = (method) => {
    if (method === "Cash") {
      return <Banknote size={17} />;
    }

    if (method === "UPI") {
      return (
        <Smartphone size={17} />
      );
    }

    return (
      <CreditCard size={17} />
    );
  };

  // ==========================================
  // VIEW INVOICE
  // ==========================================

  const viewInvoice = (sale) => {
    setSelectedSale({
      ...sale,
      shopName,
      shopAddress,
      shopPhone,
    });
  };

  // ==========================================
  // PRINT INVOICE
  // ==========================================

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="sales-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <div>
          <h1>Sales</h1>

          <p>
            Track your sales, transactions
            and revenue.
          </p>
        </div>

        <div className="sales-filter">

          <CalendarDays size={18} />

          <select
            value={filter}
            onChange={(e) => {
              const value = e.target.value;
              setFilter(value);

              if (value === "Custom Range" && !customFrom) {
                const today = new Date().toISOString().split("T")[0];
                setCustomFrom(today);
                setCustomTo(today);
              }
            }}
          >
            <option value="Today">
              Today
            </option>

            <option value="Yesterday">
              Yesterday
            </option>

            <option value="This Week">
              This Week
            </option>

            <option value="This Month">
              This Month
            </option>

            <option value="This Year">
              This Year
            </option>

            <option value="Custom Range">
              Custom Range
            </option>
          </select>

        </div>

      </div>

      {filter === "Custom Range" && (
        <div className="sales-custom-range">
          <div className="sales-date-field">
            <CalendarDays size={17} />
            <label htmlFor="sales-from">From</label>
            <input
              id="sales-from"
              type="date"
              value={customFrom}
              onChange={(e) => {
                setCustomFrom(e.target.value);
                if (customTo && e.target.value > customTo) {
                  setCustomTo(e.target.value);
                }
              }}
            />
          </div>

          <div className="sales-date-field">
            <CalendarDays size={17} />
            <label htmlFor="sales-to">To</label>
            <input
              id="sales-to"
              type="date"
              min={customFrom || undefined}
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="sales-date-reset"
            onClick={() => {
              setCustomFrom("");
              setCustomTo("");
            }}
          >
            Clear Dates
          </button>
        </div>
      )}

      {/* ======================================
          STAT CARDS
      ====================================== */}

      <div className="sales-stats">

        <div className="sales-stat-card">

          <div className="sales-stat-icon">
            <IndianRupee size={22} />
          </div>

          <div>
            <span>
              Total Sales
            </span>

            <strong>
              ₹
              {totalSales.toFixed(2)}
            </strong>
          </div>

        </div>

        <div className="sales-stat-card">

          <div className="sales-stat-icon">
            <Receipt size={22} />
          </div>

          <div>
            <span>
              Total Bills
            </span>

            <strong>
              {totalBills}
            </strong>
          </div>

        </div>

        <div className="sales-stat-card">

          <div className="sales-stat-icon">
            <IndianRupee size={22} />
          </div>

          <div>
            <span>
              Items Sold
            </span>

            <strong>
              {totalItems}
            </strong>
          </div>

        </div>

      </div>

      {/* ======================================
          SEARCH + PAYMENT FILTER
      ====================================== */}

      <div className="sales-toolbar">

        <div className="sales-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search invoice..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <div className="sales-payment-filters">

          <button
            className={
              paymentFilter === "All"
                ? "active"
                : ""
            }
            onClick={() =>
              setPaymentFilter("All")
            }
          >
            All
          </button>

          <button
            className={
              paymentFilter === "Cash"
                ? "active"
                : ""
            }
            onClick={() =>
              setPaymentFilter("Cash")
            }
          >
            <Banknote size={16} />
            Cash
          </button>

          <button
            className={
              paymentFilter === "UPI"
                ? "active"
                : ""
            }
            onClick={() =>
              setPaymentFilter("UPI")
            }
          >
            <Smartphone size={16} />
            UPI
          </button>

          <button
            className={
              paymentFilter === "Card"
                ? "active"
                : ""
            }
            onClick={() =>
              setPaymentFilter("Card")
            }
          >
            <CreditCard size={16} />
            Card
          </button>

        </div>

      </div>

      {/* ======================================
          SALES TABLE
      ====================================== */}

      <div className="sales-card">

        <div className="sales-card-header">

          <div>
            <h2>
              Sales Transactions
            </h2>

            <p>
              {filteredSales.length}{" "}
              transactions found
            </p>
          </div>

        </div>

        {filteredSales.length === 0 ? (

          <div className="empty-sales">

            <Receipt size={45} />

            <h3>
              No sales found
            </h3>

            <p>
              Complete a payment from
              Billing to see sales here.
            </p>

          </div>

        ) : (

          <div className="sales-table-wrapper">

            <table className="sales-table">

              <thead>

                <tr>
                  <th>
                    Invoice
                  </th>

                  <th>
                    Date & Time
                  </th>

                  <th>
                    Items
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {filteredSales.map(
                  (sale) => (

                    <tr
                      key={sale.id}
                    >

                      {/* INVOICE */}

                      <td>

                        <strong>
                          {
                            sale.invoiceNumber
                          }
                        </strong>

                      </td>

                      {/* DATE */}

                      <td>

                        {new Date(
                          sale.date
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </td>

                      {/* ITEMS */}

                      <td>

                        {(
                          sale.items || []
                        ).reduce(
                          (
                            sum,
                            item
                          ) =>
                            sum +
                            Number(
                              item.quantity ||
                                0
                            ),
                          0
                        )}

                      </td>

                      {/* PAYMENT */}

                      <td>

                        <span className="payment-badge">

                          {getPaymentIcon(
                            sale.paymentMethod
                          )}

                          {
                            sale.paymentMethod
                          }

                        </span>

                      </td>

                      {/* TOTAL */}

                      <td className="sales-total">

                        ₹
                        {Number(
                          sale.total || 0
                        ).toFixed(2)}

                      </td>

                      {/* ACTION */}

                      <td>

                        <div className="sales-actions">

                          <button
                            className="sales-view-btn"
                            onClick={() =>
                              viewInvoice(
                                sale
                              )
                            }
                            title="View Invoice"
                          >
                            <Eye
                              size={17}
                            />

                            View
                          </button>

                          <button
                            className="sales-print-btn"
                            onClick={() =>
                              viewInvoice(
                                sale
                              )
                            }
                            title="Print Invoice"
                          >
                            <Printer
                              size={17}
                            />

                            Print
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ======================================
          INVOICE PREVIEW
      ====================================== */}

      {selectedSale && (

        <div className="invoice-modal-overlay">

          <div className="invoice-modal">

            {/* ACTION BUTTONS */}

            <div className="invoice-modal-actions">

              <button
                className="invoice-print-btn"
                onClick={printInvoice}
              >
                <Printer size={19} />
                Print
              </button>

              <button
                className="invoice-close-btn"
                onClick={() =>
                  setSelectedSale(null)
                }
              >
                <X size={19} />
              </button>

            </div>

            {/* THERMAL RECEIPT */}

            <div className="thermal-receipt">

              <div className="receipt-header">

                <h2>
                  {
                    selectedSale.shopName
                  }
                </h2>

                <p>
                  {
                    selectedSale.shopAddress
                  }
                </p>

                <p>
                  Ph:{" "}
                  {
                    selectedSale.shopPhone
                  }
                </p>

              </div>

              <div className="receipt-line">
                ------------------------------
              </div>

              <div className="receipt-meta">

                <p>
                  Date:{" "}
                  {new Date(
                    selectedSale.date
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p>
                  Invoice:{" "}
                  {
                    selectedSale.invoiceNumber
                  }
                </p>

              </div>

              <div className="receipt-line">
                ------------------------------
              </div>

              {/* ITEMS */}

              <div className="receipt-items">

                {(
                  selectedSale.items ||
                  []
                ).map(
                  (item, index) => (

                    <div
                      className="receipt-item"
                      key={
                        item.id ??
                        index
                      }
                    >

                      <span>
                        {item.name}
                        {" x"}
                        {item.quantity}
                      </span>

                      <strong>
                        ₹
                        {(
                          Number(
                            item.price
                          ) *
                          Number(
                            item.quantity
                          )
                        ).toFixed(2)}
                      </strong>

                    </div>

                  )
                )}

              </div>

              <div className="receipt-line">
                ------------------------------
              </div>

              <div className="receipt-total-row">

                <span>
                  Sub Total
                </span>

                <strong>
                  ₹
                  {Number(
                    selectedSale.subtotal ||
                      0
                  ).toFixed(2)}
                </strong>

              </div>

              <div className="receipt-total-row">

                <span>
                  GST
                </span>

                <strong>
                  ₹
                  {Number(
                    selectedSale.tax ||
                      0
                  ).toFixed(2)}
                </strong>

              </div>

              <div className="receipt-line">
                ------------------------------
              </div>

              <div className="receipt-total-row receipt-grand-total">

                <span>
                  TOTAL
                </span>

                <strong>
                  ₹
                  {Number(
                    selectedSale.total ||
                      0
                  ).toFixed(2)}
                </strong>

              </div>

              <div className="receipt-payment">

                <p>
                  Payment:{" "}
                  {(
                    selectedSale.paymentMethod ||
                    ""
                  ).toUpperCase()}
                </p>

              </div>

              <div className="receipt-footer">

                <p>
                  Thank You!
                </p>

                <p>
                  Visit Again
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Sales;