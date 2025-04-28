import { useState, useEffect } from 'react';

import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Register from './pages/Register';
import News from './pages/News';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Error from './pages/Error';
import Profile from './pages/Profile';
import CourseView from './pages/CourseView';
import AddCourse from './pages/AddCourse'

import { UserProvider } from './context/UserContext';
import 'notyf/notyf.min.css';

function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null


  });

  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user]);

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user]);

  useEffect(() => {

    if(localStorage.getItem('token') !== null) {

        fetch('http://localhost:4000/users/details', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
                id: data._id,
                isAdmin: data.isAdmin
            })
        })
        
    } else {
setUser({
            id: null,
            isAdmin: null
        })
    }
    
}, [])
  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
    <Router>
      <AppNavbar />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/news" element={<News />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/courses/:courseId" element={<CourseView />} />
          <Route path="/addCourse" element={<AddCourse />} />
          <Route path="*" element={<Error />} />

        </Routes>
      </Container>
    </Router>
    </UserProvider>
  );
}

export default App;