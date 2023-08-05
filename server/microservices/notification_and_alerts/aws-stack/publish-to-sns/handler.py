import json
import boto3
import urllib3

def publish_to_sns(email):
    try:
        sns_client = boto3.client('sns')
        sns_topic_arn = "arn:aws:sns:us-east-1:227165718467:UsersAchievement"
        
        message = "Congrats you in the top 5 rankings of the leaderboard!"
        subject = "Congratulations"
        
        response = sns_client.publish(
            TopicArn=sns_topic_arn,
            Message=message,
            Subject=subject,
            MessageAttributes={
                "email": {
                    "DataType": "String",
                    "StringValue": email
                }
            }
        )
        
        print(f"Message sent to SNS topic for {email}: {response['MessageId']}")
    except Exception as e:
        print(e)

def fetch_user_emails():
    url = "https://s90mn5ladf.execute-api.us-east-1.amazonaws.com/topusers"
    http = urllib3.PoolManager()
    data = http.request('GET', url).data
    return data

def add_subscriber_to_sns_topic(email):
    try:
        sns_client = boto3.client('sns')
        sns_topic_arn = "arn:aws:sns:us-east-1:227165718467:UsersAchievement"
        
        response = sns_client.subscribe(
            TopicArn=sns_topic_arn,
            Protocol="email",
            Endpoint=email
        )
        
        print(f"Subscriber added to SNS topic for {email}: {response['SubscriptionArn']}")
    except Exception as e:
        print(e)

def lambda_handler(event, context):
    user_emails = fetch_user_emails()
    user_emails = json.loads(user_emails.decode('utf-8'))

    for email in user_emails:
        email = email.strip()
        add_subscriber_to_sns_topic(email)
        publish_to_sns(email)

    response = {
        "statusCode": 200,
        "body": json.dumps(user_emails)
    }

    return response
