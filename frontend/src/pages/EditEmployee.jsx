import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { updateEmployee } from "../reducers/EmployeeReducer"; // Action to update employee in Redux
import "./Style.css"; // Assuming this file contains your CSS

const EditEmployee = () => {
  const { id } = useParams(); // Get the employee ID from the URL params
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch employee data from the Redux store
  const employees = useSelector((state) => state.employeeDetailsReducer.employees);
  const employee = employees.find((emp) => emp.id === id); // Find employee by ID

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: "",
    image: null, // Initialize image as null
    createdDate: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Populate form fields with existing employee data
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        mobile: employee.mobile,
        designation: employee.designation,
        gender: employee.gender,
        course: employee.course,
        image: employee.image, // Set the current image URL
        createdDate: employee.createdDate,
      });
    }
  }, [employee]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      // If the field is a file input, store the file in the state
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Store the first file selected
      }));
    } else {
      // For other inputs, update the form state
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.designation || !formData.gender || !formData.course) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const token = localStorage.getItem("jwtToken"); // Use token for auth

      // Create FormData object to send file and other form data
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("mobile", formData.mobile);
      form.append("designation", formData.designation);
      form.append("gender", formData.gender);
      form.append("course", formData.course);
      form.append("image", formData.image); // Append the file
      form.append("createdDate", formData.createdDate);

      // Send PUT request to update employee data
      const response = await axios.put(
        `http://localhost:9090/api/employees/${employee._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      if (response.status === 200) {
        // Dispatch Redux action to update the employee list
        navigate("/list"); // Redirect to the Employee List page
      }
    } catch (error) {
      setError("Failed to update the employee. Please try again.");
      console.error("Error updating employee: ", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (!employee) {
    return <div>Loading...</div>; // Show loading if employee data isn't available yet
  }

  return (
    <div className="edit-employee">
      <h2>Edit Employee</h2>
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Unique ID</label>
          <input type="text" name="id" value={formData.id || id} readOnly />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Mobile No</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Course</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Created Date</label>
          <input
            type="date"
            name="createdDate"
            value={formData.createdDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
