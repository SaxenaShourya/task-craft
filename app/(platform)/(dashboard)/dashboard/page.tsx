import React from "react";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  Layout,
  ListChecks,
  TrendingUp,
  Clock,
  Users,
  Github,
} from "lucide-react";

import BoardDistributionChart from "@/components/Dashboard/BoardDistributionChart";
import RecentActivityList from "@/components/Dashboard/RecentActivityList";
import RecentBoardsList from "@/components/Dashboard/RecentBoardsList";
import CardDistribution from "@/components/Dashboard/CardDistribution";

const DashboardPage = async () => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    redirect("/select-org");
  }

  const organization = await clerkClient().organizations.getOrganization({
    organizationId: orgId,
  });

  // Fetch data from the database
  const boards = await db.board.count({ where: { orgId } });
  const lists = await db.list.count({ where: { board: { orgId } } });
  const cards = await db.card.count({ where: { list: { board: { orgId } } } });
  const auditLogs = await db.auditLog.count({ where: { orgId } });

  // Fetch board distribution data
  const boardDistribution = await db.board.groupBy({
    by: ["id"],
    where: { orgId },
    _count: true,
  });

  // Fetch recent activity
  const recentActivity = await db.auditLog.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Fetch recent boards
  const recentBoards = await db.board.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { lists: { select: { id: true } } },
  });

  // Calculate productivity score (new feature)
  const productivityScore = Math.round((cards / (boards * lists || 1)) * 100);

  // Fetch team members count
  const teamMembersCount =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  // Fetch card distribution data
  const cardDistribution = await db.card.groupBy({
    by: ['listId'],
    where: { 
      list: { 
        board: { orgId } 
      } 
    },
    _count: {
      listId: true,
    },
    orderBy: {
      _count: {
        listId: 'desc' 
      }
    },
    take: 5
  });
  

  // Fetch list names for the card distribution
  const listNames = await db.list.findMany({
    where: { id: { in: cardDistribution.map(item => item.listId) } },
    select: { id: true, title: true }
  });

  // Create a map of list IDs to list titles
  const listTitleMap = Object.fromEntries(listNames.map(list => [list.id, list.title]));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">
        Dashboard - {organization.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Boards</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boards}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lists</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lists}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Logs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs}</div>
            <p className="text-xs mt-1 text-muted-foreground">
              Total Activities
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-300">
              Productivity Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-100">
              {productivityScore}%
            </div>
            <p className="text-xs mt-1 text-muted-foreground">
              Cards per Board & List
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-full">
          <BoardDistributionChart distributionData={boardDistribution} />
        </div>
        <div className="grid grid-cols-1 gap-6 h-full">
          <div className="flex-1 h-full">
            <RecentBoardsList recentBoards={recentBoards} />
          </div>
          <div className="flex-1 h-full">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center">
                {teamMembersCount.data.length > 0 ? (
                  <>
                    <div className="text-2xl font-bold">
                      {teamMembersCount.data.length}
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Active Contributors
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No team members yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardDistribution cardDistribution={cardDistribution} listTitleMap={listTitleMap} totalCards={cards} />
        <RecentActivityList recentActivity={recentActivity} />
      </div>
      <div className="mt-8">
        <Card className="bg-primary text-white">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">Enjoying Task Craft?</h3>
            <p className="text-lg mb-4">Support us by giving a star on GitHub!</p>
            <Link
              href="https://github.com/SaxenaShourya/task-craft"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-primary bg-neutral-200 hover:bg-neutral-300 focus:outline-none focus:ring-none focus:ring-offset-0 transition-colors duration-200"
            >
             <Github className="w-5 h-5 mr-2" />
              Star on GitHub
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
