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
cred = credentials.Certificate(firebase_key)
firebase_admin.initialize_app(cred)
db = firestore.client()

def lambda_handler(event, context):
    try:
        #Reference  #https://stackoverflow.com/questions/53975944/aws-lambda-getting-path-parameters-using-node-js
        # Getting the Parameters from the query
        game_id = event['pathParameters']['game_id']
     
        # Deleting the specified game based on the Id
        db.collection('admingames').document(game_id).delete()
        
        # Returning a JSON response indicating success when game is deleted Succesfully
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Game deleted successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
