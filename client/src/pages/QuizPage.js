// QuizPage.js
import React, { useEffect, useState } from "react";
import "../assets/styles/quizStyles.css";
import { useLocation, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import QuizCompletion from "../components/QuizCompletion";
import TotalScore from "../components/TotalScore";

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [timer, setTimer] = useState(20); // Timer for each question
  const [score, setScore] = useState(0); // Individual question score
  const [totalScore, setTotalScore] = useState(0); // Total score
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { game } = location.state;
    console.log(game);
    setQuestions((prevQuestions) => {
      // Update the questions state using the game.questions prop
      if (game.questions && game.questions.length > 0) {
        setCurrentQuestionIndex(0);
        setShowExplanation(false);
        setIsAnswerCorrect(false);
        setShowHint(false);
        setTimer(60);
        setScore(0);
        setSelectedCategory(game.category);
        return game.questions;
      }
      return prevQuestions;
    });
  }, [location.state]);

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timer]);

  const handleOptionSelect = (questionId, option) => {
    setSelectedOption(option);
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        q.selectedOption =
          option === "option1"
            ? q.option1
            : option === "option2"
            ? q.option2
            : option === "option3"
            ? q.option3
            : q.option4;
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);

    const currentQuestion = questions[currentQuestionIndex];
    console.log("Selected Option:", currentQuestion.selectedOption);
    console.log("Correct Answer:", currentQuestion.answer);

    const isCorrect =
      currentQuestion.selectedOption &&
      currentQuestion.selectedOption.toLowerCase() ===
        currentQuestion.answer.toLowerCase();

    const questionScore = isCorrect ? 100 : 0;
    setScore(questionScore);
    setIsAnswerCorrect(isCorrect);
    setTotalScore((prevTotalScore) => prevTotalScore + questionScore);
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
    console.log("here");
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    console.log(currentQuestionIndex);
    setShowExplanation(false); // Reset explanation state when moving to the next question
    setIsAnswerCorrect(false); // Reset answer correctness state when moving to the next question
    setShowHint(false);
    setTimer(20); // Reset the timer when moving to the next question
  };

  const handleQuizCompletion = async () => {
    // Make an API call to submit the total score to Firestore
    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        total_score: totalScore,
        category: selectedCategory,
        date: date,
      }),
    };

    try {
      const response = await fetch(
        "https://us-central1-trivia-392000.cloudfunctions.net/quiz_result",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const responseData = await response.json();
      console.log(
        "Score submitted successfully. Score ID:",
        responseData.score_id
      );
    } catch (error) {
      console.log("Failed to submit score:", error);
    }

    navigate("/result");
  };

  const currentQuestion = questions[currentQuestionIndex];
  console.log(currentQuestion);
  const isAnswerChecked =
    showExplanation && currentQuestion && currentQuestion.selectedOption !== "";

  return (
    <div className="container_quiz">
      <TotalScore totalScore={totalScore} />
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
        <QuizCompletion
          totalScore={totalScore}
          handleQuizCompletion={handleQuizCompletion}
        />
      )}
    </div>
  );
}

export default QuizPage;
