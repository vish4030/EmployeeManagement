const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    id:{
        type: String,
        require:true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    gender:{
        type: String,
        require: true
    },
    course:{
        type: String,
        require: true
    },
    image: {
        type: String
    },
    createdDate: {
        type: Date,
        default: new Date()
    },
    updatedDate: {
        type: Date,
        default: new Date()
    }
});

const EmployeeModel = mongoose.model('employees', EmployeeSchema);
module.exports = EmployeeModel;