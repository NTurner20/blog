import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>

      <Routes>
        <Route path="/login" element={isAuthenticated ? <Dashboard /> : <Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login />} />
      </Routes>

    </Router>
  );
}

export default App;
