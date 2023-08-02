import boto3
import random
from datetime import datetime, timedelta

def generate_random_date():
    # Generate a random date between 1st January 2023 and 25th July 2023
    start_date = datetime(2023, 1, 1)
    end_date = datetime(2023, 7, 25)
    random_days = random.randint(0, (end_date - start_date).days)
    random_date = start_date + timedelta(days=random_days)
    return random_date.strftime("%Y-%m-%d")

def generate_random_game_category():
    # Pre-defined game categories
    game_categories = ["science", "sports", "adventure", "puzzle", "fantasy"]
    return random.choice(game_categories)

def generate_random_game():
    # Pre-defined meaningful team names and user emails
    team_names = ["RedBull", "BlueDragons", "GreenLions", "YellowTigers", "PurpleWolves"]
    user_emails = ["user1@example.com", "user2@example.com", "user3@example.com", "user4@example.com", "user5@example.com"]

    num_teams = random.randint(2, 4)
    teams_score = []

    for team_id in range(1, num_teams + 1):
        team_name = random.choice(team_names)
        team_score = random.randint(50, 100)
        team_result = random.randint(0, 1)

        num_users = random.randint(3, 5)
        users_score = []

        for user_id in range(1, num_users + 1):
            user_email = random.choice(user_emails)
            user_score = random.randint(5, 15)
            users_score.append({
                "M": {
                    "user_email": {"S": user_email},
                    "user_score": {"N": str(user_score)}
                }
            })

        teams_score.append({
            "M": {
                "team_id": {"S": str(team_id)},
                "team_name": {"S": team_name},
                "team_result": {"N": str(team_result)},
                "team_score": {"N": str(team_score)},
                "users_score": {"L": users_score}
            }
        })

    return {
        "game_id": {"S": str(random.randint(1, 100))},
        "game_category": {"S": generate_random_game_category()},
        "game_date": {"S": generate_random_date()},
        "teams_score": {"L": teams_score}
    }

def hello(event, context):
    dynamodb = boto3.client('dynamodb')
    table_name = 'Game_Result'

    # Generate a random game object
    game_object = generate_random_game()
    
    print(game_object)

    # Put the game object into the DynamoDB table
    dynamodb.put_item(TableName=table_name, Item=game_object)

    return {
        "statusCode": 200,
        "body": "Game object inserted into DynamoDB table successfully!"
    }
