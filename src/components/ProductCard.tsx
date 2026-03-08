import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, MessageCircle, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_NUMBER } from "@/lib/constants";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  sizes?: string[];
  images?: string[];
  category?: string | null;
  featured?: boolean;
  likes?: number;
  created_at: string;
  updated_at: string;
};

const formatPrice = (p: number) => `₦${p.toLocaleString("en-NG")}`;

// Always uppercase sizes regardless of what admin typed
const normalizeSize = (s: string) => s.trim().toUpperCase();

const ProductCard = ({ product }: { product: Product }) => {
  const { t } = useLanguage();
  const { addItem, isInCart, openDrawer } = useCart();

  const image = product.images?.[0] ?? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80";
  const sizes = (product.sizes ?? []).map(normalizeSize);
  const defaultSize = sizes[0] ?? "ONE SIZE";

  const [isLiked, setIsLiked] = useState(() => {
    try {
      const stored = localStorage.getItem("ov_liked");
      return stored ? JSON.parse(stored).includes(product.id) : false;
    } catch { return false; }
  });
  const [likeAnim, setLikeAnim] = useState(false);

  const [showSizePicker, setShowSizePicker] = useState(false);
  const [sizePickerMode, setSizePickerMode] = useState<"cart" | "buy">("cart");
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [imgLoaded, setImgLoaded] = useState(false);

  const alreadyInCart = isInCart(product.id, selectedSize);

  // ── Like ─────────────────────────────────────────────────────────
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // don't navigate to product detail
    e.stopPropagation();
    if (isLiked) return;
    setIsLiked(true);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
    try {
      const stored = localStorage.getItem("ov_liked");
      const arr: string[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem("ov_liked", JSON.stringify([...arr, product.id]));
    } catch {}
    await (supabase.rpc as any)("increment_likes", { product_id: product.id });
  };

  // ── Add to Cart ───────────────────────────────────────────────────
  const handleAddToCart = (size: string) => {
    addItem({ id: product.id, name: product.name, price: product.price, image, size });
    setSelectedSize(size);
    setShowSizePicker(false);
    openDrawer();
  };

  // ── Direct WhatsApp Purchase ──────────────────────────────────────
  const handleBuy = (size: string) => {
    const msg = `Hello O.V Styles! 👋\n\nI would like to purchase:\n\n• ${product.name} (Size: ${size}) — ${formatPrice(product.price)}\n\nPlease let me know how to proceed. Thank you!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setShowSizePicker(false);
  };

  const openSizePicker = (e: React.MouseEvent, mode: "cart" | "buy") => {
    e.preventDefault();
    e.stopPropagation();
    if (sizes.length <= 1) {
      mode === "cart" ? handleAddToCart(defaultSize) : handleBuy(defaultSize);
      return;
    }
    setSizePickerMode(mode);
    setShowSizePicker(true);
  };

  return (
    <div className="group relative bg-background w-full flex flex-col">

      {/* ── Clickable image → product detail ── */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4]">
          {!imgLoaded && <div className="absolute inset-0 bg-secondary/40 animate-pulse" />}
          <img
            src={image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

          {/* Like button — top right — stops propagation so it doesn't navigate */}
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center backdrop-blur-sm transition-all duration-300 z-10 ${
              isLiked
                ? "bg-red-500/90 text-white border border-red-400"
                : "bg-white/80 text-foreground border border-white/50 hover:bg-white hover:text-red-500"
            } ${likeAnim ? "scale-125" : "scale-100"}`}
          >
            <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
          </button>

          {/* Category badge — top left */}
          {product.category && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-background/80 backdrop-blur-sm">
              <span className="text-[9px] tracking-[0.3em] uppercase text-foreground font-body">
                {product.category}
              </span>
            </div>
          )}

          {/* View more overlay hint */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-3 py-1.5 bg-background/85 backdrop-blur-sm text-[9px] tracking-[0.3em] uppercase text-foreground font-body">
              View Details
            </span>
          </div>

          {/* Size picker overlay */}
          {showSizePicker && (
            <div
              className="absolute inset-0 bg-background/96 flex flex-col items-center justify-center p-5 z-10"
              onClick={(e) => e.preventDefault()}
            >
              <p className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground font-body mb-1">
                Size
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-5 mt-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      sizePickerMode === "cart" ? handleAddToCart(s) : handleBuy(s);
                    }}
                    className="w-12 h-12 border border-border text-foreground font-body text-xs hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizePicker(false); }}
                className="text-muted-foreground font-body text-xs hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* ── Info ── */}
      <div className="w-full pt-4 pb-1">

        {/* Name + sizes on same row */}
        <div className="flex items-start justify-between gap-2 w-full">
          <Link to={`/product/${product.id}`} className="min-w-0 flex-1">
            <h3 className="font-display text-base font-light text-foreground hover:text-accent transition-colors duration-200 leading-snug">
              {product.name}
            </h3>
          </Link>
          {/* Sizes beside name */}
          {sizes.length > 0 && (
            <div className="flex gap-1 flex-wrap justify-end shrink-0 mt-0.5">
              {sizes.slice(0, 3).map((s) => (
                <span key={s} className="text-[9px] font-body text-muted-foreground border border-border px-2 py-1">
                  {s}
                </span>
              ))}
              {sizes.length > 3 && (
                <span className="text-[9px] font-body text-muted-foreground self-center">+{sizes.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Category */}
        {product.category && (
          <p className="text-[9px] tracking-[0.3em] uppercase text-accent font-body mt-1">
            {product.category}
          </p>
        )}

        {/* Description — max 2 lines */}
        {product.description && (
          <p className="text-muted-foreground font-body text-xs mt-1.5 leading-relaxed line-clamp-2 w-full">
            {product.description}
          </p>
        )}

        {/* Price */}
        <p className="font-body text-lg text-foreground font-semibold mt-2 w-full">
          {formatPrice(product.price)}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-3 w-full">
          <button
            onClick={(e) => openSizePicker(e, "cart")}
            className={`w-full flex items-center justify-center gap-2 py-3.5 text-[10px] font-body tracking-[0.25em] uppercase transition-all duration-300 ${
              alreadyInCart
                ? "bg-accent text-accent-foreground"
                : "border border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground"
            }`}
          >
            {alreadyInCart
              ? <><Check size={12} /> {t.addedToCart}</>
              : <><ShoppingBag size={12} /> {t.addToCart}</>
            }
          </button>

          <button
            onClick={(e) => openSizePicker(e, "buy")}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-[10px] font-body tracking-[0.25em] uppercase border border-border text-muted-foreground hover:border-accent hover:text-accent transition-all duration-300"
          >
            <MessageCircle size={12} />
            {t.purchase}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;