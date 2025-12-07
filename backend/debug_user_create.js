const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const login = async () => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@example.com', // Using email from seed.js
            password: 'password123'
        });
        return res.data.token;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        process.exit(1);
    }
};

const createUser = async (token) => {
    try {
        const userData = {
            username: 'sharmacadenuur201/@gmail.com',
            email: 'user@zenith.com',
            mobile: '57697980',
            nationalId: '02502500',
            dob: '2002-02-01',
            role: 'voter',
            status: 'Pending',
            password: 'password123'
        };

        const res = await axios.post(`${API_URL}/users`, userData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('User created successfully:', res.data);
    } catch (error) {
        console.error('Create user failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

const run = async () => {
    const token = await login();
    await createUser(token);
};

run();
