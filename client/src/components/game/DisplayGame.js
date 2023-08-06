import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
const GamePage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const handleHome = () => {
    navigate('/admin');
  };
  useEffect(() => {
    fetchGames();
  }, []);

// Fetching all games and showing it to admin
  const fetchGames = () => {
    fetch('https://v33gsm4qr2.execute-api.us-east-1.amazonaws.com/testing/getgames')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const parsedData = JSON.parse(data.body); 
        setGames(parsedData);
      })
      .catch(error => {
        console.error('Error fetching games:', error);
      });
  };

  const handleUpdate = (gameId) => {
    navigate(`/updategame/${gameId}`);
    console.log('Update game with ID:', gameId);
  };
// Deleting the Game
  const handleDelete = (gameId) => {
    const confirmed = window.confirm('Are you sure you want to delete the game?');
    if (confirmed) {
      fetch(`https://nesj80162k.execute-api.us-east-1.amazonaws.com/deletegame/${gameId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            toast.success('Game Deleted Successfully');
            fetchGames();
          } else {
            toast.error('Error Deleting Game');
          }
        })
        .catch(error => {
          console.error('Error deleting game:', error);
          toast.error('Error deleting game:');
        });
    }
  };

  const handleAddGame = () => {
    navigate('/addgame');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleDifficultyFilterChange = (e) => {
    setDifficultyFilter(e.target.value);
  };

  const uniqueCategories = [...new Set(games.map(game => game.category))];

  const filteredGames = games.filter((game) => {
    const nameMatch = game.name && game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = categoryFilter ? (game.category && game.category.toLowerCase() === categoryFilter.toLowerCase()) : true;
    const difficultyMatch = difficultyFilter ? (game.difficulty && game.difficulty.toLowerCase() === difficultyFilter.toLowerCase()) : true;
  
    return nameMatch && categoryMatch && difficultyMatch;
  });
  
    //used bootstrap and card view and card body
    //https://getbootstrap.com/docs/5.0/layout/containers/
    //https://getbootstrap.com/docs/5.0/components/card/
  return (
    <div className="container">
      <h1 className="mt-4">Games</h1>
      <div className="d-flex align-items-center mb-3">
        <div className="me-3">
          <label htmlFor="search" className="form-label">Search:</label>
          <input type="text" className="form-control" id="search" value={searchQuery} onChange={handleSearchChange} />
        </div>
        <div className="me-3">
          <label htmlFor="categoryFilter" className="form-label">Filter by Category:</label>
          <select className="form-control" id="categoryFilter" value={categoryFilter} onChange={handleCategoryFilterChange}>
            <option value="">All</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="difficultyFilter" className="form-label">Filter by Difficulty:</label>
          <select className="form-control" id="difficultyFilter" value={difficultyFilter} onChange={handleDifficultyFilterChange}>
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
            <button
              className="btn btn-primary"
              onClick={handleHome}
              style={{ padding: '6px 20px', fontSize: '14px',marginTop:'35px',marginLeft:'20px' }} 
            >
              Home
            </button>
          </div>
          <div>
          <button className="btn btn-primary" onClick={handleAddGame} style={{ padding: '6px 20px', fontSize: '14px',marginTop:'35px',marginLeft:'20px' }} 
            >
        Add Game
      </button>
      </div>
      </div>
      <div className="list-group">
        <table className="table">
          <thead>
            <tr>
              <th>Game ID</th>
              <th>Game Name</th>
              <th>Difficulty</th>
              <th>Category</th>
              <th>Timeframe</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map((game) => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td>{game.name}</td>
                <td>{game.difficulty}</td>
                <td>{game.category}</td>
                <td>{game.timeframe}</td>
                <td>{game.start_time}</td>
                <td>{game.end_time}</td>
                <td>{game.description}</td>
                <td>
                  <button className="btn btn-primary me-2" onClick={() => handleUpdate(game.id)}>Update</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(game.id)}>Delete</button>
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

export default GamePage;
