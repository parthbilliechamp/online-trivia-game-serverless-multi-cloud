from flask import Flask
from flask_cors import CORS
import firebase_admin
from datetime import datetime
from firebase_admin import firestore
from firebase_admin import credentials
import json
import boto3


application = Flask(__name__)
CORS(application)
firestore_db = None

@application.route('/test', methods=['GET'])
def login_user():
    global firestore_db
    email = 'a@d'
    contact = 'ssd'
    name = 'fdf'
    user_id = 'sdsd'
    state = 'asdas'
    status = 'ss'

    doc_ref = firestore_db.collection('users').document(user_id)
    doc_ref.set({
        'Email': email,
        'Contact': contact,
        'Name': name,
        'State': state,
        'Status': status,
        'UserId': user_id
    })

    

    return 'success'

def initialize_firestore_app():
    global firestore_db
    cred = credentials.Certificate('/Users/parthchampaneria/Downloads/key.json')
    # cred = credentials.ApplicationDefault()
    app = firebase_admin.initialize_app(cred)
    firestore_db = firestore.client()

@application.before_first_request
def initialize_app():
    initialize_firestore_app()

if __name__ == '__main__':
    application.run()
