import functions_framework
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask import jsonify

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
firestore_db = firestore.client()


@functions_framework.http
def register(request):
    data = request.json
    # Extract data from the request JSON
    user_email = data['email']
    user_question1 = data['q1']
    user_question2 = data['q2']
    user_question3 = data['q3']
    user_answer1 = data['a1']
    user_answer2 = data['a2']
    user_answer3 = data['a3']

    # Create a dictionary to store the security questions data
    user_qna = {
        'security_questions': {
            'Q1': user_question1,
            'A1': user_answer1,
            'Q2': user_question2,
            'A2': user_answer2,
            'Q1': user_question3,
            'A3': user_answer3,
        }
    }

    # Add data to the "user_qna" collection
    reg_ref = firestore_db.collection("user_qna").document(user_email)
    reg_ref.set(user_qna)

    # return response to the frontend
    response = {'message': 'Security Questions added successfully.'}
    return jsonify(response), 201
