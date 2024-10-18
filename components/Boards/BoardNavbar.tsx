"use client";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { AlertDialogTrigger, AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";

import DeleteBoard from "./DeleteBoard";
import EditTitle from "./EditTitle";

const BoardNavbar = ({
  boardTitle,
  boardId,
  orgId,
}: {
  boardTitle: string;
  boardId: string;
  orgId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-14 z-[40] flex items-center px-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <h1 className="text-2xl font-semibold text-white mr-auto truncate cursor-pointer hover:underline">
            {boardTitle}
          </h1>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Board Title</DialogTitle>
          </DialogHeader>
          <EditTitle boardId={boardId} boardTitle={boardTitle} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-auto w-auto p-1 bg-black/20 hover:bg-black/30 transition focus-visible:ring-none focus-visible:ring-transparent focus-visible:ring-offset-0"
          >
            <MoreHorizontal className="h-5 w-5 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-md"
        >
          <DropdownMenuItem
            onClick={() => setIsOpen(true)}
            className="cursor-pointer transition-colors"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Title
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 cursor-pointer transition-colors"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Board
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <DeleteBoard boardId={boardId} orgId={orgId} />
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BoardNavbar;
