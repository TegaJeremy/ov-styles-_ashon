import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import type { Product } from "@/hooks/useProducts";
import { toast } from "sonner";
import { X, Upload, ImagePlus, Loader2 } from "lucide-react";

const CLOUDINARY_CLOUD_NAME = "dsml73vio";
const CLOUDINARY_UPLOAD_PRESET = "ovistyles_unsigned"; // create this in Cloudinary dashboard → Settings → Upload → Upload Presets (unsigned)

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "fashion");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();
  return data.secure_url as string;
};

const ProductFormDialog = ({ open, onClose, product }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean[]>([]);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(String(product.price));
      setSizes(product.sizes?.join(", ") || "");
      setCategory(product.category || "");
      setFeatured(product.featured || false);
      setImageUrls(product.images && product.images.length > 0 ? product.images : []);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setSizes("");
      setCategory("");
      setFeatured(false);
      setImageUrls([]);
    }
    setUploading([]);
  }, [product, open]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const slotsAvailable = 3 - imageUrls.length;
    const filesToUpload = files.slice(0, slotsAvailable);

    if (filesToUpload.length === 0) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    // Add uploading placeholders
    const newUploadingState = [...uploading, ...filesToUpload.map(() => true)];
    setUploading(newUploadingState);
    setImageUrls((prev) => [...prev, ...filesToUpload.map(() => "")]);

    const startIndex = imageUrls.length;

    await Promise.all(
      filesToUpload.map(async (file, i) => {
        try {
          const url = await uploadToCloudinary(file);
          setImageUrls((prev) => {
            const updated = [...prev];
            updated[startIndex + i] = url;
            return updated;
          });
        } catch {
          toast.error(`Failed to upload ${file.name}`);
          setImageUrls((prev) => prev.filter((_, idx) => idx !== startIndex + i));
        } finally {
          setUploading((prev) => {
            const updated = [...prev];
            updated[startIndex + i] = false;
            return updated;
          });
        }
      })
    );

    // reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setUploading((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validImages = imageUrls.filter(Boolean);
    if (validImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (uploading.some(Boolean)) {
      toast.error("Please wait for images to finish uploading");
      return;
    }

    setSaving(true);

    const data = {
      name,
      description,
      price: parseFloat(price),
      sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
      category,
      featured,
      images: validImages,
    };

    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...data });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(data);
        toast.success("Product created");
      }
      onClose();
    } catch {
      toast.error("Failed to save product");
    }
    setSaving(false);
  };

  const isUploading = uploading.some(Boolean);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-body tracking-wider uppercase text-muted-foreground mb-1.5 block">
              Product Name *
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-body tracking-wider uppercase text-muted-foreground mb-1.5 block">
              Description
            </label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-body tracking-wider uppercase text-muted-foreground mb-1.5 block">
                Price (₦) *
              </label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" />
            </div>
            <div>
              <label className="text-xs font-body tracking-wider uppercase text-muted-foreground mb-1.5 block">
                Category
              </label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Gowns" />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="text-xs font-body tracking-wider uppercase text-muted-foreground mb-1.5 block">
              Sizes (comma separated)
            </label>
            <Input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="S, M, L, XL" />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-xs font-body tracking-wider uppercase text-muted-foreground mb-1.5 block">
              Images (up to 3)
            </label>

            {/* Image previews */}
            {imageUrls.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 border border-border rounded-sm overflow-hidden bg-muted">
                    {uploading[i] ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Loader2 size={18} className="animate-spin text-muted-foreground" />
                      </div>
                    ) : url ? (
                      <>
                        <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white hover:bg-black"
                        >
                          <X size={10} />
                        </button>
                      </>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            {imageUrls.length < 3 && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="gap-2 text-xs tracking-wider uppercase"
                >
                  {isUploading ? (
                    <><Loader2 size={13} className="animate-spin" /> Uploading...</>
                  ) : (
                    <><ImagePlus size={13} /> {imageUrls.length === 0 ? "Upload Images" : "Add More"}</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  {3 - imageUrls.length} slot{3 - imageUrls.length !== 1 ? "s" : ""} remaining · JPG, PNG, WEBP
                </p>
              </>
            )}
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={featured}
              onCheckedChange={(checked) => setFeatured(checked as boolean)}
              id="featured"
            />
            <label htmlFor="featured" className="text-sm font-body text-muted-foreground">
              Featured product
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={saving || isUploading}
              className="flex-1 text-xs tracking-wider uppercase"
            >
              {saving ? "Saving..." : product ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="text-xs tracking-wider uppercase">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;