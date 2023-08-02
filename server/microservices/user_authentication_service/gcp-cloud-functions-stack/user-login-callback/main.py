import functions_framework
import requests
import logging

@functions_framework.http
def http(request):
    logging.info('Login callback function triggered.')

    request_args = request.args

    code = request_args['code']
    logging.info(f'Received authorization code: {code}')

    client_id = 'umlids9prbksb5eupfj18blsd'
    callback_uri = 'https://frontendapp-7l4cel6fjq-ue.a.run.app/login/'

    token_url = f'https://trivia-quiz.auth.us-east-1.amazoncognito.com/oauth2/token'
    token_payload = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'code': code,
        'redirect_uri': callback_uri,
        'scope': 'openid profile email phone aws.cognito.signin.user.admin',
    }

    token_response = requests.post(token_url, data=token_payload)
    token_data = token_response.json()
    logging.info('Received token response: %s', token_data)

    access_token = token_data['access_token']

    user_attributes = get_user_attributes(access_token)
    logging.info('Retrieved user attributes: %s', user_attributes)

        # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    return (user_attributes, 200, headers)

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
        logging.error('Failed to retrieve user information: %s', response.text)
