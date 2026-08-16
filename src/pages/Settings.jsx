import React, { useState } from "react";
import {
  Store,
  Receipt,
  User,
  Database,
  Save,
} from "lucide-react";

import "../App.css";

function Settings() {
  const [shopName, setShopName] = useState(
    localStorage.getItem("shopName") || "Baba Snacks and Bakery"
  );

  const [phone, setPhone] = useState(
    localStorage.getItem("shopPhone") || ""
  );

  const [address, setAddress] = useState(
    localStorage.getItem("shopAddress") || ""
  );

  const [invoicePrefix, setInvoicePrefix] = useState(
    localStorage.getItem("invoicePrefix") || "INV"
  );

  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    localStorage.setItem("shopName", shopName);
    localStorage.setItem("shopPhone", phone);
    localStorage.setItem("shopAddress", address);
    localStorage.setItem("invoicePrefix", invoicePrefix);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="page-container">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>
            Manage your shop and billing preferences.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={saveSettings}
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* SHOP INFORMATION */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-icon">
            <Store size={21} />
          </div>

          <div>
            <h2>Shop Information</h2>
            <p>
              Basic information about your shop.
            </p>
          </div>
        </div>

        <div className="settings-form">

          <div className="settings-field">
            <label>Shop Name</label>

            <input
              type="text"
              value={shopName}
              onChange={(e) =>
                setShopName(e.target.value)
              }
              placeholder="Enter shop name"
            />
          </div>

          <div className="settings-field">
            <label>Phone Number</label>

            <input
              type="text"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter phone number"
            />
          </div>

          <div className="settings-field full-width">
            <label>Shop Address</label>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Enter shop address"
              rows="3"
            />
          </div>

        </div>

      </div>

      {/* BILLING SETTINGS */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <Receipt size={21} />
          </div>

          <div>
            <h2>Billing Settings</h2>
            <p>
              Configure your billing preferences.
            </p>
          </div>

        </div>

        <div className="settings-form">

          <div className="settings-field">

            <label>GST</label>

            <input
              type="text"
              value="0%"
              disabled
            />

            <small>
              GST is currently disabled.
            </small>

          </div>

          <div className="settings-field">

            <label>Currency</label>

            <input
              type="text"
              value="₹ INR"
              disabled
            />

          </div>

        </div>

      </div>

      {/* INVOICE SETTINGS */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <Receipt size={21} />
          </div>

          <div>
            <h2>Invoice Settings</h2>
            <p>
              Customize your invoice numbering.
            </p>
          </div>

        </div>

        <div className="settings-form">

          <div className="settings-field">

            <label>Invoice Prefix</label>

            <input
              type="text"
              value={invoicePrefix}
              onChange={(e) =>
                setInvoicePrefix(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="INV"
            />

          </div>

        </div>

      </div>

      {/* USER SETTINGS */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <User size={21} />
          </div>

          <div>
            <h2>Admin & Users</h2>
            <p>
              User management will be added later.
            </p>
          </div>

        </div>

        <div className="settings-info-box">

          <strong>
            Admin Login
          </strong>

          <p>
            For now, the shop will use a simple
            login system. Multiple authorized users
            can be added in a future update.
          </p>

        </div>

      </div>

      {/* DATA MANAGEMENT */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <Database size={21} />
          </div>

          <div>
            <h2>Data Management</h2>
            <p>
              Manage your local shop data.
            </p>
          </div>

        </div>

        <div className="settings-info-box">

          <strong>
            Local Data Storage
          </strong>

          <p>
            Your products and sales data are
            currently stored in this browser.
          </p>

        </div>

      </div>

      {saved && (
        <div className="settings-saved">
          ✓ Settings saved successfully
        </div>
      )}

    </div>
  );
}

export default Settings;