import json
import firebase_admin
from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore
import boto3

app = Flask(__name__)

secret_name = "SecretManager"
region_name = "us-east-1" 
session = boto3.session.Session()
client = session.client(service_name="secretsmanager", region_name=region_name)
secret_value = client.get_secret_value(SecretId=secret_name)["SecretString"]
firebase_key = json.loads(secret_value)

# Initialize Firebase Admin SDK
cred = credentials.Certificate(firebase_key)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Lambda handler function
def lambda_handler(event, context):
    print(event)

    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_key)
        firebase_admin.initialize_app(cred, {
            'projectId': 'trivia-392000',
        })
    try:
        # Retrieve the question data from the Lambda event
        question_data = json.loads(event['body'])

        # Create a new document in the 'questions' collection
        doc_ref = db.collection('questions').document()
        question_id= doc_ref.id
        print(question_id)
        doc_ref.set(question_data)

        # Return a JSON response indicating success
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Question added successfully',"question_id":question_id})
        }
    except Exception as e:
        # Return a JSON response indicating an error
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

