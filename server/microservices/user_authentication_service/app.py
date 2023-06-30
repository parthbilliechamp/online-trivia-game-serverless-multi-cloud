from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

application = Flask(__name__)
CORS(application)
firestore_db = None

@application.route('/add_qna', methods=['POST'])
def add_user_security_questions():
    global firestore_db
    data = request.json


    # Extract data from the request JSON
    user_email = data['user_email']
    user_question1 = data['user_question1']
    user_question2 = data['user_question2']
    user_question3 = data['user_question3']
    user_answer1 = data['user_answer1']
    user_answer2 = data['user_answer2']
    user_answer3 = data['user_answer3']

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

    #return response to the frontend
    response = {'message': 'Security Questions added successfully'}
    return jsonify(response), 201

@application.route('/2f_authenticate', methods=['POST'])
def authenticate_user_2f():
    global firestore_db
    data = request.json

    # Extract data from the request JSON
    user_email = data['user_email']
    input_answer1 = data['user_answer1']
    input_answer2 = data['user_answer2']
    input_answer3 = data['user_answer3']

    # Get the user's security questions from database
    user_qna_ref = firestore_db.collection("user_qna").document(user_email)
    user_qna_doc = user_qna_ref.get()

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
            return jsonify(response), 201
        else:
            # Answers are incorrect
            response = {'message': 'Authentication failed'}
            return jsonify(response), 401
    else:
        # User not found
        response = {'message': 'User not found'}
        return jsonify(response), 404

# method which initializes connection with firestore application
def initialize_firestore_app():
    global firestore_db
    cred = credentials.Certificate('/Users/parthchampaneria/Downloads/privatekey.json') # use this to run on local
    #cred = credentials.ApplicationDefault()
    app = firebase_admin.initialize_app(cred)
    firestore_db = firestore.client()

@application.before_first_request
def initialize_app():
    initialize_firestore_app()

if __name__ == '__main__':
    application.run()