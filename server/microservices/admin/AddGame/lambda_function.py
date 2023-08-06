import json
import firebase_admin
from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore
import boto3

app = Flask(__name__)

secret_name = "SecretManager"
#Using secret Manager for storing credentaials
region_name = "us-east-1" 
session = boto3.session.Session()
client = session.client(service_name="secretsmanager", region_name=region_name)
secret_value = client.get_secret_value(SecretId=secret_name)["SecretString"]
firebase_key = json.loads(secret_value)

# Initialize Firebase Admin SDK
cred = credentials.Certificate(firebase_key)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Lambda Function
def lambda_handler(event, context):
    print(event)

    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_key)
        firebase_admin.initialize_app(cred, {
            'projectId': 'trivia-392000',
        })
    try:
        #Taking every value from the body
        game_data = json.loads(event['body'])

        name = game_data.get('name')
        difficulty = game_data.get('difficulty')
        category = game_data.get('category')
        timeframe = game_data.get('timeframe')
        start_time = game_data.get('start_time')
        end_time = game_data.get('end_time')
        description = game_data.get('description')
        questions = game_data.get('questions', [])


        doc_ref = db.collection('admingames').document()
        doc_id = doc_ref.id 
        teams=[]

        doc_ref.set({
            'id': doc_id,
            'difficulty': difficulty,
            'category': category,
            'timeframe': timeframe,
            'start_time': start_time,
            'end_time': end_time,
            'description': description,
            'name': name,
            'questions': questions,
            'teams':teams,
            'status':"About to Start"
        })
        # Returning response as 200
        return {
            'statusCode': 200,
            'body': json.dumps({'id': doc_id})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
