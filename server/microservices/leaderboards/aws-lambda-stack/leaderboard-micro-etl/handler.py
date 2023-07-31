import json
import boto3
import csv

def parse_teams_score(data):
    team_data = data["teams_score"]["L"]
    team_csv_data = []
    for team in team_data:
        team_info = team["M"]
        team_csv_data.append([
            data["game_id"]["S"],
            data["game_category"]["S"],
            data["game_date"]["S"],
            team_info["team_id"]["S"],
            team_info["team_name"]["S"],
            team_info["team_result"]["N"],
            team_info["team_score"]["N"]
        ])
    return team_csv_data

def parse_users_score(data):
    user_data = data["teams_score"]["L"]
    user_csv_data = []
    for team in user_data:
        users = team["M"]["users_score"]["L"]
        for user in users:
            user_info = user["M"]
            user_csv_data.append([
                data["game_id"]["S"],
                data["game_category"]["S"],
                data["game_date"]["S"],
                user_info["user_email"]["S"],
                user_info["user_score"]["N"]
            ])
    return user_csv_data

def hello(event, context):
    record = event['Records'][0]['dynamodb']
    
    if not record['NewImage']:
        return {
        'statusCode': 404,
        'body': json.dumps('No NewImage')
        }
    
    print(record)

    s3_bucket = "glue-etl-target-trivia-game"
    
    # Parse team data and write to CSV
    team_csv_data = parse_teams_score(record['NewImage'])
    team_s3_key = "teams_score/" + record['Keys']['game_id']['S'] + ".csv"
    team_s3_data = "\n".join([",".join(row) for row in team_csv_data])
    s3 = boto3.client('s3')
    s3.put_object(Bucket=s3_bucket, Key=team_s3_key, Body=team_s3_data)

    # Parse user data and write to CSV
    user_csv_data = parse_users_score(record['NewImage'])
    user_s3_key = "users_score/" + record['Keys']['game_id']['S'] + ".csv"
    user_s3_data = "\n".join([",".join(row) for row in user_csv_data])
    s3.put_object(Bucket=s3_bucket, Key=user_s3_key, Body=user_s3_data)

    print('CSV files generated and saved to S3.')

    return {
        'statusCode': 200,
        'body': json.dumps('CSV files generated and saved to S3.')
    }
