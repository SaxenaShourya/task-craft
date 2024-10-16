"use client";

import React from "react";
import { useOrganization } from "@clerk/nextjs";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/Dashboard/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useOrganization();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner variant="dark" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen size-full">
      <Navbar />
      <main className="flex-grow h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;