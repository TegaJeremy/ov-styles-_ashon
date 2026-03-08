import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, SlidersHorizontal, ShoppingBag, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

gsap.registerPlugin(ScrollTrigger);

type SortKey = "newest" | "price_asc" | "price_desc" | "most_loved";
const CATEGORIES = ["Gowns", "Blazers", "Dresses", "Jumpsuits", "Skirts", "Sets"];

const Marketplace = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { data: allProducts, isLoading } = useProducts();
  const { totalItems, openDrawer } = useCart();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "newest", label: t.sortNewest },
    { key: "price_asc", label: t.sortPriceLow },
    { key: "price_desc", label: t.sortPriceHigh },
    { key: "most_loved", label: t.sortMostLoved },
  ];

  const filtered = (allProducts ?? [])
    .filter((p) => {
      const matchCat = !activeCategory || p.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "most_loved") return (b.likes ?? 0) - (a.likes ?? 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  useEffect(() => {
    if (!pageRef.current || isLoading || filtered.length === 0) return;
    gsap.fromTo(
      pageRef.current.querySelectorAll(".product-card"),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out" }
    );
  }, [filtered.length, isLoading]);

  return (
    <div className="min-h-screen">
      <Navbar />


      {/* Hero */}
      <section className="relative h-[55vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80"
          alt="O.V Styles Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <span className="text-accent text-xs font-body tracking-[0.6em] uppercase mb-5">{t.newCollection}</span>
          <h1 className="font-display text-6xl md:text-8xl text-white font-light tracking-wider leading-none">
            {t.marketplace}
          </h1>
          <div className="w-16 h-[1px] bg-accent mx-auto mt-8" />
          <p className="text-white/50 font-body text-xs mt-5 tracking-[0.3em] uppercase max-w-xs">
            {t.featuredDesc}
          </p>
        </div>
      </section>

      <div ref={pageRef} className="bg-background">

        {/* Sticky toolbar */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 py-4">

              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.searchItems}
                  className="w-full pl-9 pr-8 py-2.5 bg-secondary/20 border border-border text-foreground font-body text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent transition-colors duration-300"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X size={11} />
                  </button>
                )}
              </div>

              {/* Filters toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-4 py-2.5 border text-xs font-body tracking-[0.2em] uppercase transition-all duration-300 ${showFilters ? "border-accent text-accent bg-accent/5" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
              >
                <SlidersHorizontal size={12} />
                <span className="hidden sm:inline">{t.filters}</span>
              </button>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="hidden sm:block pl-3 pr-8 py-2.5 bg-secondary/20 border border-border text-foreground font-body text-xs focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>

              <div className="flex-1" />

              {/* Count */}
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground font-body hidden lg:block whitespace-nowrap">
                {filtered.length} {t.piecesFound}
              </span>

              {/* Cart CTA */}
              <button
                onClick={openDrawer}
                className="relative flex items-center gap-2 px-4 py-2.5 bg-foreground text-primary-foreground text-xs font-body tracking-[0.2em] uppercase hover:bg-accent hover:text-accent-foreground transition-all duration-300 shrink-0"
              >
                <ShoppingBag size={13} />
                <span className="hidden sm:inline">{t.cart}</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold leading-none">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Category chips */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 pb-4 border-t border-border/50 pt-3">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2 text-[10px] font-body tracking-[0.25em] uppercase border transition-all duration-200 ${!activeCategory ? "border-accent text-accent bg-accent/5" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
                >
                  {t.filterAll}
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`px-4 py-2 text-[10px] font-body tracking-[0.25em] uppercase border transition-all duration-200 ${activeCategory === cat ? "border-accent text-accent bg-accent/5" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
                  >
                    {cat}
                  </button>
                ))}
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="px-4 py-2 text-[10px] font-body tracking-[0.25em] uppercase border border-border text-red-400 hover:bg-red-400/5 transition-all duration-200 flex items-center gap-1"
                  >
                    <X size={10} /> {t.clearFilters}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product grid */}
        <div className="container mx-auto px-4 py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-[3/4] bg-secondary/30 animate-pulse mb-3" />
                  <div className="h-4 bg-secondary/20 animate-pulse rounded w-2/3 mb-2" />
                  <div className="h-3 bg-secondary/15 animate-pulse rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <ShoppingBag size={48} className="text-muted-foreground/20 mb-5" />
              <h3 className="font-display text-2xl font-light text-foreground mb-2">{t.noItemsFound}</h3>
              <p className="text-muted-foreground font-body text-sm mb-8">
                {[search && `"${search}"`, activeCategory].filter(Boolean).join(" · ")}
              </p>
              <button
                onClick={() => { setSearch(""); setActiveCategory(null); }}
                className="px-8 py-3 border border-foreground text-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-foreground hover:text-primary-foreground transition-all duration-300"
              >
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14 w-full">
              {filtered.map((product) => (
                <div key={product.id} className="product-card w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;