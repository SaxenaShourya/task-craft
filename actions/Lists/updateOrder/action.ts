"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, UpdateListOrderSchema } from "./types";

const updateListOrderHandler = async (data: InputType) => {
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
    const transaction = items.map((list) =>
      db.list.update({
        where: { id: list.id, board: { orgId } },
        data: { order: list.order },
      })
    );

    await db.$transaction(transaction);

    revalidatePath(`/board/${boardId}`);
    return { data: items };
  } catch (error) {
    console.error("Error updating list order:", error);
    return {
      error: {
        title: "Failed to reorder lists",
        description: "An unexpected error occurred while reordering the lists. Please try again later.",
      },
    };
  }
};

export const updateListOrder = createSafeAction(UpdateListOrderSchema, updateListOrderHandler);