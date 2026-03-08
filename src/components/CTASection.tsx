import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import { SOCIAL_LINKS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const igImages = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",
  "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80",
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80",
];

const CTASection = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const instagramRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: ctaRef.current, start: "top 80%" } });
    }
    if (testimonialsRef.current) {
      gsap.fromTo(testimonialsRef.current.querySelectorAll(".testimonial-item"),
        { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: testimonialsRef.current, start: "top 80%" } }
      );
    }
    if (instagramRef.current) {
      gsap.fromTo(instagramRef.current.querySelectorAll(".ig-item"),
        { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: instagramRef.current, start: "top 85%" } }
      );
    }
  }, []);

  const testimonials = [
    { quote: t.t1Quote, name: t.t1Name, title: t.t1Title },
    { quote: t.t2Quote, name: t.t2Name, title: t.t2Title },
    { quote: t.t3Quote, name: t.t3Name, title: t.t3Title },
  ];

  return (
    <>
      {/* Testimonials */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.clientLove}</span>
            <h2 className="font-display text-4xl md:text-6xl font-light mt-3 text-foreground">{t.whatTheySay}</h2>
            <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
          </div>

          <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, i) => (
              <div key={i} className="testimonial-item p-10 border border-border hover:border-accent/40 transition-all duration-300 group">
                <div className="font-display text-5xl text-accent/25 leading-none mb-6 group-hover:text-accent/50 transition-colors duration-300">"</div>
                <p className="text-muted-foreground font-body leading-relaxed text-sm mb-8 italic">{item.quote}</p>
                <div className="border-t border-border/50 pt-5">
                  <div className="font-display text-lg text-foreground">{item.name}</div>
                  <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase font-body mt-1">{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok / Social Grid */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.followUs}</span>
            <h2 className="font-display text-3xl md:text-4xl font-light mt-3 text-foreground">@o.v.styles</h2>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer"
              className="inline-block mt-2 text-xs font-body tracking-[0.3em] text-muted-foreground hover:text-accent transition-colors duration-300 uppercase">
              Follow on TikTok →
            </a>
          </div>

          <div ref={instagramRef} className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {igImages.map((img, i) => (
              <a key={i} href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer"
                className="ig-item group relative aspect-square overflow-hidden block">
                <img src={img} alt={`O.V Styles ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white text-[10px] tracking-[0.3em] uppercase font-body opacity-0 group-hover:opacity-100 transition-all duration-300">View</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main CTA */}
      <section className="relative py-40 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80" alt="O.V Styles Collection"
          className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-foreground/70" />

        <div ref={ctaRef} className="relative z-10 text-center px-4">
          <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.newSeason}</span>
          <h2 className="font-display text-5xl md:text-7xl font-light text-primary-foreground mt-4 leading-tight">
            {t.discoverLatest}
          </h2>
          <p className="text-primary-foreground/55 font-body mt-6 max-w-lg mx-auto text-sm leading-relaxed">
            {t.discoverText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link to="/marketplace" className="inline-block px-14 py-5 bg-accent text-accent-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-accent/90 transition-all duration-300">
              {t.shopNow}
            </Link>
            <Link to="/contact" className="inline-block px-14 py-5 border border-white/40 text-white text-xs font-body tracking-[0.3em] uppercase hover:bg-white/10 transition-all duration-300">
              {t.bookFitting}
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-foreground">
        <div className="container mx-auto px-4 text-center">
          <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">Stay Connected</span>
          <h2 className="font-display text-3xl md:text-4xl font-light text-primary-foreground mt-3">
            {t.newsletterTitle}
          </h2>
          <p className="text-primary-foreground/40 font-body text-sm mt-4 max-w-md mx-auto leading-relaxed">
            {t.newsletterDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto mt-8">
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-body text-sm focus:outline-none focus:border-accent transition-colors duration-300"
            />
            <button className="px-8 py-4 bg-accent text-accent-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-accent/90 transition-all duration-300 whitespace-nowrap">
              {t.subscribe}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTASection;