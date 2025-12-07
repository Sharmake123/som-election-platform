const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const resetPassword = async (username, newPassword) => {
    await connectDB();

    const user = await User.findOne({ username: username, role: 'admin' });

    if (!user) {
        console.error('Admin user not found!');
        process.exit(1);
    }

    user.password = newPassword; 
    await user.save();

    console.log(`Password for admin user '${username}' has been reset successfully.`);
    process.exit();
};
resetPassword('sharma', '123456');