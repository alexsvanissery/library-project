import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [buyNowBook, setBuyNowBook] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [order, setOrder] = useState(null);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const buyNowId = searchParams.get("buyNow");

  // ==========================================
  // LOAD BUY NOW BOOK OR CART
  // ==========================================

  useEffect(() => {
    // BUY NOW
    if (buyNowId) {
      API.get(`library/${buyNowId}/`)
        .then((res) => {
          setBuyNowBook(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

      return;
    }

    // NORMAL CART CHECKOUT
    API.get("cart/")
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [buyNowId]);

  // ==========================================
  // CALCULATE TOTAL
  // ==========================================

  const total = buyNowBook
    ? Number(buyNowBook.price)
    : cart?.items?.reduce((sum, item) => sum + Number(item.total_price), 0) ||
      0;

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const placeOrder = (e) => {
    e.preventDefault();

    // BUY NOW
    if (buyNowId && !buyNowBook) {
      alert("Book information is not available.");
      return;
    }

    // NORMAL CART CHECKOUT
    if (!buyNowId && !cart?.items?.length) {
      alert("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);

    const orderData = {
      name: name,
      email: email,
      address: address,
    };

    // Send book ID only for Buy Now
    if (buyNowId) {
      orderData.book_id = buyNowId;
    }

    API.post("orders/", orderData)
      .then((res) => {
        setOrder(res.data);
        setPlacingOrder(false);
      })
      .catch((err) => {
        console.log(err);

        alert(err.response?.data?.error || "Could not place the order.");

        setPlacingOrder(false);
      });
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="container py-5 text-center">
          <h3>Loading checkout...</h3>
        </div>
      </div>
    );
  }

  // ==========================================
  // ORDER SUCCESS
  // ==========================================

  if (order) {
    return (
      <div className="checkout-page">
        <div className="container py-5">
          <div className="success-card text-center">
            <div className="success-icon">✓</div>

            <h1>Order Placed Successfully!</h1>

            <p>Thank you, {order.name}.</p>

            <div className="order-number">Order #{order.id}</div>

            <div className="success-details">
              <div>
                <span>Total</span>
                <strong>₹ {order.total_price}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{order.status}</strong>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/" className="btn btn-success">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (!buyNowBook && !cart?.items?.length) {
    return (
      <div className="checkout-page">
        <div className="container py-5 text-center">
          <div className="empty-checkout-card">
            <div className="empty-icon">🛒</div>

            <h3>Your cart is empty</h3>

            <p>Add some books before proceeding to checkout.</p>

            <Link to="/" className="btn btn-success">
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CHECKOUT PAGE
  // ==========================================

  return (
    <div className="checkout-page">
      <div className="container py-5">
        {/* Page Header */}

        <div className="checkout-header mb-4">
          <h1>{buyNowBook ? "Buy Now" : "Checkout"}</h1>

          <p>Complete your details to place your order.</p>
        </div>

        <div className="row g-4">
          {/* Customer Information */}

          <div className="col-lg-7">
            <div className="checkout-card">
              <h4>Delivery Information</h4>

              <form onSubmit={placeOrder}>
                {/* Name */}

                <div className="mb-3">
                  <label className="form-label">Full Name</label>

                  <input
                    type="text"
                    className="form-control checkout-input"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}

                <div className="mb-3">
                  <label className="form-label">Email</label>

                  <input
                    type="email"
                    className="form-control checkout-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Address */}

                <div className="mb-3">
                  <label className="form-label">Address</label>

                  <textarea
                    className="form-control checkout-input"
                    rows="4"
                    placeholder="Enter your delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Place Order */}

                <button
                  type="submit"
                  className="place-order-btn"
                  disabled={placingOrder}
                >
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}

          <div className="col-lg-5">
            <div className="checkout-summary">
              <h4>Order Summary</h4>

              {/* BUY NOW SUMMARY */}

              {buyNowBook ? (
                <div className="checkout-item">
                  <div>
                    <strong>{buyNowBook.name}</strong>

                    <small>1 × ₹ {buyNowBook.price}</small>
                  </div>

                  <strong>₹ {buyNowBook.price}</strong>
                </div>
              ) : (
                /* CART SUMMARY */

                cart.items.map((item) => (
                  <div className="checkout-item" key={item.id}>
                    <div>
                      <strong>{item.book_name}</strong>

                      <small>
                        {item.quantity} × ₹ {item.book_price}
                      </small>
                    </div>

                    <strong>₹ {item.total_price}</strong>
                  </div>
                ))
              )}

              <hr />

              <div className="checkout-total">
                <span>Total</span>

                <strong>₹ {total}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
