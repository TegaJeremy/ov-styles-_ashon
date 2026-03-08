import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Scissors, Sparkles, Globe, Award, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

import ceoImage from "@/assets/ceo.jpeg";
import anotherImage from "@/assets/another.jpeg";

// Cloudinary only for the Our Story / Vision section
const VISION_IMAGE = "https://res.cloudinary.com/dsml73vio/image/upload/w_800,q_70,f_auto/v1772984832/IMG_4130_fbomnw.jpg";
const VISION_THUMB = "https://res.cloudinary.com/dsml73vio/image/upload/w_40,q_20,f_auto/v1772984832/IMG_4130_fbomnw.jpg";

// Local assets for CEO / Director sections
const CEO_IMAGE   = ceoImage;
const CEO_THUMB   = ceoImage;
const OTHER_IMAGE = anotherImage;
const OTHER_THUMB = anotherImage;

const milestoneKeys = ["m1", "m2", "m3", "m4", "m5", "m6"];
const milestoneYears = ["2012", "2015", "2017", "2019", "2021", "2024"];

// Blur-up lazy image — shows blurred tiny placeholder instantly, fades in full image
const LazyImage = ({
  src, thumb, alt, className = "", objectPosition = "center",
}: {
  src: string; thumb: string; alt: string; className?: string; objectPosition?: string;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const reveal = () => {
      if (wrapRef.current) {
        wrapRef.current.style.transition = "filter 0.5s ease";
        wrapRef.current.style.filter = "none";
      }
    };
    if (img.complete) { reveal(); return; }
    img.addEventListener("load", reveal);
    return () => img.removeEventListener("load", reveal);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        backgroundImage: `url(${thumb})`,
        backgroundSize: "cover",
        backgroundPosition: objectPosition,
        filter: "blur(10px)",
        overflow: "hidden",
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        style={{ objectPosition }}
      />
    </div>
  );
};

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!pageRef.current) return;
    const sections = pageRef.current.querySelectorAll(".animate-section");
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { y: 40, autoAlpha: 0 },   // autoAlpha handles visibility too — no white flash
        {
          y: 0, autoAlpha: 1,
          duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 82%" },
        }
      );
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero — above fold, NO lazy load ── */}
      <section className="relative h-[75vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&q=75&auto=format"
          alt="About O.V Styles"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/80" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <span className="text-accent text-xs font-body tracking-[0.6em] uppercase mb-6">{t.aboutPageEst}</span>
          <h1 className="font-display text-6xl md:text-9xl text-white font-light tracking-wider leading-none">{t.ourStory}</h1>
          <div className="w-16 h-[1px] bg-accent mx-auto mt-8" />
          <p className="text-white/50 font-body text-xs mt-6 max-w-sm tracking-[0.35em] leading-relaxed uppercase">{t.aboutPageHeroSub}</p>
        </div>
      </section>

      <div ref={pageRef}>

        {/* ── Vision ── */}
        <section className="animate-section py-28 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.theVision}</span>
                <h2 className="font-display text-4xl md:text-5xl font-light mt-3 text-foreground leading-tight">{t.craftingElegance}</h2>
                <div className="w-12 h-[1px] bg-accent mt-6 mb-8" />
                <p className="text-muted-foreground font-body leading-relaxed mb-5 text-base">{t.visionP1}</p>
                <p className="text-muted-foreground font-body leading-relaxed mb-10 text-base">{t.visionP2}</p>
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
                  {[
                    { n: "12+", l: t.yearsLabel },
                    { n: "500+", l: t.designsLabel },
                    { n: "50+", l: t.clientsLabel },
                  ].map((s, i) => (
                    <div key={i} className="text-center group cursor-default">
                      <div className="font-display text-3xl text-accent font-light group-hover:scale-110 transition-transform duration-300 inline-block">{s.n}</div>
                      <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-body mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <LazyImage
                  src={VISION_IMAGE}
                  thumb={VISION_THUMB}
                  alt="O.V Styles"
                  className="w-full aspect-[4/5]"
                  objectPosition="top"
                />
                <div className="absolute -bottom-6 -right-6 w-28 h-28 border-2 border-accent hidden lg:block" />
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-accent/10 hidden lg:block" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Philosophy ── */}
        <section className="animate-section py-28 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.philosophyLabel}</span>
              <h2 className="font-display text-4xl md:text-6xl font-light mt-3 text-foreground">{t.philosophyHeading}</h2>
              <div className="w-12 h-[1px] bg-accent mx-auto mt-6 mb-10" />
              <p className="text-muted-foreground font-body leading-relaxed mb-6 text-base">{t.philosophyP1}</p>
              <p className="text-muted-foreground font-body leading-relaxed text-base">{t.philosophyP2}</p>
            </div>
            <div className="mt-20 border-l-4 border-accent pl-8 max-w-2xl mx-auto">
              <blockquote className="font-display text-2xl md:text-3xl font-light text-foreground leading-relaxed italic">
                "{t.founderQuote}"
              </blockquote>
              <p className="text-muted-foreground font-body text-xs mt-4 tracking-[0.3em] uppercase">{t.founderQuoteAttr}</p>
            </div>
          </div>
        </section>

        {/* ── Creative Director ── */}
        <section className="animate-section py-28 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.directorLabel}</span>
              <h2 className="font-display text-4xl md:text-6xl font-light mt-3 text-foreground">{t.directorHeading}</h2>
              <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
              {/* Two photos offset */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group relative overflow-hidden aspect-[3/4]">
                    <LazyImage
                      src={CEO_IMAGE}
                      thumb={CEO_THUMB}
                      alt="Creative Director"
                      className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                      objectPosition="top"
                    />
                    <div className="absolute inset-0 border border-transparent group-hover:border-accent/50 transition-all duration-500 pointer-events-none" />
                  </div>
                  <div className="group relative overflow-hidden aspect-[3/4] mt-10">
                    <LazyImage
                      src={OTHER_IMAGE}
                      thumb={OTHER_THUMB}
                      alt="Creative Director"
                      className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                      objectPosition="top"
                    />
                    <div className="absolute inset-0 border border-transparent group-hover:border-accent/50 transition-all duration-500 pointer-events-none" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 border border-accent/30 hidden lg:block" />
              </div>

              {/* Bio */}
              <div className="lg:pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-[1px] bg-accent" />
                  <span className="text-accent text-[10px] font-body tracking-[0.4em] uppercase">{t.ceoTitle}</span>
                </div>
                <h3 className="font-display text-3xl font-light text-foreground mb-1">{t.codeAndCouture}</h3>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-body mb-8">{t.ceoSubtitle}</p>
                <p className="text-muted-foreground font-body leading-relaxed mb-5 text-sm">{t.directorFullBio1}</p>
                <p className="text-muted-foreground font-body leading-relaxed mb-5 text-sm">{t.directorFullBio2}</p>
                <p className="font-body leading-relaxed mb-8 text-sm text-foreground/80 font-medium">{t.directorFullBio3}</p>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  {[
                    { icon: <Scissors size={14} />, title: t.tagHauteCouture, desc: "Bespoke garment construction and atelier direction" },
                    { icon: <Code2 size={14} />, title: t.tagTechDesign, desc: "Backend engineering applied to creative operations" },
                    { icon: <Sparkles size={14} />, title: t.tagAfricanLuxury, desc: "African textile heritage and luxury brand positioning" },
                    { icon: <Globe size={14} />, title: "Global Reach", desc: "Clients across Nigeria, the diaspora and beyond" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border border-border hover:border-accent/40 transition-all duration-300 group">
                      <span className="text-accent mt-0.5 shrink-0 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                      <div>
                        <p className="text-foreground font-body text-xs tracking-[0.2em] uppercase font-medium">{item.title}</p>
                        <p className="text-muted-foreground font-body text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/contact" className="inline-block px-10 py-4 border border-foreground text-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-foreground hover:text-primary-foreground transition-all duration-300">
                  {t.bookFitting}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="animate-section py-28 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.journeyLabel}</span>
              <h2 className="font-display text-4xl md:text-6xl font-light mt-3 text-foreground">{t.ourMilestones}</h2>
              <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
            </div>
            <div className="max-w-3xl mx-auto">
              {milestoneKeys.map((key, i) => (
                <div key={i} className="flex gap-8 mb-10 group">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-accent mt-1.5 shrink-0 group-hover:scale-150 transition-transform duration-300" />
                    {i < milestoneKeys.length - 1 && <div className="w-[1px] flex-1 bg-border mt-2" />}
                  </div>
                  <div className="pb-8">
                    <span className="font-display text-2xl text-accent font-light">{milestoneYears[i]}</span>
                    <p className="text-muted-foreground font-body mt-1 leading-relaxed text-sm">{t[key as keyof typeof t] as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="animate-section py-28 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.whatWeStandFor}</span>
              <h2 className="font-display text-4xl md:text-6xl font-light mt-3 text-foreground">{t.ourValues}</h2>
              <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: <Scissors size={20} />, title: t.aboutVal1Title, desc: t.aboutVal1Desc },
                { icon: <Award size={20} />, title: t.aboutVal2Title, desc: t.aboutVal2Desc },
                { icon: <Zap size={20} />, title: t.aboutVal3Title, desc: t.aboutVal3Desc },
              ].map((item, i) => (
                <div key={i} className="text-center group p-10 border border-border hover:border-accent/40 transition-all duration-300">
                  <div className="w-14 h-14 border border-accent/30 flex items-center justify-center mx-auto mb-6 text-accent group-hover:bg-accent/10 group-hover:border-accent transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-2xl font-light text-foreground mb-4">{item.title}</h3>
                  <div className="w-8 h-[1px] bg-accent mx-auto mb-6" />
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="animate-section relative py-40 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=70&auto=format"
            alt="Collection"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-foreground/70" />
          <div className="relative z-10 text-center px-4">
            <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.workWithUs}</span>
            <h2 className="font-display text-4xl md:text-6xl font-light text-white mt-4 leading-tight">{t.createSomething}</h2>
            <p className="text-white/50 font-body mt-4 max-w-md mx-auto text-sm leading-relaxed">{t.createDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link to="/marketplace" className="inline-block px-12 py-4 bg-accent text-accent-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-accent/90 transition-all duration-300">
                {t.shopCollection}
              </Link>
              <Link to="/contact" className="inline-block px-12 py-4 border border-white/40 text-white text-xs font-body tracking-[0.3em] uppercase hover:bg-white/10 transition-all duration-300">
                {t.getInTouch}
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default About;