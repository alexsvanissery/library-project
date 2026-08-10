import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./components/AdminLogin";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import AddLibrary from "./components/AddLibrary";
import ViewLibrary from "./components/ViewLibrary";
import EditLibrary from "./components/EditLibrary";
import LibraryDetails from "./components/LibraryDetails";
import Checkout from "./components/Checkout";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<ViewLibrary />} />

        <Route path="/add" element={<AddLibrary />} />

        <Route path="/edit/:id" element={<EditLibrary />} />

        <Route path="/view/:id" element={<LibraryDetails />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
