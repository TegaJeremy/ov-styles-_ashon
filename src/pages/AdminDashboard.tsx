import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import ProductFormDialog from "@/components/ProductFormDialog";
import { toast } from "sonner";
import type { Product } from "@/hooks/useProducts";

const AdminDashboard = () => {
  const { signOut, loading: authLoading, isAdmin } = useAuth();
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Wait for auth to finish loading before deciding to redirect
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground font-body">
        Loading...
      </div>
    );
  }

  // Only redirect after auth is done loading and user is confirmed not admin
  if (!authLoading && !isAdmin) {
    navigate("/admin/login");
    return null;
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-display text-xl text-foreground">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button
              onClick={() => { setEditingProduct(null); setShowForm(true); }}
              size="sm"
              className="gap-2 text-xs tracking-wider uppercase"
            >
              <Plus size={14} /> Add Product
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 text-xs tracking-wider uppercase">
              <LogOut size={14} /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-muted-foreground font-body">Loading products...</p>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body mb-4">No products yet</p>
            <Button
              onClick={() => { setEditingProduct(null); setShowForm(true); }}
              className="gap-2 text-xs tracking-wider uppercase"
            >
              <Plus size={14} /> Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-sm">
                <img
                  src={product.images?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100"}
                  alt={product.name}
                  className="w-16 h-16 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg text-foreground truncate">{product.name}</h3>
                  <p className="text-accent font-body text-sm">₦{Number(product.price).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => { setEditingProduct(product); setShowForm(true); }}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
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