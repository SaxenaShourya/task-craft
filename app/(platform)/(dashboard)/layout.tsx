"use client";

import React, { useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/Dashboard/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { organization, isLoaded } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !organization) {
      router.push('/create-org');
    }
  }, [isLoaded, organization, router]);

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen"><Spinner variant="dark" /></div>;
  }

  if (!organization) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
        <Navbar />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
