import CTASection from "@/components/HomePage/CTA";
import Features from "@/components/HomePage/Features";
import HeroSection from "@/components/HomePage/HeroSection";
import HowItWorks from "@/components/HomePage/HowItWorks";


const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <Features />
        <CTASection />
        <HowItWorks />
      </div>
    </div>
  );
};





export default HomePage;
