import Link from "next/link";
import Logo from "@/components/logo";
import { UserButton } from '@clerk/nextjs'
import { OrganizationSwitcher } from "@clerk/nextjs";

const Navbar = () => {
  return (
<header className="border-b border-border">
        <div className="flex items-center justify-between p-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Logo className="w-8 h-8" />
              <span className="hidden sm:block text-xl font-semibold text-primary">Task Craft</span>
            </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="https://www.linkedin.com/in/shouryasaxena/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Developer              
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="hidden min-[300px]:flex">
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/dashboard"
                afterLeaveOrganizationUrl="/create-org"
                afterSelectOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "flex items-center",
                  },
                }}
              />
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
      </header>
  )
}

export default Navbar