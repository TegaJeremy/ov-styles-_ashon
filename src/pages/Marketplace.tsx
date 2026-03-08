import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

gsap.registerPlugin(ScrollTrigger);

const placeholderProducts = [
  { id: "1", name: "Silk Evening Gown", description: "Elegant silk evening gown", price: 85000, sizes: ["S", "M", "L"], images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600"], category: "Gowns", featured: true, likes: 0, created_at: "", updated_at: "" },
  { id: "2", name: "Tailored Blazer", description: "Premium tailored blazer", price: 65000, sizes: ["S", "M", "L", "XL"], images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600"], category: "Blazers", featured: true, likes: 0, created_at: "", updated_at: "" },
  { id: "3", name: "Couture Dress", description: "Hand-crafted couture dress", price: 120000, sizes: ["S", "M", "L"], images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"], category: "Dresses", featured: true, likes: 0, created_at: "", updated_at: "" },
  { id: "4", name: "Statement Jumpsuit", description: "Bold fashion jumpsuit", price: 75000, sizes: ["S", "M", "L"], images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600"], category: "Jumpsuits", featured: false, likes: 0, created_at: "", updated_at: "" },
  { id: "5", name: "Beaded Cape Dress", description: "Luxurious beaded cape dress", price: 150000, sizes: ["S", "M", "L"], images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600"], category: "Dresses", featured: false, likes: 0, created_at: "", updated_at: "" },
  { id: "6", name: "Velvet Cocktail Dress", description: "Sophisticated velvet cocktail dress", price: 95000, sizes: ["S", "M", "L", "XL"], images: ["https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600"], category: "Dresses", featured: false, likes: 0, created_at: "", updated_at: "" },
];

const COLORS = ["Black", "White", "Red", "Gold", "Blue", "Green", "Brown", "Nude", "Silver"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name A–Z", value: "name_asc" },
];

const Marketplace = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { data: products } = useProducts();
  const allProducts = products && products.length > 0 ? products : placeholderProducts;

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Derive categories from products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean))) as string[];
    return ["All", ...cats];
  }, [allProducts]);

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedColor !== "All") {
      const c = selectedColor.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(c) ||
          (p.description || "").toLowerCase().includes(c)
      );
    }

    if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "name_asc") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [allProducts, search, selectedCategory, selectedColor, minPrice, maxPrice, sort]);

  const hasActiveFilters = search || selectedCategory !== "All" || selectedColor !== "All" || minPrice || maxPrice;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedColor("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
  };

  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".product-item");
    gsap.fromTo(items,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" }
    );
  }, [filtered]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[35vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80"
          alt="Marketplace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/55" />
        <div className="relative z-10 flex items-center justify-center h-full text-center">
          <div>
            <h1 className="font-display text-5xl md:text-7xl text-primary-foreground font-light tracking-wider">
              Marketplace
            </h1>
            <p className="text-primary-foreground/60 font-body text-xs mt-4 tracking-[0.4em] uppercase">
              Discover our curated collection
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">

          {/* Search + filter toggle bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, type, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border bg-card text-sm font-body focus:outline-none focus:border-accent text-foreground placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 border text-xs font-body tracking-widest uppercase transition-all duration-200 ${showFilters ? "bg-foreground text-primary-foreground border-foreground" : "border-border hover:border-foreground"}`}
            >
              <SlidersHorizontal size={13} />
              Filters
              {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-4 pr-8 py-3 border border-border bg-card text-xs font-body tracking-widest uppercase focus:outline-none focus:border-accent text-foreground cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="border border-border bg-card p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label className="text-[10px] font-body tracking-[0.3em] uppercase text-muted-foreground mb-3 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-[10px] font-body tracking-widest uppercase border transition-all duration-200 ${selectedCategory === cat ? "bg-foreground text-primary-foreground border-foreground" : "border-border hover:border-foreground"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-[10px] font-body tracking-[0.3em] uppercase text-muted-foreground mb-3 block">Color</label>
                <div className="flex flex-wrap gap-2">
                  {["All", ...COLORS].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-[10px] font-body tracking-widest uppercase border transition-all duration-200 ${selectedColor === color ? "bg-foreground text-primary-foreground border-foreground" : "border-border hover:border-foreground"}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="text-[10px] font-body tracking-[0.3em] uppercase text-muted-foreground mb-3 block">Price Range (₦)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-background text-sm font-body focus:outline-none focus:border-accent"
                  />
                  <span className="text-muted-foreground text-xs">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-background text-sm font-body focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Clear */}
              <div className="flex items-end">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-xs font-body tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={12} /> Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-body text-muted-foreground tracking-widest uppercase">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} found
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs font-body text-accent hover:text-accent/70 tracking-widest uppercase flex items-center gap-1">
                <X size={11} /> Clear filters
              </button>
            )}
          </div>

          {/* Grid — 2 cols on mobile, 3 on md, 4 on lg */}
          {filtered.length > 0 ? (
            <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {filtered.map((product) => (
                <div key={product.id} className="product-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-display text-3xl text-muted-foreground/30 font-light">No pieces found</p>
              <p className="text-muted-foreground font-body text-sm mt-3">Try adjusting your filters</p>
              <button onClick={clearFilters} className="mt-6 px-8 py-3 border border-border text-xs font-body tracking-widest uppercase hover:border-foreground transition-all">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Marketplace;