import React from "react";
import Sidebar from "@/components/Dashboard/org/Sidebar";
import { Separator } from "@/components/ui/separator";

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex md:gap-x-7 w-full h-full">
      <div className="pt-6 md:pt-8 md:px-4 mx-auto">
        <div className="w-64 shrink-0 hidden md:block">
          <Sidebar />
        </div>
      </div>
      <Separator orientation="vertical" className="h-full hidden md:block" />
      <section className="flex-grow pt-6 md:pt-8 px-4 mx-auto">{children}</section>
    </div>
  );
};

export default OrganizationLayout;
