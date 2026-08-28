// src/services/activityTracker.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ActivityTrackerService {
  /**
   * Record activity count for a given user and app for the current hour.
   * If a record for the same hour already exists, it increments the count.
   */
  static async recordActivity(userId: string, appName: string, count: number = 1): Promise<void> {
    // Round timestamp to the start of the hour
    const now = new Date();
    now.setMinutes(0, 0, 0);

    // Try to find existing record for this hour
    const existing = await prisma.hourlyActivity.findFirst({
      where: {
        userId,
        appName,
        activityTimestamp: now,
      },
    });

    if (existing) {
      // Increment the count
      await prisma.hourlyActivity.update({
        where: { id: existing.id },
        data: { count: { increment: count } },
      });
    } else {
      // Create a new record
      await prisma.hourlyActivity.create({
        data: {
          userId,
          appName,
          activityTimestamp: now,
          count,
        },
      });
    }
  }
}
