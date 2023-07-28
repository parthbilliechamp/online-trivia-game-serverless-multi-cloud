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

def lambda_handler(event, context):
    print(event)
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json"
        }
    try:

        firebase_key = get_firebase_key()

        if not firebase_admin._apps:
            cred = credentials.Certificate(firebase_key)
            firebase_admin.initialize_app(cred, {
                'projectId': 'trivia-392000',
            })

        db = firestore.client()

        request_body = json.loads(event['body'])
        print("===========================Invited user ID =========================")
        invited_user_id = request_body.get('invitedUserId')
        print(invited_user_id)
        print("===================Team Id =========================================")
        team_id = request_body.get('teamId')
        print(team_id)

        print("==============================Team reference=======================")
        # Get the team document reference
        team_ref = db.collection("teams").document(team_id)
        print(team_ref)

        print("=====================Updating collection=====================")
        # Update the user array in the team document
        team_ref.update({
            "users": firestore.ArrayUnion([invited_user_id])
        })

        # Return a success response
        response = {
            "statusCode": 200,
            "body": json.dumps("User added to team successfully."),
        }
        return response

    except Exception as e:
        # Return an error response if any error occurs
        response = {
            "statusCode": 500,
            "body": json.dumps(f"Error: {str(e)}"),
        }
        return response
