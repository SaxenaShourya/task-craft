"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, CreateListSchema } from "./types";

const createListHandler = async (data: InputType) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: {
        title: "Unauthorized",
        description: "User is not authenticated or does not belong to an organization.",
      },
    };
  }

  const { title, boardId } = data;

  const validatedFields = CreateListSchema.safeParse({ title, boardId });
  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const board = await db.board.findUnique({
      where: { id: boardId, orgId },
      include: { lists: { orderBy: { order: "desc" }, take: 1 } },
    });

    if (!board) {
      return {
        error: {
          title: "Board not found",
          description: "The specified board does not exist or you don't have access to it.",
        },
      };
    }

    if (board.lists.length >= 4) {
      return {
        error: {
          title: "List limit reached",
          description: "You can only create a maximum of 4 lists per board.",
        },
      };
    }

    const newOrder = board.lists[0]?.order + 1 || 1;

    const list = await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { data: list };
  } catch (error) {
    console.error("Error creating list:", error);
    return {
      error: {
        title: "Failed to create list",
        description: "An unexpected error occurred while creating the list. Please try again later.",
      },
    };
  }
};

export const createList = createSafeAction(CreateListSchema, createListHandler);