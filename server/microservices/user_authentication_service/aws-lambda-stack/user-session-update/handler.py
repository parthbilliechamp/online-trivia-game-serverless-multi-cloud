import json
import boto3

def hello(event, context):
    request_body = json.loads(event['body'])
    
    status = request_body.get('status')
    email = request_body.get('email')
    
    if not status or not email:
        return {
            'statusCode': 400,
            'body': json.dumps('Both status and email properties are required in the request body.')
        }
    
    
    dynamodb = boto3.resource('dynamodb')
    table_name = 'UserProfile'
    table = dynamodb.Table(table_name)
    
   
    try:
        table.update_item(
            Key={
                'Email': email
            },
            UpdateExpression='SET #stateAttr = :stateValue',
            ExpressionAttributeNames={
                '#stateAttr': 'State'
            },
            ExpressionAttributeValues={
                ':stateValue': status
            }
        )
        return {
            'statusCode': 200,
            'body': json.dumps('Status updated successfully.')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error updating status: {str(e)}')
        }
