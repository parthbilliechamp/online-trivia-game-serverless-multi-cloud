import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('./Trivia_firestore_key.json')
firebase_admin.initialize_app(cred, {
    'projectId': 'trivia-392000',
})

db = firestore.client()

def handler(event, context):
    category = event.get('queryStringParameters', {}).get('category')
    difficulty_level = event.get('queryStringParameters', {}).get('difficultyLevel')
    time_frame = event.get('queryStringParameters', {}).get('timeFrame')

    query = db.collection('TriviaGames')

    if category:
        query = query.where('category', '==', category)

    if difficulty_level:
        query = query.where('difficultyLevel', '==', difficulty_level)

    if time_frame:
        query = query.where('timeFrame', '==', time_frame)

    trivia_games = query.get()

    game_list = []
    for game in trivia_games:
        game_data = game.to_dict()
        game_info = {
            'gameId': game.id,
            'category': game_data['category'],
            'difficultyLevel': game_data['difficultyLevel'],
            'timeFrame': game_data['timeFrame'],
            'description': game_data['description']
        }
        game_list.append(game_info)

    return {
        'statusCode': 200,
        'body': json.dumps(game_list)
    }
