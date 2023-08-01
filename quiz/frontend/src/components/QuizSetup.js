// QuizSetup.js
import React from 'react';
import '../assets/styles/quizStyles.css';

function QuizSetup({ 
    selectedCategory, 
    handleCategorySelect, 
    selectedDifficulty, 
    handleDifficultySelect, 
    handleFetchQuestions 
}) {
  return (
    <div>
      <label>
        {/* Select Category*/}
        Select Category:
        <select value={selectedCategory} onChange={handleCategorySelect}>
          <option value="">Any</option>
          <option value="Sport">Sport</option>
          <option value="e">e</option>
          <option value="ss">ss</option>
        </select>
      </label>
      <label>
        {/* Select Category*/}
        Select Difficulty:
        <select value={selectedDifficulty} onChange={handleDifficultySelect}>
          <option value="">Any</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </label>
      <button onClick={handleFetchQuestions}>Fetch Questions</button>
    </div>
  );
}

export default QuizSetup;
