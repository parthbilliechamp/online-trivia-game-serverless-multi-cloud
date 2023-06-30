import functions_framework
from flask import request, jsonify

@functions_framework.http
def get_security_questions(request):
    user_email = request.args.get('email')

    # Complete the rest of your code

    # Example response data
    security_questions = ['Question 1', 'Question 2', 'Question 3']

    response_data = {
        'security_questions': security_questions
    }

    return jsonify(response_data)