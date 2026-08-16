import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { defaultProducts } from "../data/products";
import { supabase } from "../supabase";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD PRODUCTS FROM SUPABASE
  // ==========================================

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        throw error;
      }

      // If Supabase table is empty,
      // migrate existing local products
      if (!data || data.length === 0) {
        const localProducts =
          localStorage.getItem("baba_products");

        let productsToUpload = defaultProducts;

        if (localProducts) {
          try {
            productsToUpload =
              JSON.parse(localProducts);
          } catch {
            productsToUpload = defaultProducts;
          }
        }

        const productsForCloud =
          productsToUpload.map((product) => ({
            name: product.name,
            category: product.category,
            price: Number(product.price),
            stock: Number(product.stock),
          }));

        const { data: insertedProducts, error: insertError } =
          await supabase
            .from("products")
            .insert(productsForCloud)
            .select();

        if (insertError) {
          throw insertError;
        }

        setProducts(insertedProducts || []);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error(
        "Error loading products:",
        error
      );

      // Fallback to local data
      const savedProducts =
        localStorage.getItem("baba_products");

      if (savedProducts) {
        try {
          setProducts(JSON.parse(savedProducts));
        } catch {
          setProducts(defaultProducts);
        }
      } else {
        setProducts(defaultProducts);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // KEEP LOCAL CACHE
  // ==========================================

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(
        "baba_products",
        JSON.stringify(products)
      );
    }
  }, [products]);

  // ==========================================
  // ADD PRODUCT
  // ==========================================

  const addProduct = async (product, imageFile = null) => {
    const newProduct = {
      name: product.name,
      category: product.category,
      price: Number(product.price),
      stock: Number(product.stock),
    };

    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select()
      .single();

    if (error) {
      console.error("SUPABASE ADD PRODUCT ERROR:", error);
      alert(
        "Product add nahi hua.\n\n" +
        error.message
      );
      return null;
    }

    let savedProduct = data;

    // Product photo: upload to Supabase Storage and save its public URL.
    if (imageFile) {
      try {
        const extension =
          imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeName =
          imageFile.name
            .replace(/[^a-zA-Z0-9._-]/g, "-")
            .replace(/-+/g, "-");
        const filePath = `${data.id}-${Date.now()}-${safeName || `product.${extension}`}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type || "image/jpeg",
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        const { data: updatedData, error: imageDbError } =
          await supabase
            .from("products")
            .update({ image_url: imageUrl })
            .eq("id", data.id)
            .select()
            .single();

        if (imageDbError) {
          console.error("PRODUCT IMAGE DB ERROR:", imageDbError);
          alert(
            "Product add ho gaya, lekin photo save nahi hui.\n\n" +
            "Supabase products table mein image_url column add karo."
          );
        } else {
          savedProduct = updatedData;
        }
      } catch (imageError) {
        console.error("PRODUCT IMAGE UPLOAD ERROR:", imageError);
        alert(
          "Product add ho gaya, lekin photo upload nahi hui.\n\n" +
          imageError.message
        );
      }
    }

    setProducts((currentProducts) => [
      ...currentProducts,
      savedProduct,
    ]);

    return savedProduct;
  };

  // ==========================================
  // UPDATE STOCK
  // ==========================================

  const updateStock = async (id, newStock) => {
    const stockValue = Number(newStock);

    const { data, error } = await supabase
      .from("products")
      .update({
        stock: stockValue,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Error updating stock:",
        error
      );

      alert(
        "Stock update nahi hua. Please try again."
      );

      return;
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id
          ? data
          : product
      )
    );
  };

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  const updateProduct = async (
    id,
    updatedData,
    imageFile = null
  ) => {
    try {
      const productUpdate = {
        name: updatedData.name,
        category: updatedData.category,
        price: Number(updatedData.price),
        stock: Number(updatedData.stock),
      };

      // Upload a replacement photo first when one was selected.
      if (imageFile) {
        const safeName =
          imageFile.name
            .replace(/[^a-zA-Z0-9._-]/g, "-")
            .replace(/-+/g, "-");

        const filePath = `${id}-${Date.now()}-${safeName || "product-image.jpg"}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type || "image/jpeg",
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        productUpdate.image_url = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("products")
        .update(productUpdate)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === id ? data : product
        )
      );

      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        "Product update nahi hua.\n\n" +
        error.message
      );
      return null;
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const deleteProduct = async (id) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting product:",
        error
      );

      alert(
        "Product delete nahi hua. Please try again."
      );

      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== id
      )
    );
  };

  // ==========================================
// REDUCE STOCK AFTER SALE
// ==========================================

const reduceStock = async (cartItems) => {
  try {
    const updatedProducts = [];

    for (const soldItem of cartItems) {
      const product = products.find(
        (item) => item.id === soldItem.id
      );

      if (!product) {
        throw new Error(
          `Product not found: ${soldItem.name}`
        );
      }

      const newStock = Math.max(
        0,
        Number(product.stock) -
          Number(soldItem.quantity)
      );

      const { data, error } = await supabase
        .from("products")
        .update({
          stock: newStock,
        })
        .eq("id", soldItem.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      updatedProducts.push(data);
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        const updatedProduct =
          updatedProducts.find(
            (item) => item.id === product.id
          );

        return updatedProduct || product;
      })
    );

    return true;

  } catch (error) {
    console.error(
      "Error reducing stock:",
      error
    );

    alert(
      "Stock update mein problem aayi.\n\n" +
      error.message
    );

    return false;
  }
};
  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateStock,
        updateProduct,
        deleteProduct,
        reduceStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductProvider"
    );
  }

  return context;
}