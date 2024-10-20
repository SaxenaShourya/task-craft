import React from "react";
import { Activity, Clock, Users } from "lucide-react";
import CardActivity from "@/components/Cards/CardActivty";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { ACTION, AuditLog, ENTITY_TYPE } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";

const ActivityPage = async () => {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const organization = await clerkClient().organizations.getOrganization({ organizationId: orgId });

  const audits = await db.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return (
    <div className="w-full">
      <div className="mb-2 sm:mb-4 lg:mb-5 flex items-center gap-x-3">
        <Image
          src={organization.imageUrl}
          alt={organization.name}
          width={48}
          height={48}
          className="rounded-md"
        />
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-0">
            {organization.name} - Activity
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track recent actions and changes in your organization
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 mb-3 sm:mb-5">
        <div className="bg-secondary/20 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
          <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <div>
            <p className="font-semibold text-lg sm:text-xl">{audits.length}</p>
            <p className="text-xs text-muted-foreground">Total Activities</p>
          </div>
        </div>
        <div className="bg-secondary/20 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <div>
            <p className="font-semibold text-lg sm:text-xl">
              {audits[0]?.createdAt.toLocaleDateString()}
            </p>
            <p className="text-xs text-muted-foreground">Last Activity</p>
          </div>
        </div>
        <div className="bg-secondary/20 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <div>
            <p className="font-semibold text-lg sm:text-xl">
              {new Set(audits.map((audit) => audit.userId)).size}
            </p>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </div>
        </div>
      </div>

      <Separator className="my-2 sm:my-4 lg:mb-6" />

      {audits.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {audits.map((audit: AuditLog) => (
            <CardActivity
              key={audit.id}
              recentActivity={{
                action: audit.action as ACTION,
                createdAt: audit.createdAt,
                userName: audit.userName,
                userImage: audit.userImage,
                entityTitle: audit.entityTitle,
                entityType: audit.entityType as ENTITY_TYPE,
                noIcon: true,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-6 sm:p-8 bg-secondary/20 rounded-lg shadow-sm">
          <Activity className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2">No activity yet</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            When actions are performed in your organization, they&apos;ll appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
