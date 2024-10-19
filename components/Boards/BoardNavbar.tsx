"use client";
import React, { useState } from "react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AlertDialogTrigger, AlertDialog } from "@/components/ui/alert-dialog";
import { Edit2, Trash2 } from "lucide-react";

import Dropdown from "@/components/Dropdown";
import Dialog from "../Dialog";
import DeleteBoard from "./DeleteBoard";
import EditTitle from "./EditTitle";
import AddListForm from "../Lists/AddListForm";

const BoardNavbar = ({
  boardTitle,
  boardId,
  orgId,
  listCount,
}: {
  boardTitle: string;
  boardId: string;
  orgId: string;
  listCount: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-14 z-[40] flex items-center px-6">
      <Dialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Edit Board Title"
        triggerContent={
          <h1 className="text-2xl font-semibold text-white mr-auto truncate cursor-pointer hover:underline">
            {boardTitle}
          </h1>
        }
      >
        <EditTitle
          boardId={boardId}
          boardTitle={boardTitle}
          setIsOpen={setIsOpen}
        />
      </Dialog>
      <div className="gap-x-4 flex items-center">
        <AddListForm listCount={listCount} />
        <Dropdown
          contentClassName="w-56 backdrop-blur-sm border border-neutral-200 shadow-md"
          btnClassName="h-auto w-auto p-2 bg-black/20 hover:bg-black/30 transition focus-visible:ring-none focus-visible:ring-transparent focus-visible:ring-offset-0"
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
                className="text-destructive hover:bg-red-50 focus:bg-red-100 focus:text-destructive cursor-pointer transition-colors"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Board
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <DeleteBoard boardId={boardId} orgId={orgId} />
          </AlertDialog>
        </Dropdown>
      </div>
    </div>
  );
};

export default BoardNavbar;
