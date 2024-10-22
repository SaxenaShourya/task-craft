import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditLog } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { Activity, AlertCircle } from 'lucide-react';

interface RecentActivityListProps {
  recentActivity: AuditLog[];
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({ recentActivity }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivity.length > 0 ? (
          <ul className="space-y-4">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="flex items-center space-x-3">
                <Image src={activity.userImage} alt={activity.userName} width={32} height={32} className="rounded-full" />
                <div>
                  <p className="text-sm text-foreground">
                    {activity.userName}{' '}
                    <span className="font-semibold">{activity.action.toLowerCase()}</span>{' '}
                    {activity.entityTitle}{' '}
                    ({activity.entityType.toLowerCase()})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              It looks like there hasn&apos;t been any activity in your workspace recently. 
              Start collaborating on boards and tasks to see updates here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityList;