require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const apiRoutes = require('./routes/apiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const webRoutes = require('./routes/webRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes'); // Ensure this file exists
const announcementRoutes = require('./routes/announcementRoutes'); // Ensure this file exists
const streakRoutes = require('./routes/streakRoutes'); // Ensure this file exists
const errorHandler = require('./middlewares/errorHandler');
const bodyParser = require('body-parser');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());

const corsOptions = {
    origin: 'https://v0-new-project-kpsjngutvqx.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/', webRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/streak', streakRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;