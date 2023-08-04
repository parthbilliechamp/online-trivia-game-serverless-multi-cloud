// QuestionCard.js
import React from 'react';
import '../assets/styles/quizStyles.css';

function QuestionCard({
  currentQuestion,
  selectedOption,
  handleOptionSelect,
  isAnswerChecked,
  handleCheckAnswer,
  score,
  isAnswerCorrect,
  currentQuestionIndex,
  questionsLength,
  handlePrevQuestion,
  handleNextQuestion,
  handleQuizCompletion,
  shouldShowHint,
  timer,
  handleShowHint
}) {
  return (
    <div key={currentQuestion.id}>
      <div className="timer">Time Left: {timer}s</div>
      <h3>{currentQuestion.question}</h3>
      <ul className="options-container">
        <li
          className={`option ${selectedOption === 'option1' ? 'selected-option' : ''}`}
          onClick={() => handleOptionSelect(currentQuestion.id, 'option1')}
        >
          {currentQuestion.option1}
        </li>
        <li
          className={`option ${selectedOption === 'option2' ? 'selected-option' : ''}`}
          onClick={() => handleOptionSelect(currentQuestion.id, 'option2')}
        >
          {currentQuestion.option2}
        </li>
        <li
          className={`option ${selectedOption === 'option3' ? 'selected-option' : ''}`}
          onClick={() => handleOptionSelect(currentQuestion.id, 'option3')}
        >
          {currentQuestion.option3}
        </li>
        <li
          className={`option ${selectedOption === 'option4' ? 'selected-option' : ''}`}
          onClick={() => handleOptionSelect(currentQuestion.id, 'option4')}
        >
          {currentQuestion.option4}
        </li>
      </ul>

      {/*Check Answer*/}
      {isAnswerChecked ? (
        <div>
          <p>
            {isAnswerCorrect ? (
              <span className="ans_r">Correct!</span>
            ) : (
              <span className="ans_w">Incorrect! Correct answer: {currentQuestion.answer}</span>
            )}
          </p>
          <span>Explanation: {currentQuestion.explanation}</span>
          <p>Score for this question: {score}</p>
        </div>
      ) : (
        <div className="button-container">
          <button onClick={() => handleCheckAnswer()}>Submit</button>
        </div>
      )}

      {/* Hint section */}
      {!shouldShowHint() && currentQuestion.hint && (
        <button onClick={handleShowHint}>Hint</button>
      )}
      {shouldShowHint() && (
        <div>
          <p>Hint: {currentQuestion.hint}</p>
        </div>
      )}

      {/* Buttons */}
      <div>
        <p></p>
        <button onClick={() => handleNextQuestion()} disabled={currentQuestionIndex === questionsLength - 1}>Next</button>
      </div>
      <div>
        <button onClick={handleQuizCompletion}>Exit</button>
      </div>
    </div>
  );
}

export default QuestionCard;
