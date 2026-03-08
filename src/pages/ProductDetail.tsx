import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, MessageCircle, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const formatPrice = (p: number) => `₦${p.toLocaleString("en-NG")}`;
const normalizeSize = (s: string) => s.trim().toUpperCase();

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const { t } = useLanguage();
  const { addItem, isInCart, openDrawer } = useCart();

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const [isLiked, setIsLiked] = useState(() => {
    try {
      const stored = localStorage.getItem("ov_liked");
      return stored && id ? JSON.parse(stored).includes(id) : false;
    } catch { return false; }
  });
  const [likeAnim, setLikeAnim] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-40 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-secondary/30 animate-pulse" />
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3].map(i => <div key={i} className="aspect-square bg-secondary/20 animate-pulse" />)}
              </div>
            </div>
            <div className="space-y-4 pt-4">
              <div className="h-8 bg-secondary/30 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-secondary/20 animate-pulse rounded w-1/3" />
              <div className="h-20 bg-secondary/20 animate-pulse rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="font-display text-3xl font-light text-foreground mb-4">Product not found</h2>
          <Link to="/marketplace" className="text-accent font-body text-sm tracking-widest uppercase hover:underline">
            ← Back to Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = (product.images ?? []).filter(Boolean);
  if (images.length === 0) images.push("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80");
  const sizes = (product.sizes ?? []).map(normalizeSize);
  const alreadyInCart = selectedSize ? isInCart(product.id, selectedSize) : false;

  const handleLike = async () => {
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

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addItem({ id: product.id, name: product.name, price: product.price, image: images[0], size: selectedSize });
    openDrawer();
  };

  const handleBuy = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    const msg = `Hello O.V Styles! 👋\n\nI would like to purchase:\n\n• ${product.name} (Size: ${selectedSize}) — ${formatPrice(product.price)}\n\nPlease let me know how to proceed. Thank you!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="min-h-screen">
      <Navbar />


      <div className="container mx-auto px-4 pt-32 pb-20">

        {/* Back link */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground font-body transition-colors duration-200 mb-10"
        >
          <ArrowLeft size={13} /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Image Gallery ── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative overflow-hidden aspect-[4/5] bg-secondary/20 group">
              <img
                src={images[activeImg]}
                alt={`${product.name} — image ${activeImg + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {/* Arrows — only show if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
                  >
                    <ChevronRight size={18} />
                  </button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === activeImg ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square overflow-hidden border-2 transition-all duration-200 ${
                      i === activeImg ? "border-accent" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="lg:pt-4">

            {/* Category */}
            {product.category && (
              <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-body mb-3">
                {product.category}
              </p>
            )}

            {/* Name + Like */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-3xl md:text-4xl font-light text-foreground leading-tight">
                {product.name}
              </h1>
              <button
                onClick={handleLike}
                className={`mt-1 shrink-0 w-10 h-10 flex items-center justify-center border transition-all duration-300 ${
                  isLiked
                    ? "border-red-400 bg-red-500/10 text-red-500"
                    : "border-border text-muted-foreground hover:border-red-400 hover:text-red-400"
                } ${likeAnim ? "scale-125" : "scale-100"}`}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Price */}
            <p className="font-body text-2xl text-accent font-medium mt-4">
              {formatPrice(product.price)}
            </p>

            {/* Divider */}
            <div className="w-12 h-[1px] bg-accent mt-6 mb-6" />

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-8">
                <p className={`text-[10px] tracking-[0.35em] uppercase font-body mb-3 ${sizeError ? "text-red-400" : "text-muted-foreground"}`}>
                  {sizeError ? "Please select a size" : "Size"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s); setSizeError(false); }}
                      className={`w-14 h-14 border font-body text-xs transition-all duration-200 ${
                        selectedSize === s
                          ? "border-accent text-accent bg-accent/5"
                          : "border-border text-foreground hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2.5 py-4 text-xs font-body tracking-[0.3em] uppercase transition-all duration-300 ${
                  alreadyInCart
                    ? "bg-accent text-accent-foreground"
                    : "bg-foreground text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {alreadyInCart
                  ? <><Check size={14} /> Added to Cart</>
                  : <><ShoppingBag size={14} /> {t.addToCart}</>
                }
              </button>

              <button
                onClick={handleBuy}
                className="w-full flex items-center justify-center gap-2.5 py-4 text-xs font-body tracking-[0.3em] uppercase border border-border text-muted-foreground hover:border-accent hover:text-accent transition-all duration-300"
              >
                <MessageCircle size={14} />
                {t.purchase}
              </button>
            </div>

            {/* Meta */}
            <div className="mt-10 pt-6 border-t border-border space-y-2">
              {product.category && (
                <div className="flex gap-3">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-body w-20">Category</span>
                  <span className="text-xs font-body text-foreground">{product.category}</span>
                </div>
              )}
              {sizes.length > 0 && (
                <div className="flex gap-3">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-body w-20">Sizes</span>
                  <span className="text-xs font-body text-foreground">{sizes.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;