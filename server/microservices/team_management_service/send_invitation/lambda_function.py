import json
import boto3
import uuid

# Create an SNS client
sns = boto3.client('sns')

# Set up the SNS topic ARN
topic_arn = 'arn:aws:sns:us-east-1:189018341439:Send-mail_topic'

def get_invited_user_target_arn(invited_user):
    # Get all subscriptions to the SNS topic
    response = sns.list_subscriptions_by_topic(TopicArn=topic_arn)
    subscriptions = response['Subscriptions']
    
    # Find the subscription for the invitedUser
    for subscription in subscriptions:
        if subscription['Endpoint'] == invited_user:
            return subscription['SubscriptionArn']
    
    return None

# def generate_invitation_token():
#     return str(uuid.uuid4())  # Generates a random UUID (Universally Unique Identifier)

def send_invitation_email(invited_user, invitation_link):
    # Create the invitation message with the accept and decline links
    message = f"""
    Hello {invited_user},

    You've been invited to join the team. Click on the appropriate link below to respond:

    Accept: {invitation_link}
    Decline: {invitation_link}/decline

    Regards,
    Your Team
    """

    # Send the invitation message to the specific invitedUser
    sns.publish(
        TopicArn=topic_arn,
        Message=message,
        Subject='Team invited you to the team',
        MessageAttributes={
            'email': {
                'DataType': 'String',
                'StringValue': invited_user
            }
        }
    )

def lambda_handler(event, context):
    print(event)
    message_body = json.loads(event['Records'][0]['body'])  # Convert the message body to a Python dictionary

    print("======================================Get the invitedUser from the message body==================================")
    # Get the invitedUser from the message body
    invited_user = message_body.get('invitedUser')
    teamId = message_body.get('team_id')
    invited_user_id = message_body.get('invited_user_id')
    print(invited_user)
    if not invited_user:
        print("Invited user not found")
        return {
            'statusCode': 400,
            'body': 'Invited user not provided in the message'
        }

    print("===============Get the TargetArn for the invitedUser's subscription to the SNS topic================================")
    # Get the TargetArn for the invitedUser's subscription to the SNS topic
    target_arn = get_invited_user_target_arn(invited_user)
    print(target_arn)
    if not target_arn:
        print("target arn is not available.")
        return {
            'statusCode': 400,
            'body': 'Invited user is not subscribed to the SNS topic'
        }

    print("# Send the invitation message to the specific invitedUser")
    # Generate the invitation token
    # invitation_token = generate_invitation_token()

    # Create the invitation link
    invitation_link = f'https://frontendapp-7l4cel6fjq-ue.a.run.app/inviteduser?team_id={teamId}&&invited_user_id={invited_user_id}'

    # Send the invitation email with accept and decline links
    send_invitation_email(invited_user, invitation_link)

    return {
        'statusCode': 200,
        'body': 'Invitation message sent to the invited user'
    }
