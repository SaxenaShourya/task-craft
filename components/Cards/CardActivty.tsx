import React from "react";
import { Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import Image from "next/image";
import { generateAuditTitle } from "@/lib/generateAuditTitle";

interface RecentActivity {
  action: ACTION;
  createdAt: Date;
  userName: string;
  userImage: string;
  entityTitle: string;
  entityType: ENTITY_TYPE;
  noIcon?: boolean
}

const CardActivity = ({
  recentActivity,
}: {
  recentActivity: RecentActivity;
}) => {
  const auditTitle = generateAuditTitle({
    entityTitle: recentActivity.entityTitle,
    entityType: recentActivity.entityType,
    action: recentActivity.action,
  });

  return (
    <div className="bg-secondary/20 rounded-md">
      {!recentActivity.noIcon && <div className="flex items-center mb-2">
        <Activity className="w-4 h-4 mr-2 text-muted-foreground" />
        <h4 className="text-sm font-medium text-foreground">Recent Activity</h4>
      </div>}
      <div className="flex items-center text-sm text-muted-foreground ml-6">
        <Image
          src={recentActivity.userImage}
          alt={recentActivity.userName}
          width={32}
          height={32}
          className="rounded-full mr-2"
        />
        <div>
          <span className="font-semibold text-foreground">
            {recentActivity.userName}
          </span>
          <p>
            {auditTitle}{" "}
            {formatDistanceToNow(new Date(recentActivity.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardActivity;
