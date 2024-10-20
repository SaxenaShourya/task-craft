import React from "react";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { deleteCard } from "@/actions/Cards/deleteCard/action";
import { useToast } from "@/hooks/use-toast";

import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import Spinner from "../Spinner";

interface DeleteCardProps {
  cardId: string;
}

const DeleteCard = ({ cardId }: DeleteCardProps) => {
  const params = useParams();
  const { toast } = useToast();

  const { execute, isLoading } = useAction(deleteCard, {
    onSuccess: () => {
      toast({
        title: "Card deleted",
        description: "The card has been successfully deleted.",
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
    execute({
      id: cardId,
      boardId: params.boardId as string,
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive/90"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner className="h-4 w-4 mr-2" />
      ) : (
        <Trash2 className="h-4 w-4 mr-2" />
      )}
      Delete
    </Button>
  );
};

export default DeleteCard;