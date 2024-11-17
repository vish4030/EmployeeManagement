import React from 'react';
import { useSelector } from 'react-redux';
import './Style.css'; // Assuming this is the file where you store the CSS

const Dashboard = () => {
  // Get the employee count from the Redux store
  const empCount = useSelector((state) => state.employeeDetailsReducer.empCount);

  return (
    <div className="dashboard">
      <h3 className="dashboard-heading">Welcome to the Admin Dashboard</h3>
      <div className="stats-container">
        <div className="stat-box">
          <h4>Total Employees</h4>
          <p className="count">{empCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
