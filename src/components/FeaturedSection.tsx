import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "./ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const placeholderProducts = [
  { id: "1", name: "Silk Evening Gown", description: "Elegant silk evening gown", price: 85000, sizes: ["S", "M", "L"], images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600"], category: "Gowns", featured: true, likes: 0, created_at: "", updated_at: "" },
  { id: "2", name: "Tailored Power Blazer", description: "Premium tailored blazer", price: 65000, sizes: ["S", "M", "L", "XL"], images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600"], category: "Blazers", featured: true, likes: 0, created_at: "", updated_at: "" },
  { id: "3", name: "Couture Statement Dress", description: "Hand-crafted couture dress", price: 120000, sizes: ["S", "M", "L"], images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"], category: "Dresses", featured: true, likes: 0, created_at: "", updated_at: "" },
];

const FeaturedSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { data: products } = useFeaturedProducts();
  const displayProducts = products && products.length > 0 ? products : placeholderProducts;
  const { t } = useLanguage();

  const categories = [
    { name: "Gowns", image: "https://res.cloudinary.com/dsml73vio/image/upload/v1772985425/IMG_4132_w8kwg5.jpg", count:"" },
    { name: "Suits", image: "https://res.cloudinary.com/dsml73vio/image/upload/v1772985426/IMG_4131_je3vhz.jpg", count: " " },
    { name: "Ankara", image: "https://res.cloudinary.com/dsml73vio/image/upload/v1772986098/IMG_4140_ftn484.jpg", count: "" },
    { name: "English wears", image: "https://res.cloudinary.com/dsml73vio/image/upload/v1772986095/IMG_4138_lcnogb.jpg", count: " " },
    { name: "Senetors", image: "https://res.cloudinary.com/dsml73vio/image/upload/v1772989198/IMG_4141_a3y4wi.jpg", count: " " },
    { name: "Joggers", image: "https://res.cloudinary.com/dsml73vio/image/upload/v1772989199/IMG_4142_gsvdsv.jpg", count: " " },
    { name: "cultural wears", image: "https://res.cloudinary.com/dsml73vio/image/upload/v1772990101/IMG_4143_o1ylnv.jpg", count: " " },
    { name: "office wears", image: "https://res.cloudinary.com/dsml73vio/image/upload/v1772990124/IMG_4145_mhmdhj.jpg", count: " " },
    
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(sectionRef.current.querySelectorAll(".product-item"),
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
    );
    if (categoryRef.current) {
      gsap.fromTo(categoryRef.current.querySelectorAll(".cat-item"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: categoryRef.current, start: "top 80%" } }
      );
    }
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.querySelectorAll(".stat-item"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: statsRef.current, start: "top 85%" } }
      );
    }
  }, [displayProducts]);

  return (
    <>
      {/* Stats Bar */}
      <div ref={statsRef} className="bg-foreground text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: t.designsLabel },
              { number: "12+", label: t.yearsLabel },
              { number: "98%", label: "Client Approval" },
              { number: "50+", label: t.clientsLabel },
            ].map((stat, i) => (
              <div key={i} className="stat-item group cursor-default">
                <div className="font-display text-4xl md:text-5xl font-light text-accent group-hover:scale-110 transition-transform duration-300 inline-block">{stat.number}</div>
                <div className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/50 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.collection}</span>
            <h2 className="font-display text-4xl md:text-6xl font-light mt-3 text-foreground">{t.featuredPieces}</h2>
            <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
            <p className="text-muted-foreground font-body mt-6 max-w-lg mx-auto text-sm leading-relaxed">
              {t.featuredDesc}
            </p>
          </div>

          <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product) => (
              <div key={product.id} className="product-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link to="/marketplace" className="inline-block px-12 py-4 border border-foreground text-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-foreground hover:text-primary-foreground transition-all duration-300">
              {t.viewCollection}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-28 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">Browse</span>
            <h2 className="font-display text-4xl md:text-6xl font-light mt-3 text-foreground">{t.shopByCategory}</h2>
            <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
          </div>

          <div ref={categoryRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} to="/marketplace" className="cat-item group relative overflow-hidden aspect-[3/4] block">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition-all duration-500" />
                <div className="absolute inset-0 border border-transparent group-hover:border-accent/50 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-xl text-white font-light">{cat.name}</h3>
                  <p className="text-white/55 font-body text-[10px] tracking-[0.3em] uppercase mt-1">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedSection;