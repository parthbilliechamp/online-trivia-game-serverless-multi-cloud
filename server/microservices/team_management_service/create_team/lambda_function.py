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

def get_openAI_key():
    print("=================================Inside Firebase==============================")
    secret_name = "OpenAI"
    region_name = "us-east-1" 
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_name)["SecretString"]
    OpenAI_API_Key = json.loads(secret_value)
    return OpenAI_API_Key

def get_team_name():
    # Call the ChatGPT API to generate the team name
    print("==========================================Inside Chat GPT function")
    api_key = get_openAI_key()
    chatgpt_api_url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        # 'Authorization': f'Bearer {api_key}',
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': 'gpt-3.5-turbo',
        'messages': [{'role': 'system', 'content': 'You are the admin of a new trivia team, give a signle word name to team. Reply only single word.'}]
    }
    print("=========================================Sending request to GPT========================")
    response = requests.post(chatgpt_api_url, headers=headers, json=payload)
    print("=========================================Got response form gpt========================")
    print(response)
    team_name = response.json()['choices'][0]['message']['content']
    print("=========================================Filtered response to GPT========================")
    print(team_name)
    return team_name

def get_all_users():
    print("=================================Getting online Users==============================")
    firebase_key = get_firebase_key()

    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_key)
        firebase_admin.initialize_app(cred, {
            'projectId': 'trivia-392000',
        })

    db = firestore.client()
    users_ref = db.collection('users')
    all_users = [doc.to_dict() for doc in users_ref.stream()]


    all_users_with_id = []
    for doc in users_ref.stream():
        user_data = doc.to_dict()
        user_data['userId'] = doc.id
        all_users_with_id.append(user_data)


    print("=================================All users==============================")
    print(all_users_with_id)
    return all_users_with_id

def lambda_handler(event, context):
    print("=================================Inside Function==============================")

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
    user_id = request_body.get('userId')
    print(user_id)

    if not user_id:
        print("=================================User Id Not Found==============================")
        return{
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request. userId are required.'})
        }

    # Generate the team name using ChatGPT API
    team_name = get_team_name()
    print("=======================================Team name===============================")
    # team_name = "team_test"
    print(team_name)

    print("=======================================Team name===============================")
    # Add the team to Firestore with the current user as the admin and an empty list for users
    team_data = {
        'teamName': team_name,
        'admin': user_id,
        'users': []  
    }
    print(team_data)

    firebase_key = get_firebase_key()

    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_key)
        firebase_admin.initialize_app(cred, {
            'projectId': 'trivia-392000',
        })

    db = firestore.client()

    print("=======================================Creating Team in firestore COllection===============================")
    teams_ref = db.collection('teams')
    new_team = teams_ref.add(team_data)
    team_id = new_team[1].id
    print("=======================================Newly created team ID===============================")
    print(team_id)

    print("=======================================Calling Get users finction===============================")
    # Retrieve all users from Firestore
    all_users = get_all_users()
    print("=======================================Printing All users list again===============================")
    print(all_users)
    print("=======================================Printing response of this lambda finction===============================")
    response_data = {
        'teamId': team_id,
        'teamName': team_name,
        'adminUserId': user_id,
        'allUsers': all_users
    }
    print(response_data)


    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(response_data)
    }