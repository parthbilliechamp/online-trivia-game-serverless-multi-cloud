import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const UpdateGamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [gameData, setGameData] = useState({
    name: '',
    difficulty: '', 
    category: '',
    timeframe: '',
    start_time: '',
    end_time: '',
    description: ''
  });

  useEffect(() => {
    fetch(`https://67rd201n7b.execute-api.us-east-1.amazonaws.com/GetSpecificGame?game_id=${gameId}`)
      .then(response => response.json())
      .then(data => {
        setGameData(data);
      })
      .catch(error => {
        toast.error('Error fetching game data:', error);
      });
  }, [gameId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGameData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    if (new Date(gameData.end_time) < new Date(gameData.start_time)) {
      toast.error('End Time cannot be less than Start Time.');
      return;
    }
    const requestBody = {
      pathParameters: {
        game_id: gameId,
      },
      body: JSON.stringify(gameData),
    };

    fetch(`https://tzmsiyarpa.execute-api.us-east-1.amazonaws.com/testing/editgame`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          navigate(`/updategamequestion/${gameId}`);
        } else {
          throw new Error('Error updating question');
        }
      })
      .catch((error) => {
        console.error('Error updating question:', error);
        toast.error('Error updating question');
      });
  };
    //used bootstrap and card view and card body
    //https://getbootstrap.com/docs/5.0/layout/containers/
    //https://getbootstrap.com/docs/5.0/components/card/
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Update Game</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name:</label>
              <input type="text" className="form-control" id="name" name="name" value={gameData.name} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="difficulty" className="form-label">Difficulty:</label>
              <select
                className="form-select"
                id="difficulty"
                name="difficulty"
                value={gameData.difficulty}
                onChange={handleChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category:</label>
              <input type="text" className="form-control" id="category" name="category" value={gameData.category} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="timeframe" className="form-label">Timeframe:</label>
              <input type="text" className="form-control" id="timeframe" name="timeframe" value={gameData.timeframe} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="start_time" className="form-label">Start Time:</label>
              <input type="date" className="form-control" id="start_time" name="start_time" value={gameData.start_time} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="end_time" className="form-label">End Time:</label>
              <input type="date" className="form-control" id="end_time" name="end_time" value={gameData.end_time} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description:</label>
              <textarea className="form-control" id="description" name="description" value={gameData.description} onChange={handleChange} />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update Questions</button>
          </form>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default UpdateGamePage;
