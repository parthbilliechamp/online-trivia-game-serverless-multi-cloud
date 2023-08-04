import json
import boto3
import requests

def publish_to_sns(customer_order):
    sns_client = boto3.client('sns')
    sns_topic_arn = "arn:aws:sns:us-east-1:227165718467:CustomerOrderTopic"
    
    sns_client.publish(
        TopicArn=sns_topic_arn,
        Message=str(customer_order)
    )

def fetch_user_emails():
    try:
        url = "https://s90mn5ladf.execute-api.us-east-1.amazonaws.com/topusers"
        response = requests.get(url)
        
        if response.ok:
            data = response.json()
            return data["user_emails"]
        else:
            raise ValueError("Failed to fetch user emails")

    except Exception as error:
        print("Error fetching user emails:", error)



def hello(event, context):
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    user_emails = fetch_user_emails()
    print(user_emails)

    return response

    # Use this code if you don't use the http event with the LAMBDA-PROXY
    # integration
    """
    return {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "event": event
    }
    """
