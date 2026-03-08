import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const formatPrice = (p: number) =>
  `₦${p.toLocaleString("en-NG")}`;

const CartDrawer = () => {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice, isDrawerOpen, closeDrawer } = useCart();
  const { t } = useLanguage();

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const lines = items.map(
      (item) =>
        `• ${item.name} (Size: ${item.size}) x${item.quantity} — ${formatPrice(item.price * item.quantity)}`
    );
    const total = `\n*Total: ${formatPrice(totalPrice)}*`;
    const message = `Hello O.V Styles! 👋\n\nI would like to order the following:\n\n${lines.join("\n")}${total}\n\nPlease advise on next steps. Thank you!`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    closeDrawer();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col transition-transform duration-400 ease-in-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-accent" />
            <h2 className="font-display text-xl font-light text-foreground">{t.cart}</h2>
            {totalItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-body">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={40} className="text-muted-foreground/30" />
              <h3 className="font-display text-xl font-light text-foreground">{t.cartEmpty}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-xs">
                {t.cartEmptyDesc}
              </p>
              <button
                onClick={closeDrawer}
                className="mt-2 px-8 py-3 border border-foreground text-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-foreground hover:text-primary-foreground transition-all duration-300"
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              {items.map((item, i) => (
                <div key={`${item.id}-${item.size}`} className={`flex gap-4 py-5 ${i < items.length - 1 ? "border-b border-border" : ""}`}>
                  {/* Image */}
                  <div className="w-20 h-24 shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-base font-light text-foreground truncate">{item.name}</h4>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-body mt-0.5">
                      Size: {item.size}
                    </p>
                    <p className="text-accent font-body text-sm font-medium mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-0 mt-3">
                      <button
                        onClick={() => updateQty(item.id, item.size, item.quantity - 1)}
                        className="w-7 h-7 border border-border flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-colors duration-200"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-9 h-7 border-t border-b border-border flex items-center justify-center font-body text-xs text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.size, item.quantity + 1)}
                        className="w-7 h-7 border border-border flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-colors duration-200"
                      >
                        <Plus size={12} />
                      </button>

                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="ml-3 text-muted-foreground hover:text-red-400 transition-colors duration-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="text-right shrink-0">
                    <p className="font-body text-sm text-foreground font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border shrink-0 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-body">
                {t.cartTotal}
              </span>
              <span className="font-display text-2xl font-light text-foreground">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* WhatsApp checkout */}
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white text-xs font-body tracking-[0.3em] uppercase hover:bg-[#1ebe5d] transition-all duration-300"
            >
              <MessageCircle size={16} />
              Checkout
            </button>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full py-3 border border-border text-muted-foreground text-xs font-body tracking-[0.25em] uppercase hover:border-red-400 hover:text-red-400 transition-all duration-300"
            >
              {t.clearCart}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;