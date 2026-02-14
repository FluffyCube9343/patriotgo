import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import awsConfig from '../config/awsConfig';

let docClient;

export function getDynamoDocClient() {
  if (!awsConfig.enabled) {
    throw new Error('DynamoDB is disabled. Set EXPO_PUBLIC_ENABLE_DYNAMO=true to enable.');
  }

  if (!docClient) {
    const baseClient = new DynamoDBClient({
      region: awsConfig.region,
      endpoint: awsConfig.endpoint || undefined,
      credentials: awsConfig.credentials,
    });

    docClient = DynamoDBDocumentClient.from(baseClient, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  return docClient;
}

export const chatTableName = awsConfig.tableName;
export const isDynamoEnabled = awsConfig.enabled;
export const dynamoRegion = awsConfig.region;
export const dynamoEndpoint = awsConfig.endpoint;
export const ridesTableName = awsConfig.ridesTableName;
