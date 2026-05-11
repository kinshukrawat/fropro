import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Listing from "./pages/Listing";
import BusinessDetails from "./pages/BusinessDetails";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/Categories";
import AllCategories from "./pages/AllCategories";
import PopularCategories from "./pages/PopularCategories";
import Reviews from "./pages/Reviews";
import Payments from "./pages/Payments";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/listings" element={<Listing />} />
        <Route path="/business-details" element={<BusinessDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/all-categories" element={<AllCategories />} />
        <Route path="/popular-categories" element={<PopularCategories />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/contact" element={<Contact />} />

        {/* DASHBOARDS */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



ddddd