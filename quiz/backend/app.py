from flask import Flask, jsonify, request, redirect, url_for
from flask_cors import CORS
from google.cloud import firestore
import random

app = Flask(__name__)
CORS(app)

# Initialize Firestore
db = firestore.Client()

@app.route('/')
def index():
    return redirect(url_for('get_question'))

@app.route('/get_questions', methods=['GET', 'POST'])
def get_question():
    category = request.args.get('category', default=None, type=str)
    difficulty = request.args.get('difficulty', default=None, type=str)
    print("Received category:", category)
    print("Received difficulty:", difficulty)

    questions = []
    # Fetch questions collection from Firestore
    collection_ref = db.collection('admingames')
    query = collection_ref.where('category', '==', category).where('difficulty', '==', difficulty)
    print('query: ', query)
    docs = query.get()

    for doc in docs:
        question_data = doc.to_dict()
        question_data['id'] = doc.id

        # Extract the "questions" field from the document and append to the questions list
        if 'questions' in question_data:
            questions.extend(question_data['questions'])

    return jsonify(questions)

@app.route('/submit_score', methods=['POST'])
def submit_score():
    total_score = request.json.get('total_score')
    category = request.json.get('category')
    date = request.json.get('date')
    
    if total_score is None:
        return jsonify({'error': 'Total score is missing.'}), 400
    
    admingames_doc_ref = db.collection('admingames').where('category', '==', category).limit(1)
    admingames_docs = admingames_doc_ref.get()

    if len(admingames_docs) == 0:
        return jsonify({'error': 'No matching admingames document found.'}), 404

    # Extract the admingames ID from the document
    admingames_id = admingames_docs[0].id

    # Fetch two random teams from the "teams" collection
    teams_ref = db.collection('teams')
    teams_docs = teams_ref.get()
    random_teams = random.sample(teams_docs, 2)

    # Create a list to store the team scores
    team_scores = []

    for random_team in random_teams:
        # Extract team information
        team_id = random_team.id
        team_name = random_team.get('teamName')
        user_ids = random_team.get('users')  # If 'users' field is not present, default to an empty list

        # Fetch email IDs of the users associated with the team
        user_emails = []
        team_score = 0
        for user_id in user_ids:
            user_doc_ref = db.collection('users').document(user_id)
            user_doc = user_doc_ref.get()
            if user_doc.exists:
                user_email = user_doc.get('email')
                user_score = total_score
                user_emails.append({'user_id': user_id, 'email': user_email, 'User score': user_score})
                team_score += user_score

        # Create a dictionary for the current team's score
        team_score_data = {
            'Team id': team_id,
            'Team name': team_name,
            'Team score': team_score,
            'User_Score': user_emails
        }

        # Add the team score data to the list of team scores
        team_scores.append(team_score_data)

    # Create a new document in the "Score" collection to store the total score
    score_data = {
        'Game id': admingames_id,
        'Date': date,
        'Category': category,
        'Team Scores': team_scores  # Add the list of team scores to the "Team Scores" key
    }
    
    try:
        score_ref = db.collection('Score').add(score_data)
        return jsonify({'success': True, 'score_id': score_ref.id}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to save score.', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)