import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


const UpdateQuestionsPage = () => {
  const { gameId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch all the questions from http://localhost:5000/questions
    fetch('https://m0x25xomr8.execute-api.us-east-1.amazonaws.com/testing/getquestions')
      .then(response => response.json())
      .then(data => {
        const parsedData = JSON.parse(data.body); 
        setQuestions(parsedData);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });

    fetch(`https://67rd201n7b.execute-api.us-east-1.amazonaws.com/GetSpecificGame?game_id=${gameId}`)
      .then(response => response.json())
      .then(data => {
        const selectedQuestionIds = data.questions.map(question => question.id);
        setSelectedQuestions(selectedQuestionIds);
      })
      .catch(error => {
        console.error('Error fetching selected questions:', error);
      });
  }, [gameId]);

  const handleToggleSelect = questionId => {
    setSelectedQuestions(prevQuestions =>
      prevQuestions.includes(questionId)
        ? prevQuestions.filter(id => id !== questionId)
        : [...prevQuestions, questionId]
    );
  };

  const handleUpdate = async () => {
    const newlyTickedQuestions = questions.filter(
      question => selectedQuestions.includes(question.id) && !question.selected
    );
  
    if (newlyTickedQuestions.length === 0) {
      toast.error('No New Questions Added');
      return;
    }
  
    const updatedQuestions = newlyTickedQuestions.map(question => ({
      ...question,
      selected: true
    }));
  
    const requestBody = {
      questions: updatedQuestions
    };
    const requestEvent = {
      pathParameters: {
        game_id: gameId,
      },
      body: JSON.stringify(requestBody),
    };
    try {
      const response = await fetch(`https://tzmsiyarpa.execute-api.us-east-1.amazonaws.com/testing/editgame`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestEvent)
      });
  
      if (response.ok) {
        toast.success('Game updated successfully');
        navigate('/getgames'); 
      } else {
        throw new Error('Error updating questions');
      }
    } catch (error) {
      console.error('Error updating questions:', error);
      toast.error('Error updating questions');
    }
  };
  
  
      //used bootstrap and card view and card body
    //https://getbootstrap.com/docs/5.0/layout/containers/
    //https://getbootstrap.com/docs/5.0/components/card/

  return (
    <div className="container">
      <h1>Update Questions</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Option 1</th>
            <th>Option 2</th>
            <th>Option 3</th>
            <th>Option 4</th>
            <th>Category</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(question => (
            <tr key={question.id}>
              <td>{question.question}</td>
              <td>{question.answer}</td>
              <td>{question.option1}</td>
              <td>{question.option2}</td>
              <td>{question.option3}</td>
              <td>{question.option4}</td>
              <td>{question.category}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(question.id)}
                  onChange={() => handleToggleSelect(question.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleUpdate}>
        Update Game
      </button>
      <ToastContainer /> 

    </div>
  );
};

export default UpdateQuestionsPage;
