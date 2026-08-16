import React, {
  useEffect,
  useState,
} from "react";

import "./App.css";

import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";
import Backup from "./pages/Backup";

import {
  ProductProvider,
} from "./context/ProductContext";

import {
  SalesProvider,
} from "./context/SalesContext";

import { supabase } from "./supabase";

function App() {

  // ==========================================
  // AUTH STATE
  // ==========================================

  const [session, setSession] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  // ==========================================
  // PAGE
  // ==========================================

  const [activePage, setActivePage] =
    useState("Dashboard");

  // ==========================================
  // ADD PRODUCT
  // ==========================================

  const [openAddProduct, setOpenAddProduct] =
    useState(false);

  // ==========================================
  // CHECK EXISTING LOGIN
  // ==========================================

  useEffect(() => {

    const getInitialSession =
      async () => {

        const {
          data,
        } =
          await supabase.auth.getSession();

        setSession(
          data.session
        );

        setAuthLoading(false);
      };

    getInitialSession();

    // ========================================
    // AUTH STATE LISTENER
    // ========================================

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {

          setSession(
            newSession
          );

        }
      );

    return () => {

      authListener.subscription.unsubscribe();

    };

  }, []);

  // ==========================================
  // LOGIN SUCCESS
  // ==========================================

  const handleLogin = (
    newSession
  ) => {

    setSession(newSession);

    setActivePage(
      "Dashboard"
    );

  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {

    await supabase.auth.signOut();

    setSession(null);

    setActivePage(
      "Dashboard"
    );

  };

  // ==========================================
  // ADD PRODUCT FROM DASHBOARD
  // ==========================================

  const openAddProductPage = () => {

    setOpenAddProduct(true);

    setActivePage(
      "Inventory"
    );

  };

  // ==========================================
  // WAIT FOR AUTH
  // ==========================================

  if (authLoading) {

    return (
      <div className="auth-loading">

        <div className="login-logo">
          B
        </div>

        <p>
          Loading...
        </p>

      </div>
    );

  }

  // ==========================================
  // LOGIN PAGE
  // ==========================================

  if (!session) {

    return (
      <Login
        onLogin={
          handleLogin
        }
      />
    );

  }

  // ==========================================
  // MAIN APPLICATION
  // ==========================================

  return (

    <ProductProvider>

      <SalesProvider>

        <MainLayout
          activePage={
            activePage
          }
          setActivePage={
            setActivePage
          }
          onLogout={
            handleLogout
          }
        >

          {/* =========================
              DASHBOARD
          ========================= */}

          {activePage ===
            "Dashboard" && (

            <Dashboard
              setActivePage={
                setActivePage
              }
              openAddProductPage={
                openAddProductPage
              }
            />

          )}

          {/* =========================
              BILLING
          ========================= */}

          {activePage ===
            "Billing" && (

            <Billing />

          )}

          {/* =========================
              INVENTORY
          ========================= */}

          {activePage ===
            "Inventory" && (

            <Inventory
              openAddProduct={
                openAddProduct
              }
            />

          )}

          {/* =========================
              SALES
          ========================= */}

          {activePage ===
            "Sales" && (

            <Sales />

          )}

          {/* =========================
              SETTINGS
          ========================= */}

          {activePage ===
            "Settings" && (

            <Settings />

          )}

          {/* =========================
              BACKUP
          ========================= */}

          {activePage ===
            "Backup" && (

            <Backup />

          )}

        </MainLayout>

      </SalesProvider>

    </ProductProvider>

  );
}

export default App;