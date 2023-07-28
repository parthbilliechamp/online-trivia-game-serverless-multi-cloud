import json
import boto3

def lambda_handler(event, context):
    # Extract team admin and invited user information from the event
    team_id = event['teamId']
    team_admin = event['teamAdmin']
    invited_user = event['invitedUser']
    invited_user_id = event['invitedUserId']

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
        'body': json.dumps('Invitation request sent successfully')
    }
