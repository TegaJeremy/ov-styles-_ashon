import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import type { Product } from "@/hooks/useProducts";
import { getWhatsAppUrl } from "@/lib/constants";

const ProductCard = ({ product }: { product: Product }) => {
  const [liked, setLiked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const handleEnter = () => {
      gsap.to(el, { y: -4, duration: 0.3, ease: "power2.out" });
      if (imageRef.current) gsap.to(imageRef.current, { scale: 1.05, duration: 0.4, ease: "power2.out" });
    };
    const handleLeave = () => {
      gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" });
      if (imageRef.current) gsap.to(imageRef.current, { scale: 1, duration: 0.4, ease: "power2.out" });
    };
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const mainImage = product.images?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400";

  return (
    <div ref={cardRef} className="group bg-card border border-border overflow-hidden">
      {/* Image - shorter aspect ratio */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[4/5]">
        <img
          ref={imageRef}
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-body tracking-widest uppercase px-2 py-1">
            Featured
          </span>
        )}
      </Link>

      {/* Info - compact */}
      <div className="p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-sm font-medium text-foreground mb-0.5 truncate">{product.name}</h3>
        </Link>
        {product.category && (
          <p className="text-muted-foreground font-body text-[10px] tracking-widest uppercase mb-1">{product.category}</p>
        )}
        <p className="text-accent font-body text-sm font-semibold mb-2">
          ₦{Number(product.price).toLocaleString()}
        </p>

        <div className="flex items-center gap-1.5">
          <a
            href={getWhatsAppUrl(product.name)}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground py-2 text-[10px] font-body tracking-wider uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
          >
            <ShoppingBag size={11} /> Purchase
          </a>
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 border border-border transition-colors duration-300 ${liked ? "bg-accent text-accent-foreground" : "hover:border-accent"}`}
          >
            <Heart size={11} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;