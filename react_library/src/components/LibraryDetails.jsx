import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function LibraryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    API.get(`library/${id}/`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    setAdding(true);

    API.post("cart/", {
      book: item.id,
      quantity: 1,
    })
      .then(() => {
        alert(`${item.name} added to cart!`);
      })
      .catch((err) => {
        console.log(err);
        alert("Could not add book to cart.");
      })
      .finally(() => {
        setAdding(false);
      });
  };

  const buyNow = () => {
    API.post("cart/", {
      book: item.id,
      quantity: 1,
    })
      .then(() => {
        navigate("/checkout");
      })
      .catch((err) => {
        console.log(err);
        alert("Could not proceed with purchase.");
      });
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="spinner-border text-success" />
        <p>Loading book...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="details-not-found">
        <h3>Book not found</h3>
        <Link to="/" className="btn btn-success">
          Back to Library
        </Link>
      </div>
    );
  }

  const rating = (item.id % 5) + 1;

  const imageUrl = `${import.meta.env.VITE_API_URL.replace(
    "/api/",
    "",
  )}${item.image}`;

  return (
    <main className="book-details-page">
      <div className="book-details-container">
        {/* Back */}
        <Link to="/" className="back-to-library">
          ← Back to Library
        </Link>

        <div className="book-details-card">
          {/* Book Image */}
          <div className="book-details-image-section">
            <div className="book-details-image-wrapper">
              <img
                src={imageUrl}
                alt={item.name}
                className="book-details-image"
              />
            </div>
          </div>

          {/* Book Information */}
          <div className="book-details-info">
            <span className="book-details-label">LIBRARY BOOK</span>

            <h1>{item.name}</h1>

            <div className="details-rating">
              {"★".repeat(rating)}
              {"☆".repeat(5 - rating)}
              <span> {rating}.0</span>
            </div>

            <div className="details-price">₹ {item.price}</div>

            <div className="details-divider" />

            <h3>About this book</h3>

            <p className="details-description">{item.description}</p>

            {/* Actions */}
            <div className="details-actions">
              <button
                className="details-cart-btn"
                onClick={addToCart}
                disabled={adding}
              >
                🛒 {adding ? "Adding..." : "Add to Cart"}
              </button>

              <button className="details-buy-btn" onClick={buyNow}>
                ⚡ Buy Now
              </button>
            </div>

            <div className="details-features">
              <div>
                📦
                <span>Easy ordering</span>
              </div>

              <div>
                🔒
                <span>Secure checkout</span>
              </div>

              <div>
                📚
                <span>Quality books</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LibraryDetails;
