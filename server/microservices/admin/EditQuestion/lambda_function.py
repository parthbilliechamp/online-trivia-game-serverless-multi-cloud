import json
import firebase_admin
from flask import Flask
from firebase_admin import credentials, firestore
import boto3

app = Flask(__name__)

secret_name = "SecretManager"
region_name = "us-east-1" 
#storing the GCP Credentials in the Secret Manager
#Reference https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html
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
    try:
        #Referencehttps://stackoverflow.com/questions/53975944/aws-lambda-getting-path-parameters-using-node-js
        # Retrieving  the question ID from the Lambda event
        question_id = event['pathParameters']['question_id']

        # Retrieve the question data from the request body
        question_data = json.loads(event['body'])

        # Updating the specified question document
        doc_ref = db.collection('questions').document(question_id)
        doc_ref.update(question_data)

        # Returning a JSON response indicating success
        return {
            'event':event,
            'statusCode': 200,
            'body': json.dumps({'message': 'Question updated successfully'})
        }
    except Exception as e:
        # Returning a JSON response indicating an error
        return {
            'event':event,
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
