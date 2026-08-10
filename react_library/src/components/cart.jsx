import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCart = () => {
    API.get("cart/")
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    API.put(`cart/item/${id}/`, {
      quantity: quantity,
    })
      .then(() => {
        loadCart();
      })
      .catch((err) => console.log(err));
  };

  const removeItem = (id) => {
    API.delete(`cart/item/${id}/`)
      .then(() => {
        loadCart();
      })
      .catch((err) => console.log(err));
  };

  const total =
    cart?.items?.reduce((sum, item) => sum + Number(item.total_price), 0) || 0;

  if (loading) {
    return (
      <main className="cart-page">
        <div className="container py-5">Loading cart...</div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container py-5">
        {/* Cart Header */}
        <div className="cart-header">
          <div>
            <h1>🛒 Your Cart</h1>

            <p>Review your selected books</p>
          </div>

          <Link to="/" className="btn btn-outline-success">
            ← Continue Shopping
          </Link>
        </div>

        {!cart?.items?.length ? (
          /* Empty Cart */
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>

            <h3>Your cart is empty</h3>

            <p>Add some books to your cart to get started.</p>

            <Link to="/" className="btn btn-success">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8">
              {cart.items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-book-info">
                    <div className="cart-book-icon">📖</div>

                    <div>
                      <h5>{item.book_name}</h5>

                      <p>₹ {item.book_price} each</p>
                    </div>
                  </div>

                  <div className="cart-controls">
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <strong>₹ {item.total_price}</strong>

                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="cart-summary">
                <h4>Order Summary</h4>

                <div className="summary-row">
                  <span>Items</span>

                  <span>
                    {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Subtotal</span>

                  <span>₹ {total}</span>
                </div>

                <hr />

                <div className="summary-total">
                  <span>Total</span>

                  <strong>₹ {total}</strong>
                </div>

                <Link
                  to="/checkout"
                  className="checkout-btn text-center text-decoration-none d-block"
                >
                  Proceed to Checkout →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;
