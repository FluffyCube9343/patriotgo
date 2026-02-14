import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { success, error } from "../utils/response.js"
import { getAuthUserId } from "../utils/auth.js"

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler = async (event) => {
  try {
    const userId = getAuthUserId(event)
    const limit = event.queryStringParameters?.limit ? Number(event.queryStringParameters.limit) : 30

    const res = await ddb.send(new QueryCommand({
      TableName: "ConversationMembers",
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: { ":u": userId },
      ScanIndexForward: false,
      Limit: limit
    }))

    // remove access rows (we only want preview/order rows)
    const items = (res.Items || []).filter(x => !(x.sk || "").startsWith("access#"))

    return success({ items })
  } catch (e) {
    return error(e.message || "Unauthorized", 401)
  }
}
