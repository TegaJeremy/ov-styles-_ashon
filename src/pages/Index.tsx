import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import AboutPreview from "@/components/AboutPreview";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <FeaturedSection />
    <AboutPreview />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
