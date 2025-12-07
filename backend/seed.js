const { sequelize, User } = require('./models');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
    try {
        await sequelize.sync();

        const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
        if (!adminExists) {
            await User.create({
                username: 'admin',
                email: 'admin@example.com',
                password: 'password123',
                mobile: '1234567890',
                nationalId: 'ADMIN001',
                dob: '1990-01-01',
                role: 'admin',
                status: 'Verified'
            });
            console.log('Admin user created');
        }

        const voterExists = await User.findOne({ where: { email: 'voter@example.com' } });
        if (!voterExists) {
            await User.create({
                username: 'voter',
                email: 'voter@example.com',
                password: 'password123',
                mobile: '0987654321',
                nationalId: 'VOTER001',
                dob: '1995-01-01',
                role: 'voter',
                status: 'Verified'
            });
            console.log('Voter user created');
        }

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
