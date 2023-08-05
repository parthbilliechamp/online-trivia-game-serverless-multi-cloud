import json
import firebase_admin
from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore
import boto3

app = Flask(__name__)
# Initialize Firebase Admin SDK
#Reference https://stackoverflow.com/questions/59726667/firebase-admin-sdk-global-app-initialization-in-node-js
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
    #Referencehttps://stackoverflow.com/questions/53975944/aws-lambda-getting-path-parameters-using-node-js
    # Get the question_id from the path parameters
    question_id = event['querypathParameters']['question_id']
    
    # Getting the specified question document
    doc_ref = db.collection('questions').document(question_id)
    doc = doc_ref.get()

    if doc.exists:
        question_data = doc.to_dict()
        question_data['id'] = doc.id
        
        # Return the question_data as a JSON response
        return {
            'statusCode': 200,
            'body': json.dumps(question_data)
        }
    else:
        # Return an error message as a JSON response
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Question not found'})
        }
