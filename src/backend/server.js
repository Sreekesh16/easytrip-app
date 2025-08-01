// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');

// const app = express();

// // Connect to MongoDB
// connectDB();

// // CORS Configuration
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// const busRoutes = require('./routes/busRoutes');
// const scheduleRoutes = require('./routes/scheduleRoutes'); // <-- UNCOMMENTED & IMPORTED
// const driverRoutes = require('./routes/driverRoutes');
// const userRoutes=require('./routes/userRoutes');
// const bookingRoutes=require('./routes/BookingRoutes')
// app.use('/api/dashboard', require('./routes/dashboardRoutes'));
// app.use('/api/buses', busRoutes);
// app.use('/api/schedules', scheduleRoutes);
// app.use('/api/drivers', driverRoutes);
// app.use('/api/users',userRoutes);
// app.use('/api/bookings',bookingRoutes);



// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     status: 'ok',
//     message: 'Server is running',
//     timestamp: new Date().toISOString()
//   });
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     status: 'error',
//     message: 'Internal Server Error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // 404 Handler
// app.use((req, res) => {
//   res.status(404).json({
//     status: 'fail',
//     message: 'Endpoint not found'
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize app
const app = express();

// ✅ STEP 1: Register health check BEFORE anything else
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ✅ STEP 2: Connect to MongoDB
connectDB();

// ✅ STEP 3: Apply middlewares
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:60827'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ STEP 4: Route imports
const busRoutes = require('./routes/busRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const driverRoutes = require('./routes/driverRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/BookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// ✅ STEP 5: Register routes
app.use('/api/buses', busRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ STEP 6: Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ✅ STEP 7: 404 handler (must be LAST)
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Endpoint not found'
  });
});

// ✅ STEP 8: Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
