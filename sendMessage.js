import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  GetCommand
} from "@aws-sdk/lib-dynamodb"
import { success, error } from "../utils/response.js"
import { getAuthUserId } from "../utils/auth.js"

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

function parseBody(event) {
  if (!event) return {}
  if (typeof event === "string") { try { return JSON.parse(event) } catch { return {} } }
  if (event.body && typeof event.body === "object") return event.body
  if (typeof event.body === "string") { try { return JSON.parse(event.body) } catch { return {} } }
  return {}
}

export const handler = async (event) => {
  try {
    const senderId = getAuthUserId(event)
    const { conversationId, text } = parseBody(event)

    if (!conversationId || !text) return error("conversationId, text required")

    // membership check
    const access = await ddb.send(new GetCommand({
      TableName: "ConversationMembers",
      Key: { userId: senderId, sk: `access#${conversationId}` }
    }))
    if (!access.Item) return error("Not a member of this conversation", 403)

    const ts = Date.now()
    const msg = { conversationId, ts, senderId, text, type: "text" }

    await ddb.send(new PutCommand({ TableName: "Messages", Item: msg }))

    // Update conversation preview
    await ddb.send(new UpdateCommand({
      TableName: "Conversations",
      Key: { conversationId },
      UpdateExpression: "SET lastMessageAt = :t, lastMessagePreview = :p",
      ExpressionAttributeValues: { ":t": ts, ":p": text.slice(0, 80) }
    }))

    // Get members so we can update their inbox rows
    const convoRes = await ddb.send(new GetCommand({
      TableName: "Conversations",
      Key: { conversationId }
    }))
    const members = convoRes.Item?.members || []

    for (const userId of members) {
      // ensure access row exists
      await ddb.send(new PutCommand({
        TableName: "ConversationMembers",
        Item: { userId, sk: `access#${conversationId}`, conversationId, rideId: convoRes.Item?.rideId || null }
      }))

      // new ordering row (latest at top)
      await ddb.send(new PutCommand({
        TableName: "ConversationMembers",
        Item: {
          userId,
          sk: `${ts}#${conversationId}`,
          conversationId,
          rideId: convoRes.Item?.rideId || null,
          lastMessagePreview: text.slice(0, 80)
        }
      }))
    }

    return success(msg, 201)
  } catch (e) {
    return error(e.message || "Unauthorized", 401)
  }
}
