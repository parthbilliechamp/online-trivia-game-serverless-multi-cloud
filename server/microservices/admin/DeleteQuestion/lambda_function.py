import json
import firebase_admin
from flask import Flask
from firebase_admin import credentials, firestore
import boto3

app = Flask(__name__)
#Using secret Manager for storing credentaials

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
    # Extracting question_id from the event
    #Reference https://stackoverflow.com/questions/57542602/how-to-retrieve-the-input-query-parameter-in-node-aws-lambda
    question_id = event['pathParameters']['question_id']

    # Delete the specified question document
    db.collection('questions').document(question_id).delete()

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Question deleted successfully'})
    }
