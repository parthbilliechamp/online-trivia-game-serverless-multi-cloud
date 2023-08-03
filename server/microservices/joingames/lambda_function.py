import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import boto3

secret_name = "firestore_db_key"
region_name = "us-east-1" 
session = boto3.session.Session()
client = session.client(service_name="secretsmanager", region_name=region_name)
secret_value = client.get_secret_value(SecretId=secret_name)["SecretString"]
firebase_key = json.loads(secret_value)

def handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json"
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers
        }
    print(event)

    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_key)
        firebase_admin.initialize_app(cred, {
            'projectId': 'trivia-392000',
        })

    db = firestore.client()

    request_body = json.loads(event['body'])
    user_id = request_body.get('userId')  # Updated to get the user Id from request body.

    if not user_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request. userId is required.'})
        }

    # Check if the user is present in any team.
    teams_ref = db.collection('teams')
    teams_query = teams_ref.where('users', 'array_contains', user_id)
    teams_snapshot = teams_query.get()

    if len(teams_snapshot) == 0:
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'User is not joined any team.'})
        }
    else:
        # Assuming a user can be part of multiple teams, we will take the first team.
        team_id = teams_snapshot[0].id
        game_id = request_body.get('gameId')

        if not game_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Invalid request. gameId is required.'})
            }

        game_ref = db.collection('admingames').document(game_id)
        game = game_ref.get()

        if game.exists:
            game_data = game.to_dict()
            participants = game_data.get('teams', [])

            if team_id not in participants:
                participants.append(team_id)
                game_ref.update({'teams': participants})

                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'message': 'You have successfully joined the game!'})
                }
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'You are already a participant in this game.'})
                }
        else:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Game not found.'})
            }
