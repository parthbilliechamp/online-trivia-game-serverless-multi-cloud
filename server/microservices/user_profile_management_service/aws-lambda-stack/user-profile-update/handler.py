import boto3
import json

def hello(event, context):
    request_body = json.loads(event['body'])
    email = request_body['email']

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('UserProfile')

    response = table.update_item(
        Key={'Email': email},
        UpdateExpression='SET #Contact = :val1, #Name = :val2',
        ExpressionAttributeNames={
            '#Contact': 'Contact',
            '#Name': 'Name'
        },
        ExpressionAttributeValues={
            ':val1': request_body['contact'],
            ':val2': request_body['name'],
        }
    )

    return {
        'statusCode': 200,
        
        'body': json.dumps(response)
    }
