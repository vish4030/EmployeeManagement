import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch employees from the backend
export const fetchEmployees = createAsyncThunk(
  "employeeDetails/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get("http://localhost:9090/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data.employees; // Return the fetched employee data
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to fetch employees");
    }
  }
);

// Async thunk to update employee data
export const updateEmployee = createAsyncThunk(
  "employeeDetails/updateEmployee",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
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
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to update employee");
    }
  }
);

// Async thunk to delete employee from backend and Redux store
export const deleteEmployee = createAsyncThunk(
  "employeeDetails/deleteEmployeeFromDB",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(`http://localhost:9090/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id; // Return the deleted employee's ID
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to delete employee");
    }
  }
);

// Initial state
const initialState = {
  employees: [],
  empCount: 0,
  loading: false,
  error: null,
};

const employeeDetailsSlice = createSlice({
  name: "employeeDetails",
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      state.employees.push(action.payload); // Add the new employee to the state
      state.empCount += 1; // Increase count when a new employee is added
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous error if any
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload; // Set employees state with fetched data
        state.empCount = action.payload.length; // Update employee count
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEmployee = action.payload;
        const index = state.employees.findIndex((emp) => emp.id === updatedEmployee.id);
        if (index !== -1) {
          state.employees[index] = updatedEmployee; // Update employee data
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter((emp) => emp.id !== action.payload);
        state.empCount -= 1; // Decrease employee count
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { addEmployee } = employeeDetailsSlice.actions;
export default employeeDetailsSlice.reducer;
