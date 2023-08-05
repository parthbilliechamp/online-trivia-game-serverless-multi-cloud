import boto3
import decimal

def hello(event, context):
    dynamodb = boto3.client('dynamodb')
    team_stats_table_name = 'User_stats'
    user_stats_table_name = 'UserStats'
    
    for record in event['Records']:
        if record['eventName'] == 'INSERT':
            new_image = record['dynamodb']['NewImage']
            
            # Process team_score
            for team in new_image['teams_score']['L']:
                team_info = team['M']
                team_name = team_info['team_name']['S']
                team_score = int(team_info['team_score']['N'])
                team_result = int(team_info['team_result']['N'])
                
                # Fetch team stats from Team_stats table
                response = dynamodb.get_item(TableName=team_stats_table_name, Key={'team_name': {'S': team_name}})
                if 'Item' in response:
                    team_stats = response['Item']
                    total_games_played = int(team_stats['team_total_games_played']['S'])
                    total_score = int(team_stats['team_total_score']['S'])
                    games_won = int(team_stats['team_games_won']['S'])
                else:
                    team_stats = {
                        'team_name': {'S': team_name},
                        'team_total_games_played': {'S': '0'},
                        'team_total_score': {'S': '0'},
                        'team_games_won': {'S': '0'},
                        'team_win_ratio': {'S': '0.0'}
                    }
                    total_games_played = 0
                    total_score = 0
                    games_won = 0
                
                total_games_played += 1
                total_score += team_score
                
                if team_result == 1:
                    games_won += 1
                
                win_ratio = decimal.Decimal(games_won) / decimal.Decimal(total_games_played)
                
                team_stats['team_total_games_played']['S'] = str(total_games_played)
                team_stats['team_total_score']['S'] = str(total_score)
                team_stats['team_games_won']['S'] = str(games_won)
                team_stats['team_win_ratio']['S'] = str(win_ratio)
                
                dynamodb.put_item(TableName=team_stats_table_name, Item=team_stats)
                
                # Process users_score
                for user_score in team_info['users_score']['L']:
                    user_info = user_score['M']
                    print(user_info)
                    user_email = user_info['user_email']['S']
                    user_score_value = int(user_info['user_score']['N'])
                    
                    # Fetch user stats from User_stats table
                    response = dynamodb.get_item(TableName=user_stats_table_name, Key={'user_email': {'S': user_email}})
                    if 'Item' in response:
                        user_stats = response['Item']
                        user_games_won = int(user_stats['user_games_won']['S'])
                        user_total_games_played = int(user_stats['user_total_games_played']['S'])
                        user_total_score = int(user_stats['user_total_score']['S'])
                    else:
                        user_stats = {
                            'user_email': {'S': user_email},
                            'user_games_won': {'S': '0'},
                            'user_total_games_played': {'S': '0'},
                            'user_total_score': {'S': '0'},
                            'user_win_ratio': {'S': '0.0'}
                        }
                        user_games_won = 0
                        user_total_games_played = 0
                        user_total_score = 0
                    
                    user_total_games_played += 1
                    user_total_score += user_score_value
                    
                    if team_result == 1:
                        user_games_won += 1
                    
                    user_win_ratio = decimal.Decimal(user_games_won) / decimal.Decimal(user_total_games_played)
                    
                    user_stats['user_games_won']['S'] = str(user_games_won)
                    user_stats['user_total_games_played']['S'] = str(user_total_games_played)
                    user_stats['user_total_score']['S'] = str(user_total_score)
                    user_stats['user_win_ratio']['S'] = str(user_win_ratio)
                    
                    dynamodb.put_item(TableName=user_stats_table_name, Item=user_stats)
