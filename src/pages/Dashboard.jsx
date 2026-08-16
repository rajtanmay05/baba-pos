import React, { useMemo } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  IndianRupee,
  TrendingUp,
  Package,
  AlertTriangle,
  Plus,
  FileText,
  Boxes,
  Wallet,
  BarChart3,
  Upload,
} from "lucide-react";

import "../App.css";

import { useProducts } from "../context/ProductContext";
import { useSales } from "../context/SalesContext";

function Dashboard({
  setActivePage,
  openAddProductPage,
}) {
  const { products } = useProducts();
  const { sales } = useSales();

  const now = new Date();

  // ==========================================
  // TODAY CHECK
  // ==========================================

  const isToday = (date) => {
    const d = new Date(date);

    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  // ==========================================
  // TODAY'S SALES
  // ==========================================

  const todaySales = useMemo(() => {
    return sales.filter((sale) => isToday(sale.date));
  }, [sales]);

  const todayRevenue = todaySales.reduce(
    (sum, sale) =>
      sum + Number(sale.total || 0),
    0
  );

  const todayBills = todaySales.length;

  const todayItemsSold = todaySales.reduce(
    (sum, sale) =>
      sum +
      (sale.items || []).reduce(
        (itemSum, item) =>
          itemSum +
          Number(item.quantity || 0),
        0
      ),
    0
  );

  // ==========================================
  // TOTAL STOCK VALUE
  // ==========================================

  const totalStockValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) *
        Number(product.stock || 0),
    0
  );

  // ==========================================
  // LOW STOCK
  // ==========================================

  const lowStock = products
    .filter(
      (product) =>
        Number(product.stock) <= 10
    )
    .sort(
      (a, b) =>
        Number(a.stock) -
        Number(b.stock)
    )
    .slice(0, 5);

  // ==========================================
  // TOP SELLING PRODUCTS
  // ==========================================

  const topProducts = useMemo(() => {
    const soldMap = {};

    sales.forEach((sale) => {
      (sale.items || []).forEach((item) => {
        if (!soldMap[item.name]) {
          soldMap[item.name] = 0;
        }

        soldMap[item.name] +=
          Number(item.quantity || 0);
      });
    });

    return Object.entries(soldMap)
      .map(([name, sold]) => ({
        name,
        sold,
      }))
      .sort(
        (a, b) => b.sold - a.sold
      )
      .slice(0, 5);
  }, [sales]);

  // ==========================================
  // RECENT TRANSACTIONS
  // ==========================================

  const recentTransactions = [...sales]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 5);

  // ==========================================
  // SALES GRAPH - LAST 7 DAYS
  // ==========================================

  const salesData = useMemo(() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);

      date.setDate(
        now.getDate() - i
      );

      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);

      nextDate.setDate(
        date.getDate() + 1
      );

      const daySales = sales
        .filter((sale) => {
          const saleDate = new Date(
            sale.date
          );

          return (
            saleDate >= date &&
            saleDate < nextDate
          );
        })
        .reduce(
          (sum, sale) =>
            sum +
            Number(sale.total || 0),
          0
        );

      days.push({
        day: date.toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
          }
        ),
        sales: daySales,
      });
    }

    return days;
  }, [sales]);

  // ==========================================
  // PAYMENT TOTALS
  // ==========================================

  const cashReceived = todaySales
    .filter(
      (sale) =>
        sale.paymentMethod === "Cash"
    )
    .reduce(
      (sum, sale) =>
        sum +
        Number(sale.total || 0),
      0
    );

  const upiReceived = todaySales
    .filter(
      (sale) =>
        sale.paymentMethod === "UPI"
    )
    .reduce(
      (sum, sale) =>
        sum +
        Number(sale.total || 0),
      0
    );

  const cardReceived = todaySales
    .filter(
      (sale) =>
        sale.paymentMethod === "Card"
    )
    .reduce(
      (sum, sale) =>
        sum +
        Number(sale.total || 0),
      0
    );

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* ================= BANNER ================= */}

      <div className="dashboard-banner">
        <img
          src="/banner.png"
          alt="Baba Snacks and Bakery"
        />
      </div>

      {/* ================= PAGE TITLE ================= */}

      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, Admin. Here's
            today's shop overview.
          </p>
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="stats-grid">

        {/* TODAY SALES */}

        <div className="stat-card">
          <div className="stat-icon yellow">
            <IndianRupee size={25} />
          </div>

          <div className="stat-info">
            <span>
              Today's Sales
            </span>

            <strong>
              ₹{todayRevenue.toFixed(2)}
            </strong>

            <small>
              {todayBills} bills today
            </small>
          </div>
        </div>

        {/* TODAY ITEMS */}

        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={25} />
          </div>

          <div className="stat-info">
            <span>
              Items Sold Today
            </span>

            <strong>
              {todayItemsSold}
            </strong>

            <small>
              Items sold
            </small>
          </div>
        </div>

        {/* PRODUCTS */}

        <div className="stat-card">
          <div className="stat-icon purple">
            <Package size={25} />
          </div>

          <div className="stat-info">
            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>

            <small>
              Active products
            </small>
          </div>
        </div>

        {/* LOW STOCK */}

        <div className="stat-card">
          <div className="stat-icon red">
            <AlertTriangle size={25} />
          </div>

          <div className="stat-info">
            <span>
              Low Stock Items
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    Number(product.stock) <= 10
                ).length
              }
            </strong>

            <small className="warning-text">
              Reorder soon
            </small>
          </div>
        </div>

        {/* STOCK VALUE */}

        <div className="stat-card">
          <div className="stat-icon blue">
            <Boxes size={25} />
          </div>

          <div className="stat-info">
            <span>
              Total Stock Value
            </span>

            <strong>
              ₹
              {totalStockValue.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </strong>

            <small>
              Current inventory
            </small>
          </div>
        </div>

      </div>

      {/* ================= MIDDLE SECTION ================= */}

      <div className="dashboard-middle">

        {/* SALES GRAPH */}

        <div className="dashboard-panel sales-panel">

          <div className="panel-header">
            <div>
              <h2>
                Sales Overview
              </h2>

              <span>
                Sales performance for
                the last 7 days
              </span>
            </div>

            <button
              className="period-btn"
              type="button"
            >
              Last 7 Days ▾
            </button>
          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={salesData}
              >

                <CartesianGrid
                  stroke="#3a2915"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="day"
                  stroke="#b9a58a"
                />

                <YAxis
                  stroke="#b9a58a"
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "#211507",
                    border:
                      "1px solid #8b5d08",
                    borderRadius:
                      "10px",
                    color: "#fff",
                  }}
                  formatter={(value) => [
                    `₹${Number(
                      value
                    ).toFixed(2)}`,
                    "Sales",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#f5ad00"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#f5ad00",
                    stroke:
                      "#f5ad00",
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="dashboard-panel quick-panel">

          <div className="panel-header">
            <div>
              <h2>
                Quick Actions
              </h2>

              <span>
                Commonly used actions
              </span>
            </div>
          </div>

          <div className="quick-grid">

            {/* NEW BILL */}

            <button
              className="quick-btn"
              type="button"
              onClick={() =>
                setActivePage("Billing")
              }
            >
              <FileText size={23} />

              <span>
                New Bill
              </span>
            </button>

            {/* ADD PRODUCT */}

            <button
              className="quick-btn"
              type="button"
              onClick={() => {
                if (openAddProductPage) {
                  openAddProductPage();
                } else {
                  setActivePage(
                    "Inventory"
                  );
                }
              }}
            >
              <Plus size={23} />

              <span>
                Add Product
              </span>
            </button>

            {/* STOCK UPDATE */}

            <button
              className="quick-btn"
              type="button"
              onClick={() =>
                setActivePage(
                  "Inventory"
                )
              }
            >
              <Boxes size={23} />

              <span>
                Stock Update
              </span>
            </button>

            {/* DAILY REPORT */}

            <button
              className="quick-btn"
              type="button"
              onClick={() =>
                setActivePage("Sales")
              }
            >
              <BarChart3 size={23} />

              <span>
                Daily Report
              </span>
            </button>

            {/* EXPENSES */}

            <button
              className="quick-btn"
              type="button"
              onClick={() =>
                alert(
                  "Expenses module coming soon."
                )
              }
            >
              <Wallet size={23} />

              <span>
                Expenses
              </span>
            </button>

            {/* BACKUP */}

            <button
              className="quick-btn"
              type="button"
              onClick={() =>
                setActivePage("Backup")
              }
            >
              <Upload size={23} />

              <span>
                Backup Now
              </span>
            </button>

          </div>
        </div>

      </div>

      {/* ================= BOTTOM SECTION ================= */}

      <div className="dashboard-bottom">

        {/* LOW STOCK */}

        <div className="dashboard-panel">

          <div className="panel-header">
            <h2>
              Low Stock Items
            </h2>

            <button
              className="view-btn"
              type="button"
              onClick={() =>
                setActivePage(
                  "Inventory"
                )
              }
            >
              View All
            </button>
          </div>

          <div className="stock-list">

            {lowStock.length === 0 ? (

              <div className="empty-sales">
                <Package size={35} />

                <p>
                  No low stock items.
                </p>
              </div>

            ) : (

              lowStock.map(
                (item) => (

                  <div
                    className="stock-item"
                    key={item.id}
                  >

                    <div className="product-placeholder">
                      <Package
                        size={22}
                      />
                    </div>

                    <div className="stock-name">
                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        Stock:{" "}
                        {item.stock}
                      </span>
                    </div>

                    <span className="low-stock-badge">
                      Low Stock
                    </span>

                  </div>

                )
              )

            )}

          </div>
        </div>

        {/* TOP SELLING */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <h2>
              Top Selling Products
            </h2>

            <button
              className="period-btn"
              type="button"
            >
              All Time ▾
            </button>

          </div>

          <div className="top-products">

            {topProducts.length === 0 ? (

              <div className="empty-sales">
                <Package size={35} />

                <p>
                  No sales yet.
                </p>
              </div>

            ) : (

              topProducts.map(
                (product, index) => {

                  const maxSold =
                    topProducts[0]
                      ?.sold || 1;

                  return (
                    <div
                      className="top-product"
                      key={
                        product.name
                      }
                    >

                      <span className="rank">
                        {index + 1}
                      </span>

                      <div className="product-icon">
                        <Package
                          size={19}
                        />
                      </div>

                      <span className="product-title">
                        {product.name}
                      </span>

                      <div className="progress">

                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              (product.sold /
                                maxSold) *
                              100
                            }%`,
                          }}
                        />

                      </div>

                      <strong>
                        {product.sold} pcs
                      </strong>

                    </div>
                  );
                }
              )

            )}

          </div>
        </div>

        {/* RECENT TRANSACTIONS */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <h2>
              Recent Transactions
            </h2>

            <button
              className="view-btn"
              type="button"
              onClick={() =>
                setActivePage("Sales")
              }
            >
              View All
            </button>

          </div>

          <div className="transactions">

            {recentTransactions.length ===
            0 ? (

              <div className="empty-sales">

                <FileText
                  size={35}
                />

                <p>
                  No transactions yet.
                </p>

              </div>

            ) : (

              recentTransactions.map(
                (transaction) => (

                  <div
                    className="transaction"
                    key={
                      transaction.id
                    }
                  >

                    <div className="transaction-icon">
                      <FileText
                        size={19}
                      />
                    </div>

                    <div className="transaction-info">

                      <strong>
                        {
                          transaction.invoiceNumber
                        }
                      </strong>

                      <span>
                        {new Date(
                          transaction.date
                        ).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute:
                              "2-digit",
                          }
                        )}
                      </span>

                    </div>

                    <div className="transaction-right">

                      <strong>
                        ₹
                        {Number(
                          transaction.total ||
                            0
                        ).toFixed(2)}
                      </strong>

                      <span>
                        Completed
                      </span>

                    </div>

                  </div>

                )
              )

            )}

          </div>
        </div>

      </div>

      {/* ================= SUMMARY ================= */}

      <div className="dashboard-panel summary-panel">

        <div className="panel-header">
          <h2>
            Today's Summary
          </h2>
        </div>

        <div className="summary-grid">

          <div>
            <span>
              Total Bills
            </span>

            <strong>
              {todayBills}
            </strong>
          </div>

          <div>
            <span>
              Total Items Sold
            </span>

            <strong>
              {todayItemsSold}
            </strong>
          </div>

          <div>
            <span>
              Cash Received
            </span>

            <strong>
              ₹
              {cashReceived.toFixed(
                2
              )}
            </strong>
          </div>

          <div>
            <span>
              UPI Received
            </span>

            <strong>
              ₹
              {upiReceived.toFixed(
                2
              )}
            </strong>
          </div>

          <div>
            <span>
              Card Received
            </span>

            <strong>
              ₹
              {cardReceived.toFixed(
                2
              )}
            </strong>
          </div>

          <div className="net-profit">
            <span>
              Today's Revenue
            </span>

            <strong>
              ₹
              {todayRevenue.toFixed(
                2
              )}
            </strong>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;