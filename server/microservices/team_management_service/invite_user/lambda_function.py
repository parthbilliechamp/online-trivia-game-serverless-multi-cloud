import json
import boto3

def lambda_handler(event, context):
    # Extract team admin and invited user information from the event

    headers = {
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json"
    }

    request_body = json.loads(event["body"])

    team_id = request_body.get("teamId")
    team_admin = request_body.get("teamAdmin")
    invited_user = request_body.get("invitedUser")
    invited_user_id = request_body.get("invitedUserId")

    # Create an SQS client
    sqs = boto3.client('sqs')

    # Set up the SQS queue URL
    queue_url = 'https://sqs.us-east-1.amazonaws.com/189018341439/email_info_queue'  

    # Create the invitation message
    invitation_message = {
        'teamAdmin': team_admin,
        'invitedUser': invited_user,
        'team_id':team_id,
        'invited_user_id': invited_user_id
    }

    # Send the invitation message to the SQS queue
    sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps(invitation_message)
    )

    # Return a response indicating successful message submission
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps('Invitation request sent successfully')
    }
