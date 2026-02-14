import jwt from "jsonwebtoken"

export function getAuthUserId(event) {
  const headers = event?.headers || {}
  const auth = headers.Authorization || headers.authorization
  if (!auth) throw new Error("Missing Authorization header")

  const m = auth.match(/^Bearer\s+(.+)$/i)
  if (!m) throw new Error("Authorization must be: Bearer <token>")

  const token = m[1]
  const payload = jwt.verify(token, process.env.JWT_SECRET)

  if (!payload?.userId) throw new Error("Invalid token payload")
  return payload.userId
}
