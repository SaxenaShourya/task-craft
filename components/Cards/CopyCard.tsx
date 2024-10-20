import React from "react";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/Cards/copyCard/action";
import { useToast } from "@/hooks/use-toast";

import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import Spinner from "../Spinner";

interface CopyCardProps {
  cardId: string;
  cardsCount: number;
}

const CopyCard = ({ cardId, cardsCount }: CopyCardProps) => {
  const params = useParams();
  const { toast } = useToast();

  const { execute, isLoading } = useAction(copyCard, {
    onSuccess: () => {
      toast({
        title: "Card copied",
        description: "The card has been successfully copied.",
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

  const handleCopy = () => {
    execute({
      id: cardId,
      boardId: params.boardId as string,
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground"
      onClick={handleCopy}
      disabled={isLoading || cardsCount >= 5}
    >
      {isLoading ? (
        <Spinner className="h-4 w-4 mr-2" />
      ) : (
        <Copy className="h-4 w-4 mr-2" />
      )}
      Copy
    </Button>
  );
};

export default CopyCard;
