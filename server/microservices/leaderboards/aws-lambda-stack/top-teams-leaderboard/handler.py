import json
import boto3
import time

REGION = 'us-east-1'
ATHENA_DB = 'trivia_quiz_etl_db'
ATHENA_VIEW = 'top_teams'
S3_OUTPUT_PATH = 's3://glue-etl-target-trivia-game/topteams/'

def hello(event, context):
    athena_client = boto3.client('athena')
    
    queryStart = athena_client.start_query_execution(
    QueryString = 'SELECT team_name FROM ' + ATHENA_VIEW + ' LIMIT 5',
    QueryExecutionContext = {
        'Database': ATHENA_DB
    }, 
    ResultConfiguration = { 'OutputLocation': S3_OUTPUT_PATH}
    )
    
    queryExecution = athena_client.get_query_execution(QueryExecutionId=queryStart['QueryExecutionId'])
    
    while queryExecution['QueryExecution']['Status']['State'] not in ['SUCCEEDED', 'FAILED', 'CANCELLED']:
        queryExecution = athena_client.get_query_execution(QueryExecutionId=queryStart['QueryExecutionId'])
    
    result_response = athena_client.get_query_results(QueryExecutionId=queryStart['QueryExecutionId'])
    result_data = result_response['ResultSet']['Rows'][1:]
        
    team_names = [row['Data'][0]['VarCharValue'] for row in result_data]
    print("Team names:")
    print(team_names)
    
    return {
        'statusCode': 200,
        'body': json.dumps({'team_names': team_names})
    }

