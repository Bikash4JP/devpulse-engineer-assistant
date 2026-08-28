// src/services/slack.service.ts
import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "../utils/crypto";

const prisma = new PrismaClient();

export async function getSlackClient(userId: number): Promise<WebClient> {
  const cred = await prisma.credential.findFirst({
    where: { userId: String(userId), provider: "SLACK" },
  });
  if (!cred) throw new Error("Slack not linked for user");
  const token = decrypt(cred.accessToken);
  return new WebClient(token);
}

export async function pullSlackMessages(userId: number) {
  const client = await getSlackClient(userId);
  // List channels the bot is a member of
  const channelsRes = await client.conversations.list({ types: "public_channel,private_channel" as any });
  const channels = channelsRes.channels ?? [];
  for (const ch of channels) {
    const history = await client.conversations.history({ channel: ch.id as string, limit: 200 });
    for (const msg of history.messages ?? []) {
      const existing = await prisma.message.findFirst({
        where: {
          userId: String(userId),
          source: "SLACK",
          externalId: msg.ts as string,
        },
      });
      if (!existing) {
        await prisma.message.create({
          data: {
            userId: String(userId),
            source: "SLACK",
            channelId: ch.id,
            externalId: msg.ts as string,
            content: (msg.text ?? "").toString(),
          },
        });
      }
    }
  }
}
