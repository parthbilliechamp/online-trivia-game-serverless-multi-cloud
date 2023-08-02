import functions_framework
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask import request, jsonify

@functions_framework.http
def http(request):
    
    if not firebase_admin._apps:
        # App is not initialized, so initialize it
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)

    firestore_db = firestore.client()
    user_email = request.args.get('email')

    firestore_db.collection("user_qna").document(user_email)
    reg_ref = firestore_db.collection("user_qna").document(user_email)
    doc = reg_ref.get()

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

    if doc.exists:
        return (doc.to_dict()['security_questions'], 200, headers)
    else:
        return ('Unable to fetch request', 404, headers)
