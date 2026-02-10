import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AddLibrary() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const submitData = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("image", formData.image);

    API.post("library/", data)
      .then(() => navigate("/"))
      .catch(err => console.log(err));
  };

  return (
    <div className="container mt-4">
      <h3>Add Item</h3>
      <form onSubmit={submitData}>
        <input className="form-control mb-2" name="name" placeholder="Name" onChange={handleChange} />
        <input className="form-control mb-2" name="description" placeholder="Description" onChange={handleChange} />
        <input className="form-control mb-2" name="price" placeholder="Price" onChange={handleChange} />
        <input className="form-control mb-2" type="file" onChange={handleImage} />
        <button className="btn btn-success">Save</button>
      </form>
    </div>
  );
}

export default AddLibrary;
