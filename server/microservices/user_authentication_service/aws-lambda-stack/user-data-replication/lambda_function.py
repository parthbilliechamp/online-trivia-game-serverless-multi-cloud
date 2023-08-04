import json
import boto3
import os
from google.cloud import firestore

# Initialize Firestore client
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./private_key.json"
db = firestore.Client()

def copy_data_to_firestore(user_data):
    try:
        doc_ref = db.collection('users').document(user_data['user_id'])
        doc_ref.set({
            'Email': user_data['email'],
            'Contact': user_data['contact'],
            'Name': user_data['name'],
            'State': user_data['state'],
            'Status': user_data['status'],
            'UserId': user_data['user_id']
        })
        print("Data copied to Firestore for user_id:", user_data['user_id'])
    except Exception as e:
        print("Error copying data to Firestore:", e)

def get_user_data(event):
    new_item = event['Records'][0]['dynamodb']['NewImage']

    email = new_item['Email']['S']
    contact = new_item['Contact']['S']
    name = new_item['Name']['S']
    state = new_item['State']['S']
    status = new_item['Status']['S']
    user_id = new_item['UserId']['S']

    user_data = {
        'email': email,
        'contact': contact,
        'name': name,
        'state': state,
        'status': status,
        'user_id': user_id
    }

    print("Retrieved user data:", user_data)
    return user_data

def lambda_handler(event, context):
    print("Received event:", json.dumps(event))
    user_data = get_user_data(event)
    copy_data_to_firestore(user_data)
    return {
        'statusCode': 200,
        'body': json.dumps('Data saved to Firestore successfully!')
    }
