import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

application = Flask(__name__)
CORS(application)
firestore_db = None

@application.route('/signup', methods=['POST'])
def register_user():
    global firestore_db
    data = request.json

    # Add data to the Reg collection
    reg_ref = firestore_db.collection("reg").document(data['email'])
    reg_ref.set(data)

    # Add data to the State collection with current status of the user as offline
    state_ref = firestore_db.collection("state").document(data['email'])
    state_ref.set({'is_logged_in': False})

    #return response to the frontend
    response = {'message': 'Registration successfull'}
    return jsonify(response), 201

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