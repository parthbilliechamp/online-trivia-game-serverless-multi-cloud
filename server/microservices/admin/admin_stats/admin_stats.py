import json
import boto3
import time

REGION = 'us-east-1'
ATHENA_DB = 'trivia_quiz_etl_db'
ATHENA_VIEW = 'admin_stats'  #view for admin stats
S3_OUTPUT_PATH = 's3://glue-etl-target-trivia-game/adminresults/'

def lambda_handler(event, context):
    athena_client = boto3.client('athena')
    
    #Query for admin stats
    queryStart = athena_client.start_query_execution(
        QueryString = 'SELECT * FROM ' + ATHENA_VIEW,
        QueryExecutionContext = {
            'Database': ATHENA_DB
        }, 
        ResultConfiguration = { 'OutputLocation': S3_OUTPUT_PATH}
    )
    #https://docs.aws.amazon.com/athena/latest/ug/querying-athena-tables.html
    #SQL Query in Athena
    
    queryExecution = athena_client.get_query_execution(QueryExecutionId=queryStart['QueryExecutionId'])
    
    while queryExecution['QueryExecution']['Status']['State'] not in ['SUCCEEDED', 'FAILED', 'CANCELLED']:
        queryExecution = athena_client.get_query_execution(QueryExecutionId=queryStart['QueryExecutionId'])
        time.sleep(2)
    
    result_response = athena_client.get_query_results(QueryExecutionId=queryStart['QueryExecutionId'])
    result_data = result_response['ResultSet']['Rows'][1:]
        
    admin_stats = {}
    for row in result_data:
        column_name = row['Data'][0]['VarCharValue']
        column_value = row['Data'][1]['VarCharValue']
        admin_stats[column_name] = column_value

    print("Admin Stats:")
    print(admin_stats)
    # returning the Status
    return {
        'statusCode': 200,
        'body': json.dumps({'admin_stats': admin_stats})
    }
