// src/pages/AddEmployee.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addEmployee } from "../reducers/EmployeeReducer";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    id:`EMP${Math.floor(Math.random() * 10000)}`,
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: "",
    image: null,
  });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate image size
    if (formData.image && formData.image.size > 10 * 1024 * 1024) {
      setError("Image size should not exceed 10MB");
      return;
    }

    const newEmployee = {
      id:   formData.id, // Generate a unique ID
      image: formData.image ? URL.createObjectURL(formData.image) : "",
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      designation: formData.designation,
      gender: formData.gender,
      course: formData.course,
      createdDate: new Date().toISOString().split("T")[0], // Current date
    };

    // Add the employee to Redux store
    dispatch(addEmployee(newEmployee));

    // Create FormData for sending the data to the backend
    const backendFormData = new FormData();
    backendFormData.append("id", formData.id )
    backendFormData.append("name", formData.name);
    backendFormData.append("email", formData.email);
    backendFormData.append("mobile", formData.mobile);
    backendFormData.append("designation", formData.designation);
    backendFormData.append("gender", formData.gender);
    backendFormData.append("course", formData.course);
    backendFormData.append("image", formData.image); // Attach the image file

    try {
      // Send data to the backend
      await axios.post("http://localhost:9090/api/employees", backendFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Include the token
        },
      });
      alert("Employee added successfully!");
      navigate("/list"); // Redirect to the employee list page
    } catch (err) {
      console.error("Error adding employee:", err);
      setError("Failed to add employee. Please try again. "+err);
    }
  };

  return (
    <div className="add-employee-form">
      <h2>Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Designation:</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Course:</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
