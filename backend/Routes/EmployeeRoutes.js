const express = require('express');
const router = express.Router();

const {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployeeById,
    updateEmployeeById,
} = require('../Controllers/EmployeeController');

const { cloudinaryFileUploader } = require('../Middlewares/FileUploader');
const auth = require('../Middlewares/auth');

// Middleware to apply to routes requiring admin access
const adminMiddleware = [auth.verifyToken, auth.IsAdmin];

// Routes
router
    .route('/')
    .get(adminMiddleware, getAllEmployees)
    .post(
        adminMiddleware,
        cloudinaryFileUploader.single('image'),
        createEmployee
    );

router
    .route('/:id')
    .get(adminMiddleware, getEmployeeById)
    .put(
        adminMiddleware,
        cloudinaryFileUploader.single('image'),
        updateEmployeeById
    )
    .delete(adminMiddleware, deleteEmployeeById);

module.exports = router;
