import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";


function ViewLibrary() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  const itemsPerPage = 8;

  // Check whether an admin is currently logged in
  const isAdmin = localStorage.getItem("isAdmin") === "true";

useEffect(() => {
  setLoading(true);

  API.get("library/")
    .then((res) => {
      setItems(res.data.results || res.data);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

  // Delete book - admin only
  const deleteItem = (id) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Please login as admin first.");
      navigate("/admin-login");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this book?",
    );

    if (!confirmed) {
      return;
    }

    API.delete(`library/${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(() => {
        setItems((prev) => prev.filter((item) => item.id !== id));

        alert("Book deleted successfully.");
      })
      .catch((err) => {
        console.log(err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Admin permission required.");
        } else {
          alert("Could not delete the book.");
        }
      });
  };

  // Add book to cart
  const addToCart = (item) => {
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
      });
  };

  // Buy Now
  const buyNow = (item) => {
    navigate(`/checkout?buyNow=${item.id}`);
  };

  // Search
  const filteredItems = Array.isArray(items)
    ? items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <main className="library-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-icon">📚</div>

        <h1>Explore Books</h1>

        <p>Discover, manage and explore your library collection.</p>
      </section>

      {/* Search */}
      <div className="search-wrapper mb-4">
        <span className="search-icon">🔍</span>

        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        {search && (
          <button className="clear-search" onClick={() => setSearch("")}>
            ✕
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="results-info mb-3">
        {loading
          ? "Loading books..."
          : `${filteredItems.length} ${
              filteredItems.length === 1 ? "book" : "books"
            } found`}
      </div>

      {/* Books */}
      <div className="row g-4">
        {currentItems.map((item) => {
          // Stable rating based on book ID
          const rating = (item.id % 5) + 1;

          return (
            <div className="col-12 col-sm-6 col-lg-3" key={item.id}>
              <div className="book-card h-100">
                {/* Book Image */}
                <Link to={`/view/${item.id}`} className="book-image-wrapper">
                  <img
                    src={`${import.meta.env.VITE_API_URL.replace(
                      "/api/",
                      "",
                    )}${item.image}`}
                    alt={item.name}
                  />

                  <div className="view-overlay">View Book</div>
                </Link>

                {/* Book Content */}
                <div className="book-content">
                  <Link to={`/view/${item.id}`} className="book-title">
                    {item.name}
                  </Link>

                  {/* Rating */}
                  <div className="rating">
                    {"★".repeat(rating)}
                    {"☆".repeat(5 - rating)}
                  </div>

                  {/* Price */}
                  <div className="price">₹ {item.price}</div>

                  {/* Actions */}
                  <div className="book-actions">
                    {/* Add to Cart */}
                    <button
                      className="btn cart-btn"
                      onClick={() => addToCart(item)}
                    >
                      🛒 Add to Cart
                    </button>

                    {/* Buy Now */}
                    <button
                      className="btn buy-now-btn"
                      onClick={() => buyNow(item)}
                    >
                      ⚡ Buy Now
                    </button>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <>
                        <button
                          className="btn edit-btn"
                          onClick={() => {
                            navigate(`/edit/${item.id}`);
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="btn delete-btn"
                          onClick={() => {
                            deleteItem(item.id);
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>

          <h4>Loading books...</h4>

          <p>The library may take a few seconds to wake up.</p>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>

          <h4>No books found</h4>

          <p>Try searching with a different book name.</p>
        </div>
      ) : null}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-wrapper">
          {Array.from({
            length: totalPages,
          }).map((_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                className={
                  currentPage === page ? "page-btn active" : "page-btn"
                }
                onClick={() => {
                  setCurrentPage(page);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default ViewLibrary;
