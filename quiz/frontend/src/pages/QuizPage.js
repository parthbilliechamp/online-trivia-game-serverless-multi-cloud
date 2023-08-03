// QuizPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/styles/quizStyles.css';
import { useNavigate } from 'react-router-dom';

import QuizSetup from '../components/QuizSetup';
import QuestionCard from '../components/QuestionCard';
import QuizCompletion from '../components/QuizCompletion';

function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [timer, setTimer] = useState(20); // Timer for each question
    const [score, setScore] = useState(0); // Individual question score
    const [totalScore, setTotalScore] = useState(0); // Total score
    const navigate = useNavigate();

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

      const handleFetchQuestions = () => {
        fetchQuestions();
      };  

      const fetchQuestions = async () => {
        try {
          const response = await axios.get(`https://us-central1-trivia-392000.cloudfunctions.net/quiz_get_question`, {
    
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
          setTimer(60); // Reset the timer when fetching new questions
          setScore(0); // Reset the score when fetching new questions
        } catch (error) {
          console.log(error);
        }
      };
    
      const handleOptionSelect = (questionId, option) => {
        setSelectedOption(option);
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
        setShowHint(false);
        setTimer(20); // Reset the timer when moving to the next question
      };
    
      const handleCategorySelect = (event) => {
        setSelectedCategory(event.target.value);
      };
    
      const handleDifficultySelect = (event) => {
        setSelectedDifficulty(event.target.value);
      };
    
      const handleQuizCompletion = async () => {
        // Make an API call to submit the total score to Firestore
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0];
        try {
          const response = await axios.post(`https://us-central1-trivia-392000.cloudfunctions.net/quiz_result`, {
            total_score: totalScore,
            category: selectedCategory,
            date: date
          });
          console.log('Score submitted successfully. Score ID:', response.data.score_id);
        } catch (error) {
          console.log('Failed to submit score:', error);
        }
        navigate('/result');
      };
    
      const currentQuestion = questions[currentQuestionIndex];
      const isAnswerChecked = showExplanation && currentQuestion && currentQuestion.selectedOption !== '';

    return (
        <div className="container">
        <QuizSetup
            selectedCategory={selectedCategory}
            handleCategorySelect={handleCategorySelect}
            selectedDifficulty={selectedDifficulty}
            handleDifficultySelect={handleDifficultySelect}
            handleFetchQuestions={handleFetchQuestions}
        />
        {currentQuestion && (
            <QuestionCard
            currentQuestion={currentQuestion}
            selectedOption={selectedOption}
            handleOptionSelect={handleOptionSelect}
            isAnswerChecked={isAnswerChecked}
            handleCheckAnswer={handleCheckAnswer}
            score={score}
            isAnswerCorrect={isAnswerCorrect}
            currentQuestionIndex={currentQuestionIndex}
            questionsLength={questions.length}
            handlePrevQuestion={handlePrevQuestion}
            handleNextQuestion={handleNextQuestion}
            handleQuizCompletion={handleQuizCompletion}
            shouldShowHint={shouldShowHint}
            timer={timer}
            handleShowHint={handleShowHint}
            />
        )}
        
        {/* Completion & Navigation */}
        {questions.length > 0 && currentQuestionIndex === questions.length && (
            <QuizCompletion totalScore={totalScore} handleQuizCompletion={handleQuizCompletion} />
        )}
        </div>
    );
}

export default QuizPage;
