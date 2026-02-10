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

  useEffect(() => {
    API.get(`library/${id}/`)
      .then(res => {
        setFormData({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
          image: null,   // IMPORTANT
        });
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const updateData = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);

    if (formData.image) {
      data.append("image", formData.image);
    }

    API.put(`library/${id}/`, data)
      .then(() => navigate("/"))
      .catch(err => console.log(err));
  };

  return (
    <div className="container mt-4">
      <h3>Edit Item</h3>
      <form onSubmit={updateData}>
        <input
          className="form-control mb-2"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <textarea
           className="form-control mb-2"
           name="description"
           value={formData.description}
           onChange={handleChange}
           rows="3"
        />

        <input
          className="form-control mb-2"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          type="file"
          onChange={handleImage}
        />
        <button className="btn btn-warning">Update</button>
      </form>
    </div>
  );
}

export default EditLibrary;
