// src/services/summary.service.ts
import { PrismaClient, User } from '@prisma/client';
import { AiService } from './ai.service';
import PDFDocument from 'pdfkit';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env';
import { PushNotificationService } from './pushNotification.service';

const prisma = new PrismaClient();

// Initialise S3 client with credentials from env
const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export class SummaryService {
  /**
   * Generate a daily summary PDF for a user, store it in S3, record the request,
   * and send a push notification.
   */
  static async generateAndStore(userId: string, summaryDate: Date = new Date()): Promise<string> {
    // 1️⃣ Retrieve activities for the specified day (UTC)
    const start = new Date(summaryDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const activities = await prisma.hourlyActivity.findMany({
      where: {
        userId,
        activityTimestamp: {
          gte: start,
          lt: end,
        },
      },
    });

    // 2️⃣ Build AI prompt with language preference (default English)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const language = (user as any).language || 'English';
    const prompt = `Generate a concise daily summary (max 1000 words) in ${language} for the following activity data:\n${JSON.stringify(
      activities,
      null,
      2
    )}`;

    // 3️⃣ Call Gemini via AiService (reuse generateReply as a simple wrapper)
    const aiResult = await AiService.generateReply(prompt);
    const summaryText = aiResult.reply;

    // 4️⃣ Create PDF buffer
    const pdfBuffer = await SummaryService.createPdfBuffer(summaryText);

    // 5️⃣ Upload PDF to S3
    const s3Key = `summaries/${userId}/${summaryDate.toISOString().split('T')[0]}.pdf`;
    await s3.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
      })
    );

    // 6️⃣ Record the request in the database
    await prisma.summaryRequest.create({
      data: {
        userId,
        summaryDate,
        s3Key,
        status: 'COMPLETED',
      },
    });

    // 7️⃣ Notify the user via push notification
    await PushNotificationService.sendSummaryReady(userId, summaryDate, s3Key);

    return s3Key;
  }

  private static createPdfBuffer(text: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(12).text(text, { lineGap: 2 });
      doc.end();
    });
  }
}
