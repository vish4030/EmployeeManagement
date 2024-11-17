import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../reducers/UserReducer";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Clear user data from localStorage
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("name");

      // Clear user data from Redux store
      dispatch(setUserDetails(null));

      // Redirect user to login page
      navigate("/login");
    }, 3000); // 3-second timeout

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [dispatch, navigate]);

  return (
    <div className="logout-container">
      <h2>Logging Out...</h2>
      <p>You will be redirected to the login page in a few seconds.</p>
    </div>
  );
};

export default Logout;
