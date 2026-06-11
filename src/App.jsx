import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Listing from "./pages/Listing";
import BusinessDetails from "./pages/BusinessDetails";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";

import Categories from "./pages/Categories";
import AllCategories from "./pages/AllCategories";
import PopularCategories from "./pages/PopularCategories";
import Reviews from "./pages/Reviews";
import Payments from "./pages/Payments";
import Contact from "./pages/Contact";
import ViewDetail from "./pages/ViewDetail";


import Dashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/AdminLogin";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const hideLayout =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/business-dashboard" ||
    location.pathname === "/user-dashboard";

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/listings" element={<Listing />} />
        <Route path="/business-details" element={<BusinessDetails />} />
        <Route path="/business/detail/:slug" element={<BusinessDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/all-categories" element={<AllCategories />} />
        <Route path="/popular-categories" element={<PopularCategories />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/viewdetail/:id" element={<ViewDetail />} />

        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />


        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;