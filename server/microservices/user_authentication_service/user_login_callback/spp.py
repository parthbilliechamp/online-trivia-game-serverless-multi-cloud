import boto3

client_id = 'your-client-id'
user_pool_id = 'your-user-pool-id'
callback_uri = 'https://google.com'

def handle_callback(event, context):
    code = event['queryStringParameters']['code']

    client = boto3.client('cognito-idp')

    token_response = client.initiate_auth(
        ClientId=client_id,
        AuthFlow='AUTHORIZATION_CODE',
        AuthParameters={
            'CODE': code,
            'REDIRECT_URI': callback_uri
        }
    )

    access_token = token_response['AuthenticationResult']['AccessToken']

    user_attributes = get_user_attributes(access_token)

    return {
        'statusCode': 200,
        'body': user_attributes
    }

def get_user_attributes(access_token):
    client = boto3.client('cognito-idp')

    response = client.get_user(
        AccessToken=access_token
    )

    user_attributes = response['UserAttributes']

    return user_attributes
