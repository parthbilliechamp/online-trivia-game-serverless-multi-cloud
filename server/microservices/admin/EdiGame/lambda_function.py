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
#storing the GCP Credentials in the Secret Manager
#Reference https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html
session = boto3.session.Session()
client = session.client(service_name="secretsmanager", region_name=region_name)
secret_value = client.get_secret_value(SecretId=secret_name)["SecretString"]
firebase_key = json.loads(secret_value)

# Initialize Firebase Admin SDK
cred = credentials.Certificate(firebase_key)
firebase_admin.initialize_app(cred)
db = firestore.client()
def lambda_handler(event, context):
    game_id = event['pathParameters']['game_id']
    
    try:
        #Referencehttps://stackoverflow.com/questions/53975944/aws-lambda-getting-path-parameters-using-node-js
        # Getting the game data from the request body
        game_data = json.loads(event['body'])

        # Updating the specified game document
        doc_ref = db.collection('admingames').document(game_id)
        doc_ref.update(game_data)

        # Returning a success message as a JSON response
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Game updated successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
