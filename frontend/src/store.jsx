import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./reducers/UserReducer";
import employeeDetailsReducer from "./reducers/EmployeeReducer"


const store = configureStore({
    reducer:{
        userReducer,
        employeeDetailsReducer, 
    }
})


export default store;