"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "@/hooks/use-action";
import Link from "next/link";
import { createList } from "@/actions/Lists/createList/action";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CreateListSchema, InputType } from "@/actions/Lists/createList/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Dialog from "../Dialog";
import Spinner from "../Spinner";
import FormError from "../FormError";

const AddListForm = ({ listCount }: { listCount: number }) => {
  const params = useParams();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputType>({
    resolver: zodResolver(CreateListSchema),
    defaultValues: {
      title: "",
      boardId: params.boardId as string,
    },
  });

  const { execute, fieldErrors, isLoading } = useAction(createList, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "List created successfully",
        variant: "default",
      });
      reset();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: error.title,
        description: error.description,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InputType) => {
    execute(data);
  };

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerContent={
        <>
          {listCount >= 4 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-white cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    You can only create up to 4 lists on the free trial.{" "}
                    <Link
                      href="https://www.linkedin.com/in/saxena-shourya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Contact me on LinkedIn
                    </Link>{" "}
                    for more details.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button
            variant="outline"
            className={cn(
              "h-auto w-auto px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-none",
              listCount >= 4
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            )}
            disabled={listCount >= 4}
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add List
          </Button>
        </>
      }
      title="Create New List"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            List Title
          </Label>
          <Input
            id="title"
            {...register("title")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-none"
            placeholder="Enter list name"
          />
          {fieldErrors?.title && <FormError message={fieldErrors.title[0]} />}
          {!fieldErrors?.title && errors.title?.message && (
            <FormError message={errors.title.message} />
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 text-white rounded-md transition duration-300 ease-in-out"
            disabled={isLoading || listCount >= 4}
          >
            {isLoading ? <Spinner /> : "Create List"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddListForm;
