import React, { useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  X,
} from "lucide-react";

import "../App.css";

import { useProducts } from "../context/ProductContext";
import { useSales } from "../context/SalesContext";

function Billing() {
  const { products, reduceStock } = useProducts();
  const { addSale } = useSales();

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] =
    useState("Cash");
  const [search, setSearch] = useState("");

  const [invoice, setInvoice] = useState(null);
  const [processing, setProcessing] =
    useState(false);

  // ==========================================
  // SHOP INFORMATION
  // ==========================================

 const shopName = "BABA SNACKS & BAKERY";
const shopAddress =
  "Kamala Niswas, Pradhansahi, Jatni - Sundarpada Rd, Sundarpada, Bhubaneswar - 751002";
const shopPhone =
  "+917735369980, +917653035947";
  // ==========================================
  // SEARCH PRODUCTS
  // ==========================================

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert(
        `${product.name} is out of stock.`
      );
      return;
    }

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        if (
          existing.quantity >=
          product.stock
        ) {
          alert(
            `Only ${product.stock} ${product.name} available.`
          );

          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const product = products.find(
          (product) => product.id === id
        );

        if (!product) {
          return item;
        }

        if (
          item.quantity >=
          product.stock
        ) {
          alert(
            `Only ${product.stock} ${product.name} available.`
          );

          return item;
        }

        return {
          ...item,
          quantity:
            item.quantity + 1,
        };
      })
    );
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = (id) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );
  };

  // ==========================================
  // TOTALS
  // ==========================================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        item.quantity,
    0
  );

  const tax = 0;
  const total = subtotal + tax;

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = () => {
    setCart([]);
  };

  // ==========================================
  // COMPLETE PAYMENT
  // ==========================================

  const completePayment = async () => {
  if (cart.length === 0) return;

  const invoiceNumber = `INV-${Date.now()}`;

  const sale = {
    invoiceNumber,
    date: new Date().toISOString(),

    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),

    subtotal,
    tax: 0,
    total,
    paymentMethod,
  };

  try {
    setProcessing(true);

    // ==========================================
    // 1. SAVE SALE TO SUPABASE
    // ==========================================

    const savedSale = await addSale(sale);

    if (!savedSale) {
      return;
    }

    // ==========================================
    // 2. REDUCE PRODUCT STOCK
    // ==========================================

    await reduceStock(cart);

    // ==========================================
    // 3. CLEAR CART
    // ==========================================

    setCart([]);

    // ==========================================
    // 4. SHOW INVOICE
    // ==========================================

    setInvoice({
  ...sale,
  shopName,
  shopAddress,
  shopPhone,
});

  } catch (error) {
    console.error("Payment process error:", error);

    alert(
      "Payment process mein problem aayi. Sale save nahi hui."
    );
  } finally {
    setProcessing(false);
  }
};

  // ==========================================
  // PRINT INVOICE
  // ==========================================

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="billing-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <div>
          <h1>Billing</h1>

          <p>
            Create a new bill and complete
            customer payment.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={clearCart}
          disabled={
            cart.length === 0 ||
            processing
          }
        >
          Clear Cart
        </button>

      </div>

      {/* ======================================
          BILLING LAYOUT
      ====================================== */}

      <div className="billing-layout">

        {/* LEFT SIDE */}

        <div className="billing-products">

          <div className="billing-search">

            <Search size={20} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="product-grid">

            {filteredProducts.map(
              (product) => (
                <button
                  className="product-billing-card"
                  key={product.id}
                  onClick={() =>
                    addToCart(product)
                  }
                >

                  <div className="product-icon billing-product-image">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" />
                    ) : (
                      <Receipt size={25} />
                    )}
                  </div>

                  <div className="product-info">

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      Stock: {product.stock}
                    </p>

                  </div>

                  <strong>
                    ₹
                    {Number(
                      product.price
                    ).toFixed(2)}
                  </strong>

                </button>
              )
            )}

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="bill-panel">

          <div className="bill-panel-header">

            <div>
              <h2>
                Current Bill
              </h2>

              <span>
                New Invoice
              </span>
            </div>

            <Receipt size={28} />

          </div>

          <div className="cart-items">

            {cart.length === 0 ? (

              <div className="empty-cart">

                <Receipt size={45} />

                <h3>
                  No products added
                </h3>

                <p>
                  Select products to add
                  them to the bill.
                </p>

              </div>

            ) : (

              cart.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  <div className="cart-item-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      ₹
                      {Number(
                        item.price
                      ).toFixed(2)}
                      {" "}each
                    </p>

                  </div>

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                    >
                      <Minus size={15} />
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                    >
                      <Plus size={15} />
                    </button>

                  </div>

                  <strong>
                    ₹
                    {(
                      Number(
                        item.price
                      ) *
                      item.quantity
                    ).toFixed(2)}
                  </strong>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      removeItem(
                        item.id
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              ))

            )}

          </div>

          <div className="bill-summary">

            <div>
              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {subtotal.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>
                GST (0%)
              </span>

              <strong>
                ₹0.00
              </strong>
            </div>

            <div className="bill-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {total.toFixed(2)}
              </strong>

            </div>

          </div>

          <div className="payment-section">

            <h3>
              Payment Method
            </h3>

            <div className="payment-options">

              <button
                className={
                  paymentMethod === "Cash"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPaymentMethod(
                    "Cash"
                  )
                }
              >
                <Banknote size={20} />
                Cash
              </button>

              <button
                className={
                  paymentMethod === "UPI"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPaymentMethod(
                    "UPI"
                  )
                }
              >
                <Smartphone size={20} />
                UPI
              </button>

              <button
                className={
                  paymentMethod === "Card"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPaymentMethod(
                    "Card"
                  )
                }
              >
                <CreditCard size={20} />
                Card
              </button>

            </div>

          </div>

          <button
            className="complete-payment-btn"
            disabled={
              cart.length === 0 ||
              processing
            }
            onClick={completePayment}
          >
            {processing
              ? "Processing..."
              : `Complete Payment · ₹${total.toFixed(
                  2
                )}`}
          </button>

        </div>

      </div>

      {/* ======================================
          INVOICE PREVIEW MODAL
      ====================================== */}

      {invoice && (

        <div className="invoice-modal-overlay">

          <div className="invoice-modal">

            {/* PRINT BUTTON */}

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
                  setInvoice(null)
                }
              >
                <X size={19} />
              </button>

            </div>

            {/* RECEIPT */}

            <div className="thermal-receipt">

              <div className="receipt-header">

                <h2>
                  {invoice.shopName}
                </h2>

                <p>
                  {invoice.shopAddress}
                </p>

                <p>
                  Ph: {invoice.shopPhone}
                </p>

              </div>

              <div className="receipt-line">
                ------------------------------
              </div>

              <div className="receipt-meta">

                <p>
                  Date:{" "}
                  {new Date(
                    invoice.date
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p>
                  Invoice:{" "}
                  {invoice.invoiceNumber}
                </p>

              </div>

              <div className="receipt-line">
                ------------------------------
              </div>

              <div className="receipt-items">

                {invoice.items.map(
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
                          item.quantity
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
                  {invoice.subtotal.toFixed(
                    2
                  )}
                </strong>

              </div>

              <div className="receipt-total-row">

                <span>
                  GST
                </span>

                <strong>
                  ₹0.00
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
                  {invoice.total.toFixed(
                    2
                  )}
                </strong>

              </div>

              <div className="receipt-payment">

                <p>
                  Payment:{" "}
                  {invoice.paymentMethod.toUpperCase()}
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

export default Billing;