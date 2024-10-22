import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Layout, AlertCircle } from "lucide-react";

interface RecentBoardsListProps {
  recentBoards: Array<{
    id: string;
    title: string;
    createdAt: Date;
    lists: Array<{ id: string }>;
  }>;
}

const RecentBoardsList: React.FC<RecentBoardsListProps> = ({ recentBoards }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Boards
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentBoards.length > 0 ? (
          <ul className="space-y-1">
            {recentBoards.map((board) => (
              <li key={board.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{board.title}</p>
                  <p className="text-sm text-gray-500">
                    Created on {new Date(board.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <Layout className="w-4 h-4 mr-2" />
                  <span>{board.lists.length} lists</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recent Boards</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              You haven&apos;t created any boards recently. Start a new board to see it appear here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentBoardsList;