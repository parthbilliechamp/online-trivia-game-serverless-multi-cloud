import json
import boto3

def hello(event, context):
    # Get the query parameters from the event
    query_params = event['queryStringParameters']
    
    # Extract the value of user_email from the query parameters
    user_email = query_params.get('user_email')
    
    # Validate that user_email is provided in the query parameters
    if not user_email:
        return {
            'statusCode': 400,
            'body': json.dumps('user_email query parameter is required.')
        }
    
    # Initialize the DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    table_name = 'UserStats'
    table = dynamodb.Table(table_name)
    
    # Read data from the DynamoDB table based on the user_email (partition key)
    try:
        response = table.get_item(Key={'user_email': user_email})
        item = response.get('Item')
        
        if item:
            return {
                'statusCode': 200,
                'body': json.dumps(item)
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps('User not found.')
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error reading data: {str(e)}')
        }
