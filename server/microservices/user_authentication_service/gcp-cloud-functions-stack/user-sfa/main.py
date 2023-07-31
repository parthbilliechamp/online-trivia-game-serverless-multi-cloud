import functions_framework
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask import Flask, jsonify

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
firestore_db = firestore.client()

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@functions_framework.http
def sf_authenticate(request):

    if request.method == 'OPTIONS':
        return add_cors_headers(jsonify({}))

    data = request.get_json(silent=True)
    print(data)
    print(type(data))
    user_email = data['user_email']
    input_answer1 = data['user_answer1']
    input_answer2 = data['user_answer2']
    input_answer3 = data['user_answer3']

    # Get the user's security questions from the database
    user_qna_ref = firestore_db.collection("user_qna").document(user_email)
    user_qna_doc = user_qna_ref.get()

    # Set CORS headers for the main request
    headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

    if request.method == 'OPTIONS':
        # Preflight request response
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*'
    }


    if user_qna_doc.exists:
        # Retrieve the security questions and answers from the document
        user_qna_data = user_qna_doc.to_dict()
        security_questions = user_qna_data['security_questions']

        # Authenticate the user's answers
        if (
            security_questions['A1'] == input_answer1 and
            security_questions['A2'] == input_answer2 and
            security_questions['A3'] == input_answer3
        ):
            # Answers are correct
            response = {'message': 'Authentication successful'}
            return (response, 201, headers)
        else:
            # Answers are incorrect
            response = {'message': 'Authentication failed'}
            return (response, 401, headers)
    else:
        # User not found
        response = {'message': 'User not found'}
        return (response, 404, headers)
