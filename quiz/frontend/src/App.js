import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/question');
      // Remove duplicates based on question IDs
      const uniqueQuestions = response.data.reduce((acc, question) => {
        const existingQuestion = acc.find((q) => q.id === question.id);
        if (!existingQuestion) {
          // Initialize selectedOption as an empty string ('') instead of null
          acc.push({ ...question, selectedOption: '' }); // Add selectedOption state for each question
        }
        return acc;
      }, []);
      setQuestions(uniqueQuestions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionSelect = (questionId, option) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        q.selectedOption = option;
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  
    const currentQuestion = questions[currentQuestionIndex];
    console.log('Selected Option:', currentQuestion.selectedOption);
    console.log('Correct Answer:', currentQuestion.answer);
  
    setIsAnswerCorrect(currentQuestion.selectedOption.toLowerCase() === currentQuestion.answer.toLowerCase());
  };
  
  

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    setShowExplanation(false); // Reset explanation state when moving to the previous question
    setIsAnswerCorrect(false); // Reset answer correctness state when moving to the previous question
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowExplanation(false); // Reset explanation state when moving to the next question
    setIsAnswerCorrect(false); // Reset answer correctness state when moving to the next question
  };

  const currentQuestion = questions[currentQuestionIndex];

  const isOptionSelected = currentQuestion && currentQuestion.selectedOption !== '';
  const isAnswerChecked = showExplanation && currentQuestion && currentQuestion.selectedOption !== '';

  return (
    <div>
      {currentQuestion && (
        <div key={currentQuestion.id}>
          <h1>Category: {currentQuestion.category}</h1>
          <h2>Difficulty: {currentQuestion.difficulty}</h2>
          <h3>{currentQuestion.question}</h3>
          <ul>
            <li
              style={{
                color: isOptionSelected && currentQuestion.selectedOption === 'option1' ? 'blue' : 'black',
              }}
              onClick={() => handleOptionSelect(currentQuestion.id, 'option1')}
            >
              Option 1: {currentQuestion.option1}
            </li>
            <li
              style={{
                color: isOptionSelected && currentQuestion.selectedOption === 'option2' ? 'blue' : 'black',
              }}
              onClick={() => handleOptionSelect(currentQuestion.id, 'option2')}
            >
              Option 2: {currentQuestion.option2}
            </li>
            <li
              style={{
                color: isOptionSelected && currentQuestion.selectedOption === 'option3' ? 'blue' : 'black',
              }}
              onClick={() => handleOptionSelect(currentQuestion.id, 'option3')}
            >
              Option 3: {currentQuestion.option3}
            </li>
            <li
              style={{
                color: isOptionSelected && currentQuestion.selectedOption === 'option4' ? 'blue' : 'black',
              }}
              onClick={() => handleOptionSelect(currentQuestion.id, 'option4')}
            >
              Option 4 {currentQuestion.option4}
            </li>
          </ul>
          {isAnswerChecked ? (
            <>
              <p>
                {isAnswerCorrect ? (
                  <span style={{ color: 'green' }}>Correct!</span>
                ) : (
                  <span style={{ color: 'red' }}>Incorrect! Correct answer: {currentQuestion.answer}</span>
                )}
              </p>
              <span>Explanation: {currentQuestion.explanation}</span>
              <p></p>
            </>
          ) : (
            <>
              <button onClick={() => handleCheckAnswer()}>Submit</button>
              {currentQuestion.hint && <button onClick={() => setShowExplanation(true)}>Hint</button>}
              {currentQuestion.hint && isAnswerChecked && <p>{currentQuestion.hint}</p>}
            </>
          )}
          <button onClick={() => handlePrevQuestion()} disabled={currentQuestionIndex === 0}>
            Back
          </button>
          <button onClick={() => handleNextQuestion()} disabled={currentQuestionIndex === questions.length - 1}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
