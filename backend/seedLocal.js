/**
 * Seed DynamoDB Local with sample chat messages.
 *
 * Usage:
 *   DYNAMO_ENDPOINT=http://localhost:8000 node backend/seedLocal.js
 *
 * Env vars:
 *   DYNAMO_ENDPOINT (default http://localhost:8000)
 *   AWS_REGION      (default us-east-1)
 *   CHAT_TABLE      (default PatriotGoChatMessages)
 */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const endpoint = process.env.DYNAMO_ENDPOINT || 'http://localhost:8000';
const region = process.env.AWS_REGION || 'us-east-1';
const tableName = process.env.CHAT_TABLE || 'PatriotGoChatMessages';

const baseClient = new DynamoDBClient({ region, endpoint });
const docClient = DynamoDBDocumentClient.from(baseClient, {
  marshallOptions: { removeUndefinedValues: true },
});

const seedData = [
  {
    roomId: 'room-1',
    sender: 'driver-1',
    body: "Yo! I'm parked near the Rappahannock deck entrance. Look for the silver Tesla.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    roomId: 'room-1',
    sender: 'student-demo',
    body: 'Got it, crossing the street now! See ya in a sec.',
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    roomId: 'room-2',
    sender: 'driver-2',
    body: 'On Johnson Center side, wearing a green cap.',
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
];

async function seed() {
  for (const item of seedData) {
    const putItem = {
      ...item,
      id: `${item.roomId}-${item.createdAt}`,
    };
    await docClient.send(new PutCommand({ TableName: tableName, Item: putItem }));
    console.log('Inserted', putItem.id);
  }
}

seed()
  .then(() => {
    console.log('Seed complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed failed', err);
    process.exit(1);
  });
