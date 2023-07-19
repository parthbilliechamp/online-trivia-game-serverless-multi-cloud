from flask import Flask, request, jsonify
import boto3
from decimal import Decimal

app = Flask(__name__)

import boto3

@app.route('/profile', methods=['GET'])
def get_user_profile():
    email = request.args.get('email')

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Userprofile')

    response = table.get_item(Key={'email': email})

    if 'Item' in response:
        user_profile = response['Item']
        # Process the user profile as needed
        return jsonify(user_profile)
    else:
        # Handle case when user profile is not found
        return jsonify({'error': 'User profile not found'})


@app.route('/stats', methods=['GET'])
def get_stats():

    session = boto3.Session(
    )
    dynamodb = session.resource('dynamodb')
    table = dynamodb.Table('Game_Result')

    user_id = request.args.get('user_id')
    team_id = request.args.get('team_id')

    if not user_id or not team_id:
        return jsonify({'error': 'User ID and team ID are required.'}), 400

    response = table.scan()
    games = response.get('Items')

    if not games:
        return jsonify({'error': 'No games found for the specified team.'}), 404

    # Initialize variables to store the computed values
    team_total_score = 0
    team_win_count = 0
    team_total_game_count = 0
    user_total_score = 0
    user_win_count = 0
    user_total_game_count = 0

    # Scan the DynamoDB table
    response = table.scan()

    # Iterate over each item in the table
    for item in response['Items']:
        # Extract relevant data from the item
        team_scores = item['teams_score']

        # Iterate over each team score in the item
        for team_score in team_scores:
            team_id_item = team_score['team_id']
            team_score_val = int(Decimal(team_score['team_score']))
            users_scores = team_score['users_score']

            # Check if the team_id matches the input team_id
            if team_id_item == team_id:
                team_total_score += team_score_val
                team_name = team_score['team_name']
                if team_score['team_result'] == 1:
                    team_win_count += 1
                team_total_game_count += 1

                for user_score in users_scores:
                    user_id_item = list(user_score.keys())[0]
                    user_score_val = int(Decimal(user_score[user_id_item]))
                    
                    if user_id_item == user_id:
                        user_total_score += user_score_val
                        user_win_count += 1
                    user_total_game_count += 1

    # Compute win ratios
    if team_total_score > 0:
        team_win_ratio = team_win_count / team_total_game_count
    else:
        team_win_ratio = 0

    if user_total_score > 0:
        user_win_ratio = user_win_count / user_total_game_count
    else:
        user_win_ratio = 0

    response_data = {
        'team_total_score': int(team_total_score),
        'team_win_ratio': team_win_ratio,
        'user_total_score': int(user_total_score),
        'user_win_ratio': user_win_ratio,
        'team_id': team_id,
        'team_name': team_name,
        'user_total_games_played': user_total_game_count,
        'team_total_games_played': team_total_game_count,
        'user_games_won': user_win_count,
        'team_games_won': team_win_count
    }
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)
