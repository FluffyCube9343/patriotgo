## DynamoDB setup for chat

Table schema (`PatriotGoChatMessages` by default):
- Partition key: `roomId` (string)
- Sort key: `createdAt` (string, ISO timestamp)
- Attributes stored: `id`, `roomId`, `sender`, `body`, `createdAt`

### Create the table (AWS CLI)
```bash
aws dynamodb create-table \
  --table-name PatriotGoChatMessages \
  --attribute-definitions AttributeName=roomId,AttributeType=S AttributeName=createdAt,AttributeType=S \
  --key-schema AttributeName=roomId,KeyType=HASH AttributeName=createdAt,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

For local testing with DynamoDB Local:
```bash
docker run -p 8000:8000 amazon/dynamodb-local
aws dynamodb create-table \
  --endpoint-url http://localhost:8000 \
  --table-name PatriotGoChatMessages \
  --attribute-definitions AttributeName=roomId,AttributeType=S AttributeName=createdAt,AttributeType=S \
  --key-schema AttributeName=roomId,KeyType=HASH AttributeName=createdAt,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

Seed DynamoDB Local with sample messages:
```bash
DYNAMO_ENDPOINT=http://localhost:8000 node backend/seedLocal.js
```

### Minimal IAM policy
Attach a policy like this to the identity your app uses (prefer Cognito with short-lived creds):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:<region>:<account>:table/PatriotGoChatMessages"
    }
  ]
}
```

### App configuration
Set Expo env vars (e.g., in `.env` or `app.json` under `expo.extra`) before running:
```
EXPO_PUBLIC_ENABLE_DYNAMO=true
EXPO_PUBLIC_AWS_REGION=us-east-1
EXPO_PUBLIC_CHAT_TABLE=PatriotGoChatMessages
# For local only:
# EXPO_PUBLIC_DYNAMO_ENDPOINT=http://localhost:8000
# Temporary dev credentials only (avoid for prod):
# EXPO_PUBLIC_AWS_ACCESS_KEY_ID=...
# EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY=...
```

Restart the Metro server after changing env vars so the client can read them. Avoid shipping long-lived AWS keys in the bundle—use Cognito or an API layer in production.
