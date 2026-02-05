import { prisma } from '../../config/index.js';

export async function logActivity(
  entityType: string,
  entityId: string,
  action: string,
  userId?: string | null,
  metadata?: Record<string, unknown>
) {
  await prisma.activityLog.create({
    data: {
      entityType,
      entityId,
      action,
      userId: userId ?? null,
      metadata: metadata ?? undefined,
    },
  });
}
