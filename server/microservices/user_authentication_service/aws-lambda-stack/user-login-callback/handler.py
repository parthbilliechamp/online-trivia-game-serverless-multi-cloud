import requests

def hello(event, context):
    code = event['queryStringParameters']['code']
    client_id = 'umlids9prbksb5eupfj18blsd'
    callback_uri = 'https://trivia-quiz.auth.us-east-1.amazoncognito.com/'

    token_url = f'https://trivia-quiz.auth.us-east-1.amazoncognito.com/oauth2/token'
    token_payload = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'code': code,
        'redirect_uri': callback_uri,
        'scope': 'openid profile email phone aws.cognito.signin.user.admin' ,
    }

    token_response = requests.post(token_url, data=token_payload)
    token_data = token_response.json()
    access_token = token_data['access_token']
    
    user_attributes = get_user_attributes(access_token)

    return {
        'statusCode': 200,
        'body': user_attributes
    }

def get_user_attributes(access_token):
    user_info_url = 'https://trivia-quiz.auth.us-east-1.amazoncognito.com/oauth2/userInfo'
    headers = {
    'Authorization': 'Bearer ' + access_token
    }
    
    response = requests.get(user_info_url, headers=headers)
    if response.status_code == 200:
        user_info = response.json()
        return user_info
    else:
        print('Failed to retrieve user information:', response.text)