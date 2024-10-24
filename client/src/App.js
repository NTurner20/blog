import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    // console.log("isAuthenticated", isAuthenticated);
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    // console.log("token", token);
    if (token) {
      fetch("http://localhost:4000/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch((error) => {
          console.error("Error during authentication", error);
          setIsAuthenticated(false)});
          
    }
  },[isAuthenticated]);
  


  return (
    <>
     <Router>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated}/> : <Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/register" element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated}/> : <Register setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated}/> : <Login setIsAuthenticated={setIsAuthenticated}/>} />
      </Routes>

    </Router>
    <ToastContainer />
    </>
   
    
  );
}

export default App;
