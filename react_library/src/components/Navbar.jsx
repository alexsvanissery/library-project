import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar(){
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
        <Link className="navbar-brand" to="/">Library</Link>
        <div>
          <Link className="btn btn-success me-2" to="/add">
            Add Item
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;