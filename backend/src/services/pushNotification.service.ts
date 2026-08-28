// src/services/pushNotification.service.ts
import { PrismaClient, User } from '@prisma/client';
import { env } from '../config/env';

const prisma = new PrismaClient();

export class PushNotificationService {
  /**
   * Send a push notification to the user's device indicating the summary PDF is ready.
   * This placeholder uses console.log; replace with AWS SNS, Expo, or Firebase as needed.
   */
  static async sendSummaryReady(userId: string, summaryDate: Date, s3Key: string): Promise<void> {
    // Retrieve user push token (assumes a `pushToken` field on User; adjust if different)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const pushToken = (user as any).pushToken;
    if (!pushToken) {
      console.warn(`User ${userId} has no push token – skipping notification.`);
      return;
    }
    const message = {
      to: pushToken,
      title: 'Your daily summary is ready',
      body: `Tap to download the PDF for ${summaryDate.toDateString()}.`,
      data: { s3Key },
    };
    // Placeholder: log the message. Integrate with actual push provider here.
    console.log('Push notification payload:', JSON.stringify(message, null, 2));
    // e.g., await expoPushClient.sendPushNotificationsAsync([message]);
  }
}
