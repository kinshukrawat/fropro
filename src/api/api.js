import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://fropro-production.up.railway.app/api";

console.log("API_BASE_URL =", API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
});

// ====================
// Attach JWT Token & Handle Expiration
// ====================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname + window.location.search;
        // Don't redirect if we are already on the login page to avoid infinite redirect loops
        if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/admin")) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;

// ====================
// Public APIs
// ====================

export const getCategories = () => API.get("/categories");
export const getCities = () => API.get("/cities");
export const getContact = (data) => API.post("/contact", data);

// ====================
// Subscription APIs
// ====================

export const getSubscriptions = () => API.get("/subscriptions/mine");
export const getSubscriptionPlans = () =>
  API.get("/subscriptions/plans");

// ====================
// Payment APIs
// ====================

export const getMyPayments = () => API.get("/payments/mine");

// ====================
// Listings APIs
// ====================

export const getMyListings = () =>
  API.get("/listings/owner/mine");

export const createListing = (data) =>
  API.post("/listings", data);

export const updateListing = (id, data) =>
  API.patch(`/listings/${id}`, data);

export const submitListing = (id) =>
  API.post(`/listings/${id}/submit`);

export const getListingBySlug = (slug) =>
  API.get(`/listings/${slug}`);

export const searchListings = (params) =>
  API.get("/listings", { params });

// ====================
// Analytics
// ====================

export const trackWhatsappTap = (id) =>
  API.post(`/analytics/listings/${id}/whatsapp-tap`);

// ====================
// Admin APIs
// ====================

export const getAdminListings = () =>
  API.get("/admin/listings");

export const getAdminUsers = () =>
  API.get("/admin/users");

export const getAdminPayments = () =>
  API.get("/admin/payments");

export const getAdminStats = () =>
  API.get("/admin/stats");

export const getAdminEnquiries = (status) =>
  API.get("/admin/enquiries", {
    params: status ? { status } : {},
  });

export const updateAdminEnquiryStatus = (id, status) =>
  API.patch(`/admin/enquiries/${id}/status`, {
    status,
  });

export const toggleAdminFeatured = (id, isFeatured) =>
  API.patch(`/admin/listings/${id}/featured`, {
    isFeatured,
  });

export const toggleAdminVerified = (id, isVerified) =>
  API.patch(`/admin/listings/${id}/verified`, {
    isVerified,
  });

// ====================
// Uploads
// ====================

export const removeListingImage = (id) =>
  API.delete(`/uploads/listing-images/${id}`);

// ====================
// Reviews
// ====================

export const getListingReviews = (listingId) =>
  API.get(`/reviews/listing/${listingId}`);

export const getListingReviewSummary = (listingId) =>
  API.get(`/reviews/listing/${listingId}/summary`);

export const submitReview = (data) =>
  API.post("/reviews", data);

export const getRecentReviews = (limit = 20) =>
  API.get("/reviews/recent", {
    params: { limit },
  });

export const getOwnerReviews = () =>
  API.get("/reviews/owner/mine");

// ====================
// Enquiries
// ====================

export const getOwnerEnquiries = () =>
  API.get("/enquiries/owner/mine");

export const createEnquiry = (data) =>
  API.post("/enquiries", data);

// ====================
// Saved Listings
// ====================

export const getSavedListings = () =>
  API.get("/saved-listings");

export const saveListing = (listingId) =>
  API.post(`/saved-listings/${listingId}`);

export const removeSavedListing = (listingId) =>
  API.delete(`/saved-listings/${listingId}`);

export const checkSavedListing = (listingId) =>
  API.get(`/saved-listings/check/${listingId}`);