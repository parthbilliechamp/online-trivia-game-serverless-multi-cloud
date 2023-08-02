import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
const QuestionPage = ({ location }) => {
  const navigate = useNavigate();
  const { gameId } = useParams(); 
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    fetch(`https://m0x25xomr8.execute-api.us-east-1.amazonaws.com/testing/getquestions`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        console.log(data)
        const parsedData = JSON.parse(data.body); 
      
        const questionsWithSelection = parsedData.map(question => ({
          ...question,
          selected: false,
        }));
        setQuestions(questionsWithSelection);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }, [gameId]); 

  const handleToggleSelect = questionId => {
    setQuestions(prevQuestions =>
      prevQuestions.map(question => {
        if (question.id === questionId) {
          return {
            ...question,
            selected: !question.selected,
          };
        }
        return question;
      })
    );
  };

  const handleCreateGame = async () => {
    const selectedQuestions = questions.filter(question => question.selected);
  
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question.');
      return;
    }
  
    const requestBody = {
      questions: selectedQuestions,
    };
  
    const requestEvent = {
      pathParameters: {
        game_id: gameId,
      },
      body: JSON.stringify(requestBody),
    };
  
    try {
      const response = await fetch('https://tzmsiyarpa.execute-api.us-east-1.amazonaws.com/testing/editgame', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestEvent),
      });
  
      if (response.ok) {
        toast.success('Game created Sucessfully');
        navigate('/getgames');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating game');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating game');
    }
  };
  
  

  return (
    <div className="container">
      <h1 className="mt-4">Questions</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Option 1</th>
            <th>Option 2</th>
            <th>Option 3</th>
            <th>Option 4</th>
            <th>Difficulty</th>
            <th>Category</th>
            <th>Hint</th>
            <th>Explanation</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>{question.question}</td>
              <td>{question.answer}</td>
              <td>{question.option1}</td>
              <td>{question.option2}</td>
              <td>{question.option3}</td>
              <td>{question.option4}</td>
              <td>{question.difficulty}</td>
              <td>{question.category}</td>
              <td>{question.hint}</td>
              <td>{question.explanation}</td>
              <td>
                <input
                  type="checkbox"
                  checked={question.selected}
                  onChange={() => handleToggleSelect(question.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleCreateGame}>
        Create Game
      </button>
      <ToastContainer /> 
    </div>
  );
};

export default QuestionPage;
