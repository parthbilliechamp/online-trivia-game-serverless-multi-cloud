from flask import Flask, jsonify
from flask_cors import CORS
from google.cloud import firestore

app = Flask(__name__)
CORS(app)

# Initialize Firestore
db = firestore.Client()

# API route to fetch questions from Firestore
@app.route('/api/question', methods=['GET', 'POST'])
def get_questions():
    questions = []
    # Fetch questions collection from Firestore
    collection_ref = db.collection('admingames')
    docs = collection_ref.get()
    for doc in docs:
        question_data = doc.to_dict()
        question_data['id'] = doc.id

        # Extract the "questions" field from the document and append to the questions list
        if 'questions' in question_data:
            questions.extend(question_data['questions'])

    return jsonify(questions)

if __name__ == '__main__':
    app.run(debug=True)
