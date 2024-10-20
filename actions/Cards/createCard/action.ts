"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, CreateCardSchema } from "./types";

const createCardHandler = async (data: InputType) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: {
        title: "Unauthorized",
        description: "User is not authenticated or does not belong to an organization.",
      },
    };
  }

  const { title, listId, boardId } = data;

  try {
    const list = await db.list.findUnique({
      where: { id: listId, board: { orgId } },
      include: { cards: true },
    });

    if (!list) {
      return {
        error: {
          title: "List not found",
          description: "The specified list does not exist or you don't have access to it.",
        },
      };
    }

    if (list.cards.length >= 5) {
      return {
        error: {
          title: "Card limit reached",
          description: "This list already has the maximum of 5 cards.",
        },
      };
    }

    const newOrder = list.cards.length + 1;

    const card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder,
        description: "",
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { data: card };
  } catch (error) {
    console.error("Error creating card:", error);
    return {
      error: {
        title: "Failed to create card",
        description: "An unexpected error occurred while creating the card. Please try again later.",
      },
    };
  }
};

export const createCard = createSafeAction(CreateCardSchema, createCardHandler);