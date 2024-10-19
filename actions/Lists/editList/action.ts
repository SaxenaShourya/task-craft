"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, UpdateListSchema } from "./types";

const updateListHandler = async (data: InputType) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: {
        title: "Unauthorized",
        description: "User is not authenticated or does not belong to an organization.",
      },
    };
  }

  const { id, title, boardId } = data;

  const validatedFields = UpdateListSchema.safeParse({ id, title, boardId });
  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const existingList = await db.list.findUnique({
      where: { id, board: { orgId } },
    });

    if (!existingList) {
      return {
        error: {
          title: "List not found",
          description: "The specified list does not exist or you don't have access to it.",
        },
      };
    }

    if (existingList.title === title) {
      return {
        error: {
          title: "No changes detected",
          description: "The new title is the same as the current title.",
        },
      };
    }

    const updatedList = await db.list.update({
      where: { id, board: { orgId } },
      data: { title },
    });

    revalidatePath(`/board/${boardId}`);
    return { data: updatedList };
  } catch (error) {
    console.error("Error updating list:", error);
    return {
      error: {
        title: "Failed to update list title.",
        description: "An unexpected error occurred while updating the list. Please try again later.",
      },
    };
  }
};

export const updateList = createSafeAction(UpdateListSchema, updateListHandler);