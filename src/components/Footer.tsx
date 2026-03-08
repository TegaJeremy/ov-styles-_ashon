import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import {
  BRAND_NAME, CONTACT_EMAIL, CONTACT_ADDRESS,
  SOCIAL_LINKS, WHATSAPP_NUMBER, WHATSAPP_NUMBER_2
} from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.05a8.28 8.28 0 004.76 1.5V7.1a4.85 4.85 0 01-1-.41z" />
  </svg>
);

const Footer = () => {
  const { t } = useLanguage();

  const navLinks = [
    { to: "/", label: t.home },
    { to: "/about", label: t.about },
    { to: "/marketplace", label: t.marketplace },
    { to: "/contact", label: t.contact },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Top accent line */}
      <div className="h-[2px] gold-gradient" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-2xl mb-2 tracking-wider">{BRAND_NAME}</h3>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary-foreground/40 mb-4">Lagos, Nigeria</p>
            <p className="text-primary-foreground/60 text-sm leading-relaxed font-body">
              {t.discoverText}
            </p>
            {/* Social */}
            <div className="flex gap-4 mt-6">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/50 hover:border-accent hover:text-accent transition-all duration-300">
                <Facebook size={15} />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/50 hover:border-accent hover:text-accent transition-all duration-300">
                <Instagram size={15} />
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/50 hover:border-accent hover:text-accent transition-all duration-300">
                <TikTokIcon />
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/50 hover:border-accent hover:text-accent transition-all duration-300">
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base mb-5 tracking-wider">{t.quickLinks}</h4>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex items-center gap-2 text-primary-foreground/55 hover:text-accent text-sm font-body tracking-wide transition-colors duration-300"
                >
                  <span className="w-4 h-[1px] bg-primary-foreground/20 group-hover:bg-accent group-hover:w-6 transition-all duration-300" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base mb-5 tracking-wider">{t.contactUs}</h4>
            <div className="flex flex-col gap-4 text-sm text-primary-foreground/55 font-body">
              <a href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center gap-3 hover:text-accent transition-colors duration-300 group">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-foreground/10 group-hover:bg-accent/20 transition-colors duration-300">
                  <Phone size={12} />
                </span>
                +234 815 068 4208
              </a>
              <a href={`tel:+${WHATSAPP_NUMBER_2}`}
                className="flex items-center gap-3 hover:text-accent transition-colors duration-300 group">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-foreground/10 group-hover:bg-accent/20 transition-colors duration-300">
                  <MessageCircle size={12} />
                </span>
                +234 708 618 5912
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-3 hover:text-accent transition-colors duration-300 group">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-foreground/10 group-hover:bg-accent/20 transition-colors duration-300">
                  <Mail size={12} />
                </span>
                <span className="break-all">{CONTACT_EMAIL}</span>
              </a>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-foreground/10 shrink-0 mt-0.5">
                  <MapPin size={12} />
                </span>
                <span className="leading-relaxed">{CONTACT_ADDRESS}</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-base mb-2 tracking-wider">{t.newsletterTitle}</h4>
            <p className="text-primary-foreground/50 text-xs font-body leading-relaxed mb-5">
              {t.newsletterDesc}
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                className="bg-primary-foreground/10 border border-primary-foreground/20 rounded px-4 py-2.5 text-xs font-body text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-accent transition-colors duration-300"
              />
              <button className="gold-gradient text-primary-foreground/90 text-xs font-body tracking-[0.2em] uppercase py-2.5 rounded hover:opacity-90 transition-opacity duration-300">
                {t.subscribe}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-primary-foreground/35 text-xs font-body tracking-wider">
            © {new Date().getFullYear()} {BRAND_NAME}. {t.allRights}
          </p>
          <p className="text-primary-foreground/25 text-[10px] font-body tracking-wider">
            28, Alhaji Yusuf, Olodi Apapa, Lagos
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;