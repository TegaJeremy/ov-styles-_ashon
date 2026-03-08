import { useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { getWhatsAppUrl } from "@/lib/constants";

const placeholderProduct = {
  id: "1",
  name: "Silk Evening Gown",
  description:
    "An exquisite silk evening gown crafted with the finest fabrics. This piece features hand-sewn details, a flowing silhouette, and elegant draping that creates a stunning visual effect. Perfect for galas, red carpet events, and exclusive soirées.",
  price: 85000,
  sizes: ["S", "M", "L", "XL"],
  images: [
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
  ],
  category: "Gowns",
  featured: true,
  likes: 0,
  created_at: "",
  updated_at: "",
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product } = useProduct(id || "");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  const p = product || placeholderProduct;
  const images = p.images && p.images.length > 0
    ? p.images
    : placeholderProduct.images;

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="aspect-[3/4] overflow-hidden bg-secondary mb-4">
                <img
                  src={images[selectedImage]}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-accent" : "border-border"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">
                {p.category || "Collection"}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-light mt-2 text-foreground">
                {p.name}
              </h1>
              <p className="text-accent font-body text-2xl font-semibold mt-4">
                ₦{Number(p.price).toLocaleString()}
              </p>

              <div className="w-12 h-[1px] bg-border mt-6 mb-6" />

              <p className="text-muted-foreground font-body leading-relaxed mb-8">
                {p.description}
              </p>

              {/* Sizes */}
              {p.sizes && p.sizes.length > 0 && (
                <div className="mb-8">
                  <span className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
                    Available Sizes
                  </span>
                  <div className="flex gap-3">
                    {p.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 border text-sm font-body transition-all duration-300 ${
                          selectedSize === size
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border text-foreground hover:border-accent"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <a
                  href={getWhatsAppUrl(p.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 text-xs font-body tracking-[0.3em] uppercase hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  <ShoppingBag size={16} /> Purchase via WhatsApp
                </a>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`px-5 border border-border transition-colors duration-300 ${
                    liked ? "bg-accent text-accent-foreground" : "hover:border-accent"
                  }`}
                >
                  <Heart size={18} fill={liked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
