import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EditLibrary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const [error, setError] = useState("");

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const token = localStorage.getItem("adminToken");

  // Protect edit page
  if (!isAdmin || !token) {
    navigate("/admin-login");
    return null;
  }

  useEffect(() => {
    API.get(`library/${id}/`)
      .then((res) => {
        setFormData({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
          image: null,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

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

  const updateData = (e) => {
    e.preventDefault();

    setError("");

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);

    if (formData.image) {
      data.append("image", formData.image);
    }

    API.put(`library/${id}/`, data, {
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

        setError("Could not update the book. Please try again.");
      });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="checkout-card">
            <h2 className="fw-bold mb-4">✏️ Edit Book</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={updateData}>
              <div className="mb-3">
                <label className="form-label">Book Name</label>

                <input
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                  min="0"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Replace Image</label>

                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />

                <small className="text-muted">
                  Leave empty to keep the existing image.
                </small>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-warning">
                  Update Book
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

export default EditLibrary;
