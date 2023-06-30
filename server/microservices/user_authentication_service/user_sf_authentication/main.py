import functions_framework
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask import Flask, request, jsonify
from flask_cors import CORS

#https://user-authentication-2f-7l4cel6fjq-uc.a.run.app

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
firestore_db = firestore.client()

@functions_framework.http
def sf_authenticate(request):

  data = request.get_json(silent=True)
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

