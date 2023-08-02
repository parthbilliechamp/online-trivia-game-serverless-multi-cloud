import functions_framework
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask import jsonify

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
firestore_db = firestore.client()


@functions_framework.http
def http(request):

    
    user_email = request.args.get('email')
    user_question1 = request.args.get('q1')
    user_question2 = request.args.get('q2')
    user_question3 = request.args.get('q3')
    user_answer1 = request.args.get('a1')
    user_answer2 = request.args.get('a2')
    user_answer3 = request.args.get('a3')

    # Create a dictionary to store the security questions data
    user_qna = {
        'security_questions': {
            'Q1': user_question1,
            'A1': user_answer1,
            'Q2': user_question2,
            'A2': user_answer2,
            'Q3': user_question3,
            'A3': user_answer3,
        }
    }

    # Add data to the "user_qna" collection
    reg_ref = firestore_db.collection("user_qna").document(user_email)
    reg_ref.set(user_qna)


    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    return ('Security Questions added successfully.', 201, headers)