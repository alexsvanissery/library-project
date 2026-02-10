import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function LibraryDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    API.get(`library/${id}/`)
      .then(res => setItem(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!item) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h3 className="mb-3">{item.name}</h3>
        
        const API_URL = import.meta.env.VITE_API_URL.replace("/api/", "");
        <img
          src={`${API_URL}${item.image}`}
          alt={item.name}
          style={{ width: "200px", marginBottom: "15px" }}
        />
        <h5>Price: ₹ {item.price}</h5>
        <hr />
        <h6>Description</h6>
        <p>{item.description}</p>
      </div>
    </div>
  );
}

export default LibraryDetails;
