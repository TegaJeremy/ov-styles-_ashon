import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Pencil, Trash2, LogOut, Sun, Moon,
  Heart, ShoppingBag, Star, TrendingUp,
  Search, X, Package, LayoutGrid, List,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import ProductFormDialog from "@/components/ProductFormDialog";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import type { Product } from "@/hooks/useProducts";

const fmt = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

// ── Stat Card ─────────────────────────────────────────────────────
const StatCard = ({
  icon, label, value, sub, accent,
}: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; accent?: boolean;
}) => (
  <div className={`rounded-sm border p-5 flex items-start gap-4 ${accent ? "border-accent/30 bg-accent/5" : "border-border bg-card"}`}>
    <div className={`w-10 h-10 flex items-center justify-center rounded-sm shrink-0 ${accent ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-body">{label}</p>
      <p className="font-display text-2xl font-light text-foreground mt-0.5">{value}</p>
      {sub && <p className="text-[11px] font-body text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── Most Loved Badge ──────────────────────────────────────────────
const LikesBadge = ({ count }: { count: number }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-body font-medium ${
    count > 0 ? "bg-red-500/10 text-red-500 border border-red-400/20" : "bg-muted text-muted-foreground border border-border"
  }`}>
    <Heart size={10} fill={count > 0 ? "currentColor" : "none"} />
    {count}
  </span>
);

// ── Admin Dashboard ───────────────────────────────────────────────
const AdminDashboard = () => {
  const { signOut, loading: authLoading, isAdmin } = useAuth();
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState<"newest" | "most_loved" | "price_high" | "price_low">("newest");

  // ── Stats (ALL hooks must be before any early return) ──
  const totalProducts = products?.length ?? 0;
  const totalLikes = products?.reduce((sum, p) => sum + (p.likes ?? 0), 0) ?? 0;
  const featuredCount = products?.filter((p) => p.featured).length ?? 0;
  const mostLoved = products?.reduce((best, p) =>
    (p.likes ?? 0) > (best?.likes ?? 0) ? p : best, products?.[0]);

  // ── Filtered + sorted list ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (products ?? [])
      .filter((p) =>
        !q || p.name.toLowerCase().includes(q) || (p.category ?? "").toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (sortBy === "most_loved") return (b.likes ?? 0) - (a.likes ?? 0);
        if (sortBy === "price_high") return b.price - a.price;
        if (sortBy === "price_low") return a.price - b.price;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, search, sortBy]);

  // ── Auth guard (after all hooks) ──
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-body text-xs tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (!authLoading && !isAdmin) {
    navigate("/admin/login");
    return null;
  }

  // ── Actions ──
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Top Header ── */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent/15 border border-accent/30 flex items-center justify-center">
              <Package size={15} className="text-accent" />
            </div>
            <div>
              <p className="font-display text-base font-light text-foreground leading-none">O.V Styles</p>
              <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground font-body">Admin Panel</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* View store link */}
            <a
              href="/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-[0.2em] uppercase font-body text-muted-foreground hover:text-foreground border border-border hover:border-foreground transition-all duration-200"
            >
              <ExternalLink size={12} /> View Store
            </a>

            {/* Dark/light toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center border border-border hover:border-accent text-muted-foreground hover:text-accent transition-all duration-200"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Add product */}
            <button
              onClick={() => { setEditingProduct(null); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-[10px] tracking-[0.25em] uppercase font-body hover:bg-accent/90 transition-all duration-200"
            >
              <Plus size={13} /> Add Product
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center border border-border hover:border-red-400 text-muted-foreground hover:text-red-400 transition-all duration-200"
              title="Log out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<ShoppingBag size={18} />}
            label="Total Products"
            value={totalProducts}
            sub={`${featuredCount} featured`}
          />
          <StatCard
            icon={<Heart size={18} />}
            label="Total Loves"
            value={totalLikes}
            sub="across all products"
            accent={totalLikes > 0}
          />
          <StatCard
            icon={<Star size={18} />}
            label="Featured"
            value={featuredCount}
            sub="shown on homepage"
          />
          <StatCard
            icon={<TrendingUp size={18} />}
            label="Most Loved"
            value={mostLoved?.likes ?? 0}
            sub={mostLoved?.name ?? "—"}
            accent={(mostLoved?.likes ?? 0) > 0}
          />
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-8 py-2.5 bg-background border border-border text-foreground font-body text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="pl-3 pr-8 py-2.5 bg-background border border-border text-foreground font-body text-xs focus:outline-none focus:border-accent appearance-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="most_loved">Most Loved</option>
              <option value="price_high">Price: High → Low</option>
              <option value="price_low">Price: Low → High</option>
            </select>
          </div>

          {/* View toggle + count */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-body hidden sm:block">
              {filtered.length} products
            </span>
            <button
              onClick={() => setViewMode("table")}
              className={`w-8 h-8 flex items-center justify-center border transition-all duration-200 ${viewMode === "table" ? "border-accent text-accent bg-accent/5" : "border-border text-muted-foreground hover:border-foreground"}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`w-8 h-8 flex items-center justify-center border transition-all duration-200 ${viewMode === "grid" ? "border-accent text-accent bg-accent/5" : "border-border text-muted-foreground hover:border-foreground"}`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>

        {/* ── Products ── */}
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-20 bg-card border border-border animate-pulse rounded-sm" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-sm">
            <Package size={40} className="text-muted-foreground/20 mb-4" />
            <h3 className="font-display text-xl font-light text-foreground mb-2">
              {search ? "No products match your search" : "No products yet"}
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-6">
              {search ? `Try a different search term` : "Start by adding your first product"}
            </p>
            {!search && (
              <button
                onClick={() => { setEditingProduct(null); setShowForm(true); }}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground text-[10px] tracking-[0.3em] uppercase font-body hover:bg-accent/90 transition-all"
              >
                <Plus size={13} /> Add First Product
              </button>
            )}
          </div>
        ) : viewMode === "table" ? (

          /* ── TABLE VIEW ── */
          <div className="border border-border rounded-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[64px_1fr_100px_100px_80px_80px_96px] gap-4 px-4 py-3 bg-muted/30 border-b border-border">
              {["", "Product", "Category", "Price", "Loves", "Featured", ""].map((h, i) => (
                <span key={i} className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-body">{h}</span>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-[64px_1fr_100px_100px_80px_80px_96px] gap-4 px-4 py-4 items-center hover:bg-muted/20 transition-colors duration-150 group"
                >
                  {/* Image */}
                  <div className="w-14 h-14 overflow-hidden shrink-0">
                    <img
                      src={product.images?.[0] ?? "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name + desc */}
                  <div className="min-w-0">
                    <p className="font-display text-sm text-foreground truncate">{product.name}</p>
                    {product.description && (
                      <p className="text-[11px] font-body text-muted-foreground truncate mt-0.5">{product.description}</p>
                    )}
                    {(product.sizes ?? []).length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {(product.sizes ?? []).slice(0, 4).map((s) => (
                          <span key={s} className="text-[8px] font-body text-muted-foreground border border-border px-1.5 py-0.5 uppercase">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <span className="text-[10px] tracking-[0.2em] uppercase font-body text-muted-foreground truncate">
                    {product.category ?? "—"}
                  </span>

                  {/* Price */}
                  <span className="font-body text-sm text-accent font-medium">{fmt(product.price)}</span>

                  {/* Loves — this is what admin sees */}
                  <LikesBadge count={product.likes ?? 0} />

                  {/* Featured */}
                  <span className={`text-[10px] font-body tracking-wider uppercase ${product.featured ? "text-accent" : "text-muted-foreground"}`}>
                    {product.featured ? "Yes" : "No"}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-1.5 justify-end">
                    <button
                      onClick={() => { setEditingProduct(product); setShowForm(true); }}
                      className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:border-accent hover:text-accent transition-all duration-200"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:border-red-400 hover:text-red-400 transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        ) : (

          /* ── GRID VIEW ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <div key={product.id} className="border border-border bg-card group hover:border-accent/40 transition-all duration-200">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images?.[0] ?? "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.featured && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-accent-foreground text-[8px] tracking-widest uppercase font-body">
                      Featured
                    </div>
                  )}
                  {/* Loves badge on image */}
                  <div className="absolute top-2 right-2">
                    <LikesBadge count={product.likes ?? 0} />
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-display text-sm text-foreground truncate">{product.name}</p>
                  <p className="font-body text-xs text-accent mt-1">{fmt(product.price)}</p>
                  {product.category && (
                    <p className="text-[9px] tracking-widest uppercase text-muted-foreground font-body mt-0.5">{product.category}</p>
                  )}
                  <div className="flex gap-1.5 mt-3">
                    <button
                      onClick={() => { setEditingProduct(product); setShowForm(true); }}
                      className="flex-1 py-2 text-[9px] tracking-widest uppercase font-body border border-border text-muted-foreground hover:border-accent hover:text-accent transition-all duration-200 flex items-center justify-center gap-1"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="w-8 py-2 border border-border text-muted-foreground hover:border-red-400 hover:text-red-400 transition-all duration-200 flex items-center justify-center"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ProductFormDialog
        open={showForm}
        onClose={() => { setShowForm(false); setEditingProduct(null); }}
        product={editingProduct}
      />
    </div>
  );
};

export default AdminDashboard;