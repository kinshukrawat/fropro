import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBuilding,
  FaPhoneAlt,
  FaInstagram,
  FaMapMarkerAlt,
  FaImage,
  FaClock,
  FaRupeeSign,
} from "react-icons/fa";

import API, { getCategories, getCities } from "../api/api";

export default function AddBusinessListing() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    pincode: "",
    phone: "",
    email: "",
    whatsappPhone: "",
    instagramUrl: "",
    categoryId: "",
    cityId: "",
    priceRange: "",
    opensAt: "",
    closesAt: "",
    servicesText: "",
  });

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const categoryRes = await getCategories();
      const cityRes = await getCities();

      setCategories(categoryRes.data?.items || categoryRes.data || []);
      setCities(cityRes.data?.items || cityRes.data || []);
    } catch (error) {
      console.log("Dropdown Error:", error.response?.data || error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    setImageFiles(validFiles);
    setImagePreviews(validFiles.map((file) => URL.createObjectURL(file)));
  };

  const getPayload = () => ({
    name: formData.name,
    description: formData.description,
    categoryId: formData.categoryId,
    cityId: formData.cityId,
    priceRange: formData.priceRange,
    contactPhone: formData.phone,
    email: formData.email,
    whatsappPhone: formData.whatsappPhone || formData.phone,
    instagramUrl: formData.instagramUrl,
    addressLine1: formData.addressLine1,
    addressLine2: formData.addressLine2,
    landmark: formData.landmark,
    pincode: formData.pincode,
    opensAt: formData.opensAt,
    closesAt: formData.closesAt,
    services: formData.servicesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  });

  const uploadImagesForListing = async (listingId) => {
    if (!imageFiles.length || !listingId) return;

    for (const file of imageFiles) {
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const uploadRes = await API.post("/uploads/image", uploadForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await API.post("/uploads/listing-images", {
        listingId,
        url: uploadRes.data.url,
        cloudinaryId: uploadRes.data.cloudinaryId,
        altText: formData.name,
      });
    }
  };

  const handleAddListing = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const listingRes = await API.post("/listings", getPayload());

      const createdListing =
        listingRes.data?.data || listingRes.data?.item || listingRes.data;

      const listingId = createdListing?.id;

      await uploadImagesForListing(listingId);

      alert("Business listing created successfully");
      navigate("/business-dashboard");
    } catch (error) {
      console.log("FULL ERROR:", error.response?.data || error);
      alert(JSON.stringify(error.response?.data || "Failed to add listing"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6 lg:p-10 text-gray-900">
      <button
        onClick={() => navigate("/business-dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
      >
        <FaArrowLeft />
        Back to Dashboard
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl border shadow-sm p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold">
            Add Business Listing
          </h1>
          <p className="text-gray-500 mt-2">
            Fill your business details and submit for admin approval.
          </p>
        </div>

        <form onSubmit={handleAddListing} className="grid md:grid-cols-2 gap-4">
          <InputBox
            icon={<FaBuilding />}
            label="Business Name"
            name="name"
            placeholder="Enter business name"
            value={formData.name}
            onChange={handleChange}
          />

          <InputBox
            icon={<FaPhoneAlt />}
            label="Phone Number"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          <InputBox
            icon={<FaPhoneAlt />}
            label="WhatsApp Number"
            name="whatsappPhone"
            placeholder="Enter WhatsApp number"
            value={formData.whatsappPhone}
            onChange={handleChange}
            required={false}
          />

          <InputBox
            icon={<FaInstagram />}
            label="Instagram Handle / URL"
            name="instagramUrl"
            placeholder="@businessname or https://instagram.com/name"
            value={formData.instagramUrl}
            onChange={handleChange}
            required={false}
          />

          <InputBox
            icon={<FaMapMarkerAlt />}
            label="Address Line 1"
            name="addressLine1"
            placeholder="Shop no, building, market"
            value={formData.addressLine1}
            onChange={handleChange}
          />

          <InputBox
            icon={<FaMapMarkerAlt />}
            label="Address Line 2"
            name="addressLine2"
            placeholder="Sector, area, nearby place"
            value={formData.addressLine2}
            onChange={handleChange}
            required={false}
          />

          <InputBox
            icon={<FaMapMarkerAlt />}
            label="Landmark"
            name="landmark"
            placeholder="Near metro, mall, school etc."
            value={formData.landmark}
            onChange={handleChange}
            required={false}
          />

          <InputBox
            icon={<FaMapMarkerAlt />}
            label="Pincode"
            name="pincode"
            placeholder="110085"
            value={formData.pincode}
            onChange={handleChange}
            required={false}
          />

          <SelectBox
            label="Category"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectBox>

          <SelectBox
            label="City"
            name="cityId"
            value={formData.cityId}
            onChange={handleChange}
            required
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </SelectBox>

          <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500">
            <label className="text-sm text-gray-500">
              Price Range <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-3 mt-2">
              <FaRupeeSign className="text-gray-400" />
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
                required
              >
                <option value="">Select Price Range</option>
                <option value="BUDGET">Budget</option>
                <option value="MID_RANGE">Mid Range</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </div>
          </div>

          <TimeInputBox
            icon={<FaClock />}
            label="Opening Time"
            name="opensAt"
            value={formData.opensAt}
            onChange={handleChange}
          />

          <TimeInputBox
            icon={<FaClock />}
            label="Closing Time"
            name="closesAt"
            value={formData.closesAt}
            onChange={handleChange}
          />

          <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500 md:col-span-2">
            <label className="text-sm text-gray-500">
              Services / Catalogue Items
            </label>
            <textarea
              name="servicesText"
              placeholder="Haircut, Spa, Facial, Bridal Makeup"
              value={formData.servicesText}
              onChange={handleChange}
              className="w-full mt-2 outline-none resize-none"
              rows="3"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate services using comma.
            </p>
          </div>

          <div className="border rounded-2xl px-4 py-3 md:col-span-2">
            <label className="text-sm text-gray-500">
              Business Images / Gallery
            </label>

            <div className="flex items-center gap-3 mt-3">
              <FaImage className="text-gray-400" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full"
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {imagePreviews.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt=""
                    className="w-full h-32 object-cover rounded-xl border"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500 md:col-span-2">
            <label className="text-sm text-gray-500">
              Business Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Write about your business, services, experience..."
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-2 outline-none resize-none"
              rows="5"
              required
            />
            <p className="text-right text-xs text-gray-400">
              {formData.description.length}/500
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/business-dashboard")}
            className="border hover:bg-gray-50 py-3 rounded-2xl font-semibold"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputBox({
  icon,
  label,
  name,
  placeholder,
  value,
  onChange,
  required = true,
}) {
  return (
    <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500">
      <label className="text-sm text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-gray-400">{icon}</span>
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full outline-none"
          required={required}
        />
      </div>
    </div>
  );
}

function SelectBox({ label, name, value, onChange, children, required }) {
  return (
    <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500">
      <label className="text-sm text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full outline-none bg-transparent mt-2"
        required={required}
      >
        {children}
      </select>
    </div>
  );
}

function TimeInputBox({ icon, label, name, value, onChange }) {
  return (
    <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500">
      <label className="text-sm text-gray-500">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-gray-400">{icon}</span>
        <input
          type="time"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full outline-none"
          required
        />
      </div>
    </div>
  );
}