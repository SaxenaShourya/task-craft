"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { CreateBoardSchema, InputType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: {
        title: "Unauthorized",
        description:
          "You must be logged in to create a board. Please sign in to your account or create a new one if you haven't already.",
      },
    };
  }

  const { title, image } = data;

  const validatedFields = CreateBoardSchema.safeParse({ title, image });
  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Check if the board limit is exceeded
    const boardCount = await db.board.count({ where: { orgId } });
    if (boardCount >= 4) {
      return {
        error: {
          title: "Board limit exceeded",
          description:
            "You have reached the maximum number of boards allowed. Please upgrade your account or delete an existing board to create a new one.",
        },
      };
    }

    const board = await db.board.create({
      data: {
        title,
        orgId,
        imageId: image.id,
        imageThumbUrl: image.urls.thumb,
        imageFullUrl: image.urls.full,
        imageAuthor: image.author,
        imageLinkHtml: image.links.html,
      },
    });

    await createAuditLog({
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      entityTitle: board.title,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: {
        title: "Failed to create board.",
        description:
          "An unexpected error occurred while creating the board. Please try again later.",
      },
    };
  }

  revalidatePath(`/organization/${orgId}`);
  return {
    data: {
      success: "Board created successfully!",
      description:
        "Your new board has been created and is now ready for use. You can start adding lists and cards to organize your tasks and projects.",
    },
  };
};

export const createBoard = createSafeAction(CreateBoardSchema, handler);

export async function getBoards() {
  const { orgId } = auth();

  if (!orgId) {
    return {
      error: {
        title: "Unauthorized",
        description:
          "You must be logged in to create a board. Please sign in to your account or create a new one if you haven't already.",
      },
    };
  }

  try {
    const boards = await db.board.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
    });

    return { boards };
  } catch (error) {
    return {
      error: {
        title: "Failed to fetch boards",
        description:
          "An unexpected error occurred while fetching the boards. Please try again later.",
      },
    };
  }
}
