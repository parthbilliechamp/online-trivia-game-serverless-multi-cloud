// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


/*
use this in index.js
import QuizPage from '../pages/QuizPage';
import ResultPage from '../pages/ResultPage';
<Route path="/get_questions" element={<QuizPage />} />
<Route path="/result" element={<ResultPage />} />
 */