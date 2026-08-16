import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../supabase";

const SalesContext = createContext(null);

export function SalesProvider({ children }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD SALES FROM SUPABASE
  // ==========================================

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        throw error;
      }

      const cloudSales = (data || []).map((row) => ({
        ...row.sale_data,
        id: row.id,
      }));

      setSales(cloudSales);
    } catch (error) {
      console.error("Error loading sales:", error);

      // Fallback to local storage
      const savedSales =
        localStorage.getItem("baba_sales");

      if (savedSales) {
        try {
          setSales(JSON.parse(savedSales));
        } catch {
          setSales([]);
        }
      } else {
        setSales([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // KEEP LOCAL CACHE
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "baba_sales",
      JSON.stringify(sales)
    );
  }, [sales]);

  // ==========================================
  // ADD NEW SALE
  // ==========================================

  const addSale = async (sale) => {
    try {
      const { data, error } = await supabase
        .from("sales")
        .insert([
          {
            sale_data: sale,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newSale = {
        ...data.sale_data,
        id: data.id,
      };

      setSales((currentSales) => [
        newSale,
        ...currentSales,
      ]);

      return newSale;

    } catch (error) {
      console.error(
        "Error adding sale:",
        error
      );

      alert(
        "Sale save nahi hui. Please try again."
      );

      return null;
    }
  };

  // ==========================================
  // DELETE SALE
  // ==========================================

  const deleteSale = async (id) => {
    try {
      const { error } = await supabase
        .from("sales")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setSales((currentSales) =>
        currentSales.filter(
          (sale) => sale.id !== id
        )
      );

    } catch (error) {
      console.error(
        "Error deleting sale:",
        error
      );

      alert(
        "Sale delete nahi hui. Please try again."
      );
    }
  };

  return (
    <SalesContext.Provider
      value={{
        sales,
        loading,
        addSale,
        deleteSale,
        loadSales,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);

  if (!context) {
    throw new Error(
      "useSales must be used inside SalesProvider"
    );
  }

  return context;
}