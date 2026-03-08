import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronDown, Globe, ShoppingBag } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { BRAND_NAME, LANGUAGES } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { totalItems, openDrawer } = useCart();
  const langRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { to: "/", label: t.home },
    { to: "/about", label: t.about },
    { to: "/marketplace", label: t.marketplace },
    { to: "/contact", label: t.contact },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === language);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/40 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-20 px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-full w-12 h-12 ring-1 ring-accent/30 group-hover:ring-accent transition-all duration-300">
            <img src={logo} alt={BRAND_NAME} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-xl font-semibold tracking-[0.15em] text-foreground group-hover:text-accent transition-colors duration-300">
              O.V STYLES
            </span>
            <span className="block text-[9px] font-body tracking-[0.4em] text-muted-foreground uppercase">
              Lagos Couture
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-[11px] font-body tracking-[0.2em] uppercase transition-colors duration-300 py-1 group
                ${location.pathname === link.to ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              {link.label}
              {/* Animated underline */}
              <span className={`absolute bottom-0 left-0 h-[1px] bg-accent transition-all duration-300
                ${location.pathname === link.to ? "w-full" : "w-0 group-hover:w-full"}`}
              />
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">

          {/* Dark/Light Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-border/60 hover:border-accent hover:text-accent text-muted-foreground transition-all duration-300 hover:bg-accent/10"
            aria-label="Toggle theme"
          >
            {theme === "dark"
              ? <Sun size={15} className="transition-transform duration-300 hover:rotate-45" />
              : <Moon size={15} className="transition-transform duration-300 hover:-rotate-12" />
            }
          </button>

          {/* Language Switcher */}
          <div className="relative hidden md:block" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-border/60 hover:border-accent text-muted-foreground hover:text-accent transition-all duration-300 text-[11px] font-body tracking-wide hover:bg-accent/10"
            >
              <Globe size={13} />
              <span>{currentLang?.flag} {currentLang?.label}</span>
              <ChevronDown size={11} className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-background border border-border rounded-lg shadow-xl overflow-hidden z-50 animate-fade-in">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-body tracking-wide transition-colors duration-200
                      ${language === lang.code
                        ? "bg-accent/15 text-accent font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart icon */}
          <button
            onClick={openDrawer}
            className="relative w-9 h-9 flex items-center justify-center rounded-full border border-border/60 hover:border-accent hover:text-accent text-muted-foreground transition-all duration-300 hover:bg-accent/10"
            aria-label="View cart"
          >
            <ShoppingBag size={15} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] flex items-center justify-center font-bold leading-none">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-border/60 hover:border-accent text-foreground transition-all duration-300"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border animate-fade-in">
          <div className="flex flex-col items-center py-8 gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`text-sm font-body tracking-[0.25em] uppercase transition-colors duration-300
                  ${location.pathname === link.to ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Cart */}
            <button
              onClick={() => { setOpen(false); openDrawer(); }}
              className="flex items-center gap-2 text-sm font-body tracking-[0.25em] uppercase text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              <ShoppingBag size={15} />
              {t.cart}{totalItems > 0 && ` (${totalItems})`}
            </button>

            {/* Mobile Language Switcher */}
            <div className="pt-4 border-t border-border/40 w-48">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground text-center mb-3">
                Language
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setOpen(false); }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[10px] font-body transition-colors duration-200
                      ${language === lang.code
                        ? "bg-accent/15 text-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                  >
                    <span>{lang.flag}</span>
                    <span className="truncate">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;