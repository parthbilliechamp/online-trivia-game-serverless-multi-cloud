import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/styles.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [timer, setTimer] = useState(20); // Timer for each question
  const [score, setScore] = useState(0); // Individual question score
  const [totalScore, setTotalScore] = useState(0); // Total score

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory, selectedDifficulty]);

  useEffect(() => {
    // Start the timer when the current question changes
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else {
        // Move to the next question when the timer reaches 0
        handleNextQuestion();
      }
    }, 1000);

    // Clean up the interval when the component unmounts or the current question changes
    return () => clearInterval(interval);
  }, [currentQuestionIndex, timer]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/question', {
        params: {
          category: selectedCategory,
          difficulty: selectedDifficulty,
        },
      });
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
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
      setIsAnswerCorrect(false);
      setShowHint(false);
      setTimer(20); // Reset the timer when fetching new questions
      setScore(0); // Reset the score when fetching new questions
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionSelect = (questionId, option) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        q.selectedOption = option === 'option1' ? q.option1 : option === 'option2' ? q.option2 : option === 'option3' ? q.option3 : q.option4;
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

    const isCorrect =
      currentQuestion.selectedOption && currentQuestion.selectedOption.toLowerCase() === currentQuestion.answer.toLowerCase();
    
    const questionScore = isCorrect ? 100 : 0;
    setScore(questionScore);
    setIsAnswerCorrect(isCorrect);
    setTotalScore((prevTotalScore) => prevTotalScore + questionScore); // Update total score
  };

  const shouldShowHint = () => {
    if (showHint && currentQuestion && currentQuestion.hint) {
      return true;
    }
    return false;
  };

  const handleShowHint = () => {
    setShowHint(true);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    setShowExplanation(false); // Reset explanation state when moving to the previous question
    setIsAnswerCorrect(false); // Reset answer correctness state when moving to the previous question
    setShowHint(false); // Reset showHint state when moving to the previous question
    setTimer(20); // Reset the timer when moving to the previous question
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowExplanation(false); // Reset explanation state when moving to the next question
    setIsAnswerCorrect(false); // Reset answer correctness state when moving to the next question
    setShowHint(true);
    setTimer(20); // Reset the timer when moving to the next question
  };

  const handleCategorySelect = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDifficultySelect = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isOptionSelected = currentQuestion && currentQuestion.selectedOption !== '';
  const isAnswerChecked = showExplanation && currentQuestion && currentQuestion.selectedOption !== '';

  return (
    <div className="container">
      <div>
        <label>
          Select Category:
          <select value={selectedCategory} onChange={handleCategorySelect}>
            <option value="">All</option>
            {/* Add options based on your available categories in Firestore */}
            <option value="kk">kk</option>
            <option value="Sport">Sport</option>
            <option value="e">e</option>
            <option value="ss">Category KK</option>
          </select>
        </label>
        <label>
          Select Difficulty:
          <select value={selectedDifficulty} onChange={handleDifficultySelect}>
            <option value="">All</option>
            {/* Add options based on your available difficulties in Firestore */}
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
        <button onClick={fetchQuestions}>Fetch Questions</button>
      </div>

      {currentQuestion && (
        <div key={currentQuestion.id}>
          <h1>Category: {currentQuestion.category}</h1>
          <h2>Difficulty: {currentQuestion.difficulty}</h2>
          <div className="timer">Time Left: {timer}s</div>
          <h3>{currentQuestion.question}</h3>
          <ul className="options-container">
            <li
              className={`option ${
                isOptionSelected && currentQuestion.selectedOption === 'option1' ? 'selected-option' : ''
              }`}
              onClick={() => handleOptionSelect(currentQuestion.id, 'option1')}
            >
              Option 1: {currentQuestion.option1}
            </li>
            <li
              className={`option ${
                isOptionSelected && currentQuestion.selectedOption === 'option2' ? 'selected-option' : ''
              }`}
              onClick={() => handleOptionSelect(currentQuestion.id, 'option2')}
            >
              Option 2: {currentQuestion.option2}
            </li>
            <li
              className={`option ${
                isOptionSelected && currentQuestion.selectedOption === 'option3' ? 'selected-option' : ''
              }`}
              onClick={() => handleOptionSelect(currentQuestion.id, 'option3')}
            >
              Option 3: {currentQuestion.option3}
            </li>
            <li
              className={`option ${
                isOptionSelected && currentQuestion.selectedOption === 'option4' ? 'selected-option' : ''
              }`}
              onClick={() => handleOptionSelect(currentQuestion.id, 'option4')}
            >
              Option 4 {currentQuestion.option4}
            </li>
          </ul>

          {isAnswerChecked ? (
            <div>
              <p>
                {isAnswerCorrect ? (
                  <span style={{ color: 'green' }}>Correct!</span>
                ) : (
                  <span style={{ color: 'red' }}>Incorrect! Correct answer: {currentQuestion.answer}</span>
                )}
              </p>
              <span>Explanation: {currentQuestion.explanation}</span>
              <p>Score for this question: {score}</p>
            </div>
          ) : (
            <>
              <button onClick={() => handleCheckAnswer()}>Submit</button>
              {currentQuestion.hint && <button onClick={handleShowHint}>Hint</button>}
            </>
          )}
          {!shouldShowHint() && currentQuestion.hint && (
            <button onClick={handleShowHint}>Hint</button>
          )}
          {/* Show the hint section */}
          {shouldShowHint() && (
            <div>
              <p>{currentQuestion.hint}</p>
            </div>
          )}

          <button onClick={() => handlePrevQuestion()} disabled={currentQuestionIndex === 0}>
            Back
          </button>
          <button onClick={() => handleNextQuestion()} disabled={currentQuestionIndex === questions.length - 1}>
            Next
          </button>
        </div>
      )}
      {questions.length > 0 && currentQuestionIndex === questions.length && (
        <div>
          <h1>Quiz Completed!</h1>
          <p>Total Score: {totalScore}</p>
        </div>
      )}
    </div>
  );
}

export default App;