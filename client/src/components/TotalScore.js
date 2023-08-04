// TotalScore.js
import React from "react";

function TotalScore({ totalScore }) {
  return (
    <div className="total-score">
      <div className="score-circle">
        <span>{totalScore}</span>
      </div>
      <div className="score-text">Total Score</div>
    </div>
  );
}

export default TotalScore;