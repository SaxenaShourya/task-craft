import React, { useState, KeyboardEvent } from "react";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import Link from "next/link";
import { createCard } from "@/actions/Cards/createCard/action";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Plus, X, HelpCircle } from "lucide-react";

import FormError from "../FormError";
import Spinner from "../Spinner";

const AddCard = ({
  listId,
  cardsCount,
}: {
  listId: string;
  cardsCount: number;
}) => {
  const params = useParams();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [cardTitle, setCardTitle] = useState("");

  const { execute, fieldErrors, isLoading } = useAction(createCard, {
    onSuccess: () => {
      toast({
        title: "Card created",
        description: "The card has been successfully added to the list.",
        variant: "default",
      });
      setIsAdding(false);
      setCardTitle("");
    },
    onError: (error) => {
      toast({
        title: error.title,
        description: error.description,
        variant: "destructive",
      });
    },
  });

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleInputBlur = () => {
    if (!cardTitle.trim()) {
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && cardTitle.trim()) {
      e.preventDefault();
      execute({
        title: cardTitle.trim(),
        listId,
        boardId: params.boardId as string,
      });
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setCardTitle("");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setCardTitle("");
  };

  if (isAdding) {
    return (
      <div className="w-full flex flex-col gap-2 p-1 bg-white/80 rounded-md shadow-sm">
        <div className="flex items-center">
          <Input
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder="Enter card title..."
            autoFocus
            disabled={isLoading}
            className="flex-grow"
          />
          <Button
            onClick={handleCancel}
            className="ml-4 p-2"
            variant="ghost"
            size="sm"
          >
            <X className="h-full w-6" />
          </Button>
        </div>
        {fieldErrors?.title && <FormError message={fieldErrors.title[0]} />}
        {isLoading && (
          <div className="flex justify-center items-center w-full">
            <Spinner variant="dark" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={handleAddClick}
        className="w-full py-6 justify-start text-foreground hover:text-foreground bg-gray-200 hover:bg-gray-300 z-[1]"
        variant="ghost"
        size="sm"
        disabled={cardsCount >= 5}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a card
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-500 transition z-10 cursor-pointer" />
          </TooltipTrigger>

          <TooltipContent
            side="left"
            align="end"
            className="bg-white p-4 rounded-md shadow-lg max-w-xs"
          >
            <p className="text-sm text-neutral-700 leading-relaxed">
              You can create up to 5 cards on the free trial.{" "}
              <Link
                href="https://www.linkedin.com/in/saxena-shourya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Contact me
              </Link>{" "}
              for more details.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AddCard;
