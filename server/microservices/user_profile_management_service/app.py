from flask import Flask, request, jsonify
import boto3

app = Flask(__name__)

@app.route('/stats', methods=['GET'])
def get_stats():

    session = boto3.Session(
    aws_access_key_id="ASIATJZBBY7BY55IPMHX",
    aws_secret_access_key="6j1HhFdL1qLWPyjMehXPzbYghXnrG37HA9V8a8eX",
    aws_session_token="FwoGZXIvYXdzEL3//////////wEaDF/hIiGGKHXla4xRmiLCASbG8Kb+xPt+l24HkWmK/JVKPvpMZQczfrA/wj0o6/KmXG8q0cu8PbI14FU6XCvYpJNLrVOZhqrMzUPwX2n+UBmRTJMHYLlagrIjCi/MHJCnTPCY5PPhgUpR4ndEgyPbicUkJ1EZ+vwC9VCqy2D1UGJxE5D1S3Il92YPLs4UMpUrMre6AFf+MY9E5+x6PF6a4pJoBpHv198nUhzkxiPorvUjncVTa/tv4RfIhTwaDSias/cnHACYDJZQlV7pdga77W1WKLm8k6UGMi0jL2X69iLB/nbx3K/q41k6KDTKYczggVQNJxlDni//64ElzBCWZuiF0oCZnaU=",
    region_name="us-east-1"
    )
    dynamodb = session.resource('dynamodb')
    table = dynamodb.Table('game_results')

    user_id = request.args.get('user_id')
    team_id = request.args.get('team_id')

    if not user_id or not team_id:
        return jsonify({'error': 'User ID and team ID are required.'}), 400

    response = table.scan(FilterExpression='team_id = :tid', ExpressionAttributeValues={':tid': team_id})
    games = response.get('Items')

    if not games:
        return jsonify({'error': 'No games found for the specified team.'}), 404

    team_total_score = 0
    user_total_score = 0
    team_win_count = 0
    user_win_count = 0
    team_players = set()

    for game in games:
        team_score = game.get('team_score')
        players_scores = game.get('players_score', {})

        if team_score:
            team_total_score += team_score
            team_players.update(players_scores.keys())

            if team_score > user_total_score:
                team_win_count += 1

        if user_id in players_scores:
            user_score = players_scores[user_id]
            user_total_score += user_score

            if user_score > team_score:
                user_win_count += 1

    team_loss_count = len(games) - team_win_count
    user_loss_count = len(games) - user_win_count

    team_win_loss_ratio = team_win_count / max(team_loss_count, 1)
    user_win_loss_ratio = user_win_count / max(user_loss_count, 1)

    # Retrieve team information from your database or any other source
    team_name = "Your Team Name"

    response_data = {
        'team_total_score': int(team_total_score),
        'team_win_loss_ratio': team_win_loss_ratio,
        'user_total_score': int(user_total_score),
        'user_win_loss_ratio': user_win_loss_ratio,
        'team_id': team_id,
        'team_name': team_name,
        'team_players': list(team_players)
    }

    print(response_data)
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)
