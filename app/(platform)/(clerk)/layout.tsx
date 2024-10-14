"use client";


import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return <div className="flex justify-center items-center size-full"><Spinner variant="dark" /></div>; 
  }

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/90">
      <header className="p-4 sm:p-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-lg sm:text-xl font-bold text-primary">
            Task Craft
          </span>
        </Link>
        <nav className="hidden sm:flex space-x-4">
          <Link
            href="/#features"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="https://www.linkedin.com/in/shouryasaxena/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </Link>
        </nav>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="mt-8 p-4 sm:p-6 border-t border-border">
        <div className="mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
            © 2024 Task Craft. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://www.linkedin.com/in/shouryasaxena/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaLinkedin className="w-5 h-5" />
            </Link>
            <Link
              href="https://github.com/SaxenaShourya/task-craft"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaGithub className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
