"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, CopyCardSchema } from "./types";

const copyCardHandler = async (data: InputType) => {
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
    const cardToCopy = await db.card.findUnique({
      where: { id, list: { board: { orgId } } },
      include: { list: true },
    });

    if (!cardToCopy) {
      return {
        error: {
          title: "Card not found",
          description: "The specified card does not exist or you don't have access to it.",
        },
      };
    }

    const cardCount = await db.card.count({
      where: { listId: cardToCopy.listId },
    });

    if (cardCount >= 5) {
      return {
        error: {
          title: "Card limit reached",
          description: "This list already has the maximum of 5 cards.",
        },
      };
    }

    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const copiedCard = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        order: newOrder,
        listId: cardToCopy.listId,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { data: copiedCard };
  } catch (error) {
    console.error("Error copying card:", error);
    return {
      error: {
        title: "Failed to copy card",
        description: "An unexpected error occurred while copying the card. Please try again later.",
      },
    };
  }
};

export const copyCard = createSafeAction(CopyCardSchema, copyCardHandler);