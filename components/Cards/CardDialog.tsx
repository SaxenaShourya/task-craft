import React, { useEffect, useState } from "react";
import { ACTION, Card, ENTITY_TYPE } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/Cards/editCard/action";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCardSchema, InputType } from "@/actions/Cards/editCard/types";
import { getRecentCardActivity } from "@/actions/Activity/getCardActivity/action";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Edit2, Save, X, AlignLeft, Clock, List } from "lucide-react";

import Dialog from "../Dialog";
import CopyCard from "./CopyCard";
import DeleteCard from "./DeleteCard";
import CardActivity from "./CardActivty";
import FormError from "../FormError";
import Spinner from "../Spinner";

interface CardDialogProps {
  card: Card;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  listName: string;
  cardsCount: number;
}

const CardDialog = ({
  card,
  isOpen,
  setIsOpen,
  listName,
  cardsCount,
}: CardDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [recentActivity, setRecentActivity] = useState<{
    action: ACTION;
    createdAt: Date;
    userName: string;
    userImage: string;
    entityTitle: string;
    entityType: ENTITY_TYPE;
  } | null>(null);
  const params = useParams();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(UpdateCardSchema),
    defaultValues: {
      id: card.id,
      title: card.title,
      description: card.description || "",
      boardId: params.boardId as string,
    },
  });

  const { execute, fieldErrors, isLoading } = useAction(updateCard, {
    onSuccess: (data) => {
      toast({
        title: "Card updated",
        description: "The card has been successfully updated.",
        variant: "default",
      });
      setIsEditing(false);
      reset({
        id: data.id,
        title: data.title,
        description: data.description || "",
        boardId: params.boardId as string,
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

  useEffect(() => {
    if (isOpen) {
      reset({
        id: card.id,
        title: card.title,
        description: card.description || "",
        boardId: params.boardId as string,
      });
      getRecentCardActivity(card.id).then(setRecentActivity);
    }
  }, [isOpen, card, params.boardId, reset]);

  const onSubmit = (data: InputType) => {
    execute(data);
  };

  const triggerContent = (
    <div className="w-full px-4 py-3 rounded-md bg-white hover:bg-gray-100 cursor-pointer flex items-center justify-between group transition-colors duration-200 border border-gray-200 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 truncate">
        {card.title}
      </h3>
      <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerContent={triggerContent}
      title={isEditing ? "Edit Card" : card.title}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Input
                {...register("title")}
                placeholder="Card Title"
                className="border-gray-300 focus:ring-none"
              />
              {(errors.title || fieldErrors?.title) && (
                <FormError
                  message={
                    errors.title?.message || fieldErrors?.title?.[0] || ""
                  }
                />
              )}
            </div>
            <div>
              <Textarea
                {...register("description")}
                placeholder="Card Description"
                rows={4}
                className="border-gray-300 focus:ring-none"
              />
              {(errors.description || fieldErrors?.description) && (
                <FormError
                  message={
                    errors.description?.message ||
                    fieldErrors?.description?.[0] ||
                    ""
                  }
                />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                <span>{new Date(card.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-primary">
                <List className="w-4 h-4 mr-2" />
                <span>{listName}</span>
              </div>
            </div>
            <Separator />
            <div className="bg-secondary/20 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <AlignLeft className="w-4 h-4 mr-2 text-muted-foreground" />
                <h4 className="text-sm font-medium text-foreground">
                  Description
                </h4>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {card.description || "No description"}
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          {isEditing ? (
            <div className="space-x-2">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                variant="outline"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="text-primary hover:bg-primary/10 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}

          {!isEditing && (
            <div className="space-x-2">
              <CopyCard cardId={card.id} cardsCount={cardsCount} />
              <DeleteCard cardId={card.id} />
            </div>
          )}
        </div>
      </form>
      {recentActivity && !isEditing && (
        <div className="space-y-4 mt-4">
          <Separator orientation="horizontal" />
          <CardActivity recentActivity={recentActivity} />
        </div>
      )}
    </Dialog>
  );
};

export default CardDialog;
