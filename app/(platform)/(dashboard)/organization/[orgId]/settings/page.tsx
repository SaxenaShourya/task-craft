import React from "react";
import { OrganizationProfile } from "@clerk/nextjs";

const SettingsPage = () => {
  return (
    <div className="w-full">
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: {
              boxShadow: "none",
              width: "100%",
            },
            cardBox: {
              boxShadow: "none",
              width: "100%",
              border: "1px solid #e5e7eb",
            },
          },
        }}
        afterLeaveOrganizationUrl="/create-org"
        routing="hash"
      />
    </div>
  );
};

export default SettingsPage;
