// src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import './App.css'; // Import CSS for App styling

const App = () => {

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Outlet /> {/* This is where child routes will be rendered */}
      </main>
    </div>
  );
};

export default App;
