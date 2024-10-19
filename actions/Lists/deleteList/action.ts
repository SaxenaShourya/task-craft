"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, DeleteListSchema } from "./types";

const deleteListHandler = async (data: InputType) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: {
        title: "Unauthorized",
        description: "User is not authenticated or does not belong to an organization.",
      },
    };
  }

  const { id, boardId } = data;

  try {
    await db.list.delete({
      where: { id, board: { orgId } },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting list:", error);
    return {
      error: {
        title: "Failed to delete list",
        description: "An unexpected error occurred while deleting the list. Please try again later.",
      },
    };
  }
};

export const deleteList = createSafeAction(DeleteListSchema, deleteListHandler);