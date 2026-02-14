// AWS + DynamoDB configuration used by the chat data layer.
// For Expo apps, supply these values via env variables prefixed with EXPO_PUBLIC_*
// to avoid hard-coding secrets in source. Example:
// EXPO_PUBLIC_ENABLE_DYNAMO=true
// EXPO_PUBLIC_AWS_REGION=us-east-1
// EXPO_PUBLIC_CHAT_TABLE=PatriotGoChatMessages
// EXPO_PUBLIC_DYNAMO_ENDPOINT=http://localhost:8000 (optional for local Dynamo)
// Avoid shipping long-lived AWS keys in the client; use Cognito or short-lived tokens.

const awsConfig = {
  enabled: process.env.EXPO_PUBLIC_ENABLE_DYNAMO === 'true',
  region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
  tableName: process.env.EXPO_PUBLIC_CHAT_TABLE || 'PatriotGoChatMessages',
  ridesTableName: process.env.EXPO_PUBLIC_RIDES_TABLE || 'PatriotGoRides',
  endpoint: process.env.EXPO_PUBLIC_DYNAMO_ENDPOINT,
  // Client-side credentials are not recommended. Prefer Cognito/Federation.
  // These are provided only for development/local testing.
  credentials:
    process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID &&
    process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
};

export default awsConfig;
