#!/usr/bin/env node
/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import {
  DynamoDBClient,
  BatchWriteItemCommand,
  ScanCommand,
  type ScanCommandOutput,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { ulid } from "ulid";

type Sentiment = "happy" | "sad" | "neutral" | "angry";

interface NoteItem {
  id: string;
  text: string;
  sentiment: Sentiment;
  dateCreated: string;
}

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "Notes";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const SEED_COUNT = Number(process.env.SEED_COUNT || 50);

const ddb = new DynamoDBClient({ region: AWS_REGION });

function randomSentiment(): Sentiment {
  const arr: Sentiment[] = ["happy", "sad", "neutral", "angry"];
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeNote(): NoteItem {
  return {
    id: ulid(),
    text: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
    sentiment: randomSentiment(),
    dateCreated: new Date(faker.date.recent({ days: 14 })).toISOString(),
  };
}

async function clearTableAll(): Promise<number> {
  let lastEvaluatedKey: Record<string, AttributeValue> | undefined = undefined;
  let deleted = 0;

  console.log(`🗑️  Clearing table ${TABLE_NAME}...`);

  do {
    const scanOut: ScanCommandOutput = await ddb.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        ProjectionExpression: "#id",
        ExpressionAttributeNames: { "#id": "id" },
        ExclusiveStartKey: lastEvaluatedKey,
        Limit: 1000,
      })
    );

    const items = scanOut.Items ?? [];
    if (items.length > 0) {
      // borrar en lotes de 25
      for (let i = 0; i < items.length; i += 25) {
        const chunk = items.slice(i, i + 25);
        const requestItems = {
          [TABLE_NAME]: chunk.map((key: Record<string, AttributeValue>) => ({
            DeleteRequest: { Key: key },
          })),
        };
        await ddb.send(
          new BatchWriteItemCommand({
            RequestItems: requestItems,
          })
        );
      }
      deleted += items.length;
      console.log(`   - Deleted ${deleted} so far...`);
    }

    lastEvaluatedKey = scanOut.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  console.log(`✅ Table cleared (${deleted} items)`);
  return deleted;
}

async function seedNotes(n: number): Promise<void> {
  console.log(`🌱 Seeding ${n} notes into ${TABLE_NAME}...`);
  const notes: NoteItem[] = Array.from({ length: n }, makeNote);

  for (let i = 0; i < notes.length; i += 25) {
    const batch = notes.slice(i, i + 25);
    const requestItems = {
      [TABLE_NAME]: batch.map((note: NoteItem) => ({
        PutRequest: { Item: marshall(note) },
      })),
    };
    await ddb.send(
      new BatchWriteItemCommand({
        RequestItems: requestItems,
      })
    );
  }

  const stats = notes.reduce<Record<Sentiment, number>>(
    (acc, n) => {
      acc[n.sentiment] = (acc[n.sentiment] || 0) + 1;
      return acc;
    },
    { happy: 0, sad: 0, neutral: 0, angry: 0 }
  );

  console.log(
    `✅ Seeded ${n}. Stats -> 😊 ${stats.happy} 😢 ${stats.sad} 😐 ${stats.neutral} 😠 ${stats.angry}`
  );
}

async function main() {
  try {
    console.log("🚀 Start seeding\n");
    await clearTableAll();
    await seedNotes(SEED_COUNT);
    console.log("\n🎉 Done");
  } catch (e) {
    console.error("❌ Failed:", e);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { makeNote, seedNotes, clearTableAll };
