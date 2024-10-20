import React, { useState } from "react";
import { List, Card } from "@prisma/client";
import { useAction } from "@/hooks/use-action";
import { updateList } from "@/actions/Lists/editList/action";
import { useToast } from "@/hooks/use-toast";

import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, X, Edit2 } from "lucide-react";

import Dropdown from "../Dropdown";
import DeleteList from "./DeleteList";
import CopyList from "./CopyList";
import FormError from "../FormError";
import Spinner from "../Spinner";

const ListHeader = ({
  id,
  boardId,
  title,
  onTitleChange,
  listCount,
}: {
  id: string;
  boardId: string;
  title: string;
  onTitleChange: (newTitle: string) => void;
  listCount: number;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const { toast } = useToast();

  const { execute, fieldErrors, isLoading } = useAction(updateList, {
    onSuccess: (data) => {
      toast({
        title: "List updated",
        description: "The list title has been successfully updated.",
        variant: "default",
      });
      onTitleChange(data.title);
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: error.title,
        description: error.description,
        variant: "destructive",
      });
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    execute({ id, title: editedTitle, boardId });
  };

  const handleCancelClick = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col p-2 bg-card rounded-t-md">
      <div className="flex items-center justify-between">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-sm font-semibold text-foreground"
              disabled={isLoading}
            />
            <Button
              onClick={handleSaveClick}
              className="text-primary bg-gray-200 hover:bg-gray-300 hover:text-primary/80"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : <Check className="h-4 w-4" />}
            </Button>
            <Button
              onClick={handleCancelClick}
              className="text-destructive bg-gray-200 hover:bg-gray-300 hover:text-destructive/80"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <h3 className="font-semibold text-sm text-foreground ml-3 my-[10px]">
            {title}
          </h3>
        )}
        <Dropdown
          contentClassName="bg-background"
          btnClassName="text-muted-foreground"
          iconClassName="text-muted-foreground"
        >
          <DropdownMenuItem
            className="flex items-center py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            onClick={handleEditClick}
          >
            <Edit2 className="text-foreground/90 mr-2" />
            <span className="text-foreground">Edit List Title</span>
          </DropdownMenuItem>
          <CopyList listId={id} listCount={listCount} />
          <DeleteList listId={id} />
        </Dropdown>
      </div>
      {isEditing && fieldErrors?.title && (
        <FormError message={fieldErrors.title[0]} className="mt-2" />
      )}
    </div>
  );
};

const ListItem = ({ data, listCount }: { data: { cards: Card[] } & List, listCount: number }) => {
  const [listTitle, setListTitle] = useState(data.title);

  const handleTitleChange = (newTitle: string) => {
    setListTitle(newTitle);
  };

  return (
    <div className="rounded-md w-full bg-card">
      <ListHeader
        id={data.id}
        boardId={data.boardId}
        title={listTitle}
        onTitleChange={handleTitleChange}
        listCount={listCount}
      />
    </div>
  );
};

export default ListItem;
