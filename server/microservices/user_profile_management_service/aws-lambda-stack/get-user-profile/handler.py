import boto3
import json

def hello(event, context):
    email = event['queryStringParameters']['email']

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('UserProfile')

    response = table.get_item(Key={'Email': email})

    if 'Item' in response:
        user_profile = response['Item']
        return {
            'statusCode': 200,
            'body': json.dumps(user_profile)
        }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps('User not found')
        }