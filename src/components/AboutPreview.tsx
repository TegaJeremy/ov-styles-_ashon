import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Scissors, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

import ceoImage from "@/assets/ceo.jpeg";

// Cloudinary for the Our Story section image
const STORY_IMAGE = "https://res.cloudinary.com/dsml73vio/image/upload/w_800,q_70,f_auto/v1772984832/IMG_4130_fbomnw.jpg";
const STORY_THUMB = "https://res.cloudinary.com/dsml73vio/image/upload/w_40,q_30,f_auto/v1772984832/IMG_4130_fbomnw.jpg";

// Local asset for CEO section
const CEO_IMAGE = ceoImage;
const CEO_THUMB = ceoImage;

// Blur-up image component — shows tiny blurred placeholder instantly, then loads full image
const LazyImage = ({
  src, thumb, alt, className, objectPosition = "center",
}: {
  src: string; thumb: string; alt: string; className?: string; objectPosition?: string;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      if (wrapRef.current) wrapRef.current.style.filter = "none";
      return;
    }
    img.onload = () => {
      if (wrapRef.current) {
        wrapRef.current.style.transition = "filter 0.6s ease";
        wrapRef.current.style.filter = "none";
      }
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{
        backgroundImage: `url(${thumb})`,
        backgroundSize: "cover",
        backgroundPosition: objectPosition,
        filter: "blur(8px)",
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

const AboutPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const ceoRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!sectionRef.current) return;

    // Use autoAlpha (handles visibility + opacity together, no white flash)
    const textEl = sectionRef.current.querySelector(".about-text");
    const imgEl = sectionRef.current.querySelector(".about-image");

    if (textEl) {
      gsap.fromTo(textEl,
        { x: -40, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
      );
    }
    if (imgEl) {
      gsap.fromTo(imgEl,
        { x: 40, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
      );
    }
    if (valuesRef.current) {
      gsap.fromTo(valuesRef.current.querySelectorAll(".value-item"),
        { y: 25, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: valuesRef.current, start: "top 85%" } }
      );
    }
    if (processRef.current) {
      gsap.fromTo(processRef.current.querySelectorAll(".step-item"),
        { y: 25, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: processRef.current, start: "top 85%" } }
      );
    }
    if (ceoRef.current) {
      gsap.fromTo(ceoRef.current,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: ceoRef.current, start: "top 80%" } }
      );
    }
  }, []);

  return (
    <>
      {/* ── Our Story ── */}
      <section ref={sectionRef} className="py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            <div className="about-text">
              <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.ourStory}</span>
              <h2 className="font-display text-4xl md:text-6xl font-light mt-3 text-foreground leading-tight">
                {t.aboutHeading}
              </h2>
              <div className="w-16 h-[1px] bg-accent mt-6 mb-8" />
              <p className="text-muted-foreground font-body leading-relaxed mb-6 text-base">{t.aboutP1}</p>
              <p className="text-muted-foreground font-body leading-relaxed mb-8 text-base">{t.aboutP2}</p>
              <div className="flex gap-8 mb-10">
                <div>
                  <div className="font-display text-4xl text-accent font-light">12+</div>
                  <div className="text-xs tracking-widest text-muted-foreground uppercase font-body mt-1">{t.yearsLabel}</div>
                </div>
                <div className="w-[1px] bg-border" />
                <div>
                  <div className="font-display text-4xl text-accent font-light">500+</div>
                  <div className="text-xs tracking-widest text-muted-foreground uppercase font-body mt-1">{t.designsLabel}</div>
                </div>
                <div className="w-[1px] bg-border" />
                <div>
                  <div className="font-display text-4xl text-accent font-light">50+</div>
                  <div className="text-xs tracking-widest text-muted-foreground uppercase font-body mt-1">{t.clientsLabel}</div>
                </div>
              </div>
              <Link
                to="/about"
                className="inline-block px-10 py-4 border border-foreground text-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-foreground hover:text-primary-foreground transition-all duration-300"
              >
                {t.readMore}
              </Link>
            </div>

            <div className="about-image relative">
              <LazyImage
                src={STORY_IMAGE}
                thumb={STORY_THUMB}
                alt="O.V Styles Atelier"
                className="w-full aspect-[3/4]"
                objectPosition="top"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-accent hidden lg:block" />
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-accent/20 hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CEO / Visionary ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.theVisionary}</span>
            <h2 className="font-display text-4xl md:text-5xl font-light mt-3 text-foreground">{t.meetDirector}</h2>
            <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
          </div>

          <div ref={ceoRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 border border-accent/20 translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <LazyImage
                  src={CEO_IMAGE}
                  thumb={CEO_THUMB}
                  alt="O.V Styles Creative Director"
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                  objectPosition="top"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="font-display text-white text-xl font-light">{t.ceoTitle}</p>
                <p className="font-body text-accent text-xs tracking-[0.3em] uppercase mt-1">{t.ceoSubtitle}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-[1px] bg-accent" />
                <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.mindBehind}</span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
                {t.codeAndCouture}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed mb-5 text-sm">{t.ceoBio1}</p>
              <p className="text-muted-foreground font-body leading-relaxed mb-8 text-sm">{t.ceoBio2}</p>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: <Scissors size={12} />, label: t.tagHauteCouture },
                  { icon: <Code2 size={12} />, label: t.tagTechDesign },
                  { icon: <Sparkles size={12} />, label: t.tagAfricanLuxury },
                ].map((tag, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-4 py-2 border border-accent/30 text-accent text-[10px] font-body tracking-[0.2em] uppercase hover:bg-accent/10 transition-colors duration-300">
                    {tag.icon} {tag.label}
                  </span>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-block px-10 py-4 border border-foreground text-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-foreground hover:text-primary-foreground transition-all duration-300"
              >
                {t.fullStory}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-28 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.whatWeStandFor}</span>
            <h2 className="font-display text-4xl md:text-6xl font-light mt-3 text-foreground">{t.ourValues}</h2>
            <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
          </div>

          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: t.val1Title, desc: t.val1Desc },
              { title: t.val2Title, desc: t.val2Desc },
              { title: t.val3Title, desc: t.val3Desc },
            ].map((v, i) => (
              <div key={i} className="value-item text-center group">
                <div className="w-16 h-16 border border-accent/40 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/10 group-hover:border-accent transition-all duration-300">
                  <span className="font-display text-2xl text-accent font-light">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-display text-2xl font-light text-foreground mb-4">{v.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.howItWorks}</span>
            <h2 className="font-display text-4xl md:text-6xl font-light mt-3 text-foreground">{t.bespokeProcess}</h2>
            <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
          </div>

          <div ref={processRef} className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: t.step1Title, desc: t.step1Desc },
              { step: "02", title: t.step2Title, desc: t.step2Desc },
              { step: "03", title: t.step3Title, desc: t.step3Desc },
              { step: "04", title: t.step4Title, desc: t.step4Desc },
            ].map((p, i) => (
              <div key={i} className="step-item relative group">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-full h-[1px] bg-border z-0" style={{ width: "calc(100% - 2rem)" }} />
                )}
                <div className="font-display text-6xl text-accent/15 font-light mb-4 group-hover:text-accent/30 transition-colors duration-300">{p.step}</div>
                <h3 className="font-display text-xl font-light text-foreground mb-3">{p.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPreview;