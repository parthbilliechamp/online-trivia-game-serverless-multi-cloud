import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
const QuestionPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const handleHome = () => {
    navigate('/admin');
  };

  useEffect(() => {
    fetch('https://m0x25xomr8.execute-api.us-east-1.amazonaws.com/testing/getquestions')
      .then(response => response.json())
      .then(data => {
        console.log(data); 
        const parsedData = JSON.parse(data.body); 
        setQuestions(parsedData);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  const handleUpdate = (questionId) => {
    navigate(`/updatequestion/${questionId}`);
  };

  const handleAddQuestion = () => {
    navigate('/addquestion');
  };
  const handleDelete = (questionId) => {
    const confirmed = window.confirm('Are you sure you want to delete the question?');
    if (confirmed) {
      fetch(`https://j1rkizdah9.execute-api.us-east-1.amazonaws.com/deletequestion?question_id=${questionId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            toast.success('Question deleted successfully');
            setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== questionId));

            
          } else {
            toast.error('Error Deleting Question')
            throw new Error('Error deleting question');
          }
        })
        .catch(error => {
          console.error('Error deleting question:', error);
          alert('Error deleting question');
        });
    }
    navigate('/getquestion');
  };
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleDifficultyFilter = (e) => {
    setDifficultyFilter(e.target.value);
  };

  const uniqueCategories = [...new Set(questions.map(question => question.category))];

  const filteredQuestions = questions.filter(question => {
    if (searchTerm === '' && categoryFilter === '' && difficultyFilter === '') {
      return true;
    }
    return (
      (searchTerm === '' || question.question.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === '' || question.category?.toLowerCase() === categoryFilter.toLowerCase()) &&
      (difficultyFilter === '' || question.difficulty?.toLowerCase() === difficultyFilter.toLowerCase())
    );
  });
    //used bootstrap and card view and card body
    //https://getbootstrap.com/docs/5.0/layout/containers/
    //https://getbootstrap.com/docs/5.0/components/card/
  return (
    <div className="container">
      <h1 className="mt-4">Questions</h1>
      <div className="list-group">
        <div className="mb-3 d-flex align-items-end">
          <div className="me-3">
            <label htmlFor="searchTerm" className="form-label">Search by Question</label>
            <input
              type="text"
              className="form-control"
              id="searchTerm"
              name="searchTerm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="me-3">
            <label htmlFor="categoryFilter" className="form-label">Filter by Category:</label>
            <select
              className="form-select"
              id="categoryFilter"
              value={categoryFilter}
              onChange={handleCategoryFilter}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="difficultyFilter" className="form-label">Filter by Difficulty:</label>
            <select
              className="form-select"
              id="difficultyFilter"
              value={difficultyFilter}
              onChange={handleDifficultyFilter}
            >
              <option value="">Select by Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={handleHome}
              style={{ padding: '6px 12px', fontSize: '14px' ,marginLeft:'20px'}} 
            >
              Home
            </button>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAddQuestion}
            style={{ padding: '6px 12px', fontSize: '14px',marginLeft:'20px' }} 
          >
            Add Question
          </button>
        </div>
        
        
        <table className="table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Option 1</th>
              <th>Option 2</th>
              <th>Option 3</th>
              <th>Option 4</th>
              <th>Difficulty</th>
              <th>Category</th>
              <th>Hint</th>
              <th>Explanation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question, index) => (
              <tr key={index}>
                <td>{question.question}</td>
                <td>{question.answer}</td>
                <td>{question.option1}</td>
                <td>{question.option2}</td>
                <td>{question.option3}</td>
                <td>{question.option4}</td>
                <td>{question.difficulty}</td>
                <td>{question.category}</td>
                <td>{question.hint}</td>
                <td>{question.explanation}</td>
                {/* <td>{question.id}</td> */}
                <td>
                  <button className="btn btn-primary me-2" onClick={() => handleUpdate(question.id)}>Update</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(question.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default QuestionPage;
