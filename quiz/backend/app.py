from flask import Flask, jsonify, request, redirect, url_for
from flask_cors import CORS
from google.cloud import firestore

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
    
    if total_score is None:
        return jsonify({'error': 'Total score is missing.'}), 400

    # Create a new document in the "Score" collection to store the total score
    score_data = {
        'total_score': total_score,
        'timestamp': firestore.SERVER_TIMESTAMP
    }
    
    try:
        score_ref = db.collection('Score').add(score_data)
        return jsonify({'success': True, 'score_id': score_ref.id}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to save score.', 'details': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)