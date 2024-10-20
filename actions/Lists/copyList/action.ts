"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, CopyListSchema } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const copyListHandler = async (data: InputType) => {
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
    const listToCopy = await db.list.findUnique({
      where: { id, board: { orgId } },
      include: { cards: true },
    });

    if (!listToCopy) {
      return {
        error: {
          title: "List not found",
          description: "The specified list does not exist or you don't have access to it.",
        },
      };
    }

    const existingListsCount = await db.list.count({
      where: { boardId },
    });

    if (existingListsCount >= 5) {
      return {
        error: {
          title: "List limit reached",
          description: "You can only create a maximum of 4 lists per board.",
        },
      };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = (lastList?.order || 0) + 1;

    const copiedList = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        cards: {
          create: listToCopy.cards.map(card => ({
            title: card.title,
            description: card.description,
            order: card.order,
          })),
        },
      },
      include: { cards: true },
    });

    await createAuditLog({
      entityId: copiedList.id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: copiedList.title,
      action: ACTION.CREATE,
    });

    revalidatePath(`/board/${boardId}`);
    return { data: copiedList };
  } catch (error) {
    console.error("Error copying list:", error);
    return {
      error: {
        title: "Failed to copy list",
        description: "An unexpected error occurred while copying the list. Please try again later.",
      },
    };
  }
};

export const copyList = createSafeAction(CopyListSchema, copyListHandler);