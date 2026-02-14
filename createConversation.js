import { v4 as uuid } from "uuid"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb"
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
    // must be logged in
    getAuthUserId(event)

    const { members, rideId } = parseBody(event)
    if (!Array.isArray(members) || members.length < 2) {
      return error("members must be an array of 2+ userIds")
    }

    const now = Date.now()
    const isDM = members.length === 2 && !rideId

    const conversationId = isDM
      ? `dm#${[members[0], members[1]].sort().join("#")}`
      : `conv_${uuid()}`

    // If DM exists already, return it
    if (isDM) {
      const existing = await ddb.send(new GetCommand({
        TableName: "Conversations",
        Key: { conversationId }
      }))
      if (existing.Item) return success(existing.Item)
    }

    const convo = {
      conversationId,
      type: members.length === 2 ? "dm" : "group",
      members,
      rideId: rideId || null,
      createdAt: now,
      lastMessageAt: now,
      lastMessagePreview: ""
    }

    await ddb.send(new PutCommand({ TableName: "Conversations", Item: convo }))

    // Membership rows
    for (const userId of members) {
      // Access row (used for auth checks)
      await ddb.send(new PutCommand({
        TableName: "ConversationMembers",
        Item: { userId, sk: `access#${conversationId}`, conversationId, rideId: rideId || null }
      }))

      // Ordering/preview row (used for inbox sorting)
      await ddb.send(new PutCommand({
        TableName: "ConversationMembers",
        Item: {
          userId,
          sk: `${now}#${conversationId}`,
          conversationId,
          rideId: rideId || null,
          lastMessagePreview: ""
        }
      }))
    }

    return success(convo, 201)
  } catch (e) {
    return error(e.message || "Unauthorized", 401)
  }
}
