import { useRouter } from "next/navigation";
import { deleteBoard } from "@/actions/Boards/deleteBoard/action";
import { useToast } from "@/hooks/use-toast";
import { useAction } from "@/hooks/use-action";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormError from "../FormError";
import Spinner from "../Spinner";

const DeleteBoard = ({
  boardId,
  orgId,
}: {
  boardId: string;
  orgId: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const { execute, fieldErrors, isLoading } = useAction(deleteBoard, {
    onSuccess: () => {
      toast({
        title: "Board deleted",
        description: "The board has been successfully deleted.",
        variant: "default",
      });
      router.push(`/organization/${orgId}`);
    },
    onError: (error) => {
      toast({
        title: error.title,
        description: error.description,
        variant: "destructive",
      });
    },
  });

  const handleDeleteBoard = () => {
    execute({ id: boardId });
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          board and remove all of its data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDeleteBoard} disabled={isLoading}>
          {isLoading ? <Spinner /> : "Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
      {fieldErrors?.id && (
        <FormError message={fieldErrors.id[0]} />
      )}
    </AlertDialogContent>
  );
};

export default DeleteBoard;
