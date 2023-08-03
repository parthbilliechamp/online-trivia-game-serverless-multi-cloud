import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import boto3
import datetime

def get_firebase_key():
    secret_name = "firestore_db_key"
    region_name = "us-east-1" 
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_name)["SecretString"]
    firebase_key = json.loads(secret_value)
    return firebase_key

def handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json"
    }

    firebase_key = get_firebase_key()

    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_key)
        firebase_admin.initialize_app(cred, {
            'projectId': 'trivia-392000',
        })

    db = firestore.client()

    print("==================================================EVENT======================================")
    print(event)
    # print(json.loads(event))
    # event = json.loads(e)
    # print(event)

    # queryStringParameters = event.get("queryStringParameters")
    # category = queryStringParameters.get('category')
    # print("category ======")
    # print(category)
    # difficulty_level = queryStringParameters.get('difficultyLevel')
    # print("difficulty_level ======")
    # print(difficulty_level)
    # time_frame = queryStringParameters.get('timeFrame')
    # print("time_frame ======")
    # print(time_frame)


    queryStringParameters = event.get("queryStringParameters")
    category = queryStringParameters.get('category') if queryStringParameters else None
    print("category ======")
    print(category)
    difficulty_level = queryStringParameters.get('difficultyLevel') if queryStringParameters else None
    print("difficulty_level ======")
    print(difficulty_level)
    time_frame = queryStringParameters.get('timeFrame') if queryStringParameters else None
    print("time_frame ======")
    print(time_frame)


    # category = event["queryStringParameters"]['category']
    # print("category ======")
    # print(category)
    # # difficulty_level = event.get('queryStringParameters', {}).get('difficultyLevel')
    # difficulty_level = event["queryStringParameters"]['difficultyLevel']
    # print("difficulty_level ======")
    # print(difficulty_level)
    # # time_frame = event.get('queryStringParameters', {}).get('timeFrame')
    # time_frame = event["queryStringParameters"]['timeFrame']
    # print("time_frame ======")
    # print(time_frame)
    
    query = db.collection('admingames')
    print("query =====")
    print(query)

    if category is not None:
        print("inside category")
        query = query.where('category', '==', category)
        print(query)

    if difficulty_level is not None:
        print("inside difficultyLevel")
        query = query.where('difficulty', '==', difficulty_level)
        print(query)

    if time_frame is not None:
        print("inside timeFrame")
        query = query.where('timeframe', '==', time_frame)
        print(query)

    trivia_games = query.get()

    game_list = []
    for game in trivia_games:
        print("========================================================")
        print("Inside first for loop")
        game_data = game.to_dict()
        print("Game_data =============")
        print(game_data)

        teams = []
        print("array of teams =========")
        print(game_data['teams'])
        print("=======================================================)")
        for team_id in game_data['teams']:
            print("Inside second for loop") 
            team_doc = db.collection('teams').document(team_id).get()
            print("Team Doc =====")
            print(team_doc)

            users = []
            team_data = team_doc.to_dict()
            team_members = team_data.get('users', [])
            for user_id in team_members:
                print("inside third for loop")
                user_doc = db.collection('users').document(user_id).get()
                if user_doc.exists:
                    user_data = {
                        'userId': user_id,
                        'userName': user_doc.get('name'),
                    }
                    users.append(user_data)
            print(users)

            team_data = {
                'teamId': team_id,
                'teamName': team_data.get('name'),
                'teamMembers': users
            }
            teams.append(team_data)

        game_info = {
            'gameId': game.id,
            'category': game_data['category'],
            'difficultyLevel': game_data['difficulty'],
            'timeFrame': game_data['timeframe'],
            'description': game_data['description'],
            'teams': teams,
            'status': game_data['status'],
            'start_time' : game_data['start_time']
        }
        game_list.append(game_info)

    print("Game List =============")
    print(json.dumps(game_list))

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(game_list)
    }
