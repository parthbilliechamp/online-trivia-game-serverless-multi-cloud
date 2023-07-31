import json
import boto3

def hello(event, context):
    query_params = event['queryStringParameters']
    
    team_name = query_params.get('team_name')
    
    if not team_name:
        return {
            'statusCode': 400,
            'body': json.dumps('team_name query parameter is required.')
        }
    
    dynamodb = boto3.resource('dynamodb')
    table_name = 'Team_Stats' 
    table = dynamodb.Table(table_name)
    
    try:
        response = table.get_item(Key={'team_name': team_name})
        item = response.get('Item')
        
        if item:
            return {
                'statusCode': 200,
                'body': json.dumps(item)
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps('Team not found.')
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error reading data: {str(e)}')
        }

