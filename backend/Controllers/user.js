const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
require('dotenv').config();


exports.register = async (req, res) => {
    console.log(req.body);
    const { name, email, password, user_type } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send({ message: "Email is already registered." });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            email,
            name,
            password: hashPassword,
            user_type: user_type,
        });

        // Save user in the database
        const registeredUser = await user.save();

        // Generate JWT token
        const payload = { id: registeredUser._id, user_type: registeredUser.user_type };
        const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        // Respond with success
        res.status(201).send({
            message: "Registration successful",
            user: { id: registeredUser._id, email: registeredUser.email },
            token,
        });
    } catch (err) {
        console.error("Registration error:", err.message);
        res.status(500).send({ message: "An error occurred while registering. Please try again later." });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send({ message: "Invalid email or password." });
        
        // Validate password
        const validatePass = await bcrypt.compare(password, user.password);
        if (!validatePass) return res.status(401).send({ message: "Invalid password." });
        
        // Generate JWT token
        const payload = { id: user._id, user_type: user.user_type };
        const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        // Send response
        const { _id, user_type, name } = user; // Extract only necessary fields
        res.status(200).header("auth-token", token).send({ user: { _id, email, user_type, name }, token });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "An unexpected error occurred. Please try again later." });
    }
};
