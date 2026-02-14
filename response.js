export const success = (data) => ({
  statusCode: 200,
  body: JSON.stringify(data)
})

export const error = (msg, code = 400) => ({
  statusCode: code,
  body: JSON.stringify({ error: msg })
})
