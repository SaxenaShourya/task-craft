"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, DeleteCardSchema } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const deleteCardHandler = async (data: InputType) => {
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
    const cardToDelete = await db.card.findUnique({
      where: { id, list: { board: { orgId } } },
    });

    if (!cardToDelete) {
      return {
        error: {
          title: "Card not found",
          description: "The specified card does not exist or you don't have access to it.",
        },
      };
    }

    await db.card.delete({
      where: { id },
    });

    await createAuditLog({
      entityId: cardToDelete.id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: cardToDelete.title,
      action: ACTION.DELETE,
    });

    revalidatePath(`/board/${boardId}`);
    return { data: { success: true } };
  } catch (error) {
    console.error("Error deleting card:", error);
    return {
      error: {
        title: "Failed to delete card",
        description: "An unexpected error occurred while deleting the card. Please try again later.",
      },
    };
  }
};

export const deleteCard = createSafeAction(DeleteCardSchema, deleteCardHandler);