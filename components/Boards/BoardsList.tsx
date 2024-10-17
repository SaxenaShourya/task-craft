"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Layout, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import CreateCard from "./CreateCard";
import DialogForm from "./DialogForm";
import Boards from "./Boards";

import { getBoards } from "@/actions/createBoard/action";
import Spinner from "@/components/Spinner";
import { Board } from "@prisma/client";
import { Button } from "@/components/ui/button";

const MAX_BOARDS = 4;
const REFRESH_COOLDOWN = 10000; // 10 seconds cooldown

const BoardsList = () => {
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  const REMAINING_BOARDS = MAX_BOARDS - boards.length;

  const handleOpenDialog = () => {
    if (REMAINING_BOARDS > 0) {
      setIsDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Board limit reached",
        description: "You have reached the maximum number of boards allowed.",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    fetchBoards();
  };

  const fetchBoards = useCallback(async () => {
    setIsLoading(true);
    const result = await getBoards();
    if (result.error) {
      toast({
        variant: "destructive",
        title: result.error.title,
        description: result.error.description,
      });
    } else {
      setBoards(result.boards);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleRefresh = () => {
    const currentTime = Date.now();
    if (currentTime - lastRefreshTime < REFRESH_COOLDOWN) {
      toast({
        variant: "default",
        title: "Refresh cooldown",
        description: `Please wait ${Math.ceil(
          (REFRESH_COOLDOWN - (currentTime - lastRefreshTime)) / 1000
        )} seconds before refreshing again.`,
      });
      return;
    }

    setIsRefreshing(true);
    fetchBoards().then(() => {
      setIsRefreshing(false);
      setLastRefreshTime(currentTime);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center font-semibold text-lg text-neutral-700">
            <Layout className="w-6 h-6 mr-2" />
            Your boards
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Create and manage boards to organize your tasks and projects.
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Spinner variant="dark" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Boards boards={boards} />
            <CreateCard
              onClick={handleOpenDialog}
              remainingBoards={REMAINING_BOARDS}
            />
          </div>
          <DialogForm isOpen={isDialogOpen} onClose={handleCloseDialog} />
        </>
      )}
    </div>
  );
};
export default BoardsList;
