import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch employees from the backend
export const fetchEmployees = createAsyncThunk(
  "employeeDetails/fetchEmployees",
  async () => {
    const token = localStorage.getItem("jwtToken");
    const response = await axios.get("http://localhost:9090/api/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data.employees; // Return the fetched employee data
  }
);

// Async thunk to update employee data
export const updateEmployee = createAsyncThunk(
  "employeeDetails/updateEmployee",
  async ({ id, updatedData }) => {
    const token = localStorage.getItem("jwtToken");
    const response = await axios.put(
      `http://localhost:9090/api/employees/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the updated employee data
  }
);

const initialState = {
  employees: [],
  loading: false,
  error: null,
  empCount: 0, // Initialize employee count
};

const employeeDetailsSlice = createSlice({
  name: "employeeDetails",
  initialState,
  reducers: {
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter((emp) => emp.id !== action.payload);
      state.empCount -= 1; // Decrease count when an employee is deleted
    },
    addEmployee: (state, action) => {
      state.employees.push(action.payload); // Add the new employee to the state
      state.empCount += 1; // Increase count when a new employee is added
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous error if any
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload; // Set employees state with fetched data
        state.empCount = action.payload.length; // Set employee count to the length of employees array
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Set error message in case of failure
      })
      // Handle employee update action
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        // Find and update the employee in the employees array
        const updatedEmployee = action.payload;
        const index = state.employees.findIndex((emp) => emp.id === updatedEmployee.id);
        if (index !== -1) {
          state.employees[index] = updatedEmployee; // Replace the old employee data with the updated one
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { deleteEmployee, addEmployee } = employeeDetailsSlice.actions;
export default employeeDetailsSlice.reducer;
