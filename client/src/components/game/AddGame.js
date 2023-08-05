import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddGamePage = () => {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState(null);
  const [gameData, setGameData] = useState({
    name: '',
    difficulty: 'Select Difficulty',
    category: '',
    timeframe: '',
    start_time: '',
    end_time: '',
    description: '',
    question: '',
    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setGameData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();  
    try {
      if (new Date(gameData.end_time) < new Date(gameData.start_time)) {
        toast.error('End Time cannot be less than Start Time.');
        return;
      }
      //Posting the details to the API
      const response = await fetch('https://dtudhiworh.execute-api.us-east-1.amazonaws.com/testing/addgame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: JSON.stringify(gameData)
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        const parsedBody = JSON.parse(data.body); 
        const generatedGameId = parsedBody.id;
        setGameId(generatedGameId);
        setGameData({
          name: '',
          difficulty: 'Select Difficulty',
          category: '',
          timeframe: '',
          start_time: '',
          end_time: '',
          description: '',
          question: ''
        });

      } else {
        throw new Error('Error adding game');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error adding game'); 
    }
  };


  useEffect(() => {
    console.log(gameId)
    if (gameId) {
      navigate(`/gamequestion/${gameId}`);
    }
  }, [gameId, navigate]);

  const handleNextClick = () => {
    if (gameId) {
      navigate(`/gamequestion/${gameId}`);
    } else {
    }
  }
    //used bootstrap and card view and card body
    //https://getbootstrap.com/docs/5.0/layout/containers/
    //https://getbootstrap.com/docs/5.0/components/card/
  return (
    <div className="container py-6">
      <h1 className="mt-4" style={{ fontSize: '1.5rem' }}>Add Game</h1>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-6">
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label" style={{ fontSize: '1rem' }}>Name:</label>
              <input type="text" className="form-control" id="name" name="name" value={gameData.name} onChange={handleChange} required style={{ fontSize: '1rem' }} />
            </div>
            <div className="mb-3">
              <label htmlFor="difficulty" className="form-label" style={{ fontSize: '1rem' }}>Difficulty:</label>
              <select className="form-select" id="difficulty" name="difficulty" value={gameData.difficulty} onChange={handleChange} required style={{ fontSize: '1rem' }}>
                <option disabled>Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label" style={{ fontSize: '1rem' }}>Category:</label>
              <input type="text" className="form-control" id="category" name="category" value={gameData.category} onChange={handleChange} required style={{ fontSize: '1rem' }} />
            </div>
            <div className="mb-3">
              <label htmlFor="timeframe" className="form-label" style={{ fontSize: '1rem' }}>Timeframe (for each question in seconds):</label>
              <input type="text" className="form-control" id="timeframe" name="timeframe" value={gameData.timeframe} onChange={handleChange} required style={{ fontSize: '1rem' }} />
            </div>
            <div className="mb-3">
            <label htmlFor="start_time" className="form-label" style={{ fontSize: '1rem' }}>Start Time:</label>
            <input type="datetime-local" className="form-control" id="start_time" name="start_time" value={gameData.start_time} onChange={handleChange} required style={{ fontSize: '1rem' }} />
            </div>
            <div className="mb-3">
            <label htmlFor="end_time" className="form-label" style={{ fontSize: '1rem' }}>End Time:</label>
            <input type="datetime-local" className="form-control" id="end_time" name="end_time" value={gameData.end_time} onChange={handleChange} required style={{ fontSize: '1rem' }} />
            </div>


            <div className="mb-3">
              <label htmlFor="description" className="form-label" style={{ fontSize: '1rem' }}>Description:</label>
              <input type="text" className="form-control" id="description" name="description" value={gameData.description} onChange={handleChange} required style={{ fontSize: '1rem' }} />
            </div>
            <button onClick={handleNextClick} className="btn btn-primary" style={{ fontSize: '1rem' }}>Next</button>
          </form>
        </div>
        </div>
        </div>
      </div>
      <ToastContainer /> 

    </div>
  );
};

export default AddGamePage;
