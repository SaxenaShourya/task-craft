"use client";
import { OrganizationList, useOrganizationList } from "@clerk/nextjs";
import Logo from "@/components/logo";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const CreateOrgPage = () => {
  const { isLoaded } = useOrganizationList();

  return (
    <section className="h-screen flex flex-col">
      <header className="py-4 border-b border-border">
        <div className="mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-semibold text-primary">
              Task Craft
            </span>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center mt-4">
        <h1 className="text-2xl font-medium text-primary mb-1">
          Create Your Organization
        </h1>
        <p className="text-muted-foreground text-sm mb-4">
          Please create an organization to continue.
        </p>
      </div>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-md flex justify-center items-center">
          {!isLoaded ? (
            <Spinner variant="dark" />
          ) : (
            <OrganizationList hidePersonal afterSelectOrganizationUrl='/organization/:id' afterCreateOrganizationUrl='/organization/:id' />
          )}
        </div>
      </main>
      <footer className="py-4 border-t border-border">
        <div className="mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
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
    </section>
  );
};

export default CreateOrgPage;
