import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { chatTableName, getDynamoDocClient, isDynamoEnabled } from './dynamoClient';

const FALLBACK_MESSAGES = [
  {
    id: 'demo-1',
    roomId: 'demo-room',
    sender: 'driver',
    body: "Yo! I'm parked near the Rappahannock deck entrance. Look for the silver Tesla.",
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'demo-2',
    roomId: 'demo-room',
    sender: 'me',
    body: 'Got it, crossing the street now! See ya in a sec.',
    createdAt: '2024-01-01T10:01:00Z',
  },
];

export async function listMessages(roomId, limit = 50) {
  if (!isDynamoEnabled) {
    return FALLBACK_MESSAGES.filter((m) => m.roomId === roomId);
  }

  const client = getDynamoDocClient();
  const response = await client.send(
    new QueryCommand({
      TableName: chatTableName,
      KeyConditionExpression: '#roomId = :roomId',
      ExpressionAttributeNames: { '#roomId': 'roomId' },
      ExpressionAttributeValues: { ':roomId': roomId },
      ScanIndexForward: true, // old -> new
      Limit: limit,
    }),
  );

  return response.Items || [];
}

export async function sendMessage(roomId, sender, body) {
  const createdAt = new Date().toISOString();
  const message = {
    id: `${roomId}-${createdAt}`,
    roomId,
    sender,
    body,
    createdAt,
  };

  if (!isDynamoEnabled) {
    return message;
  }

  const client = getDynamoDocClient();
  await client.send(
    new PutCommand({
      TableName: chatTableName,
      Item: message,
    }),
  );

  return message;
}

export async function pingDynamo(roomId = 'health-check') {
  if (!isDynamoEnabled) {
    return { ok: false, reason: 'disabled' };
  }

  const client = getDynamoDocClient();
  await client.send(
    new QueryCommand({
      TableName: chatTableName,
      KeyConditionExpression: '#roomId = :roomId',
      ExpressionAttributeNames: { '#roomId': 'roomId' },
      ExpressionAttributeValues: { ':roomId': roomId },
      Limit: 1,
    }),
  );

  return { ok: true };
}
