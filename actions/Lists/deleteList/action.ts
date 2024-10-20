"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, DeleteListSchema } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

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
    const listToDelete = await db.list.findUnique({
      where: { id, board: { orgId } },
    });

    if (!listToDelete) {
      return {
        error: {
          title: "List not found",
          description: "The specified list does not exist or you don't have access to it.",
        },
      };
    }

    await db.list.delete({
      where: { id },
    });

    await createAuditLog({
      entityId: listToDelete.id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: listToDelete.title,
      action: ACTION.DELETE,
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