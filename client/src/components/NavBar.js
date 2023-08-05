import React from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import profileImage from '../assets/images/profile_template.png';

function AppNavbar() {
  return (
    <Navbar  expand="lg" style={{ marginBottom: '40px' ,backgroundColor:'rgb(39, 83, 148)'}}>
      <Navbar.Brand style={{color:'white'}}href="/lobby">Trivia Titans</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">
        <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
          <Nav.Link style={{color:'white'}}href="/">Home</Nav.Link>
          <Nav.Link style={{color:'white'}} href="/browsegame">Games</Nav.Link>
          <Nav.Link style={{color:'white'}} href="/stats">View Stats</Nav.Link>
          <Nav.Link style={{color:'white'}} href="/leaderboard">Leaderboard</Nav.Link>
          <Nav.Link style={{color:'white'}} href="/createTeam">Create Team</Nav.Link>
          <Nav.Link style={{color:'white'}} href="/aihelp">AI Help</Nav.Link>

        </Nav>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
          />
        </Form>
        <Dropdown align="end">
          <Dropdown.Toggle variant="white" id="profileDropdown">
            <img
              src={profileImage}
              className="rounded-circle"
              alt="Profile"
              style={{
                width: '40px',
                height: '40px',
                marginLeft: '10px',
                cursor: 'pointer',
              }}
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="/profile">Modify Profile</Dropdown.Item>
            <Dropdown.Item href="/logout">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;