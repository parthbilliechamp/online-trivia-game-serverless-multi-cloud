from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
import boto3

application = Flask(__name__)
CORS(application)
firestore_db = None


@application.route('/login', methods=['GET'])
def handle_callback():
    code = request.args.get('code')

    client_id = 'umlids9prbksb5eupfj18blsd'
    callback_uri = 'https://www.google.com/'

    # Exchange authorization code for tokens
    token_url = f'https://trivia-quiz.auth.us-east-1.amazoncognito.com/oauth2/token'
    token_payload = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'code': code,
        'redirect_uri': callback_uri,
        'scope': 'openid profile email phone aws.cognito.signin.user.admin' ,
    }

    token_response = requests.post(token_url, data=token_payload)
    token_data = token_response.json()
    print(token_data)
    access_token = token_data['access_token']


    print(access_token)
    #access_token = "eyJraWQiOiIyalZCTWY5QndST3VqNjdsdzlTQUtRd3N2SEFwMFg0UTVKS1VrSG10XC9TQT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NDM4OTQ0OC00MGMxLTcwMjgtMTEyNy03M2Y0ZTVkYjAxNTUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Pc1p4WW1qSUgiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiJ1bWxpZHM5cHJia3NiNWV1cGZqMThibHNkIiwib3JpZ2luX2p0aSI6IjQwMGJjYjJlLWJkYzEtNDk4MS1hNTIyLWZhMGViY2M5ZWIyNyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoicGhvbmUgb3BlbmlkIGVtYWlsIiwiYXV0aF90aW1lIjoxNjg5Mjc3Mzk2LCJleHAiOjE2ODkyODA5OTYsImlhdCI6MTY4OTI3NzM5NiwianRpIjoiMDM1NzBkMzMtYWI1OS00MDI2LTliMGItNDAxNmY3ZWNkMjY0IiwidXNlcm5hbWUiOiI0NDM4OTQ0OC00MGMxLTcwMjgtMTEyNy03M2Y0ZTVkYjAxNTUifQ.k_XnCj-Ot-Ks_TCirxReylF8BXBP6QOkfo3xwVD_6m02Nmrn_2X8JhMyOLXabE9ihHZXoVZUT0ErrZ8_NmRj8SE8Z58pV4gagl_YxP3ntDKDlJehHD9gnI1gNDCIJNNyuiDtAz-XngDjiYxAeOCv_2QcLh3VnHh8nqrQ_-0tTyAh7Ln_wzt6KUA_qwfye630ykzGkq1lol1pKcFmvElzsT089kkOjsdfLOqEbRzSha0NctAqVhLuJj734loWmsgFKdEcveRv7cfnCJWMC0ZF_j2oYp1CcdVDf1Vgdv8FK_MuTn3wEtC1TepxRuOHcRUoXBjbw3yG4uVQ86I-uK7Z3g"

    # Use the access token to retrieve user attributes
    user_attributes = get_user_attributes(access_token)

    

    # Handle the retrieved user attributes
    print(user_attributes)

    return user_attributes, 200

# Function to retrieve user attributes using the access token
def get_user_attributes(access_token):

    user_info_url = 'https://trivia-quiz.auth.us-east-1.amazoncognito.com/oauth2/userInfo'

    headers = {
    'Authorization': 'Bearer ' + access_token
    }
    response = requests.get(user_info_url, headers=headers)
    if response.status_code == 200:
        user_info = response.json()
        print(user_info)
    else:
        print('Failed to retrieve user information:', response.text)
    return user_info

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