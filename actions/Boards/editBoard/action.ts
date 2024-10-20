"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, UpdateBoardSchema } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

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
    const existingBoard = await db.board.findUnique({
      where: { id, orgId },
    });

    if (!existingBoard) {
      return {
        error: {
          title: "Board not found",
          description:
            "The specified board does not exist or you don't have access to it.",
        },
      };
    }

    if (existingBoard.title === title) {
      return {
        error: {
          title: "No changes detected",
          description: "The new title is the same as the current title.",
        },
      };
    }

    const updatedBoard = await db.board.update({
      where: { id, orgId },
      data: { title },
    });

    await createAuditLog({
      entityId: updatedBoard.id,
      entityType: ENTITY_TYPE.BOARD,
      entityTitle: updatedBoard.title,
      action: ACTION.UPDATE,
    });

    revalidatePath(`/board/${id}`);
    return { data: updatedBoard };
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
