import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import store from './store';
import App from './App.jsx';
import Dashboard from './pages/Dashboard';
import EmployeeCreate from './pages/AddEmployee';
import EmployeeList from './pages/EmployeeList';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/LoginPage';
import Logout from './pages/Logout';
import EditEmployee from './pages/EditEmployee';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Wrap all routes under the main App component
    errorElement: <ErrorPage />, // Fallback for undefined routes
    children: [
      { path: '/login', element: <Login /> },
      { path: '/logout', element: <Logout /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/create', element: <EmployeeCreate /> },
      { path: '/edit/:id', element: <EditEmployee /> },
      { path: '/list', element: <EmployeeList /> },
      
      // Wildcard route for undefined paths
      { path: '*', element: <ErrorPage /> },
    ],
  },
]);

// Render the application with RouterProvider and Redux store
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
);
