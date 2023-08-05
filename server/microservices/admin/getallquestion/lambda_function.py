import json
import firebase_admin
from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore
import boto3

app = Flask(__name__)

#storing the GCP Credentials in the Secret Manager
#Reference https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html
secret_name = "SecretManager"
region_name = "us-east-1" 
session = boto3.session.Session()
client = session.client(service_name="secretsmanager", region_name=region_name)
secret_value = client.get_secret_value(SecretId=secret_name)["SecretString"]
firebase_key = json.loads(secret_value)

# Initialize Firebase Admin SDK
#Reference https://stackoverflow.com/questions/59726667/firebase-admin-sdk-global-app-initialization-in-node-js
cred = credentials.Certificate(firebase_key)
firebase_admin.initialize_app(cred)
db = firestore.client()

def lambda_handler(event, context):
    print(event)
    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_key)
        firebase_admin.initialize_app(cred, {
            'projectId': 'trivia-392000',
        })
    questions = []

    # Querying the 'questions' collection in the Firestore
    query = db.collection('questions').get()

    # Converting the query snapshot to a list of dictionaries
    for doc in query:
        question = doc.to_dict()
        question['id'] = doc.id 
        questions.append(question)

    return {
        'statusCode': 200,
        'body': json.dumps(questions)
    }
