// QuizCompletion.js
import React from 'react';
import '../assets/styles/quizStyles.css';

function QuizCompletion({ totalScore, handleQuizCompletion }) {
  return (
    <div>
      <h1>Quiz Completed!</h1>
      <p>Total Score: {totalScore}</p>
      <button onClick={handleQuizCompletion}>Exit</button>
    </div>
  );
}

export default QuizCompletion;
