import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    userDetails: {}
};

// Create a slice
const userDetailsSlice = createSlice({
    name: "userDetails", // Updated slice name
    initialState,
    reducers: {
        // Set user details action
        setUserDetails: (state, action) => {
            console.log(action.payload+"reducer");
            state.userDetails = action.payload; // Update userDetails with the payload
        }
    }
});

// Export the action and the reducer
export const { setUserDetails } = userDetailsSlice.actions; // Export the correct action
export default userDetailsSlice.reducer; // Export the reducer
