import { prisma } from '../../config/index.js';

export async function getStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const [totalPatients, appointmentsToday, appointmentsScheduled, completedCount, pendingCount] = await Promise.all([
    prisma.patient.count(),
    prisma.appointment.count({
      where: {
        date: { gte: today, lt: todayEnd },
      },
    }),
    prisma.appointment.count({
      where: {
        date: { gte: today },
        status: 'Scheduled',
      },
    }),
    prisma.appointment.count({
      where: { status: 'Completed' },
    }),
    prisma.appointment.count({
      where: {
        date: { gte: today },
        status: { in: ['Scheduled', 'Ongoing'] },
      },
    }),
  ]);

  return {
    totalPatients,
    appointmentsToday,
    pendingCount,
    completedCount,
    upcomingScheduled: appointmentsScheduled,
    trends: {
      patients: 'up' as const,
      appointments: 'up' as const,
    },
  };
}

export async function getRecentActivity(limit = 20) {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  const activities = logs.map((log) => ({
    id: log.id,
    entity_type: log.entityType,
    entity_id: log.entityId,
    action: log.action,
    metadata: log.metadata,
    created_at: log.createdAt.toISOString(),
    description: formatDescription(log),
  }));

  return { activities };
}

function formatDescription(log: { entityType: string; action: string; metadata: unknown }): string {
  const meta = log.metadata as { name?: string } | null;
  const name = meta?.name ?? 'Unknown';
  switch (log.action) {
    case 'created':
      return log.entityType === 'patient'
        ? `New patient registered: ${name}`
        : `New appointment for ${name}`;
    case 'updated':
      return `${log.entityType} updated: ${name}`;
    case 'deleted':
      return `${log.entityType} deleted`;
    default:
      return `${log.action} on ${log.entityType}`;
  }
}
