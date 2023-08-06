import functions_framework
from flask import Flask, jsonify, request, redirect, url_for
from flask_cors import CORS
from google.cloud import firestore
import random
import boto3
import uuid
from botocore.exceptions import ClientError

db = firestore.Client()

app = Flask(__name__)

# Enable CORS for all routes in the Flask app
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@functions_framework.http
def hello_http(request):
    if request.method == 'OPTIONS':
        return add_cors_headers(jsonify({}))
    category = request.args.get('category', default=None, type=str)
    difficulty = request.args.get('difficulty', default=None, type=str)
    print("Received category:", category)
    print("Received difficulty:", difficulty)

    questions = []
    # Fetch questions collection from Firestore
    collection_ref = db.collection('admingames')
    query = collection_ref.where('category', '==', category).where('difficulty', '==', difficulty)
    print('query: ', query)
    docs = query.get()

    for doc in docs:
        question_data = doc.to_dict()
        question_data['id'] = doc.id

        # Extract the "questions" field from the document and append to the questions list
        if 'questions' in question_data:
            questions.extend(question_data['questions'])

    return jsonify(questions)

if __name__ == '__main__':
    app.run()