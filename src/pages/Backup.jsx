import React, { useEffect, useState } from "react";
import {
  Cloud,
  Package,
  Receipt,
  RefreshCw,
  CheckCircle2,
  Database,
} from "lucide-react";

import { supabase } from "../supabase";

function Backup() {
  const [productsCount, setProductsCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // ==========================================
  // LOAD CLOUD DATA STATUS
  // ==========================================

  const loadCloudStatus = async () => {
    try {
      setLoading(true);

      const { count: products, error: productsError } =
        await supabase
          .from("products")
          .select("*", {
            count: "exact",
            head: true,
          });

      if (productsError) {
        throw productsError;
      }

      const { count: sales, error: salesError } =
        await supabase
          .from("sales")
          .select("*", {
            count: "exact",
            head: true,
          });

      if (salesError) {
        throw salesError;
      }

      setProductsCount(products || 0);
      setSalesCount(sales || 0);
      setLastSync(new Date());
    } catch (error) {
      console.error("Error checking cloud status:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadCloudStatus();
  }, []);

  // ==========================================
  // SYNC NOW
  // ==========================================

  const handleSync = async () => {
    setSyncing(true);

    await loadCloudStatus();

    setSyncing(false);
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "Not available";
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="backup-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="page-header">
        <div>
          <h1>Cloud Backup</h1>

          <p>
            Keep your shop data safely synced
            with the cloud.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={handleSync}
          disabled={syncing}
        >
          <RefreshCw
            size={18}
            className={syncing ? "backup-spin" : ""}
          />

          {syncing ? "Checking..." : "Sync Now"}
        </button>
      </div>

      {/* ======================================
          CLOUD STATUS
      ====================================== */}

      <div className="backup-status-card">

        <div className="backup-status-icon">
          <Cloud size={30} />
        </div>

        <div className="backup-status-content">

          <div className="backup-status-title">
            <h2>Cloud Connected</h2>

            <span className="backup-online">
              <span></span>
              Online
            </span>
          </div>

          <p>
            Your shop data is connected to
            Supabase cloud storage.
          </p>

        </div>

        <CheckCircle2
          className="backup-success-icon"
          size={28}
        />

      </div>

      {/* ======================================
          DATA CARDS
      ====================================== */}

      <div className="backup-stats">

        {/* PRODUCTS */}

        <div className="backup-stat-card">

          <div className="backup-stat-icon">
            <Package size={22} />
          </div>

          <div>
            <span>Products</span>

            <strong>
              {loading ? "..." : productsCount}
            </strong>
          </div>

          <div className="backup-synced">
            <CheckCircle2 size={15} />
            Synced
          </div>

        </div>

        {/* SALES */}

        <div className="backup-stat-card">

          <div className="backup-stat-icon">
            <Receipt size={22} />
          </div>

          <div>
            <span>Sales Transactions</span>

            <strong>
              {loading ? "..." : salesCount}
            </strong>
          </div>

          <div className="backup-synced">
            <CheckCircle2 size={15} />
            Synced
          </div>

        </div>

      </div>

      {/* ======================================
          BACKUP INFORMATION
      ====================================== */}

      <div className="backup-card">

        <div className="backup-card-header">

          <div className="backup-card-icon">
            <Database size={21} />
          </div>

          <div>
            <h2>Cloud Data</h2>

            <p>
              Your important shop data is stored
              securely in the cloud.
            </p>
          </div>

        </div>

        <div className="backup-info-grid">

          <div className="backup-info-item">
            <span>Products</span>

            <strong>
              {loading ? "..." : productsCount}
            </strong>
          </div>

          <div className="backup-info-item">
            <span>Sales</span>

            <strong>
              {loading ? "..." : salesCount}
            </strong>
          </div>

          <div className="backup-info-item">
            <span>Status</span>

            <strong className="backup-status-text">
              Connected
            </strong>
          </div>

          <div className="backup-info-item">
            <span>Last Check</span>

            <strong>
              {formatTime(lastSync)}
            </strong>
          </div>

        </div>

      </div>

      {/* ======================================
          MULTI DEVICE INFO
      ====================================== */}

      <div className="backup-card backup-device-card">

        <div className="backup-device-icon">
          <Cloud size={24} />
        </div>

        <div>
          <h3>
            Access your data from anywhere
          </h3>

          <p>
            Once you log in from another
            authorized device, your cloud
            products and sales data can be
            accessed from the same database.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Backup;