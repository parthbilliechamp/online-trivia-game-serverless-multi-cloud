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
    try:
        # Get the game_id from the path parameters
        game_id = event['queryStringParameters']['game_id']
        
        # Retrieve the game from the Firestore collection
        game = db.collection('admingames').document(game_id).get()
        
        if game.exists:
            game_data=game.to_dict()
            game_data['id'] = game.id

            # Returning the game data as JSON response
            return {
                'statusCode': 200,
                'body': json.dumps(game_data)
            }
        else:
            # Returning a JSON response indicating that the game was not found
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Game not found'})
            }
    except Exception as e:
        # Returning a JSON response indicating an error
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
