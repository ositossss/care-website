
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const { protect, admin, notFound, errorHandler } = require('./middleware/auth');

const app = express();

app.use(cors({
    origin: [
        'https://care-website-tau.vercel.app',
        'https://care-website-x9te.vercel.app'
    ],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/contact', require('./routes/contact'));

app.get('/api/admin/stats', protect, admin, async (req, res, next) => {
    try {
        const A = require('./models/Appointment');

        const [doctors, appointments, pending, unread] = await Promise.all([
            require('./models/Doctor').countDocuments(),
            A.countDocuments(),
            A.countDocuments({ status: 'pending' }),
            require('./models/ContactMessage').countDocuments({ isRead: false })
        ]);

        res.json({ doctors, appointments, pending, unread });
    } catch (e) {
        next(e);
    }
});

app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB once and reuse the connection.
let dbConnection;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!dbConnection) {
        dbConnection = mongoose.connect(process.env.MONGO_URI)
            .catch((error) => {
                dbConnection = null;
                throw error;
            });
    }

    await dbConnection;
};

// Vercel serverless handler
module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        return res.status(500).json({
            message: 'Database connection failed'
        });
    }
};

// Local development
if (require.main === module) {
    connectDB()
        .then(() => {
            app.listen(process.env.PORT || 5000, () => {
                console.log('API running on port ' + (process.env.PORT || 5000));
            });
        })
        .catch((error) => {
            console.error('MongoDB connection failed:', error.message);
            process.exit(1);
        });
}

