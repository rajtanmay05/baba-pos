import React, { useEffect, useState } from "react";

import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  Edit3,
  Trash2,
  Filter,
  RefreshCw,
  Boxes,
  X,
  Camera,
} from "lucide-react";

import { useProducts } from "../context/ProductContext";

function Inventory({ openAddProduct = false }) {
  const [showAddProduct, setShowAddProduct] =
    useState(false);

  const {
    products,
    addProduct,
    updateStock,
    deleteProduct,
    updateProduct,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Bakery",
    price: "",
    stock: "",
  });

  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProduct, setEditProduct] = useState({
    name: "",
    category: "Bakery",
    price: "",
    stock: "",
  });
  const [editProductImage, setEditProductImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // ==========================================
  // OPEN ADD PRODUCT FROM DASHBOARD
  // ==========================================

  useEffect(() => {
    if (openAddProduct) {
      setShowAddProduct(true);
    }
  }, [openAddProduct]);

  // ==========================================
  // SEARCH + CATEGORY FILTER
  // ==========================================

  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  // ==========================================
  // LOW STOCK
  // ==========================================

  const lowStock = products.filter(
    (product) =>
      Number(product.stock) <= 7
  ).length;

  // ==========================================
  // TOTAL STOCK
  // ==========================================

  const totalStock = products.reduce(
    (sum, product) =>
      sum + Number(product.stock || 0),
    0
  );

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDeleteProduct = (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    deleteProduct(id);
  };

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setEditProduct({
      name: product.name || "",
      category: product.category || "Bakery",
      price: product.price ?? "",
      stock: product.stock ?? "",
    });
    setEditProductImage(null);
    setEditImagePreview(product.image_url || "");
    setShowEditProduct(true);
  };

  const closeEditProduct = () => {
    setShowEditProduct(false);
    setEditingProduct(null);
    setEditProductImage(null);
    setEditImagePreview("");
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();

    if (!editingProduct) return;

    if (!editProduct.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!editProduct.price || Number(editProduct.price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (editProduct.stock === "" || Number(editProduct.stock) < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    try {
      setSavingEdit(true);

      const saved = await updateProduct(
        editingProduct.id,
        {
          name: editProduct.name.trim(),
          category: editProduct.category,
          price: Number(editProduct.price),
          stock: Number(editProduct.stock),
        },
        editProductImage
      );

      if (!saved) return;

      closeEditProduct();
    } finally {
      setSavingEdit(false);
    }
  };

  // ==========================================
  // ADD PRODUCT
  // ==========================================

  const handelAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name.trim()) {
      alert(
        "Please enter product name."
      );
      return;
    }

    if (
      !newProduct.price ||
      Number(newProduct.price) <= 0
    ) {
      alert(
        "Please enter a valid price."
      );
      return;
    }

    if (
      newProduct.stock === "" ||
      Number(newProduct.stock) < 0
    ) {
      alert(
        "Please enter a valid stock quantity."
      );
      return;
    }

    const newItem = {
      name: newProduct.name.trim(),
      category: newProduct.category,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
    };

    try {
      setSavingProduct(true);
      const saved = await addProduct(newItem, productImage);

      if (!saved) return;

      setNewProduct({
        name: "",
        category: "Bakery",
        price: "",
        stock: "",
      });
      setProductImage(null);
      setImagePreview("");
      setShowAddProduct(false);
    } finally {
      setSavingProduct(false);
    }
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeAddProduct = () => {
    setShowAddProduct(false);
  };

  return (
    <div className="inventory-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">

        <div>
          <h1>Inventory</h1>

          <p>
            Manage your products, stock
            and inventory levels.
          </p>
        </div>

        <button
          className="add-product-btn"
          onClick={() =>
            setShowAddProduct(true)
          }
        >
          <Plus size={18} />
          Add Product
        </button>

      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="inventory-stats">

        <div className="inventory-stat-card">

          <div className="stat-icon gold">
            <Package size={22} />
          </div>

          <div>
            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>
          </div>

        </div>

        <div className="inventory-stat-card">

          <div className="stat-icon blue">
            <Boxes size={22} />
          </div>

          <div>
            <span>
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>
          </div>

        </div>

        <div className="inventory-stat-card">

          <div className="stat-icon red">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>
              Low Stock
            </span>

            <strong>
              {lowStock}
            </strong>
          </div>

        </div>

      </div>

      {/* ================= SEARCH + FILTER ================= */}

      <div className="inventory-toolbar">

        <div className="inventory-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="inventory-filter">

          <Filter size={18} />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            <option value="All">
              All Categories
            </option>

            <option value="Bakery">
              Bakery
            </option>

            <option value="Snacks">
              Snacks
            </option>

            <option value="Beverages">
              Beverages
            </option>

          </select>

        </div>

        <button
          className="refresh-btn"
          onClick={() => {
            setSearch("");
            setCategory("All");
          }}
        >
          <RefreshCw size={18} />
          Reset
        </button>

      </div>

      {/* ================= PRODUCT TABLE ================= */}

      <div className="inventory-card">

        <div className="inventory-card-header">

          <div>
            <h2>
              Product Inventory
            </h2>

            <p>
              {filteredProducts.length}{" "}
              products found
            </p>
          </div>

        </div>

        <div className="inventory-table-wrapper">

          <table className="inventory-table">

            <thead>

              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredProducts.map(
                (product) => (

                  <tr
                    key={product.id}
                  >

                    <td>

                      <div className="product-name">

                        <div className="product-icon inventory-product-image">
                          {product.image_url ? (
                            <img src={product.image_url} alt="" />
                          ) : (
                            <Package size={18} />
                          )}
                        </div>

                        <strong>
                          {product.name}
                        </strong>

                      </div>

                    </td>

                    <td>
                      {product.category}
                    </td>

                    <td className="product-price">
                      ₹{product.price}
                    </td>

                    <td>
                      <strong>
                        {product.stock}
                      </strong>
                    </td>

                    <td>

                      <span
                        className={
                          Number(
                            product.stock
                          ) <= 7
                            ? "stock-badge low"
                            : "stock-badge good"
                        }
                      >
                        {Number(
                          product.stock
                        ) <= 7
                          ? "Low Stock"
                          : "In Stock"}
                      </span>

                    </td>

                    <td>

                      <div className="table-actions">

                        <button
                          className="action-btn edit"
                          onClick={() =>
                            openEditProduct(product)
                          }
                          title="Edit Product"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() =>
                            handleDeleteProduct(
                              product.id
                            )
                          }
                          title="Delete Product"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          {filteredProducts.length === 0 && (

            <div className="empty-inventory">

              <Package size={42} />

              <h3>
                No products found
              </h3>

              <p>
                Try changing your search
                or category filter.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* ================= ADD PRODUCT MODAL ================= */}

      {showAddProduct && (

        <div
          className="modal-overlay"
          onClick={closeAddProduct}
        >

          <div
            className="add-product-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  Add New Product
                </h2>

                <p>
                  Add a new product to
                  your inventory.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={
                  closeAddProduct
                }
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={
                handelAddProduct
              }
            >

              {/* PRODUCT IMAGE */}

              <div className="form-group product-image-field">

                <label>Product Photo</label>

                <label className="product-image-upload">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Product preview" />
                  ) : (
                    <div className="product-image-placeholder">
                      <Camera size={28} />
                      <strong>Take / Upload Photo</strong>
                      <span>Employees can identify the product easily</span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (!file.type.startsWith("image/")) {
                        alert("Please select an image file.");
                        return;
                      }

                      if (file.size > 5 * 1024 * 1024) {
                        alert("Image size 5MB se kam rakho.");
                        return;
                      }

                      setProductImage(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </label>

                {imagePreview && (
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setProductImage(null);
                      setImagePreview("");
                    }}
                  >
                    <X size={14} /> Remove photo
                  </button>
                )}

              </div>

              {/* PRODUCT NAME */}

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Chocolate Cake"
                  value={
                    newProduct.name
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      name:
                        e.target.value,
                    })
                  }
                />

              </div>

              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  value={
                    newProduct.category
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category:
                        e.target.value,
                    })
                  }
                >

                  <option value="Bakery">
                    Bakery
                  </option>

                  <option value="Snacks">
                    Snacks
                  </option>

                  <option value="Beverages">
                    Beverages
                  </option>

                </select>

              </div>

              {/* PRICE */}

              <div className="form-group">

                <label>
                  Price (₹)
                </label>

                <input
                  type="number"
                  placeholder="e.g. 50"
                  min="0"
                  value={
                    newProduct.price
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price:
                        e.target.value,
                    })
                  }
                />

              </div>

              {/* STOCK */}

              <div className="form-group">

                <label>
                  Stock Quantity
                </label>

                <input
                  type="number"
                  placeholder="e.g. 25"
                  min="0"
                  value={
                    newProduct.stock
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock:
                        e.target.value,
                    })
                  }
                />

              </div>

              {/* BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    closeAddProduct
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-product-btn"
                  disabled={savingProduct}
                >
                  <Plus size={18} />
                  {savingProduct ? "Saving..." : "Add Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}

      {showEditProduct && editingProduct && (
        <div
          className="modal-overlay"
          onClick={closeEditProduct}
        >
          <div
            className="add-product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Edit Product</h2>
                <p>Update product photo, name, price and stock.</p>
              </div>

              <button
                className="modal-close"
                type="button"
                onClick={closeEditProduct}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditProduct}>
              {/* PRODUCT IMAGE */}
              <div className="form-group product-image-field">
                <label>Product Photo</label>

                <label className="product-image-upload">
                  {editImagePreview ? (
                    <img src={editImagePreview} alt="Product preview" />
                  ) : (
                    <div className="product-image-placeholder">
                      <Camera size={28} />
                      <strong>Take / Upload Photo</strong>
                      <span>Employees can identify the product easily</span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (!file.type.startsWith("image/")) {
                        alert("Please select an image file.");
                        return;
                      }

                      if (file.size > 5 * 1024 * 1024) {
                        alert("Image size 5MB se kam rakho.");
                        return;
                      }

                      setEditProductImage(file);
                      setEditImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </label>

                {editImagePreview && (
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setEditProductImage(null);
                      setEditImagePreview("");
                    }}
                  >
                    <X size={14} /> Remove photo
                  </button>
                )}
              </div>

              {/* PRODUCT NAME */}
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chocolate Cake"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* CATEGORY */}
              <div className="form-group">
                <label>Category</label>
                <select
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="Bakery">Bakery</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>

              {/* PRICE */}
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  min="0"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      price: e.target.value,
                    })
                  }
                />
              </div>

              {/* STOCK */}
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  min="0"
                  value={editProduct.stock}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      stock: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeEditProduct}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-product-btn"
                  disabled={savingEdit}
                >
                  <Edit3 size={18} />
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Inventory;