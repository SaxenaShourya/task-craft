"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, UpdateCardSchema } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const updateCardHandler = async (data: InputType) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: {
        title: "Unauthorized",
        description: "User is not authenticated or does not belong to an organization.",
      },
    };
  }

  const { id, title, description, boardId } = data;

  const validatedFields = UpdateCardSchema.safeParse({ id, title, description, boardId });
  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const existingCard = await db.card.findUnique({
      where: { id, list: { board: { orgId } } },
    });

    if (!existingCard) {
      return {
        error: {
          title: "Card not found",
          description: "The specified card does not exist or you don't have access to it.",
        },
      };
    }

    if (existingCard.title === title && existingCard.description === description) {
      return {
        error: {
          title: "No changes detected",
          description: "The card details are the same as before.",
        },
      };
    }

    const updatedCard = await db.card.update({
      where: { id },
      data: { title, description },
    });

    await createAuditLog({
      entityId: updatedCard.id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: updatedCard.title,
      action: ACTION.UPDATE,
    });

    revalidatePath(`/board/${boardId}`);
    return { data: updatedCard };
  } catch (error) {
    console.error("Error updating card:", error);
    return {
      error: {
        title: "Failed to update card",
        description: "An unexpected error occurred while updating the card. Please try again later.",
      },
    };
  }
};

export const updateCard = createSafeAction(UpdateCardSchema, updateCardHandler);