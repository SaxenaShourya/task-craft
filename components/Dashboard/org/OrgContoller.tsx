"use client"
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

const OrgController = () => {
  const { orgId } = useParams();
  const router = useRouter();
  const { setActive, isLoaded: isListLoaded } = useOrganizationList();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();

  useEffect(() => {
    if (!isListLoaded || !isOrgLoaded) return;

    const setActiveOrg = async () => {
      if (orgId && organization && organization.id !== orgId) {
        await setActive({ organization: orgId as string });
      } else if (!organization && isOrgLoaded) {
        router.push("/create-org");
      }
    };
    setActiveOrg();
  }, [orgId, setActive, isListLoaded, organization, isOrgLoaded, router]);

  return null;
};

export default OrgController;
