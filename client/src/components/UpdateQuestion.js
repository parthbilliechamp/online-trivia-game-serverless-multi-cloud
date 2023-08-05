import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { useParams } from 'react-router-dom';

const UpdateQuestionPage = () => {
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
  });
  const { questionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://0syqhh2iy0.execute-api.us-east-1.amazonaws.com/getSpecificQuestion?question_id=${questionId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setQuestionData(data);
      })
      .catch(error => {
        console.error('Error fetching question data:', error);
      });
  }, [questionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    const requestBody = {
      pathParameters: {
        question_id: questionId,
      },
      body: JSON.stringify(questionData),
    };
  
    fetch('https://g869b5m1ja.execute-api.us-east-1.amazonaws.com/testing/editquestion', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (response.ok) {
          toast.success('Question updated successfully');
          navigate('/getquestion');
        } else {
          throw new Error('Error updating question');
        }
      })
      .catch(error => {
        console.error('Error updating question:', error);
        toast.error('Error updating question');
      });
  };
  
    //used bootstrap and card view and card body
    //https://getbootstrap.com/docs/5.0/layout/containers/
    //https://getbootstrap.com/docs/5.0/components/card/
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Update Question</h1>
              <form>
                <div className="mb-3">
                  <label htmlFor="question" className="form-label">Question:</label>
                  <input type="text" className="form-control" id="question" name="question" value={questionData.question} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="option1" className="form-label">Option 1:</label>
                  <input type="text" className="form-control" id="option1" name="option1" value={questionData.option1} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="option2" className="form-label">Option 2:</label>
                  <input type="text" className="form-control" id="option2" name="option2" value={questionData.option2} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="option3" className="form-label">Option 3:</label>
                  <input type="text" className="form-control" id="option3" name="option3" value={questionData.option3} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="option4" className="form-label">Option 4:</label>
                  <input type="text" className="form-control" id="option4" name="option4" value={questionData.option4} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="answer" className="form-label">Answer:</label>
                  <input type="text" className="form-control" id="answer" name="answer" value={questionData.answer} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category:</label>
                  <input type="text" className="form-control" id="category" name="category" value={questionData.category} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="hint" className="form-label">Hint:</label>
                  <input type="text" className="form-control" id="hint" name="hint" value={questionData.hint} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="explanation" className="form-label">Explanation:</label>
                  <input type="text" className="form-control" id="explanation" name="explanation" value={questionData.explanation} onChange={handleChange} />
                </div>
                <button type="button" className="btn btn-primary mt-3" onClick={handleUpdate}>Update Question</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default UpdateQuestionPage;
