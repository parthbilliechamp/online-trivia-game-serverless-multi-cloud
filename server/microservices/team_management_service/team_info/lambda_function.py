import json
import boto3
import firebase_admin
from firebase_admin import credentials, firestore
def get_firebase_key():
    print("=================================Inside Firebase==============================")
    secret_name = "firestore_db_key"
    region_name = "us-east-1" 
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_name)["SecretString"]
    firebase_key = json.loads(secret_value)
    return firebase_key

def fetch_team_data_from_user_id(user_id):
    headers = {
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json"
        }
    firebase_key = get_firebase_key()
    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_key)
        firebase_admin.initialize_app(cred, {
            'projectId': 'trivia-392000',
        })

    db = firestore.client()

    teams_ref = db.collection('teams')
    teams_query = teams_ref.where('users', 'array_contains', user_id)
    teams_docs = teams_query.get()

    if not teams_docs:
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'User not found in any team.'})
        }

    team_data = []
    for team_doc in teams_docs:
        team_info = team_doc.to_dict()
        team_members_info = []
        for user_id in team_info['users']:
            user_ref = db.collection('users').document(user_id)
            user_doc = user_ref.get()
            if user_doc.exists:
                user_data = user_doc.to_dict()
                team_members_info.append({
                    'user_id': user_id,
                    'user_info': {
                        'email': user_data['email'],
                        'name': user_data['name'],
                    }
                })

        team_data.append({
            'teamId': team_doc.id,
            'teamName': team_info['teamName'],
            'admin': team_info['admin'],
            'teamMembers': team_members_info,
        })

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(team_data)
    }

def lambda_handler(event, context):
    request_body = json.loads(event['body'])
    user_id = request_body.get('userId')
    return fetch_team_data_from_user_id(user_id)
