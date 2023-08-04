// QuestionCard.js
import React from 'react';
import { Container, Row, Col, Table,Button } from 'react-bootstrap';
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
      <br></br>
      <Row>
      <Col xs={12} md={6} className="mb-4">
        <div className="timer">Time Left: {timer}s</div>
        </Col>
        <Col xs={12} md={6} className="mb-4">
        <Button  style={{
          backgroundColor: "rgb(39, 83, 148)",
          color: "white",
          float:'right'
        }}  onClick={handleQuizCompletion}>Exit</Button></Col>
      </Row>
      
      <h4>1. {currentQuestion.question}</h4>
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
    
        <Row>
       
        <Col xs={12} md={12}className="mb-4">
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
          <Button  style={{
            backgroundColor: "rgb(39, 83, 148)",
            color: "white",
          }}onClick={() => handleCheckAnswer()}>Submit</Button>
        </div>
      )}
          </Col>
          <Col xs={12} md={12} className="mb-4">
             {/* Hint section */}
      {!shouldShowHint() && currentQuestion.hint && (
        <Button  style={{
          backgroundColor: "rgb(39, 83, 148)",
          color: "white",
        }} onClick={handleShowHint}>Hint</Button>
      )}
      {shouldShowHint() && (
        <div>
          <p>Hint: {currentQuestion.hint}</p>
        </div>
      )}
          </Col>
        
      
          <Col xs={12} md={11}>
          <Button  style={{
            backgroundColor: "rgb(39, 83, 148)",
            color: "white",float:'right'
          }}  onClick={() => handlePrevQuestion()} disabled={currentQuestionIndex === 0}>Back</Button>
          </Col>
          <Col  xs={12} md={1}>
          <Button  style={{
            backgroundColor: "rgb(39, 83, 148)",
            color: "white",float:'right'
          }} onClick={() => handleNextQuestion()} disabled={currentQuestionIndex === questionsLength - 1}>Next</Button>
          </Col>
        </Row>
        <br></br>
     
      {/*Check Answer*/}
      

     

     
     
    </div>
  );
}

export default QuestionCard;
