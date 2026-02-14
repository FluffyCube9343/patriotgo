import { v4 as uuid } from "uuid"
import jwt from "jsonwebtoken"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { success, error } from "../utils/response.js"

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

function parseBody(event) {
  if (!event) return {}

  // Serverless invoke sometimes passes event as a string
  if (typeof event === "string") {
    // Try JSON first
    try {
      return JSON.parse(event)
    } catch {
      // Fallback: parse formats like "{ email:tejas@gmu.edu, name:Tejas }"
      const cleaned = event
        .trim()
        .replace(/^\{|\}$/g, "") // remove { }
      const pairs = cleaned.split(",").map(s => s.trim())
      const obj = {}
      for (const p of pairs) {
        const [k, v] = p.split(":").map(s => s.trim())
        if (k && v) obj[k] = v
      }
      return obj
    }
  }

  // If invoked directly with { email, name }
  if (typeof event.email === "string" || typeof event.name === "string") {
    return event
  }

  // If body is already an object
  if (event.body && typeof event.body === "object") {
    return event.body
  }

  // Normal API Gateway body (string, maybe base64)
  const raw = event.body
  if (!raw) return {}

  const bodyStr = event.isBase64Encoded
    ? Buffer.from(raw, "base64").toString("utf-8")
    : raw

  try {
    return JSON.parse(bodyStr)
  } catch {
    return {}
  }
}

export const handler = async (event) => {
  const { email, name } = parseBody(event)

  if (!email || !name) return error("Missing email or name")
  if (!email.endsWith(".edu")) return error("Use school email")

  const user = {
    userId: uuid(),
    email,
    name,
    credits: 10,
    createdAt: Date.now()
  }

  await ddb.send(new PutCommand({
    TableName: "Users",
    Item: user
  }))

  const token = jwt.sign({ userId: user.userId }, "SECRET")

  return success({ token, user })
}


