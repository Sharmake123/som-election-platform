const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'som_election',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
    }
);

const { User } = require('./models');
const bcrypt = require('bcryptjs');

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        try {
            const newUser = await User.create({
                username: 'sharmacadenuur201/@gmail.com',
                email: 'user@zenith.com',
                mobile: '57697980',
                nationalId: '02502500',
                dob: '2002-02-01',
                role: 'voter',
                status: 'Pending',
                password: 'password123'
            });
            console.log('User created successfully:', newUser.id);
        } catch (createError) {
            console.error('Failed to create user:', createError.message);
            if (createError.errors) {
                createError.errors.forEach(e => console.error(`- ${e.message}`));
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testConnection();
