import { CheckCircle, Info, Shield, Users, Zap } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const HeroSection = () => (
  <section
    id="hero"
    className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden"
  >
    <div className="container mx-auto px-4 text-center z-10">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-primary">
        Craft Your Success with Task Craft
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-3xl mx-auto">
        Elevate your productivity, streamline collaboration, and achieve more
        with our intuitive task management platform.
      </p>
      <div className="flex justify-center space-x-4 mb-16">
        <Link href="/login">
          <Button size="lg" className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Start Crafting
          </Button>
        </Link>
        <Link href="#features">
          <Button size="lg" variant="outline" className="flex items-center">
          <Info className="mr-2 h-5 w-5" />
          Explore Features
        </Button>
        </Link>
      </div>
      <div className="flex justify-center space-x-12">
        <div className="flex flex-col items-center">
          <div className="bg-primary/10 rounded-full p-3 mb-3">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <span className="text-sm font-medium">Intuitive Design</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-primary/10 rounded-full p-3 mb-3">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <span className="text-sm font-medium">Seamless Collaboration</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-primary/10 rounded-full p-3 mb-3">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <span className="text-sm font-medium">Enterprise-grade Security</span>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
