"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, UpdateCardPositionSchema } from "./types";

const updateCardPositionHandler = async (data: InputType) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: {
        title: "Unauthorized",
        description: "User is not authenticated or does not belong to an organization.",
      },
    };
  }

  const { items, boardId } = data;

  try {
    const transaction = items.map((card) =>
      db.card.update({
        where: { id: card.id, list: { board: { orgId } } },
        data: { order: card.order, listId: card.listId },
      })
    );

    await db.$transaction(transaction);

    revalidatePath(`/board/${boardId}`);
    return { data: items };
  } catch (error) {
    console.error("Error updating card position:", error);
    return {
      error: {
        title: "Failed to update card position",
        description: "An unexpected error occurred while updating the card position. Please try again later.",
      },
    };
  }
};

export const updateCardPosition = createSafeAction(UpdateCardPositionSchema, updateCardPositionHandler);