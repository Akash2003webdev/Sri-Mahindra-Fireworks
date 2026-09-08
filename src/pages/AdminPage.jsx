import { useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  UtensilsCrossed,
  MessageSquareText,
  MessageCircleQuestion,
  ClipboardList,
  X,
  Plus,
  Pencil,
  Trash2,
  Lock,
  User,
  Key,
  Calendar,
  Phone,
  Layers,
  Sparkles,
  AlertCircle,
  Loader2,
  Camera,
  ImageUp,
  Image as ImageIcon,
  GalleryHorizontal,
  Tag,
  Link as LinkIcon,
  Package,
  Search,
  CheckSquare,
  Square,
  Minus,
  IndianRupee,
  Award,
  Video,
  BadgePercent,
  Copy,
  Power,
  PackageCheck,
  PackageX,
  PackageMinus,
} from "lucide-react";
import {
  getCategories,
  getMenuItems,
  getOverallReviews,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getEnquiries,
  deleteEnquiry,
  deleteReview,
  uploadCategoryImage,
  uploadMenuItemImage,
  uploadMenuItemVideo,
  createCategory,
  updateCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createVariant,
  updateVariant,
  deleteVariant,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  uploadOfferImage,
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  uploadCouponImage,
} from "../lib/api";
import { ORDER_STATUSES, getStatusMeta } from "../lib/orderStatus";
import { useStoreSettings } from "../context/StoreSettingsContext";

// TODO: change these before going live — see README.md
const ADMIN_USER = "mahendrafancycrackers";
const ADMIN_PASS = "123456";

const TABS = [
  { key: "categories", label: "Categories", icon: LayoutGrid },
  { key: "items", label: "Menu Items", icon: UtensilsCrossed },
  { key: "brands", label: "Brands", icon: Award },
  { key: "banners", label: "Banners", icon: GalleryHorizontal },
  { key: "offers", label: "Combo Pack", icon: Tag },
  { key: "coupons", label: "Coupons", icon: BadgePercent },
  { key: "reviews", label: "Reviews", icon: MessageSquareText },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "enquiries", label: "Enquiries", icon: MessageCircleQuestion },
];

// --- 1. SOLID PREMIUM LOGIN GATE ---
function LoginGate({ onSuccess, onClose }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    if (e) e.preventDefault();
    setError("");

    if (user.trim() === ADMIN_USER && pass.trim() === ADMIN_PASS) {
      onSuccess();
    } else {
      setError("Invalid username or password credentials");
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-900/90 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2rem] border border-gray-200 p-8 w-full max-w-sm shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock size={22} className="text-gold-500 animate-pulse" />
        </div>

        <h2 className="font-display font-black text-xl text-center text-gray-900 tracking-tight">
          Control Center
        </h2>
        <p className="text-center text-xs text-gray-400 mt-1 mb-6 font-medium">
          Authorized staff login only
        </p>

        <div className="space-y-4">
          <div className="relative group">
            <User
              size={16}
              className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-gold-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Admin Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10"
              required
            />
          </div>

          <div className="relative group">
            <Key
              size={16}
              className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-gold-500 transition-colors"
            />
            <input
              type="password"
              placeholder="Security Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-xl text-xs font-semibold">
              <AlertCircle size={14} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold tracking-wide shadow-md shadow-primary-500/10 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            Authenticate
          </button>
        </div>
      </form>
    </div>
  );
}

// --- 2. SUBCOMPONENTS ---
function SectionHeader({ title, onAdd, count }) {
  return (
    <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <h3 className="font-display font-black text-xl md:text-2xl text-gray-900 tracking-tight">
          {title}
        </h3>
        {count !== undefined && (
          <span className="text-xs font-bold bg-gold-100 text-gold-800 border border-gold-200 px-2.5 py-0.5 rounded-full shadow-inner">
            {count}
          </span>
        )}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-xl shadow-md shadow-primary-500/5 hover:scale-[1.02] transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={14} strokeWidth={2.5} /> Add Item
        </button>
      )}
    </div>
  );
}

function LoadingRow() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-2">
      <div className="w-8 h-8 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
      <p className="text-xs font-semibold text-gray-400">
        Fetching live matrix...
      </p>
    </div>
  );
}

function ErrorRow({ message }) {
  return (
    <div className="flex items-start gap-3 bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-100 text-xs md:text-sm font-medium mb-6">
      <AlertCircle size={18} className="shrink-0 text-rose-500 mt-0.5" />
      <div>
        <p className="font-bold">Database Connectivity Alert</p>
        <p className="opacity-90 mt-0.5">
          Couldn't stream server data — {message}. Verify your Supabase
          configurations.
        </p>
      </div>
    </div>
  );
}

const STATUS_BADGE_COLORS = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  red: "bg-rose-50 text-rose-700 border-rose-200",
};

function StatusBadge({ status, orderType }) {
  const meta = getStatusMeta(status, orderType);
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold border px-2 py-0.5 rounded-md ${
        STATUS_BADGE_COLORS[meta.color] || STATUS_BADGE_COLORS.amber
      }`}
    >
      {meta.label}
    </span>
  );
}

// --- 3. PREMIUM INTEGRATED CAMERA & GALLERY IMAGE PICKER (single-file, used by
// Categories / Brands / Banners / Offers) ---
function ImagePicker({
  preview,
  onFile,
  fallbackIcon: FallbackIcon = ImageIcon,
}) {
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);

  function handleChange(e) {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-gray-300 shadow-inner flex items-center justify-center text-gray-400">
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <FallbackIcon size={22} />
        )}
      </div>
      <div className="space-y-2 flex-1">
        <span className="text-xs font-bold text-gray-600 block">
          Visual Media Asset
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-colors cursor-pointer"
          >
            <ImageUp size={13} className="text-gold-500" /> Upload File
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-colors cursor-pointer"
          >
            <Camera size={13} className="text-primary-500" /> Take Photo
          </button>

          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

// --- VIDEO PICKER SUBCOMPONENT (single-file, used elsewhere) ---
function VideoPicker({ preview, onFile }) {
  const videoRef = useRef(null);

  function handleChange(e) {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-gray-300 shadow-inner flex items-center justify-center text-gray-400">
        {preview ? (
          <video src={preview} className="w-full h-full object-cover" />
        ) : (
          <Video size={22} />
        )}
      </div>
      <div className="space-y-2 flex-1">
        <span className="text-xs font-bold text-gray-600 block">
          Product Demo Video (Optional)
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => videoRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-colors cursor-pointer"
          >
            <ImageUp size={13} className="text-gold-500" /> Upload Video
          </button>
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

// --- MULTI-IMAGE PICKER (Menu Items only) ---
function MenuImagesPicker({ images, onImagesChange }) {
  const fileInputRef = useRef(null);

  function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onImagesChange([...images, ...files]);
    }
    e.target.value = "";
  }

  function removeImage(index) {
    onImagesChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <span className="text-xs font-bold text-gray-600 block">
        Product Images (Multiple allowed)
      </span>
      <div className="flex flex-wrap gap-3">
        {images.map((img, index) => {
          const previewUrl =
            typeof img === "string" ? img : URL.createObjectURL(img);
          return (
            <div
              key={index}
              className="relative w-16 h-16 rounded-xl bg-gray-200 overflow-hidden border border-gray-300 shadow-inner group"
            >
              <img
                src={previewUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 cursor-pointer"
              >
                <X size={10} />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-16 h-16 rounded-xl bg-white border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-gold-500 hover:text-gold-600 transition-colors cursor-pointer"
        >
          <Plus size={20} />
          <span className="text-[10px] font-bold mt-0.5">Add</span>
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesChange}
        className="hidden"
      />
    </div>
  );
}

// --- MULTI-VIDEO PICKER (Menu Items only) ---
function MenuVideosPicker({ videos, onVideosChange }) {
  const videoInputRef = useRef(null);

  function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onVideosChange([...videos, ...files]);
    }
    e.target.value = "";
  }

  function removeVideo(index) {
    onVideosChange(videos.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <span className="text-xs font-bold text-gray-600 block">
        Product Demo Videos (Optional, Multiple allowed)
      </span>
      <div className="flex flex-wrap gap-3">
        {videos.map((vid, index) => {
          const previewUrl =
            typeof vid === "string" ? vid : URL.createObjectURL(vid);
          return (
            <div
              key={index}
              className="relative w-16 h-16 rounded-xl bg-gray-200 overflow-hidden border border-gray-300 shadow-inner group"
            >
              <video src={previewUrl} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 cursor-pointer"
              >
                <X size={10} />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="w-16 h-16 rounded-xl bg-white border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-gold-500 hover:text-gold-600 transition-colors cursor-pointer"
        >
          <Plus size={20} />
          <span className="text-[10px] font-bold mt-0.5">Add Video</span>
        </button>
      </div>
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleFilesChange}
        className="hidden"
      />
    </div>
  );
}

// --- 4. ADMINISTRATIVE FORMS ---
function CategoryForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleFile(f) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      let imageUrl = initial?.image || null;
      if (file) imageUrl = await uploadCategoryImage(file);
      await onSave({ name: name.trim(), image: imageUrl });
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 mb-4 shadow-sm animate-fade-in"
    >
      <ImagePicker
        preview={preview}
        onFile={handleFile}
        fallbackIcon={LayoutGrid}
      />

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">
          Category Label Title
        </label>
        <input
          type="text"
          placeholder="e.g., Authentic Desserts"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10"
          required
        />
      </div>

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-600 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Processing..." : "Commit Matrix"}
        </button>
      </div>
    </form>
  );
}

// --- MENU ITEM FORM: now supports multiple images, multiple videos,
// and multiple variants (pricing options) ---
function MenuItemForm({ initial, categories, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [categoryId, setCategoryId] = useState(
    initial?.category_id || categories[0]?.id || "",
  );

  const [images, setImages] = useState(initial?.images || []);
  const [videos, setVideos] = useState(initial?.videos || []);

  const [variants, setVariants] = useState(
    initial?.variants && initial.variants.length > 0
      ? initial.variants.map((v) => ({ ...v }))
      : [
          {
            name: "1 Box",
            price: "",
            actual_rate: "",
            discount_percent: "",
            sort_order: 0,
          },
        ],
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addVariantRow() {
    setVariants([
      ...variants,
      {
        name: "Pack",
        price: "",
        actual_rate: "",
        discount_percent: "",
        sort_order: variants.length,
      },
    ]);
  }

  function updateVariantField(index, field, value) {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  }

  function removeVariantRow(index) {
    if (variants.length === 1) {
      alert("At least one variant/price is required.");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !name.trim() ||
      !categoryId ||
      variants.length === 0 ||
      images.length === 0
    ) {
      setError(
        "Please provide a name, category, at least one image, and one variant.",
      );
      return;
    }

    setSaving(true);
    setError("");
    try {
      // Images: keep existing URLs as-is, upload only newly-picked files.
      const existingImageUrls = images.filter((img) => typeof img === "string");
      const newImageFiles = images.filter((img) => typeof img !== "string");
      const uploadedImageUrls =
        newImageFiles.length > 0
          ? await Promise.all(newImageFiles.map((f) => uploadMenuItemImage(f)))
          : [];
      const finalImages = [...existingImageUrls, ...uploadedImageUrls];

      // Videos: same pattern.
      const existingVideoUrls = videos.filter((vid) => typeof vid === "string");
      const newVideoFiles = videos.filter((vid) => typeof vid !== "string");
      const uploadedVideoUrls =
        newVideoFiles.length > 0
          ? await Promise.all(newVideoFiles.map((f) => uploadMenuItemVideo(f)))
          : [];
      const finalVideos = [...existingVideoUrls, ...uploadedVideoUrls];

      await onSave({
        name: name.trim(),
        categoryId,
        images: finalImages,
        videos: finalVideos,
        variants: variants.map((v) => ({
          id: v.id || null,
          name: v.name.trim(),
          price: Number(v.price),
          actual_rate: v.actual_rate ? Number(v.actual_rate) : null,
          discount_percent: v.discount_percent
            ? Number(v.discount_percent)
            : null,
          sort_order: Number(v.sort_order) || 0,
        })),
      });
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 mb-4 shadow-sm animate-fade-in max-h-[90vh] overflow-y-auto"
    >
      <MenuImagesPicker images={images} onImagesChange={setImages} />
      <MenuVideosPicker videos={videos} onVideosChange={setVideos} />

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">Item Name</label>
        <input
          type="text"
          placeholder="e.g., Sky Shot Rocket - 10 Shots"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">
          Category Group
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-gold-500 transition-all cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* VARIANTS MANAGER */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Package size={14} className="text-gold-500" /> Item Variants &
            Pricing Options
          </label>
          <button
            type="button"
            onClick={addVariantRow}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100 cursor-pointer flex items-center gap-1"
          >
            <Plus size={12} /> Add Variant
          </button>
        </div>

        <div className="space-y-2">
          {variants.map((v, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200"
            >
              <input
                type="text"
                placeholder="Variant Name (e.g., 1 Box)"
                value={v.name}
                onChange={(e) =>
                  updateVariantField(index, "name", e.target.value)
                }
                className="w-full sm:flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium outline-none"
                required
              />
              <input
                type="number"
                placeholder="Selling Price (₹)"
                value={v.price}
                onChange={(e) =>
                  updateVariantField(index, "price", e.target.value)
                }
                className="w-full sm:w-28 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium outline-none"
                required
              />
              <input
                type="number"
                placeholder="MRP Rate"
                value={v.actual_rate ?? ""}
                onChange={(e) =>
                  updateVariantField(index, "actual_rate", e.target.value)
                }
                className="w-full sm:w-28 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium outline-none"
              />
              <button
                type="button"
                onClick={() => removeVariantRow(index)}
                className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Saving Changes..." : "Commit Matrix"}
        </button>
      </div>
    </form>
  );
}

// --- 5. TABS COMPONENTS ---
function CategoriesTab() {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  function refresh() {
    getCategories()
      .then(setCategories)
      .catch((e) => setError(e.message));
  }

  useEffect(refresh, []);

  async function handleDelete(id) {
    if (!confirm("Delete this category? Items inside it will be deleted too."))
      return;
    try {
      await deleteCategory(id);
      refresh();
    } catch (err) {
      alert("Couldn't delete: " + err.message);
    }
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Categories"
        onAdd={() => setAdding(true)}
        count={categories?.length}
      />
      {error && <ErrorRow message={error} />}
      {!error && !categories && <LoadingRow />}

      {adding && (
        <CategoryForm
          onSave={async (fields) => {
            await createCategory(fields);
            setAdding(false);
            refresh();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories?.map((c) =>
          editingId === c.id ? (
            <div className="col-span-1 sm:col-span-2" key={c.id}>
              <CategoryForm
                initial={c}
                onSave={async (fields) => {
                  await updateCategory(c.id, fields);
                  setEditingId(null);
                  refresh();
                }}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div
              key={c.id}
              className="bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center gap-4 shadow-sm hover:border-gray-300 transition-all"
            >
              <img
                src={c.image || "/placeholder.png"}
                alt={c.name}
                className="w-14 h-14 rounded-xl object-cover border border-gray-100"
              />
              <span className="flex-1 text-sm font-bold text-gray-800">
                {c.name}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingId(c.id)}
                  className="text-gray-400 hover:text-gold-500 p-1.5 rounded-xl hover:bg-gold-50 transition-colors cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-gray-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      {categories && (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-6 text-xs font-semibold text-gray-500">
          <Layers size={16} className="text-gold-500 shrink-0" />
          <p>
            Supabase connection operational. Engine actions ready to layout
            write queries.
          </p>
        </div>
      )}
    </div>
  );
}

// --- BRANDS ---
function BrandForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleFile(f) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      let imageUrl = initial?.image || null;
      if (file) imageUrl = await uploadBrandImage(file);
      await onSave({ name: name.trim(), image: imageUrl });
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 mb-4 shadow-sm animate-fade-in"
    >
      <ImagePicker preview={preview} onFile={handleFile} fallbackIcon={Award} />

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">Brand Name</label>
        <input
          type="text"
          placeholder="e.g., Standard Fireworks"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10"
          required
        />
      </div>

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-600 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Saving..." : "Save Brand"}
        </button>
      </div>
    </form>
  );
}

function BrandsTab() {
  const [brands, setBrands] = useState(null);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  function refresh() {
    getAllBrands()
      .then(setBrands)
      .catch((e) => setError(e.message));
  }

  useEffect(refresh, []);

  async function handleDelete(id) {
    if (
      !confirm(
        "Delete this brand? It will disappear from Shop by Brand on the home page.",
      )
    )
      return;
    try {
      await deleteBrand(id);
      refresh();
    } catch (err) {
      alert("Couldn't delete: " + err.message);
    }
  }

  async function handleToggleStatus(brand) {
    try {
      await updateBrand(brand.id, {
        status: brand.status === "active" ? "inactive" : "active",
      });
      refresh();
    } catch (err) {
      alert("Couldn't update: " + err.message);
    }
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Brands"
        onAdd={() => setAdding(true)}
        count={brands?.length}
      />
      {error && <ErrorRow message={error} />}
      {!error && !brands && <LoadingRow />}

      {adding && (
        <BrandForm
          onSave={async (fields) => {
            await createBrand(fields);
            setAdding(false);
            refresh();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {brands?.map((b) =>
          editingId === b.id ? (
            <div className="col-span-1 sm:col-span-2" key={b.id}>
              <BrandForm
                initial={b}
                onSave={async (fields) => {
                  await updateBrand(b.id, fields);
                  setEditingId(null);
                  refresh();
                }}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div
              key={b.id}
              className="bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center gap-4 shadow-sm hover:border-gray-300 transition-all"
            >
              <img
                src={b.image || "/logo.png"}
                alt={b.name}
                className="w-14 h-14 rounded-xl object-cover border border-gray-100 bg-gray-50"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-gray-800 block truncate">
                  {b.name}
                </span>
                <button
                  onClick={() => handleToggleStatus(b)}
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg mt-1 inline-block cursor-pointer transition-colors ${
                    b.status === "active"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  {b.status === "active" ? "Active" : "Inactive"}
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingId(b.id)}
                  className="text-gray-400 hover:text-gold-500 p-1.5 rounded-xl hover:bg-gold-50 transition-colors cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-gray-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      {brands?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 text-sm">
          No brands yet — add one to show it in "Shop by Brand" on the home
          page.
        </div>
      )}
    </div>
  );
}

function ItemsTab() {
  const [items, setItems] = useState(null);
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  function refresh() {
    getMenuItems()
      .then(setItems)
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    refresh();
    getCategories()
      .then(setCategories)
      .catch((e) => setError(e.message));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this menu item?")) return;
    try {
      await deleteMenuItem(id);
      refresh();
    } catch (err) {
      alert("Couldn't delete: " + err.message);
    }
  }

  async function handleStockStatusChange(id, stockStatus) {
    try {
      await updateMenuItem(id, { stock_status: stockStatus });
      refresh();
    } catch (err) {
      alert("Couldn't update stock status: " + err.message);
    }
  }

  const ready = items && categories;

  const filteredItems = items?.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Menu Items"
        onAdd={() => ready && setAdding(true)}
        count={items?.length}
      />

      {ready && !adding && (
        <div className="mb-6 relative group">
          <Search
            size={18}
            className="absolute left-4 top-3 text-gray-400 group-focus-within:text-gold-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 shadow-sm"
          />
        </div>
      )}

      {error && <ErrorRow message={error} />}
      {!error && !ready && <LoadingRow />}

      {adding && ready && (
        <MenuItemForm
          categories={categories}
          onSave={async ({ variants, ...fields }) => {
            const newItem = await createMenuItem({
              categoryId: fields.categoryId,
              name: fields.name,
              images: fields.images,
              videos: fields.videos,
            });
            for (const v of variants) {
              await createVariant(newItem.id, v);
            }
            setAdding(false);
            refresh();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ready &&
          filteredItems.map((i) => {
            const isAvailable = i.status === "available";
            return editingId === i.id ? (
              <div className="col-span-1 sm:col-span-2" key={i.id}>
                <MenuItemForm
                  initial={i}
                  categories={categories}
                  onSave={async ({ variants, ...fields }) => {
                    await updateMenuItem(i.id, {
                      name: fields.name,
                      category_id: fields.categoryId,
                      images: fields.images,
                      videos: fields.videos,
                    });

                    const existingVariantIds = (i.variants || []).map(
                      (v) => v.id,
                    );
                    const updatedVariantIds = variants
                      .filter((v) => v.id)
                      .map((v) => v.id);

                    for (const oldId of existingVariantIds) {
                      if (!updatedVariantIds.includes(oldId)) {
                        await deleteVariant(oldId);
                      }
                    }

                    for (const v of variants) {
                      if (v.id) {
                        await updateVariant(v.id, v);
                      } else {
                        await createVariant(i.id, v);
                      }
                    }

                    setEditingId(null);
                    refresh();
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div
                key={i.id}
                className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm hover:border-gray-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={i.images?.[0]}
                    alt={i.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-gray-800 block truncate">
                      {i.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          isAvailable
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-rose-50 text-rose-600 border-rose-200"
                        }`}
                      >
                        {isAvailable ? "Available" : "Sold Out"}
                      </span>
                      <span className="text-xs font-black text-gold-600">
                        ₹{i.variants?.[0]?.price ?? "—"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingId(i.id)}
                      className="text-gray-400 hover:text-gold-500 p-1.5 rounded-xl hover:bg-gold-50 transition-colors cursor-pointer"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="text-gray-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Stock status — available / low stock / out of stock —
                    drives whether customers can add this item to cart. */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                    Stock
                  </span>
                  {[
                    { key: "available", label: "Available", icon: PackageCheck, active: "bg-green-50 text-green-600 border-green-300" },
                    { key: "low_stock", label: "Low Stock", icon: PackageMinus, active: "bg-amber-50 text-amber-600 border-amber-300" },
                    { key: "out_of_stock", label: "Out of Stock", icon: PackageX, active: "bg-rose-50 text-rose-600 border-rose-300" },
                  ].map(({ key, label, icon: Icon, active }) => {
                    const isCurrent = (i.stock_status || "available") === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleStockStatusChange(i.id, key)}
                        className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                          isCurrent ? active : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={12} /> {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

        {ready && filteredItems.length === 0 && !adding && (
          <div className="col-span-1 sm:col-span-2 py-10 flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
            <Search size={24} className="text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-500">
              No items match "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewsTab() {
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState(null);

  function refresh() {
    getOverallReviews()
      .then(setReviews)
      .catch((e) => setError(e.message));
  }

  useEffect(refresh, []);

  async function handleDelete(id) {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      refresh();
    } catch (err) {
      alert("Couldn't delete: " + err.message);
    }
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Guest Reviews" count={reviews?.length} />
      {error && <ErrorRow message={error} />}
      {!error && !reviews && <LoadingRow />}
      {reviews?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 text-sm">
          No reviews yet.
        </div>
      )}

      <div className="space-y-3">
        {reviews?.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gold-50 border border-gold-200 text-gold-600 flex items-center justify-center text-[10px] font-black uppercase">
                  {r.name.charAt(0)}
                </div>
                {r.name}
              </span>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-gray-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              {r.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BannerForm({ initial, onSave, onCancel }) {
  const [link, setLink] = useState(initial?.link || "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [placement, setPlacement] = useState(initial?.placement || "main");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleFile(f) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file && !initial?.image) {
      setError("Please add a banner image.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let imageUrl = initial?.image || null;
      if (file) imageUrl = await uploadBannerImage(file);
      await onSave({
        image: imageUrl,
        link: link.trim(),
        sortOrder: Number(sortOrder) || 0,
        placement,
      });
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 mb-4 shadow-sm animate-fade-in"
    >
      <ImagePicker
        preview={preview}
        onFile={handleFile}
        fallbackIcon={GalleryHorizontal}
      />

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">
          Banner Position
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPlacement("main")}
            className={`py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
              placement === "main"
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Main Banner
          </button>
          <button
            type="button"
            onClick={() => setPlacement("side")}
            className={`py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
              placement === "side"
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Side Banner
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">
          Link (optional — opens when tapped)
        </label>
        <div className="relative">
          <LinkIcon
            size={14}
            className="absolute left-3.5 top-3 text-gray-400"
          />
          <input
            type="url"
            placeholder="https://..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">Sort Order</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
        />
      </div>

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-600 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Saving..." : "Save Banner"}
        </button>
      </div>
    </form>
  );
}

function BannersTab() {
  const [banners, setBanners] = useState(null);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  function refresh() {
    getAllBanners()
      .then(setBanners)
      .catch((e) => setError(e.message));
  }

  useEffect(refresh, []);

  async function handleDelete(id) {
    if (!confirm("Delete this banner?")) return;
    try {
      await deleteBanner(id);
      refresh();
    } catch (err) {
      alert("Couldn't delete: " + err.message);
    }
  }

  async function toggleStatus(b) {
    try {
      await updateBanner(b.id, {
        status: b.status === "active" ? "inactive" : "active",
      });
      refresh();
    } catch (err) {
      alert("Couldn't update: " + err.message);
    }
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Home Banners"
        onAdd={() => setAdding(true)}
        count={banners?.length}
      />
      <p className="text-xs text-gray-400 -mt-4 mb-5">
        Choose Main or Side for each banner. Main shows in the big hero slot,
        Side shows in the smaller slot next to it — both appear on the home
        page alongside the default images.
      </p>
      {error && <ErrorRow message={error} />}
      {!error && !banners && <LoadingRow />}

      {adding && (
        <BannerForm
          onSave={async (fields) => {
            await createBanner(fields);
            setAdding(false);
            refresh();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {banners?.map((b) =>
          editingId === b.id ? (
            <div className="col-span-1 sm:col-span-2" key={b.id}>
              <BannerForm
                initial={b}
                onSave={async (fields) => {
                  await updateBanner(b.id, fields);
                  setEditingId(null);
                  refresh();
                }}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div
              key={b.id}
              className="bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center gap-4 shadow-sm hover:border-gray-300 transition-all"
            >
              <img
                src={b.image}
                alt="Banner"
                className="w-20 h-14 rounded-xl object-cover border border-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => toggleStatus(b)}
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      b.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    {b.status === "active" ? "Active" : "Inactive"}
                  </button>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      b.placement === "side"
                        ? "bg-sky-50 text-sky-700 border-sky-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {b.placement === "side" ? "Side" : "Main"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-1">
                  {b.link || "No link"}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setEditingId(b.id)}
                  className="text-gray-400 hover:text-primary-500 p-1.5 rounded-xl hover:bg-gold-50 transition-colors cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-gray-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function ComboProductPicker({
  allItems,
  selected,
  onToggle,
  onQuantityChange,
}) {
  const [query, setQuery] = useState("");

  const filtered = (allItems || []).filter((i) =>
    i.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search products to add to this combo…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
        />
      </div>

      <div className="border border-gray-200 rounded-xl max-h-64 overflow-y-auto divide-y divide-gray-100 bg-white">
        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">
            No products found.
          </p>
        )}
        {filtered.map((item) => {
          const variant = item.variants?.[0];
          const sel = selected[item.id];
          const isSelected = !!sel;
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-2.5 transition-colors ${isSelected ? "bg-primary-50/60" : ""}`}
            >
              <button
                type="button"
                onClick={() => onToggle(item, variant)}
                className="shrink-0 text-primary-600 cursor-pointer"
              >
                {isSelected ? (
                  <CheckSquare size={19} />
                ) : (
                  <Square size={19} className="text-gray-300" />
                )}
              </button>
              <img
                src={item.images?.[0] || "/product-placeholder.png"}
                alt=""
                className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-gray-800 block truncate">
                  {item.name}
                </span>
                <span className="text-[11px] text-gray-400 font-semibold">
                  ₹{variant?.price ?? "—"}
                </span>
              </div>
              {isSelected && (
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-1 py-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      onQuantityChange(item.id, Math.max(1, sel.quantity - 1))
                    }
                    className="w-5 h-5 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="text-[11px] font-bold w-4 text-center">
                    {sel.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item.id, sel.quantity + 1)}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OfferForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [rate, setRate] = useState(initial?.rate ?? "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [allItems, setAllItems] = useState(null);
  const [selected, setSelected] = useState(() => {
    const map = {};
    (initial?.products || []).forEach((p) => {
      map[p.id] = { quantity: p.quantity ?? 1, variantId: p.variantId };
    });
    return map;
  });

  useEffect(() => {
    getMenuItems()
      .then(setAllItems)
      .catch(() => setAllItems([]));
  }, []);

  function handleFile(f) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function toggleItem(item, variant) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[item.id]) {
        delete next[item.id];
      } else {
        next[item.id] = { quantity: 1, variantId: variant?.id ?? null };
      }
      return next;
    });
  }

  function changeQuantity(itemId, quantity) {
    setSelected((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity },
    }));
  }

  const selectedIds = Object.keys(selected);
  const originalTotal =
    allItems
      ?.filter((i) => selectedIds.includes(i.id))
      .reduce((sum, i) => {
        const sel = selected[i.id];
        const price = i.variants?.[0]?.price ?? 0;
        return sum + price * (sel?.quantity ?? 1);
      }, 0) ?? 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || rate === "" || selectedIds.length === 0) return;
    setSaving(true);
    setError("");
    try {
      let imageUrl = initial?.image || null;
      if (file) imageUrl = await uploadOfferImage(file);
      const items = selectedIds.map((itemId) => ({
        itemId,
        variantId: selected[itemId].variantId,
        quantity: selected[itemId].quantity,
      }));
      await onSave({
        title: title.trim(),
        description: description.trim(),
        image: imageUrl,
        rate: Number(rate),
        items,
      });
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 mb-4 shadow-sm animate-fade-in"
    >
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">
          Cover Image (optional — if skipped, the combo's product photos are
          shown instead)
        </label>
        <ImagePicker preview={preview} onFile={handleFile} fallbackIcon={Tag} />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">
          Offer / Combo Pack Name
        </label>
        <input
          type="text"
          placeholder="e.g., Diwali Special Combo Pack"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">
          Description (optional)
        </label>
        <textarea
          placeholder="Short details about the offer"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 resize-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600 flex items-center gap-2">
          <Package size={13} /> Group Products Into This Combo Pack
        </label>
        {allItems === null ? (
          <LoadingRow />
        ) : (
          <ComboProductPicker
            allItems={allItems}
            selected={selected}
            onToggle={toggleItem}
            onQuantityChange={changeQuantity}
          />
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
          <IndianRupee size={12} /> Combo Pack Rate (₹) — what the customer pays
        </label>
        <input
          type="number"
          placeholder="e.g., 249"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          required
        />
        {selectedIds.length > 0 && (
          <p className="text-[11px] text-gray-400 font-semibold pt-0.5">
            Individual products total ₹{originalTotal}
            {rate !== "" && Number(rate) < originalTotal && (
              <span className="text-emerald-600">
                {" "}
                · Customer saves ₹{originalTotal - Number(rate)}
              </span>
            )}
          </p>
        )}
      </div>

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-600 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || selectedIds.length === 0}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Saving..." : "Save Offer"}
        </button>
      </div>
    </form>
  );
}

function OffersTab() {
  const [offers, setOffers] = useState(null);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  function refresh() {
    getAllOffers()
      .then(setOffers)
      .catch((e) => setError(e.message));
  }

  useEffect(refresh, []);

  async function handleDelete(id) {
    if (!confirm("Delete this offer?")) return;
    try {
      await deleteOffer(id);
      refresh();
    } catch (err) {
      alert("Couldn't delete: " + err.message);
    }
  }

  async function toggleStatus(o) {
    try {
      await updateOffer(o.id, {
        status: o.status === "active" ? "inactive" : "active",
      });
      refresh();
    } catch (err) {
      alert("Couldn't update: " + err.message);
    }
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Offers Page"
        onAdd={() => setAdding(true)}
        count={offers?.length}
      />
      {error && <ErrorRow message={error} />}
      {!error && !offers && <LoadingRow />}

      {adding && (
        <OfferForm
          onSave={async ({ items, ...fields }) => {
            await createOffer({ ...fields, items });
            setAdding(false);
            refresh();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {offers?.map((o) =>
          editingId === o.id ? (
            <div className="col-span-1 sm:col-span-2" key={o.id}>
              <OfferForm
                initial={o}
                onSave={async ({ items, ...fields }) => {
                  await updateOffer(o.id, fields, items);
                  setEditingId(null);
                  refresh();
                }}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div
              key={o.id}
              className="bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center gap-4 shadow-sm hover:border-gray-300 transition-all"
            >
              {o.image ? (
                <img
                  src={o.image}
                  alt={o.title}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0"
                />
              ) : o.products?.length ? (
                <div className="w-14 h-14 rounded-xl overflow-hidden grid grid-cols-2 gap-0.5 shrink-0 border border-gray-100 bg-gray-50">
                  {o.products.slice(0, 4).map((p) => (
                    <img
                      key={p.id}
                      src={p.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gold-50 border border-gold-100 flex items-center justify-center shrink-0">
                  <Tag size={20} className="text-gold-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-gray-800 block truncate">
                  {o.title}
                </span>
                <span className="text-xs font-black text-gold-600 block mt-0.5">
                  ₹{o.rate}{" "}
                  <span className="text-gray-400 font-semibold">
                    · {o.products?.length ?? 0} products
                  </span>
                </span>
                <button
                  onClick={() => toggleStatus(o)}
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border mt-1 inline-block ${
                    o.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {o.status === "active" ? "Active" : "Inactive"}
                </button>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setEditingId(o.id)}
                  className="text-gray-400 hover:text-primary-500 p-1.5 rounded-xl hover:bg-gold-50 transition-colors cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(o.id)}
                  className="text-gray-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function CouponForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [code, setCode] = useState(initial?.code || "");
  const [discountAmount, setDiscountAmount] = useState(initial?.discount_amount ?? "");
  const [minOrderAmount, setMinOrderAmount] = useState(initial?.min_order_amount ?? "");
  const [validUntil, setValidUntil] = useState(
    initial?.valid_until ? initial.valid_until.slice(0, 10) : ""
  );
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleFile(f) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !code.trim() || discountAmount === "" || minOrderAmount === "") return;
    setSaving(true);
    setError("");
    try {
      let imageUrl = initial?.image || null;
      if (file) imageUrl = await uploadCouponImage(file);
      await onSave({
        name: name.trim(),
        code: code.trim(),
        image: imageUrl,
        discountAmount: Number(discountAmount),
        minOrderAmount: Number(minOrderAmount),
        validUntil: validUntil ? new Date(validUntil).toISOString() : null,
      });
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 mb-4 shadow-sm animate-fade-in"
    >
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">
          Banner Image (optional — canva-style poster; falls back to a plain ₹ OFF card if skipped)
        </label>
        <ImagePicker preview={preview} onFile={handleFile} fallbackIcon={BadgePercent} />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">Offer Name</label>
        <input
          type="text"
          placeholder="e.g., Diwali Mega Saver"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600">Coupon Code</label>
        <input
          type="text"
          placeholder="e.g., SAVE500"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold uppercase tracking-wider outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
            <IndianRupee size={12} /> Discount (₹)
          </label>
          <input
            type="number"
            placeholder="e.g., 500"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
            <IndianRupee size={12} /> Min. Order (₹)
          </label>
          <input
            type="number"
            placeholder="e.g., 10000"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
          <Calendar size={12} /> Valid Until (optional — leave blank for no expiry)
        </label>
        <input
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
        />
      </div>

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-600 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Saving..." : "Save Coupon"}
        </button>
      </div>
    </form>
  );
}

function CouponsTab() {
  const [coupons, setCoupons] = useState(null);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  function refresh() {
    getAllCoupons()
      .then(setCoupons)
      .catch((e) => setError(e.message));
  }

  useEffect(refresh, []);

  async function handleDelete(id) {
    if (!confirm("Delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      refresh();
    } catch (err) {
      alert("Couldn't delete: " + err.message);
    }
  }

  async function toggleStatus(c) {
    try {
      await updateCoupon(c.id, {
        status: c.status === "active" ? "inactive" : "active",
      });
      refresh();
    } catch (err) {
      alert("Couldn't update: " + err.message);
    }
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Coupons"
        onAdd={() => setAdding(true)}
        count={coupons?.length}
      />
      {error && <ErrorRow message={error} />}
      {!error && !coupons && <LoadingRow />}

      {adding && (
        <CouponForm
          onSave={async (fields) => {
            await createCoupon(fields);
            setAdding(false);
            refresh();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {coupons?.map((c) =>
          editingId === c.id ? (
            <div className="col-span-1 sm:col-span-2" key={c.id}>
              <CouponForm
                initial={c}
                onSave={async (fields) => {
                  await updateCoupon(c.id, fields);
                  setEditingId(null);
                  refresh();
                }}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div
              key={c.id}
              className="bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center gap-4 shadow-sm hover:border-gray-300 transition-all"
            >
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gold-50 border border-gold-100 flex items-center justify-center shrink-0">
                  <BadgePercent size={20} className="text-gold-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-gray-800 block truncate">
                  {c.name}
                </span>
                <span className="text-xs font-black text-gold-600 block mt-0.5 flex items-center gap-1">
                  <Copy size={11} /> {c.code}
                </span>
                <span className="text-[11px] text-gray-500 font-semibold block mt-0.5">
                  ₹{c.discount_amount} off · min ₹{c.min_order_amount}
                </span>
                <button
                  onClick={() => toggleStatus(c)}
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border mt-1 inline-block ${
                    c.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {c.status === "active" ? "Active" : "Inactive"}
                </button>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setEditingId(c.id)}
                  className="text-gray-400 hover:text-primary-500 p-1.5 rounded-xl hover:bg-gold-50 transition-colors cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-gray-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      {coupons?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 text-sm">
          No coupons yet — add one to show it in Explore Gift → Offers.
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((e) => setError(e.message));
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    setSavingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(orderId) {
    const order = orders?.find((o) => o.id === orderId);
    if (order && order.status !== "completed") {
      setError("Only delivered / picked up orders can be deleted.");
      return;
    }
    if (!confirm("Delete this order? This can't be undone.")) return;
    setSavingId(orderId);
    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setExpandedId((id) => (id === orderId ? null : id));
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader title="WhatsApp Orders Ledger" count={orders?.length} />
      {error && <ErrorRow message={error} />}
      {!error && !orders && <LoadingRow />}
      {orders?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 text-sm">
          No transactions yet. Direct mobile baskets will queue live here.
        </div>
      )}

      <div className="space-y-3">
        {orders?.map((o) => {
          const items = Array.isArray(o.items) ? o.items : [];
          const open = expandedId === o.id;
          return (
            <div
              key={o.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:border-gray-300 transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedId(open ? null : o.id)}
                className="w-full flex items-start justify-between mb-2 text-left cursor-pointer"
              >
                <div>
                  <span className="text-sm font-bold text-gray-900 block">
                    {o.customer_name}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[10px] bg-gold-50 text-gold-800 font-bold border border-gold-200 px-2 py-0.5 rounded-md">
                      {o.order_type}
                    </span>
                    <StatusBadge status={o.status} orderType={o.order_type} />
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-base font-black text-gold-600 block">
                      ₹{o.total}
                    </span>
                    {o.coupon_code && (
                      <span className="text-[10px] font-bold text-emerald-600 block">
                        − ₹{o.discount_amount} ({o.coupon_code})
                      </span>
                    )}
                  </div>
                  {open ? (
                    <Minus size={16} className="text-gray-400" />
                  ) : (
                    <Plus size={16} className="text-gray-400" />
                  )}
                </div>
              </button>

              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 border-t border-gray-100 text-[11px] text-gray-500 font-semibold">
                <span className="flex items-center gap-1">
                  <Phone size={12} /> {o.customer_phone}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />{" "}
                  {new Date(o.created_at).toLocaleString()}
                </span>
              </div>

              {open && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-xs bg-purple-50 border border-purple-100 rounded-xl p-2.5">
                    <span className="font-bold text-gray-800 shrink-0">
                      Order Status:
                    </span>
                    <select
                      value={o.status}
                      disabled={savingId === o.id}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 rounded-lg border border-purple-200 bg-white px-2 py-1.5 text-xs font-bold text-[#730ca8] focus:outline-none focus:ring-2 focus:ring-[#730ca8]/30 disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {getStatusMeta(s, o.order_type).label}
                        </option>
                      ))}
                    </select>
                    {savingId === o.id && (
                      <Loader2
                        size={14}
                        className="animate-spin text-[#730ca8]"
                      />
                    )}
                  </div>

                  {o.coupon_code && (
                    <div className="flex items-center justify-between gap-2 text-xs bg-emerald-50 border border-emerald-100 rounded-xl p-2.5">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <BadgePercent size={13} /> Coupon Applied: {o.coupon_code}
                      </span>
                      <span className="font-black text-emerald-700">
                        − ₹{o.discount_amount} (Subtotal ₹{o.total + o.discount_amount})
                      </span>
                    </div>
                  )}

                  {o.address && (
                    <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-xl p-2.5">
                      <span className="font-bold text-gray-800 shrink-0">
                        Delivery Address:
                      </span>
                      <span>{o.address}</span>
                    </div>
                  )}

                  {o.map_location && (
                    <a
                      href={o.map_location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 hover:bg-emerald-100 transition-colors"
                    >
                      📍 View customer's pinned location on map
                    </a>
                  )}

                  <div>
                    <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5 mb-1.5">
                      <Package size={13} /> Items ordered ({items.length})
                    </span>
                    <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                      {items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 px-3 py-2 bg-white text-xs"
                        >
                          <span className="text-gray-700 font-medium">
                            {it.name}
                            {it.variantName ? (
                              <span className="text-gray-400">
                                {" "}
                                — {it.variantName}
                              </span>
                            ) : null}
                            <span className="text-gray-400">
                              {" "}
                              × {it.quantity}
                            </span>
                          </span>
                          <span className="font-bold text-gold-700 shrink-0">
                            ₹{(it.price ?? 0) * (it.quantity ?? 1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    {o.status === "completed" ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(o.id);
                        }}
                        disabled={savingId === o.id}
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl px-3 py-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 size={13} /> Delete Order
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-semibold">
                        Delete unlocks once the order is marked{" "}
                        {o.order_type === "Store Pickup" ? "Picked Up" : "Delivered"}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState(null);
  const [error, setError] = useState(null);

  function refresh() {
    getEnquiries()
      .then(setEnquiries)
      .catch((e) => setError(e.message));
  }

  useEffect(refresh, []);

  async function handleDelete(id) {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await deleteEnquiry(id);
      refresh();
    } catch (err) {
      alert("Couldn't delete: " + err.message);
    }
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Guest Enquiries" count={enquiries?.length} />
      {error && <ErrorRow message={error} />}
      {!error && !enquiries && <LoadingRow />}
      {enquiries?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 text-sm">
          No client records registered.
        </div>
      )}

      <div className="space-y-3">
        {enquiries?.map((e) => (
          <div
            key={e.id}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
              <div>
                <span className="text-sm font-bold text-gray-900 block">
                  {e.name}
                </span>
                <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1 mt-0.5">
                  <Phone size={11} /> {e.phone}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-primary-50 text-primary-600 border border-primary-200 px-2.5 py-0.5 rounded-lg">
                  {e.enquiry_type}
                </span>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="text-gray-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              {e.message}
            </p>
            <span className="text-[10px] text-gray-400 mt-2.5 block font-semibold">
              Received · {new Date(e.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 6. MAIN ADMINISTRATIVE FRAMEWORK PAGE ---
export default function AdminPage({ onClose }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("categories");
  const { onlineOrderEnabled, setOnlineOrder } = useStoreSettings();
  const [togglingOrder, setTogglingOrder] = useState(false);

  if (!loggedIn) {
    return <LoginGate onSuccess={() => setLoggedIn(true)} onClose={onClose} />;
  }

  async function handleToggleOnlineOrder() {
    setTogglingOrder(true);
    try {
      await setOnlineOrder(!onlineOrderEnabled);
    } catch (err) {
      alert("Couldn't update: " + err.message);
    }
    setTogglingOrder(false);
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-gray-100 flex flex-col min-h-screen">
      <div className="bg-gray-900 text-white px-5 py-4 flex items-center justify-between shadow-md border-b border-gray-800 relative overflow-hidden">
        <div className="flex items-center gap-2 z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h1 className="font-display font-black text-lg tracking-tight uppercase flex items-center gap-1.5">
            HQ Dashboard <Sparkles size={14} className="text-gold-400" />
          </h1>
        </div>

        <div className="flex items-center gap-2 z-10">
          {/* Online Order On/Off — hides Add to Cart across the site and
              shows a "visit store" message instead, while this is off. */}
          <button
            onClick={handleToggleOnlineOrder}
            disabled={togglingOrder}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 disabled:opacity-50 cursor-pointer ${
              onlineOrderEnabled
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/40 text-rose-400"
            }`}
            title={onlineOrderEnabled ? "Online Orders: ON — tap to turn off" : "Online Orders: OFF — tap to turn on"}
          >
            <Power size={14} />
            {togglingOrder ? "..." : onlineOrderEnabled ? "Online Order: ON" : "Online Order: OFF"}
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-all active:scale-90 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full md:px-6 pb-28">
        {tab === "categories" && <CategoriesTab />}
        {tab === "items" && <ItemsTab />}
        {tab === "brands" && <BrandsTab />}
        {tab === "banners" && <BannersTab />}
        {tab === "offers" && <OffersTab />}
        {tab === "coupons" && <CouponsTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "enquiries" && <EnquiriesTab />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl pb-safe">
        <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-2">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="relative flex flex-col items-center justify-center py-1 min-w-[60px] md:min-w-[70px] transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <div
                  className={`absolute inset-x-0.5 top-0 bottom-0 rounded-xl bg-gold-50 opacity-0 scale-75 transition-all duration-300 -z-10 ${
                    active ? "opacity-100 scale-100 border border-gold-100" : ""
                  }`}
                />

                <div
                  className={`transition-transform duration-300 ${active ? "-translate-y-0.5" : ""}`}
                >
                  <Icon
                    size={18}
                    className={`transition-colors duration-300 ${active ? "text-gold-500 stroke-[2.5]" : "text-gray-400 stroke-[2]"}`}
                    color={active ? "#cc2027" : "#9ca3af"}
                  />
                </div>

                <span
                  className={`text-[9px] tracking-wide mt-1 transition-all duration-300 font-bold ${
                    active
                      ? "text-gold-600 scale-105"
                      : "text-gray-400 font-medium"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
