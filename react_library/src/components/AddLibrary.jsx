import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AddLibrary() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check admin login
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const token = localStorage.getItem("adminToken");

    if (!isAdmin || !token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    setCheckingAuth(false);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const submitData = (e) => {
    e.preventDefault();

    setError("");

    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);

    if (formData.image) {
      data.append("image", formData.image);
    }

    API.post("library/", data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUsername");
          localStorage.removeItem("isAdmin");

          navigate("/admin-login");
          return;
        }

        setError(
          "Could not add the book. Please check the information and try again.",
        );
      });
  };

  // While checking authentication
  if (checkingAuth) {
    return (
      <div className="container py-5 text-center">
        <p>Checking admin access...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="checkout-card">
            <h2 className="fw-bold mb-4">📚 Add New Book</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={submitData}>
              <div className="mb-3">
                <label className="form-label">Book Name</label>

                <input
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter book name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>

                <textarea
                  className="form-control"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter book description"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Price</label>

                <input
                  className="form-control"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Book Image</label>

                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  Save Book
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLibrary;
