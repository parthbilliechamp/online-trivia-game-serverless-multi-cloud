import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const QuestionForm = () => {
  const [questionData, setQuestionData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
    category: '',
    hint: '',
    explanation: '',
    difficulty: '' 
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://sc4bprych1.execute-api.us-east-1.amazonaws.com/testing/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: JSON.stringify(questionData)
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        const parsedData = JSON.parse(data.body);
        const question_id = parsedData.question_id
        console.log(question_id,"question_id")  
        const classifyResponse = await fetch(`https://us-central1-trivia-392000.cloudfunctions.net/node_automated/classify-question/${question_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(classifyResponse,"classifyResponse")
  
        if (classifyResponse.ok) {
          const classifyData = await classifyResponse.json();
          toast.success("Automated Question Tagging Done");
          console.log(classifyData, "classification_data");
        } else {
          throw new Error('Error classifying question');
        }
  
        toast.success('Question added successfully');
        setQuestionData({
          question: '',
          option1: '',
          option2: '',
          option3: '',
          option4: '',
          answer: '',
          category: '',
          hint: '',
          explanation: '',
          difficulty: ''
        });
        navigate('/getquestion');
      } else {
        throw new Error('Error adding question');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error adding question');
    }
  };
      //used bootstrap and card view and card body
    //https://getbootstrap.com/docs/5.0/layout/containers/
    //https://getbootstrap.com/docs/5.0/components/card/
  return (
    <div className="container py-6">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Add Question</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="question" className="form-label">
                    Question:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="question"
                    name="question"
                    value={questionData.question}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="option1" className="form-label">
                      Option 1:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="option1"
                      name="option1"
                      value={questionData.option1}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="option2" className="form-label">
                      Option 2:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="option2"
                      name="option2"
                      value={questionData.option2}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="option3" className="form-label">
                      Option 3:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="option3"
                      name="option3"
                      value={questionData.option3}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="option4" className="form-label">
                      Option 4:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="option4"
                      name="option4"
                      value={questionData.option4}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="answer" className="form-label">
                    Answer:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="answer"
                    name="answer"
                    value={questionData.answer}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="difficulty" className="form-label">
                    Difficulty:
                  </label>
                  <select
                    className="form-select"
                    id="difficulty"
                    name="difficulty"
                    value={questionData.difficulty}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="category" className="form-label">
                    Category:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={questionData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="hint" className="form-label">
                    Hint:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="hint"
                    name="hint"
                    value={questionData.hint}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="explanation" className="form-label">
                    Explanation:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="explanation"
                    name="explanation"
                    value={questionData.explanation}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Add Question
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default QuestionForm;
