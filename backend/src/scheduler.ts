// src/scheduler.ts
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { SummaryService } from './services/summary.service';
import { pullSlackMessages } from './services/slack.service';
import { pullLineMessages } from './services/line.service';
import { pullGmailMessages } from './services/email.service';

const prisma = new PrismaClient();

/** Initialise cron jobs for users with summaryEnabled */
export async function initScheduler() {
  const users = await prisma.user.findMany({
    where: { summaryEnabled: true },
    select: { id: true, summaryTime: true, summaryFrequency: true },
  });

  for (const user of users) {
    // Pull external messages before scheduling summary
    try {
      await Promise.all([
        pullSlackMessages(user.id),
        pullLineMessages(user.id),
        pullGmailMessages(user.id),
      ]);
    } catch (e) {
      console.error(`Failed to pull messages for user ${user.id}:`, e);
    }

    if (!user.summaryTime) continue;
    const [hourStr, minuteStr] = user.summaryTime.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const frequency = user.summaryFrequency || 1;

    const scheduleAt = (h: number, m: number) => {
      const cronExp = `${m} ${h} * * *`;
      cron.schedule(cronExp, async () => {
        console.log(`🕒 Running summary for user ${user.id} at ${h}:${m}`);
        try {
          await SummaryService.generateAndStore(user.id);
        } catch (err) {
          console.error('❌ Summary generation failed', err);
        }
      });
    };

    scheduleAt(hour, minute);
    if (frequency > 1) {
      const intervalHours = Math.floor(24 / frequency);
      for (let i = 1; i < frequency; i++) {
        const extraHour = (hour + i * intervalHours) % 24;
        scheduleAt(extraHour, minute);
      }
    }
  }

  console.log('✅ Scheduler initialised for', users.length, 'users');
}

import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { SummaryService } from './services/summary.service';
import { pullSlackMessages } from './services/slack.service';
import { pullLineMessages } from './services/line.service';
import { pullGmailMessages } from './services/email.service';

const prisma = new PrismaClient();

/** Initialise cron jobs for users with summaryEnabled */
export async function initScheduler() {
  const users = await prisma.user.findMany({
    where: { summaryEnabled: true },
    select: { id: true, summaryTime: true, summaryFrequency: true },
  });

  for (const user of users) {
    // Pull external messages before scheduling summary
    try {
      await Promise.all([
        pullSlackMessages(user.id),
        pullLineMessages(user.id),
        pullGmailMessages(user.id),
      ]);
    } catch (e) {
      console.error(`Failed to pull messages for user ${user.id}:`, e);
    }

    if (!user.summaryTime) continue;
    const [hourStr, minuteStr] = user.summaryTime.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const frequency = user.summaryFrequency || 1;

    const scheduleAt = (h: number, m: number) => {
      const cronExp = `${m} ${h} * * *`;
      cron.schedule(cronExp, async () => {
        console.log(`🕒 Running summary for user ${user.id} at ${h}:${m}`);
        try {
          await SummaryService.generateAndStore(user.id);
        } catch (err) {
          console.error('❌ Summary generation failed', err);
        }
      });
    };

    scheduleAt(hour, minute);
    if (frequency > 1) {
      const intervalHours = Math.floor(24 / frequency);
      for (let i = 1; i < frequency; i++) {
        const extraHour = (hour + i * intervalHours) % 24;
        scheduleAt(extraHour, minute);
      }
    }
  }

  console.log('✅ Scheduler initialised for', users.length, 'users');
}



const prisma = new PrismaClient();

/** Initialise cron jobs for users with summaryEnabled */
export async function initScheduler() {
  const users = await prisma.user.findMany({
    where: { summaryEnabled: true },
    select: { id: true, summaryTime: true, summaryFrequency: true },
  });

  for (const user of users) {
    if (!user.summaryTime) continue;
    const [hourStr, minuteStr] = user.summaryTime.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const frequency = user.summaryFrequency || 1;

    const scheduleAt = (h: number, m: number) => {
      const cronExp = `${m} ${h} * * *`;
      cron.schedule(cronExp, async () => {
        console.log(`🕒 Running summary for user ${user.id} at ${h}:${m}`);
        try {
          await SummaryService.generateAndStore(user.id);
        } catch (err) {
          console.error('❌ Summary generation failed', err);
        }
      });
    };

    scheduleAt(hour, minute);
    if (frequency > 1) {
      const intervalHours = Math.floor(24 / frequency);
      for (let i = 1; i < frequency; i++) {
        const extraHour = (hour + i * intervalHours) % 24;
        scheduleAt(extraHour, minute);
      }
    }
  }

  console.log('✅ Scheduler initialised for', users.length, 'users');
}
