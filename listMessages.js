import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb"
import { success, error } from "../utils/response.js"
import { getAuthUserId } from "../utils/auth.js"

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler = async (event) => {
  try {
    const userId = getAuthUserId(event)

    const qs = event.queryStringParameters || {}
    const conversationId = qs.conversationId
    const limit = qs.limit ? Number(qs.limit) : 30
    const after = qs.after ? Number(qs.after) : null

    if (!conversationId) return error("conversationId required")

    const access = await ddb.send(new GetCommand({
      TableName: "ConversationMembers",
      Key: { userId, sk: `access#${conversationId}` }
    }))
    if (!access.Item) return error("Not a member of this conversation", 403)

    const params = {
      TableName: "Messages",
      KeyConditionExpression: "conversationId = :c",
      ExpressionAttributeValues: { ":c": conversationId },
      ScanIndexForward: true,
      Limit: limit
    }

    if (after) {
      params.KeyConditionExpression = "conversationId = :c AND ts > :after"
      params.ExpressionAttributeValues[":after"] = after
    }

    const res = await ddb.send(new QueryCommand(params))
    return success({ items: res.Items || [] })
  } catch (e) {
    return error(e.message || "Unauthorized", 401)
  }
}
