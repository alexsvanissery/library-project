import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddLibrary from "./components/AddLibrary";
import ViewLibrary from "./components/ViewLibrary";
import EditLibrary from "./components/EditLibrary";
import Carousel from "./components/Carousel";
import LibraryDetails from "./components/LibraryDetails";

function App(){
  return (
    <BrowserRouter>
      <Navbar/>
      <Carousel/>
      <Routes>
        <Route path="/" element={<ViewLibrary/>}/>
        <Route path="/add" element={<AddLibrary />} />
        <Route path="/edit/:id" element={<EditLibrary />} />
        <Route path="/view/:id" element={<LibraryDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;