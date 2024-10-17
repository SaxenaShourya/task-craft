import OrgController from "@/components/Dashboard/org/OrgContoller";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { orgSlug } = auth();
  
  if (!orgSlug) {
    return {
      title: "Organization",
    };
  }

  return {
    title: `${orgSlug}`,
  };
}

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col size-full">
      <OrgController />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default OrganizationLayout;
