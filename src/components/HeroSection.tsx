import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { t } = useLanguage();

  const heroSlides = [
    { image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80", label: t.newCollection, tagline: t.tagline },
    { image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=80", label: "Evening Wear", tagline: t.tagline2 },
    { image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80", label: "Bespoke", tagline: t.tagline3 },
    { image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80", label: "Ready to Wear", tagline: t.tagline4 },
    { image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80", label: t.collection, tagline: t.tagline5 },
  ];

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 })
      .fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.7")
      .fromTo(buttonsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
      .fromTo(labelRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, "-=0.5");
  }, []);

  const goTo = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    gsap.to(overlayRef.current, {
      opacity: 1, duration: 0.4,
      onComplete: () => {
        setCurrent(index);
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.6, delay: 0.1 });
        setTimeout(() => setIsTransitioning(false), 700);
      },
    });
  };

  const next = () => goTo((current + 1) % heroSlides.length);
  const prev = () => goTo((current - 1 + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [current]);

  const slide = heroSlides[current];

  return (
    <section className="relative h-screen overflow-hidden">
      <img src={slide.image} alt="O.V Styles" className="absolute inset-0 w-full h-full object-cover" />
      <div ref={overlayRef} className="absolute inset-0 bg-black opacity-0 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/75 z-10" />

      <div className="absolute top-32 left-8 md:left-16 z-20">
        <span ref={labelRef} className="text-white/60 font-body text-xs tracking-[0.5em] uppercase border-l-2 border-accent pl-4">
          {slide.label}
        </span>
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <p className="font-body text-[10px] tracking-[0.8em] uppercase text-accent/80 mb-4">Lagos · Nigeria</p>
        <h1 ref={titleRef} className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-light tracking-wider text-white leading-none">
          O.V STYLES
        </h1>
        <p ref={subtitleRef} className="font-body text-xs sm:text-sm tracking-[0.4em] uppercase text-white/65 mt-6 max-w-lg">
          {slide.tagline}
        </p>
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 mt-12">
          <Link to="/marketplace" className="px-12 py-4 bg-accent text-accent-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-accent/90 transition-all duration-300">
            {t.exploreCollection}
          </Link>
          <Link to="/contact" className="px-12 py-4 border border-white/40 text-white text-xs font-body tracking-[0.3em] uppercase hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
            {t.bookFitting}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-16 left-8 md:left-16 z-20 flex items-center gap-4">
        <span className="text-white font-display text-3xl">{String(current + 1).padStart(2, "0")}</span>
        <div className="w-12 h-[1px] bg-white/40" />
        <span className="text-white/40 font-display text-lg">{String(heroSlides.length).padStart(2, "0")}</span>
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? "w-8 h-1.5 bg-accent" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"}`} />
        ))}
      </div>

      <button onClick={prev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 text-white flex items-center justify-center hover:bg-white/10 hover:border-accent transition-all duration-300 backdrop-blur-sm">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 text-white flex items-center justify-center hover:bg-white/10 hover:border-accent transition-all duration-300 backdrop-blur-sm">
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-8 right-8 md:right-16 z-20 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-body">Scroll</span>
        <ArrowDown className="text-white/40" size={16} />
      </div>
    </section>
  );
};

export default HeroSection;