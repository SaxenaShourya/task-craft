"use client";

import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { OrganizationMembershipResource, SetActive } from "@clerk/types";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Plus, Activity, Settings, Layout } from "lucide-react";

import Spinner from "@/components/Spinner";

type SidebarProps = {
  storageKey?: string;
};

type SideBarItemProps = {
  org: OrganizationMembershipResource;
  isActive: boolean;
  isExpanded: boolean;
  onExpand: (id: string) => void;
  setActive: SetActive
};

const SideBarItem = ({
  org,
  isActive,
  isExpanded,
  onExpand,
  setActive
}: SideBarItemProps) => {
  const routes = [
    {
      name: "Boards",
      icon: <Layout className="w-4 h-4 mr-2" />,
      href: `/organization/${org.organization.id}`,
    },
    {
      name: "Activity",
      icon: <Activity className="w-4 h-4 mr-2" />,
      href: `/organization/${org.organization.id}/activity`,
    },
    {
      name: "Settings",
      icon: <Settings className="w-4 h-4 mr-2" />,
      href: `/organization/${org.organization.id}/settings`,
    },
  ];

  return (
    <AccordionItem value={org.organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(org.organization.id)}
        className={cn(
          "flex items-center justify-between w-full p-2 rounded-sm hover:no-underline",
          isExpanded ? "bg-gray-200" : "hover:bg-gray-100",
          isActive ? "text-blue-500" : "text-gray-700"
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="size-7 relative">
            <Image
              src={org.organization.imageUrl}
              alt="Organization"
              fill
              className="rounded-sm object-cover"
            />
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              isActive ? "text-blue-500" : "text-gray-700",
            )}
          >
            {org.organization.name}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {routes.map((route) => (
          <Link href={route.href} key={route.href} onClick={()=>setActive({ organization: org.organization.id })}>
            <div
              className={cn(
                "text-sm rounded-sm font-medium p-2 flex items-center gap-x-2",
                isActive ? "text-blue-500" : "text-gray-700",
                "hover:bg-gray-100"
              )}
            >
              {route.icon}
              {route.name}
            </div>
          </Link>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

const Sidebar = ({ storageKey = "tc-sidebar-state" }: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );
  
  const { organization: activeOrganization, isLoaded: isActiveOrgLoaded } =
    useOrganization();
  const { isLoaded: isOrgsListLoaded, userMemberships, setActive } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }
      return acc;
    },
    []
  );

  const onExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !expanded[id],
    }));
  };

  if (!isActiveOrgLoaded || !isOrgsListLoaded || userMemberships.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner variant="dark" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between pl-2 w-full mb-4">
        <span className="text-sm">Workspaces</span>
        <Button variant="ghost" size="icon" asChild className="w-8 h-8">
          <Link href="/create-org">
            <Plus className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <Separator className="my-4" />
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships.data?.map((org) => (
          <SideBarItem
            key={org.organization.id}
            org={org}
            isActive={activeOrganization?.id === org.organization.id}
            isExpanded={expanded[org.organization.id]}
            onExpand={onExpand}
            setActive={setActive}
          />
        ))}
      </Accordion>
    </>
  );
};

export default Sidebar;
