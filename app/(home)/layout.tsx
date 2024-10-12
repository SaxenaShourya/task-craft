import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import Logo from '@/components/logo';

const NavBar = () => (
  <nav className="bg-background border-b border-border sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-primary flex items-center">
        <Logo className="mr-2" />
        <span>Task Craft</span>
      </Link>
      <div className="hidden md:flex space-x-6">
        <Button variant="ghost" asChild>
          <Link href="#features">Features</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="#how-it-works">How It Works</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="https://github.com/SaxenaShourya/task-craft" target="_blank" rel="noopener noreferrer">Github</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="https://www.linkedin.com/in/shouryasaxena/" target="_blank" rel="noopener noreferrer">About</Link>
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/login">Log In</Link>
        </Button>
        <Button variant="default">Sign Up</Button>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-gradient-to-b from-background to-background/90 border-t border-border py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {[
          { title: "Product", links: ["Features", "Pricing", "Roadmap", "Integrations"] },
          { title: "Company", links: ["About Us", "Careers", "Contact", "Press Kit"] },
          { title: "Resources", links: ["Blog", "Help Center", "API Docs", "Community"] },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"] }
        ].map((section, index) => (
          <div key={index} className="space-y-4">
            <h3 className="font-bold text-lg text-primary mb-6">{section.title}</h3>
            <ul className="space-y-3">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm hover:underline">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
        <p className="text-muted-foreground text-sm mb-6 md:mb-0">
          &copy; 2024 Task Craft. All rights reserved.
        </p>
        <div className="flex items-center space-x-6">
          <Link href="https://github.com/SaxenaShourya/task-craft" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            <Github className="h-6 w-6" />
          </Link>
          <Link href="https://www.linkedin.com/in/shouryasaxena/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300">
          <Linkedin />
          </Link>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Crafted with ❤️ by{" "}
          <Link
            href="https://www.linkedin.com/in/shouryasaxena/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline transition-all duration-300 hover:text-primary/80"
          >
            Shourya Saxena
          </Link>
        </p>
      </div>
    </div>
  </footer>
);

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
    <NavBar />
      <main className="container mx-auto">
        {children}
      </main>
    <Footer />
    </div>
  );
};

export default HomeLayout;
