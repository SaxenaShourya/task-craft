import Link from "next/link";
import Logo from "@/components/logo";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { MobileSidebar } from "./org/MobileSideBar";
import { Suspense } from "react";
import Spinner from "../Spinner";

const Navbar = () => {

  return (
    <nav className="border-b bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <MobileSidebar />
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Logo className="w-8 h-8" />
            <span className="hidden sm:block text-xl font-semibold text-primary">
              Task Craft
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Link
            href="https://www.linkedin.com/in/shouryasaxena/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Developer
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="hidden min-[300px]:flex">
            <Suspense fallback={<Spinner variant="dark" />}>
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/create-org"
                afterSelectOrganizationUrl="/organization/:id"
                afterLeaveOrganizationUrl="/create-org"
                appearance={{
                  elements: {
                    rootBox: "flex items-center",
                  },
                }}
              />
            </Suspense>
          </div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;