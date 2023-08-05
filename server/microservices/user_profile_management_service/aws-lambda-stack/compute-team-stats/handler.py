import json
import boto3

def hello(event, context):
    dynamodb = boto3.resource('dynamodb')
    game_table_name = 'Game_Result'
    team_table_name = 'Team_Stats'
    game_table = dynamodb.Table(game_table_name)
    team_table = dynamodb.Table(team_table_name)
    
    team_name = event['queryStringParameters']['team_name']
    team_total_score = 0
    team_total_games_played = 0
    team_games_won = 0
    team_members = set()
    
    try:
        response = game_table.scan()
        game_results = response['Items']
        
        for game_result in game_results:
            teams_score = game_result.get('teams_score', [])
            for team in teams_score:
                team_info = team.get('team_name', '')
                if team_info == team_name:
                    team_match_count += 1
                    team_total_score += int(team.get('team_score', '0'))
                    team_total_games_played += 1
                    if int(team.get('team_result', '0')) == 1:
                        team_games_won += 1
                    users_score = team.get('users_score', [])
                    for user_score in users_score:
                        email = user_score.get('email', '')
                        team_members.add(email)
        
        team_item = {
            'team_name': team_name,
            'team_total_score': str(team_total_score),
            'team_win_ratio': str(team_games_won / team_total_games_played) if team_total_games_played > 0 else '0.0',
            'team_total_games_played': str(team_total_games_played),
            'team_games_won': str(team_games_won),
            'team_members': list(team_members)
        }
        
        team_table.put_item(Item=team_item)
        
        return {
            'statusCode': 200,
            'body': json.dumps('Data added/updated successfully.')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error adding/updating data: {str(e)}')
        }