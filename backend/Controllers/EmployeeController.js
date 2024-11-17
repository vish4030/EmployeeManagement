
const EmployeeModel = require("../Models/EmployeeModel.js");


const createEmployee = async (req, res) => {
    try {
        const body = req.body;
        const image = req?.file ? req?.file?.path : null;
        body.image = image;
        const emp = new EmployeeModel(body);

        await emp.save();
        res.status(201)
            .json({
                message: 'Employee Created',
                success: true
            });
    } catch (err) {
        console.log('Error ', err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err
        })
    }
}
const getAllEmployees = async (req, res) => {
    try {
        let { page, limit, search } = req.query;

        // Set default values
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const skip = (page - 1) * limit;

        let searchCriteria = {};
        if (search) {
            searchCriteria = {
                name: { $regex: search, $options: 'i' }
            };
        }

        const totalEmployees = await EmployeeModel.countDocuments(searchCriteria);
        const emps = await EmployeeModel.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort({ updatedAt: -1 });

        const totalPages = Math.ceil(totalEmployees / limit);

        return res.status(200).json({
            message: 'All Employees',
            success: true,
            data: {
                employees: emps,
                pagination: {
                    totalEmployees,
                    currentPage: page,
                    totalPages,
                    pageSize: limit
                }
            }
        });
    } catch (err) {
        console.error('Error in getAllEmployees:', err);

        // Ensure only one response is sent
        if (!res.headersSent) {
            return res.status(500).json({
                message: 'Internal Server Error',
                success: false,
                error: err.message
            });
        }
    }
};


const getEmployeeById = async (req, res) => {
    try {
        const id = req.params.id;
        const emp = await EmployeeModel.findOne({ id: id });
        res.status(200)
            .json({
                message: 'Employee Details',
                success: true,
                data: emp
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err
        })
    }
}

const deleteEmployeeById = async (req, res) => {
    try {
        const id = req.params.id;
        await EmployeeModel.deleteOne({ _id: id });
        res.status(200)
            .json({
                message: 'Employee Deleted Successfully',
                success: true
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err
        })
    }
}

const updateEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, mobile, designation, gender, course, createdDate } = req.body;
        let updateData = {
            name, email, mobile, designation, gender, course, createdDate, updatedAt: new Date()
        };
        console.log('<-- update ---> ', req.file)
        if (req.file) {
            updateData.image = req.file.path;
        }
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200)
            .json({
                message: 'Employee Updated Successfully',
                success: true,
                data: updatedEmployee
            });
    } catch (error) {
        console.log("updateEmployee "+ error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployeeById,
    updateEmployeeById
}
