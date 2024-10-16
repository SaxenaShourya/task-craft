import React from "react";
import Sidebar from "@/components/Dashboard/org/Sidebar";

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex md:gap-x-7">
      <div className="pt-6 md:pt-8 md:px-4 mx-auto">
        <div className="w-64 shrink-0 hidden md:block">
          <Sidebar />
        </div>
      </div>

      <section className="flex-grow pt-6 md:pt-8 px-4 mx-auto">{children}</section>
    </div>
  );
};

export default OrganizationLayout;
