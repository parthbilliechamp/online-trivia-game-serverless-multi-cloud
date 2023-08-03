import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
import boto3

def get_firebase_key():
    print("=================================Inside Firebase==============================")
    secret_name = "firestore_db_key"
    region_name = "us-east-1" 
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_name)["SecretString"]
    firebase_key = json.loads(secret_value)
    return firebase_key

def get_user_data(user_ids):
    print("=================================Fetching User Data==============================")
    firebase_key = get_firebase_key()
    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_key)
        firebase_admin.initialize_app(cred, {
            'projectId': 'trivia-392000',
        })

    db = firestore.client()
    user_data = []

    print("=================================Outside For Loop==============================")
    for user_id in user_ids:
        print("=================================Inside For looooop==============================")
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        print("=================================Outside IFFF==============================")
        if user_doc.exists:
            print("=================================Inside IFFFFF==============================")
            user_data.append(user_doc.to_dict())

    return user_data

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json"
    }

    print("=================================Getting User Id==============================")
    print(event)
    # Get the current user ID from the request (You should adapt this based on how you pass the user ID)
    request_body = json.loads(event['body'])
    print("=================================User ID==============================")
    game_id = request_body.get('gameId')
    print(game_id)

    if not game_id:
        print("=================================User Id Not Found==============================")
        return{
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request. game_id are required.'})
        }

    firebase_key = get_firebase_key()

    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_key)
        firebase_admin.initialize_app(cred, {
            'projectId': 'trivia-392000',
        })

    db = firestore.client()

    game_ref = db.collection('admingames').document(game_id)
    game_doc = game_ref.get()

    if game_doc.exists:
        game_data = game_doc.to_dict()

        # Fetch team data
        teams_data = []
        for team_id in game_data['teams']:
            team_ref = db.collection('teams').document(team_id)
            team_doc = team_ref.get()

            if team_doc.exists:
                team_data = team_doc.to_dict()
                teams_data.append(team_data)
        print("=================================Feching User Data Function==============================")

        # Fetch user data
        user_ids = [user_id for team_data in teams_data for user_id in team_data['users']]
        # users_data = get_user_data(user_ids)
        user_data = []

        print("=================================Outside For Loop==============================")
        for user_id in user_ids:
            print("=================================Inside For looooop==============================")
            user_ref = db.collection('users').document(user_id)
            user_doc = user_ref.get()
            print("=================================Outside IFFF==============================")
            if user_doc.exists:
                print("=================================Inside IFFFFF==============================")
                user_data.append({
                'user_id': user_id,
                'user_info': user_doc.to_dict()
                })
        print(user_data)
        response_data = {
            'category': game_data['category'],
            'description': game_data['description'],
            'difficulty': game_data['difficulty'],
            'end_time': game_data['end_time'],
            'id': game_data['id'],
            'name': game_data['name'],
            'questions': game_data['questions'],
            'start_time': game_data['start_time'],
            'status': game_data['status'],
            'teams': teams_data,
            'users': user_data,  # Add the user data to the response
            'timeframe': game_data['timeframe']
        }
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response_data)
        }
    else:
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({"error": "Something went wrong"})
        }
