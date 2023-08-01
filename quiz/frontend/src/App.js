import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={QuizPage} />
          <Route exact path="/result" component={ResultPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
