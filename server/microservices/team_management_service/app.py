from flask import Flask, request, jsonify
import boto3
import requests
import openai

app = Flask(__name__)

# Initialize AWS services
dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')
sqs = boto3.client('sqs')

# DynamoDB table names
TEAMS_TABLE_NAME = 'teams'
USERS_TABLE_NAME = 'users'

# AWS SNS Topic ARN for team invitation notifications
INVITATION_TOPIC_ARN = 'arn:aws:sns:us-west-2:123456789012:team_invitations'

# OpenAI ChatGPT API Key
# CHATGPT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'
openai.api_key = "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"

# Flask route to create a new team with an AI-generated name


@app.route('/team/create', methods=['POST'])
def create_team():
    # Generate AI team name using a third-party API
    ai_team_name = generate_ai_team_name()

    # Create a new team record in DynamoDB
    # team_id = create_team_record(ai_team_name)

    # return jsonify({'team_id': team_id, 'team_name': ai_team_name})
    return jsonify({'team_name': ai_team_name})

# Flask route to invite users to join a team


@app.route('/team/invite', methods=['POST'])
def invite_users():
    team_id = request.json['team_id']
    users = request.json['users']

    # Send team invitation notifications using SNS
    for user in users:
        send_invitation_notification(team_id, user)

    return jsonify({'message': 'Invitations sent successfully.'})

# Flask route to accept or decline team invitations


@app.route('/team/invitation/accept', methods=['POST'])
def accept_invitation():
    user_id = request.json['user_id']
    team_id = request.json['team_id']

    # Update user's team record in DynamoDB
    update_user_team(user_id, team_id)

    # Send acknowledgement to the inviter using SNS
    send_acknowledgement(team_id, user_id)

    return jsonify({'message': 'Invitation accepted.'})


@app.route('/team/invitation/decline', methods=['POST'])
def decline_invitation():
    user_id = request.json['user_id']
    team_id = request.json['team_id']

    # Remove the invitation from the user's record in DynamoDB
    remove_invitation(user_id, team_id)

    return jsonify({'message': 'Invitation declined.'})

# Function to generate AI team name using a third-party API


def generate_ai_team_name():
    # Define your prompt or message for the AI
    prompt = "Please suggest a creative team name for our trivia game team:"

    # Generate AI response using ChatGPT API
    response = openai.Completion.create(
        engine='text-davinci-003',
        prompt=prompt,
        max_tokens=30,
        n=1,
        stop=None,
        temperature=0.7
    )

    # Extract the generated team name from the AI response
    team_name = response.choices[0].text.strip()

    return team_name

# Function to create a new team record in DynamoDB


def create_team_record(team_name):
    table = dynamodb.Table(TEAMS_TABLE_NAME)

    # Generate a unique team ID
    team_id = generate_unique_id()

    # Create the team record in DynamoDB
    team_data = {'team_id': team_id, 'team_name': team_name}
    table.put_item(Item=team_data)

    return team_id

# Function to send team invitation notifications using SNS


def send_invitation_notification(team_id, user):
    message = f"You have been invited to join Team {team_id}!"
    sns.publish(TopicArn=INVITATION_TOPIC_ARN,
                Message=message, Subject='Team Invitation')

# Function to update user's team record in DynamoDB


def update_user_team(user_id, team_id):
    table = dynamodb.Table(USERS_TABLE_NAME)

    # Update the user's team record in DynamoDB
    table.update_item(
        Key={'user_id': user_id},
        UpdateExpression='SET team_id = :team_id',
        ExpressionAttributeValues={':team_id': team_id}
    )

# Function to send acknowledgement to the inviter using SNS


def send_acknowledgement(team_id, user_id):
    message = f"{user_id} has accepted the invitation to join Team {team_id}!"
    sns.publish(TopicArn=INVITATION_TOPIC_ARN,
                Message=message, Subject='Invitation Accepted')

# Function to remove the invitation from the user's record in DynamoDB


def remove_invitation(user_id, team_id):
    table = dynamodb.Table(USERS_TABLE_NAME)

    # Remove the invitation from the user's record in DynamoDB
    table.update_item(
        Key={'user_id': user_id},
        UpdateExpression='REMOVE invitations.#team_id',
        ExpressionAttributeNames={'#team_id': team_id}
    )

# Function to generate a unique ID for teams or users


def generate_unique_id():
    # Your logic to generate a unique ID (e.g., UUID, timestamp-based, etc.)
    pass


if __name__ == '__main__':
    app.run(debug=True)
