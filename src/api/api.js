import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://fropro-production.up.railway.app/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;

export const getCategories = () => API.get("/categories");
export const getCities = () => API.get("/cities");
export const getContact = (data) => API.post("/contact", data);
export const getSubscriptions = () => API.get("/subscriptions/mine");
export const getSubscriptionPlans = () => API.get("/subscriptions/plans");
export const getMyPayments = () => API.get("/payments/mine");
export const getMyListings = () => API.get("/listings/owner/mine");
export const createListing = (data) => API.post("/listings", data);
export const updateListing = (id, data) => API.patch(`/listings/${id}`, data);
export const submitListing = (id) => API.post(`/listings/${id}/submit`);
export const getListingBySlug = (slug) => API.get(`/listings/${slug}`);
export const searchListings = (params) => API.get("/listings", { params });
export const trackWhatsappTap = (id) =>
  API.post(`/analytics/listings/${id}/whatsapp-tap`);
export const getAdminListings = () => API.get("/admin/listings");
export const getAdminUsers = () => API.get("/admin/users");
export const getAdminPayments = () => API.get("/admin/payments");
export const getAdminStats = () => API.get("/admin/stats");
export const getAdminEnquiries = (status) =>
  API.get("/admin/enquiries", { params: status ? { status } : {} });
export const updateAdminEnquiryStatus = (id, status) =>
  API.patch(`/admin/enquiries/${id}/status`, { status });
export const toggleAdminFeatured = (id, isFeatured) =>
  API.patch(`/admin/listings/${id}/featured`, { isFeatured });
export const toggleAdminVerified = (id, isVerified) =>
  API.patch(`/admin/listings/${id}/verified`, { isVerified });
export const removeListingImage = (id) =>
  API.delete(`/uploads/listing-images/${id}`);

export const getListingReviews = (listingId) =>
  API.get(`/reviews/listing/${listingId}`);

export const getListingReviewSummary = (listingId) =>
  API.get(`/reviews/listing/${listingId}/summary`);

export const submitReview = (data) => API.post("/reviews", data);

export const getRecentReviews = (limit = 20) =>
  API.get("/reviews/recent", { params: { limit } });

export const getOwnerReviews = () => API.get("/reviews/owner/mine");

export const getOwnerEnquiries = () => API.get("/enquiries/owner/mine");

