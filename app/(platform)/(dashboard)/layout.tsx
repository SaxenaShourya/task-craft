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
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
