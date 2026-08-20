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
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

import API, { getCategories, getCities } from "../api/api";

const MAX_MEDIA = 10;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function AddBusinessListing() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [mediaFiles, setMediaFiles] = useState([]);

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

    return () => {
      mediaFiles.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [categoryRes, cityRes] = await Promise.all([
        getCategories(),
        getCities(),
      ]);

      setCategories(
        categoryRes.data?.items ||
          categoryRes.data ||
          []
      );

      setCities(
        cityRes.data?.items ||
          cityRes.data ||
          []
      );
    } catch (error) {
      console.error(
        "Dropdown Error:",
        error.response?.data || error
      );

      alert("Failed to load categories or cities.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    const allowedImageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ];

    const allowedVideoExtensions = [
      "mp4",
      "mov",
      "webm",
    ];

    const newMedia = [...mediaFiles];
    const errors = [];

    for (const file of files) {
      if (newMedia.length >= MAX_MEDIA) {
        errors.push(
          `Maximum ${MAX_MEDIA} media files are allowed per listing.`
        );
        break;
      }

      const ext =
        file.name.split(".").pop()?.toLowerCase() || "";

      const mimeType =
        file.type?.toLowerCase() || "";

      const isImage =
        allowedImageExtensions.includes(ext) ||
        mimeType.startsWith("image/");

      const isVideo =
        allowedVideoExtensions.includes(ext) ||
        mimeType.startsWith("video/");

      if (!isImage && !isVideo) {
        errors.push(
          `"${file.name}" is not a supported file format.`
        );
        continue;
      }

      if (isImage) {
        if (file.size > MAX_IMAGE_SIZE) {
          errors.push(
            `"${file.name}" exceeds the 10 MB image limit.`
          );
          continue;
        }

        newMedia.push({
          file,
          preview: URL.createObjectURL(file),
          type: "IMAGE",
        });

        continue;
      }

      if (isVideo) {
        if (file.size > MAX_VIDEO_SIZE) {
          errors.push(
            `"${file.name}" exceeds the 100 MB video limit.`
          );
          continue;
        }

        newMedia.push({
          file,
          preview: URL.createObjectURL(file),
          type: "VIDEO",
        });
      }
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
    }

    setMediaFiles(newMedia);

    // Allow selecting the same file again.
    e.target.value = "";
  };

  const handleRemoveMedia = (indexToRemove) => {
    setMediaFiles((prev) => {
      const item = prev[indexToRemove];

      if (item?.preview) {
        URL.revokeObjectURL(item.preview);
      }

      return prev.filter(
        (_, index) => index !== indexToRemove
      );
    });
  };

  const getPayload = () => {
    return {
      name: formData.name.trim(),
      description: formData.description.trim(),

      categoryId: formData.categoryId,
      cityId: formData.cityId,

      priceRange: formData.priceRange,

      contactPhone: formData.phone.trim(),

      email: formData.email.trim() || undefined,

      whatsappPhone:
        formData.whatsappPhone.trim() ||
        formData.phone.trim(),

      instagramUrl:
        formData.instagramUrl.trim() || undefined,

      addressLine1:
        formData.addressLine1.trim(),

      addressLine2:
        formData.addressLine2.trim() || undefined,

      landmark:
        formData.landmark.trim() || undefined,

      pincode:
        formData.pincode.trim() || undefined,

      opensAt: formData.opensAt,

      closesAt: formData.closesAt,

      services: formData.servicesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
  };

  /**
   * Upload a single file directly to Cloudinary.
   *
   * Returns:
   * {
   *   url,
   *   cloudinaryId
   * }
   */
  const uploadToCloudinary = async (file) => {
    if (
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_UPLOAD_PRESET
    ) {
      throw new Error(
        "Cloudinary configuration is missing. Please configure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
      );
    }

    const cloudinaryFormData = new FormData();

    cloudinaryFormData.append("file", file);

    cloudinaryFormData.append(
      "upload_preset",
      CLOUDINARY_UPLOAD_PRESET
    );

    const resourceType = file.type.startsWith("video/")
      ? "video"
      : "image";

    const cloudinaryUrl =
      `https://api.cloudinary.com/v1_1/` +
      `${CLOUDINARY_CLOUD_NAME}/` +
      `${resourceType}/upload`;

    const response = await fetch(
      cloudinaryUrl,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary Error:", data);

      throw new Error(
        data?.error?.message ||
          "Cloudinary upload failed."
      );
    }

    return {
      url: data.secure_url,
      cloudinaryId: data.public_id,
    };
  };

  /**
   * After Cloudinary upload, save the media
   * against the listing in our NestJS backend.
   */
  const uploadMediaForListing = async (listingId) => {
    if (!listingId || mediaFiles.length === 0) {
      return;
    }

    setUploadingMedia(true);

    try {
      for (
        let index = 0;
        index < mediaFiles.length;
        index++
      ) {
        const item = mediaFiles[index];

        try {
          // 1. Upload file to Cloudinary
          const cloudinaryResult =
            await uploadToCloudinary(item.file);

          // 2. Save Cloudinary details in our backend
          await API.post(
            "/uploads/listing-images",
            {
              listingId,

              url: cloudinaryResult.url,

              cloudinaryId:
                cloudinaryResult.cloudinaryId,

              altText: formData.name,

              mediaType: item.type,
            }
          );
        } catch (error) {
          console.error(
            `Media upload failed for ${item.file.name}:`,
            error.response?.data || error
          );

          throw new Error(
            `Failed to upload "${item.file.name}".`
          );
        }
      }
    } finally {
      setUploadingMedia(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter business name.");
      return false;
    }

    if (!formData.phone.trim()) {
      alert("Please enter phone number.");
      return false;
    }

    if (!formData.addressLine1.trim()) {
      alert("Please enter address.");
      return false;
    }

    if (!formData.categoryId) {
      alert("Please select a category.");
      return false;
    }

    if (!formData.cityId) {
      alert("Please select a city.");
      return false;
    }

    if (!formData.priceRange) {
      alert("Please select price range.");
      return false;
    }

    if (!formData.opensAt) {
      alert("Please select opening time.");
      return false;
    }

    if (!formData.closesAt) {
      alert("Please select closing time.");
      return false;
    }

    if (!formData.description.trim()) {
      alert("Please enter business description.");
      return false;
    }

    if (formData.description.length > 500) {
      alert(
        "Business description cannot exceed 500 characters."
      );
      return false;
    }

    return true;
  };

  const handleAddListing = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      /**
       * STEP 1
       * Create listing.
       */
      const listingRes = await API.post(
        "/listings",
        getPayload()
      );

      console.log(
        "Create Listing Response:",
        listingRes.data
      );

      /**
       * Backend response can be:
       * {
       *   data: {...}
       * }
       *
       * OR
       *
       * {
       *   item: {...}
       * }
       *
       * OR
       *
       * {...}
       */
      const createdListing =
        listingRes.data?.data ||
        listingRes.data?.item ||
        listingRes.data;

      const listingId =
        createdListing?.id;

      if (!listingId) {
        console.error(
          "Invalid listing response:",
          listingRes.data
        );

        throw new Error(
          "Listing was created but listing ID was not returned by server."
        );
      }

      /**
       * STEP 2
       * Upload selected media.
       */
      if (mediaFiles.length > 0) {
        await uploadMediaForListing(
          listingId
        );
      }

      /**
       * STEP 3
       * Everything completed.
       */
      alert(
        mediaFiles.length > 0
          ? "Business listing and media uploaded successfully."
          : "Business listing created successfully."
      );

      /**
       * Clean preview URLs.
       */
      mediaFiles.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });

      setMediaFiles([]);

      navigate("/business-dashboard");
    } catch (error) {
      console.error(
        "FULL ERROR:",
        error.response?.data || error
      );

      const backendMessage =
        error.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        alert(
          backendMessage.join("\n")
        );
      } else {
        alert(
          backendMessage ||
            error.message ||
            "Failed to add business listing."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isBusy =
    loading || uploadingMedia;

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6 lg:p-10 text-gray-900">
      <button
        type="button"
        onClick={() =>
          navigate("/business-dashboard")
        }
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
      >
        <FaArrowLeft />
        Back to Dashboard
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl border shadow-sm p-6 lg:p-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold">
            Add Business Listing
          </h1>

          <p className="text-gray-500 mt-2">
            Fill your business details and submit
            for admin approval.
          </p>
        </div>

        <form
          onSubmit={handleAddListing}
          className="grid md:grid-cols-2 gap-4"
        >
          {/* BUSINESS NAME */}
          <InputBox
            icon={<FaBuilding />}
            label="Business Name"
            name="name"
            placeholder="Enter business name"
            value={formData.name}
            onChange={handleChange}
          />

          {/* PHONE */}
          <InputBox
            icon={<FaPhoneAlt />}
            label="Phone Number"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* WHATSAPP */}
          <InputBox
            icon={<FaPhoneAlt />}
            label="WhatsApp Number"
            name="whatsappPhone"
            placeholder="Enter WhatsApp number"
            value={formData.whatsappPhone}
            onChange={handleChange}
            required={false}
          />

          {/* INSTAGRAM */}
          <InputBox
            icon={<FaInstagram />}
            label="Instagram Handle / URL"
            name="instagramUrl"
            placeholder="@businessname or https://instagram.com/name"
            value={formData.instagramUrl}
            onChange={handleChange}
            required={false}
          />

          {/* ADDRESS */}
          <InputBox
            icon={<FaMapMarkerAlt />}
            label="Address Line 1"
            name="addressLine1"
            placeholder="Shop no, building, market"
            value={formData.addressLine1}
            onChange={handleChange}
          />

          {/* ADDRESS 2 */}
          <InputBox
            icon={<FaMapMarkerAlt />}
            label="Address Line 2"
            name="addressLine2"
            placeholder="Sector, area, nearby place"
            value={formData.addressLine2}
            onChange={handleChange}
            required={false}
          />

          {/* LANDMARK */}
          <InputBox
            icon={<FaMapMarkerAlt />}
            label="Landmark"
            name="landmark"
            placeholder="Near metro, mall, school etc."
            value={formData.landmark}
            onChange={handleChange}
            required={false}
          />

          {/* PINCODE */}
          <InputBox
            icon={<FaMapMarkerAlt />}
            label="Pincode"
            name="pincode"
            placeholder="110085"
            value={formData.pincode}
            onChange={handleChange}
            required={false}
          />

          {/* CATEGORY */}
          <SelectBox
            label="Category"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </SelectBox>

          {/* CITY */}
          <SelectBox
            label="City"
            name="cityId"
            value={formData.cityId}
            onChange={handleChange}
            required
          >
            <option value="">
              Select City
            </option>

            {cities.map((city) => (
              <option
                key={city.id}
                value={city.id}
              >
                {city.name}
              </option>
            ))}
          </SelectBox>

          {/* PRICE RANGE */}
          <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500">
            <label className="text-sm text-gray-500">
              Price Range{" "}
              <span className="text-red-500">
                *
              </span>
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
                <option value="">
                  Select Price Range
                </option>

                <option value="BUDGET">
                  Budget
                </option>

                <option value="MID_RANGE">
                  Mid Range
                </option>

                <option value="PREMIUM">
                  Premium
                </option>
              </select>
            </div>
          </div>

          {/* OPENING TIME */}
          <TimeInputBox
            icon={<FaClock />}
            label="Opening Time"
            name="opensAt"
            value={formData.opensAt}
            onChange={handleChange}
          />

          {/* CLOSING TIME */}
          <TimeInputBox
            icon={<FaClock />}
            label="Closing Time"
            name="closesAt"
            value={formData.closesAt}
            onChange={handleChange}
          />

          {/* SERVICES */}
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

          {/* MEDIA */}
          <div className="border rounded-2xl p-5 md:col-span-2 bg-white shadow-sm">
            <label className="text-sm font-semibold text-gray-700">
              Business Media
            </label>

            <p className="text-xs text-gray-400 mt-1">
              Upload up to 10 photos/videos.
              Images: max 10 MB each. Videos:
              max 100 MB each.
            </p>

            <div className="flex items-center gap-3 mt-3 p-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-500 transition duration-200">
              <FaImage className="text-gray-400 text-lg" />

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/mov,video/webm"
                multiple
                onChange={handleMediaChange}
                disabled={isBusy}
                className="w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 file:hover:bg-blue-100 disabled:opacity-50"
              />
            </div>

            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {mediaFiles.map(
                  (item, index) => (
                    <div
                      key={`${item.file.name}-${index}`}
                      className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm h-32"
                    >
                      {item.type ===
                      "IMAGE" ? (
                        <img
                          src={item.preview}
                          alt={formData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.preview}
                          controls
                          className="w-full h-full object-cover bg-black"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveMedia(
                            index
                          )
                        }
                        disabled={isBusy}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow transition opacity-90 hover:scale-105 border-none cursor-pointer disabled:opacity-50"
                      >
                        <FaTimes className="text-xs" />
                      </button>

                      <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {item.type ===
                        "IMAGE"
                          ? "Image"
                          : "Video"}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500 md:col-span-2">
            <label className="text-sm text-gray-500">
              Business Description{" "}
              <span className="text-red-500">
                *
              </span>
            </label>

            <textarea
              name="description"
              placeholder="Write about your business, services, experience..."
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-2 outline-none resize-none"
              rows="5"
              maxLength={500}
              required
            />

            <p className="text-right text-xs text-gray-400">
              {formData.description.length}/500
            </p>
          </div>

          {/* CANCEL */}
          <button
            type="button"
            onClick={() =>
              navigate("/business-dashboard")
            }
            disabled={isBusy}
            className="border hover:bg-gray-50 py-3 rounded-2xl font-semibold disabled:opacity-50"
          >
            Cancel
          </button>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isBusy}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isBusy && (
              <FaSpinner className="animate-spin" />
            )}

            {loading
              ? uploadingMedia
                ? "Uploading Media..."
                : "Creating Listing..."
              : "Add Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT BOX
========================================================= */

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
        {label}{" "}
        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </label>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-gray-400">
          {icon}
        </span>

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

/* =========================================================
   SELECT BOX
========================================================= */

function SelectBox({
  label,
  name,
  value,
  onChange,
  children,
  required,
}) {
  return (
    <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500">
      <label className="text-sm text-gray-500">
        {label}{" "}
        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
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

/* =========================================================
   TIME INPUT
========================================================= */

function TimeInputBox({
  icon,
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500">
      <label className="text-sm text-gray-500">
        {label}{" "}
        <span className="text-red-500">
          *
        </span>
      </label>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-gray-400">
          {icon}
        </span>

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