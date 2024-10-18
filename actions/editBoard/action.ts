"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, UpdateBoardSchema } from "./types";

const updateBoardHandler = async (data: InputType) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: {
        title: "Unauthorized",
        description:
          "User is not authenticated or does not belong to an organization.",
      },
    };
  }

  const { id, title } = data;

  
  const validatedFields = UpdateBoardSchema.safeParse({ id, title });
  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const board = await db.board.update({
      where: { id, orgId },
      data: { title },
    });

    revalidatePath(`/board/${id}`);
    return { data: board };
  } catch (error) {
    console.error("Error updating board:", error);
    return {
      error: {
        title: "Failed to update board title.",
        description:
          "An unexpected error occurred while updating the board. Please try again later.",
      },
    };
  }
};

export const updateBoard = createSafeAction(
  UpdateBoardSchema,
  updateBoardHandler
);
