import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import datetime

application = Flask(__name__)
CORS(application)
firestore_db = None

@application.route('/sfa', methods=['GET'])
def authenticate_user():
    global firestore_db

    user_email = request.args.get('email')
    firestore_db.collection("user_qna").document(user_email)
    reg_ref = firestore_db.collection("user_qna").document(user_email)
    doc = reg_ref.get()

    if doc.exists:
        return jsonify(doc.to_dict()['security_questions']), 200
    else:
        return jsonify('Unable to fetch request'), 404

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