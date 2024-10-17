"use client";
import { useOrganization } from "@clerk/nextjs";

import { Separator } from "@/components/ui/separator";
import Info from "@/components/Boards/Info";
import BoardsList from "@/components/Boards/BoardsList";
import Spinner from "@/components/Spinner";

const OrganizationPage = () => {
  const { organization: org, isLoaded } = useOrganization();

  if (!isLoaded || !org) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner variant="dark" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 w-full h-full">
      <Info org={org} />
      <Separator />
      <BoardsList />
    </div>
  );
};

export default OrganizationPage;
