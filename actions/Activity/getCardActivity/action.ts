"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

export async function getRecentCardActivity(cardId: string) {
  const { orgId } = auth();

  if (!orgId) {
    return null;
  }

  const activity = await db.auditLog.findFirst({
    where: {
      entityId: cardId,
      entityType: ENTITY_TYPE.CARD,
      action: {
        in: [ACTION.CREATE, ACTION.UPDATE],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      action: true,
      createdAt: true,
      userImage: true,
      userName: true,
      entityTitle: true,
      entityType: true,
    },
  });

  return activity;
}
