import React from "react";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { deleteList } from "@/actions/Lists/deleteList/action";
import { useToast } from "@/hooks/use-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";

import FormError from "../FormError";
import Spinner from "../Spinner";

const Alert = ({ listId }: { listId: string }) => {
  const params = useParams();
  const { toast } = useToast();

  const { execute, fieldErrors, isLoading } = useAction(deleteList, {
    onSuccess: () => {
      toast({
        title: "List deleted",
        description: "The list has been successfully deleted.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: error.title,
        description: error.description,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    execute({ id: listId, boardId: params.boardId as string });
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your List
          and remove all of its data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="focus-visible:ring-none focus-visible:outline-none">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
          {isLoading ? <Spinner /> : "Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
      {fieldErrors?.id && <FormError message={fieldErrors.id[0]} />}
    </AlertDialogContent>
  );
};

const DeleteList = ({ listId }: { listId: string }) => {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-red-100 cursor-pointer transition-colors"
            onSelect={(e) => e.preventDefault()}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Board
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <Alert listId={listId} />
      </AlertDialog>
    </>
  );
};

export default DeleteList;
