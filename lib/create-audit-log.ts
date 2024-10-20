import { auth, currentUser } from '@clerk/nextjs/server';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { db } from '@/lib/db';

interface CreateAuditLogProps {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

export const createAuditLog = async ({
  entityId,
  entityType,
  entityTitle,
  action,
}: CreateAuditLogProps): Promise<void> => {
    try {
        const { orgId } = auth();
        const user = await currentUser();

        if (!orgId) {
            throw new Error('Organization ID not found');
        }

        if (!user) {
            throw new Error('User not found');
        }

        await db.auditLog.create({
            data: {
                orgId,
                entityId,
                entityType,
                entityTitle,
                action,
                userId: user.id,
                userImage: user.imageUrl ?? '',
                userName: user.username ?? '',
            }
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        throw new Error('Failed to create audit log');
    }
};
