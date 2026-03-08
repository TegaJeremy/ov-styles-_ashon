import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Mail, Clock, ChevronDown, CheckCircle2, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { CONTACT_EMAIL, CONTACT_ADDRESS, WHATSAPP_NUMBER, WHATSAPP_NUMBER_2 } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const Contact = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const sections = pageRef.current.querySelectorAll(".animate-section");
    sections.forEach((section) => {
      gsap.fromTo(section,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 82%" } }
      );
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);

    // Build mailto link — SMTP will be wired up later
    // For now we compose a mailto to the CEO email
    const subject = encodeURIComponent(form.subject || "New enquiry from O.V Styles website");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "—"}\n\n${form.message}`
    );
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    // Simulate a brief delay then open mailto
    await new Promise((r) => setTimeout(r, 800));
    window.location.href = mailto;
    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello O.V Styles, I would like to make an enquiry.")}`;

  const contactCards = [
    {
      icon: <MapPin size={22} />,
      label: t.visitUs,
      value: CONTACT_ADDRESS,
      sub: "Lagos, Nigeria",
    },
    {
      icon: <Phone size={22} />,
      label: t.callUs,
      value: `+${WHATSAPP_NUMBER}`,
      sub: `+${WHATSAPP_NUMBER_2}`,
      href: `tel:+${WHATSAPP_NUMBER}`,
    },
    {
      icon: <Mail size={22} />,
      label: t.emailUs,
      value: CONTACT_EMAIL,
      sub: null,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: <Clock size={22} />,
      label: t.hoursLabel,
      value: t.hoursValue,
      sub: null,
    },
  ];

  const faqs = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A },
  ];

  const subjectOptions = [
    { value: "", label: "—" },
    { value: t.formSubjectOpt1, label: t.formSubjectOpt1 },
    { value: t.formSubjectOpt2, label: t.formSubjectOpt2 },
    { value: t.formSubjectOpt3, label: t.formSubjectOpt3 },
    { value: t.formSubjectOpt4, label: t.formSubjectOpt4 },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80"
          alt="Contact O.V Styles"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/80" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <span className="text-accent text-xs font-body tracking-[0.6em] uppercase mb-6">
            {t.contactPageEst}
          </span>
          <h1 className="font-display text-6xl md:text-8xl text-white font-light tracking-wider leading-none">
            {t.contact}
          </h1>
          <div className="w-16 h-[1px] bg-accent mx-auto mt-8" />
          <p className="text-white/50 font-body text-xs mt-6 max-w-sm tracking-[0.35em] leading-relaxed uppercase">
            {t.contactPageHeroSub}
          </p>
        </div>
      </section>

      <div ref={pageRef}>

        {/* Contact cards */}
        <section className="animate-section py-16 bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
              {contactCards.map((card, i) => (
                <div
                  key={i}
                  className="group p-8 border-r border-border last:border-r-0 hover:bg-secondary/30 transition-all duration-300 text-center"
                >
                  <div className="text-accent mx-auto mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <p className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground font-body mb-3">
                    {card.label}
                  </p>
                  {card.href ? (
                    <a href={card.href} className="font-display text-base text-foreground font-light hover:text-accent transition-colors duration-300 block">
                      {card.value}
                    </a>
                  ) : (
                    <p className="font-display text-base text-foreground font-light">{card.value}</p>
                  )}
                  {card.sub && (
                    <p className="text-muted-foreground font-body text-xs mt-1">{card.sub}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form + WhatsApp */}
        <section className="animate-section py-28 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 max-w-6xl mx-auto">

              {/* Form — 3 cols */}
              <div className="lg:col-span-3">
                <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">
                  {t.getInTouchHeading}
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-light mt-3 text-foreground mb-4">
                  {t.sendMessage}
                </h2>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-10">
                  {t.getInTouchDesc}
                </p>

                {sent ? (
                  <div className="flex flex-col items-start gap-4 py-16">
                    <CheckCircle2 size={40} className="text-accent" />
                    <h3 className="font-display text-2xl text-foreground font-light">{t.messageSent}</h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-sm">
                      {t.messageSentDesc}
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-4 px-8 py-3 border border-foreground text-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-foreground hover:text-primary-foreground transition-all duration-300"
                    >
                      {t.sendMessage}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-body mb-2">
                          {t.formName} <span className="text-accent">*</span>
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder={t.formNamePlaceholder}
                          className="w-full px-4 py-3 bg-secondary/20 border border-border text-foreground font-body text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-body mb-2">
                          {t.formEmail} <span className="text-accent">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder={t.formEmailPlaceholder}
                          className="w-full px-4 py-3 bg-secondary/20 border border-border text-foreground font-body text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent transition-colors duration-300"
                        />
                      </div>
                    </div>

                    {/* Phone + Subject */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-body mb-2">
                          {t.formPhone}
                        </label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder={t.formPhonePlaceholder}
                          className="w-full px-4 py-3 bg-secondary/20 border border-border text-foreground font-body text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-body mb-2">
                          {t.formSubject}
                        </label>
                        <div className="relative">
                          <select
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-secondary/20 border border-border text-foreground font-body text-sm focus:outline-none focus:border-accent transition-colors duration-300 appearance-none cursor-pointer"
                          >
                            {subjectOptions.map((o, i) => (
                              <option key={i} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-body mb-2">
                        {t.formMessage} <span className="text-accent">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder={t.formMessagePlaceholder}
                        className="w-full px-4 py-3 bg-secondary/20 border border-border text-foreground font-body text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent transition-colors duration-300 resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={sending || !form.name || !form.email || !form.message}
                      className="inline-block px-12 py-4 bg-foreground text-primary-foreground text-xs font-body tracking-[0.3em] uppercase hover:bg-accent hover:text-accent-foreground transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {sending ? t.formSending : t.formSend}
                    </button>
                  </div>
                )}
              </div>

              {/* Right side — WhatsApp + info */}
              <div className="lg:col-span-2 space-y-8">
                {/* WhatsApp card */}
                <div className="p-8 border border-border hover:border-accent/40 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageCircle size={20} className="text-accent" />
                    <h3 className="font-display text-xl font-light text-foreground">{t.whatsappUs}</h3>
                  </div>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">
                    {t.whatsappDesc}
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block w-full text-center px-6 py-4 bg-[#25D366] text-white text-xs font-body tracking-[0.3em] uppercase hover:bg-[#1ebe5d] transition-all duration-300"
                  >
                    {t.messageOnWhatsapp}
                  </a>
                </div>

                {/* Map embed placeholder */}
                <div className="relative overflow-hidden aspect-video border border-border">
                  <iframe
                    title="O.V Styles Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7!2d3.354!3d6.447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjYnNDkuMiJOIDPCsDIxJzE0LjQiRQ!5e0!3m2!1sen!2sng!4v1"
                    className="w-full h-full grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 border border-border">
                    <p className="text-foreground font-body text-xs">{CONTACT_ADDRESS}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="animate-section py-28 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.faqLabel}</span>
              <h2 className="font-display text-4xl md:text-6xl font-light mt-3 text-foreground">{t.faqHeading}</h2>
              <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
            </div>

            <div className="max-w-3xl mx-auto space-y-0">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left group"
                  >
                    <span className="font-display text-lg font-light text-foreground group-hover:text-accent transition-colors duration-300 pr-8">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-accent shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-400 ease-in-out ${
                      openFaq === i ? "max-h-48 pb-6" : "max-h-0"
                    }`}
                  >
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA strip */}
        <section className="animate-section relative py-32 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80"
            alt="O.V Styles"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/72" />
          <div className="relative z-10 text-center px-4">
            <span className="text-accent text-xs font-body tracking-[0.4em] uppercase">{t.newSeason}</span>
            <h2 className="font-display text-4xl md:text-6xl font-light text-white mt-4 leading-tight">
              {t.createSomething}
            </h2>
            <p className="text-white/50 font-body mt-4 max-w-md mx-auto text-sm leading-relaxed">
              {t.createDesc}
            </p>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default Contact;