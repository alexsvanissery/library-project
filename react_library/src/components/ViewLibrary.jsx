import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import PasswordModal from "../components/PasswordModal";

function ViewLibrary() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [actionType, setActionType] = useState(null);

  const navigate = useNavigate();

  const itemsPerPage = 8;

  useEffect(() => {
    API.get("library/")
      .then((res) => setItems(res.data))
      .catch((err) => console.log(err));
  }, []);

  const deleteItem = (id) => {
    API.delete(`library/${id}/`).then(() => {
      setItems(items.filter((item) => item.id !== id));
    });
  };

  // Password verification
  const ADMIN_PASS = "1234";

  const handleConfirm = (pass) => {
    if (pass === ADMIN_PASS) {
      if (actionType === "edit") {
        navigate(`/edit/${pendingId}`);
      }

      if (actionType === "delete") {
        deleteItem(pendingId);
      }
    } else {
      alert("Wrong password");
    }

    setShowModal(false);
  };

  // Search filter
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Library Items</h3>

      <input
        type="text"
        placeholder="Search books..."
        className="form-control mb-4 shadow-sm"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <div className="row">
        {currentItems.map((item) => {
          const rating = Math.floor(Math.random() * 5) + 1;

          return (
            <div className="col-md-3 mb-4" key={item.id}>
              <div className="card h-100 shadow-sm book-card">
                <Link to={`/view/${item.id}`}>
                  <img
                    src={`${import.meta.env.VITE_API_URL.replace("/api/", "")}${item.image}`}
                    className="card-img-top"
                    style={{
                      height: "200px",
                      objectFit: "contain",
                      padding: "10px",
                    }}
                    alt={item.name}
                  />
                </Link>

                <div className="card-body">
                  <Link
                    to={`/view/${item.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <h5 className="card-title">{item.name}</h5>
                  </Link>

                  <p style={{ color: "#f4c150", marginBottom: "5px" }}>
                    {"★".repeat(rating)}
                    {"☆".repeat(5 - rating)}
                  </p>

                  <p className="card-text">₹ {item.price}</p>

                  {/* Edit Button */}
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setPendingId(item.id);
                      setActionType("edit");
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setPendingId(item.id);
                      setActionType("delete");
                      setShowModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`btn btn-sm mx-1 ${
              currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Password Modal */}
      <PasswordModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default ViewLibrary;
