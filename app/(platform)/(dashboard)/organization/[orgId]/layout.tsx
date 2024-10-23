import OrgController from "@/components/Dashboard/org/OrgContoller";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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

const OrganizationLayout = async ({ children, params }: { children: React.ReactNode, params: { orgId: string } }) => {
  const { orgId } = params;
  
  try {
    const org = await clerkClient().organizations.getOrganization({ organizationId: orgId });
    if (!org) {
      notFound();
    }
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <div className="flex flex-col size-full">
      <OrgController />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default OrganizationLayout;
