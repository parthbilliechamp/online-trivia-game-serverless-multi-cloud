import functions_framework
from flask import Flask, jsonify, request, redirect, url_for
from flask_cors import CORS
from google.cloud import firestore
import random
import boto3
import uuid
from botocore.exceptions import ClientError

db = firestore.Client()
aws_access_key_id = 'AKIAYYMCQ4PPFYQGX2WL'
aws_secret_access_key = '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'
region_name = 'us-east-1'

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@functions_framework.http
def hello_http(request):
    if request.method == 'OPTIONS':
        return add_cors_headers(jsonify({}))
        
    data = request.get_json(silent=True)
    print(data)
    total_score = data['total_score']
    category = data['category']
    date = data['date']

    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    
    if total_score is None:
        response = {'error': 'Total score is missing.'}
        return (response, 404, headers)
    
    
    admingames_doc_ref = db.collection('admingames').where('category', '==', category).limit(1)
    admingames_docs = admingames_doc_ref.get()

    if len(admingames_docs) == 0:
        response = {'error': 'admingames_docs is missing.'}
        return (response, 404, headers)

    # Extract the admingames ID from the document
    admingames_id = admingames_docs[0].id

    # Fetch two random teams from the "teams" collection
    teams_ref = db.collection('teams')
    teams_docs = teams_ref.get()
    random_teams = random.sample(teams_docs, 2)

    # Create a list to store the team scores
    team_scores = []

    for random_team in random_teams:
        # Extract team information
        team_id = random_team.id
        team_name = random_team.get('teamName')
        user_ids = random_team.get('users')  # If 'users' field is not present, default to an empty list

        # Fetch email IDs of the users associated with the team
        user_emails = []
        team_score = 0
        for user_id in user_ids:
            user_doc_ref = db.collection('users').document(user_id)
            user_doc = user_doc_ref.get()
            if user_doc.exists:
                user_email = user_doc.get('email')
                user_score = total_score
                user_emails.append({'user_id': user_id, 'email': user_email, 'User score': user_score})
                team_score += user_score

        # Create a dictionary for the current team's score
        team_score_data = {
            'Team id': team_id,
            'Team name': team_name,
            'Team score': team_score,
            'User_Score': user_emails
        }

        # Add the team score data to the list of team scores
        team_scores.append(team_score_data)

    score_id = str(uuid.uuid4())

    # Create a new document in the "Score" collection to store the total score
    score_data = {
        'ScoreID': score_id,
        'Game id': admingames_id,
        'Date': date,
        'Category': category,
        'Team Scores': team_scores  # Add the list of team scores to the "Team Scores" key
    }
    
    try:
        score_ref = db.collection('Score').add(score_data)

        # Initialize Boto3 DynamoDB resource and table inside the function
        dynamodb = boto3.resource(
            'dynamodb',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name
        )
        table = dynamodb.Table('Score')

        # Save the data in Amazon DynamoDB
        score_item = {
            'ScoreID': score_id,
            'GameID': admingames_id,
            'Date': date,
            'Category': category,
        }

        # Prepare the Team Scores data to be saved in DynamoDB
        team_scores_dynamodb = []
        for team_score_data in team_scores:
            team_score_dynamodb = {
                'TeamID': team_score_data['Team id'],
                'TeamName': team_score_data['Team name'],
                'TeamScore': team_score_data['Team score'],
                'UserScore': []
            }

            # Prepare the User Scores data for the current team to be saved in DynamoDB
            for user_score_data in team_score_data['User_Score']:
                user_score_dynamodb = {
                    'UserID': user_score_data['user_id'],
                    'Email': user_score_data['email'],
                    'UserScore': user_score_data['User score']
                }

                team_score_dynamodb['UserScore'].append(user_score_dynamodb)
            team_scores_dynamodb.append(team_score_dynamodb)
        score_item['TeamScores'] = team_scores_dynamodb
        table.put_item(Item=score_item)

        response = {'success': True, 'score_id': score_id}
        return (response, 201, headers)
    except ClientError as e:
        response = {'error': 'Failed to save score.', 'details': str(e)}
        return (response, 500, headers)