import json
import firebase_admin
from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore
import boto3
from google.cloud import language_v1
from google.api_core import exceptions as google_exceptions
app = Flask(__name__)

secret_name = "SecretManager"
region_name = "us-east-1" 
session = boto3.session.Session()
client = session.client(service_name="secretsmanager", region_name=region_name)
secret_value = client.get_secret_value(SecretId=secret_name)["SecretString"]
firebase_key = json.loads(secret_value)

cred = credentials.Certificate(firebase_key)
firebase_admin.initialize_app(cred)
db = firestore.client()

client = language_v1.LanguageServiceClient()

def classify_question(question):
    document = language_v1.Document(content=question, type_=language_v1.Document.Type.PLAIN_TEXT)
    try:
        response = client.classify_text(request={'document': document})
        categories = [category for category in response.categories]
        categories.sort(key=lambda x: x.confidence, reverse=True)
        highest_confidence_category = categories[0].name if categories else None
        return highest_confidence_category
    except google_exceptions.InvalidArgument as e:
        return None

def store_unique_categories(categories_list, question_id):
    categories_ref = db.collection('questions').document(question_id)
    categories_ref.update({'automated_question_tagging': categories_list})

def lambda_handler(event, context):
    try:
        question_id = event['pathParameters']['question_id']
        question_ref = db.collection('questions').document(question_id)
        question = question_ref.get()

        if not question.exists:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Question not found'})
            }

        question_data = question.to_dict()
        question_text = question_data['question']

        category = classify_question(question_text)

        if category is None:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'Failed to classify question'})
            }

        category_array = category.split('/')
        category_array = [category.strip() for category in category_array if category.strip()]
        store_unique_categories(category_array, question_id)
        result = {
            'question': question_text,
            'category': category_array
        }

        return {
            'statusCode': 200,
            'body': json.dumps(result)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
