import React, { useState } from "react";
import {
  Plus,
  Search,
  Package,
  Edit3,
  Trash2,
  X,
} from "lucide-react";

const initialProducts = [
  {
    id: 1,
    name: "Bread",
    category: "Bakery",
    price: 40,
    stock: 25,
  },
  {
    id: 2,
    name: "Samosa",
    category: "Snacks",
    price: 15,
    stock: 50,
  },
  {
    id: 3,
    name: "Puff",
    category: "Bakery",
    price: 30,
    stock: 35,
  },
  {
    id: 4,
    name: "Cake Slice",
    category: "Bakery",
    price: 60,
    stock: 20,
  },
  {
    id: 5,
    name: "Mixture",
    category: "Snacks",
    price: 80,
    stock: 15,
  },
  {
    id: 6,
    name: "Biscuits",
    category: "Bakery",
    price: 25,
    stock: 40,
  },
];

function Products() {
  const [products, setProducts] = useState(initialProducts);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "Bakery",
    price: "",
    stock: "",
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // OPEN ADD MODAL
  const openAddModal = () => {
    setEditingProduct(null);

    setForm({
      name: "",
      category: "Bakery",
      price: "",
      stock: "",
    });

    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });

    setShowModal(true);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);

    setForm({
      name: "",
      category: "Bakery",
      price: "",
      stock: "",
    });
  };

  // ADD / UPDATE PRODUCT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      form.price === "" ||
      form.stock === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    const productData = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    // EDIT
    if (editingProduct) {
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...productData,
              }
            : product
        )
      );
    }

    // ADD
    else {
      const newProduct = {
        id: Date.now(),
        ...productData,
      };

      setProducts([...products, newProduct]);
    }

    closeModal();
  };

  // DELETE
  const deleteProduct = (id) => {
    const product = products.find((p) => p.id === id);

    if (
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      )
    ) {
      setProducts(
        products.filter((product) => product.id !== id)
      );
    }
  };

  return (
    <div className="inventory-page">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product catalog and pricing.</p>
        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* SEARCH */}
      <div className="inventory-toolbar">

        <div className="inventory-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* PRODUCT TABLE */}
      <div className="inventory-card">

        <div className="inventory-card-header">

          <div>
            <h2>Product Catalog</h2>
            <p>
              {filteredProducts.length} products found
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

              {filteredProducts.map((product) => (

                <tr key={product.id}>

                  <td>
                    <div className="product-name">

                      <div className="product-icon">
                        <Package size={18} />
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
                        product.stock <= 7
                          ? "stock-badge low"
                          : "stock-badge good"
                      }
                    >
                      {product.stock <= 7
                        ? "Low Stock"
                        : "In Stock"}
                    </span>

                  </td>

                  <td>

                    <div className="table-actions">

                      {/* EDIT */}
                      <button
                        className="action-btn edit"
                        title="Edit Product"
                        onClick={() =>
                          openEditModal(product)
                        }
                      >
                        <Edit3 size={17} />
                      </button>

                      {/* DELETE */}
                      <button
                        className="action-btn delete"
                        title="Delete Product"
                        onClick={() =>
                          deleteProduct(product.id)
                        }
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredProducts.length === 0 && (

            <div className="empty-inventory">

              <Package size={42} />

              <h3>
                No products found
              </h3>

              <p>
                Try another search.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (

        <div
          className="product-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="product-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="product-modal-header">

              <div>
                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p>
                  {editingProduct
                    ? "Update product information."
                    : "Add a new product to your catalog."}
                </p>
              </div>

              <button
                className="product-modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}
            <form
              className="product-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Chocolate Cake"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
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

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

              <div className="form-group">

                <label>
                  Price (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 50"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 25"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: e.target.value,
                    })
                  }
                />

              </div>

              {/* BUTTONS */}
              <div className="product-modal-actions">

                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-submit-btn"
                >
                  <Plus size={18} />

                  {editingProduct
                    ? "Save Changes"
                    : "Add Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Products;