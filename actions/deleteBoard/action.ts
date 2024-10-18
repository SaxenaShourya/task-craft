"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, DeleteBoardSchema } from "./types";

const deleteBoardHandler = async (data: InputType) => {
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

  const { id } = data;
  const validatedFields = DeleteBoardSchema.safeParse({ id });
  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db.board.delete({
      where: { id, orgId },
    });

    revalidatePath(`/organization/${orgId}`);
    return { data: { success: true } };
  } catch (error) {
    console.error("Error deleting board:", error);
    return {
      error: {
        title: "Failed to delete board",
        description:
          "An unexpected error occurred while deleting the board. Please try again later.",
      },
    };
  }
};

export const deleteBoard = createSafeAction(
  DeleteBoardSchema,
  deleteBoardHandler
);
