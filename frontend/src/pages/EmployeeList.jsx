// src/components/EmployeeList.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees, deleteEmployee } from "../reducers/EmployeeReducer";
import { Link } from "react-router-dom";
import "./Style.css";

const EmployeeList = () => {
  const dispatch = useDispatch();

  // Retrieve employee data, loading, and error state from Redux
  const { employees, loading, error } = useSelector((state) => state.employeeDetailsReducer);

  console.log(employees);

  useEffect(() => {
    // Fetch employee data when the component mounts
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      dispatch(deleteEmployee(id));
    }
  };

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="employee-list">
      <h2>Employee List</h2>
      <table>
        <thead>
          <tr>
            <th>Unique ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees?.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>
                  <img src={emp.image} alt={emp.name} className="employee-image" />
                </td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.mobile}</td>
                <td>{emp.designation}</td>
                <td>{emp.gender}</td>
                <td>{emp.course}</td>
                <td>{new Date(emp.createdDate).toLocaleDateString()}</td>
                <td>
                  <Link to={`/edit/${emp.id}`} className="btn btn-edit">
                    Edit
                  </Link>
                  <button className="btn btn-delete" onClick={() => handleDelete(emp._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
