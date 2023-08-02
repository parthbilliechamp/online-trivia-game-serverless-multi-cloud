import json
import boto3

dynamodb = boto3.client('dynamodb')

def hello(event, context):
    user_attributes = event['request']['userAttributes']
    
    # Extract the user properties
    user_id = user_attributes['sub']
    user_email = user_attributes['email']
    user_name = user_attributes['name']
    user_contact = user_attributes['phone_number']
    
    # Create a new item in DynamoDB
    response = dynamodb.put_item(
        TableName='UserProfile',
        Item={
            'Email': {'S': user_email},
            'UserId': {'S': user_id},
            'Name': {'S': user_name},
            'Contact': {'S': user_contact},
            'Status' : {'S': '0'}
        }
    )
    
    return event
