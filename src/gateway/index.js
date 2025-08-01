const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const PORT = 3000;
const busesURL = 'http://localhost:5000/api/buses';
const schedulesURL= 'http://localhost:5000/api/schedules';
const driversURL = 'http://localhost:5000/api/drivers';
const usersURL = 'http://localhost:5000/api/users';
const bookingsURL = 'http://localhost:5000/api/bookings';
const dashboardURL = 'http://localhost:5000/api/dashboard';

app.use(cors({
  origin: '*',
  credentials: true
}));


app.use('/api/buses', createProxyMiddleware({
  target: busesURL,
  changeOrigin: true,
  logLevel: 'debug'
}));
app.use('/api/schedules', createProxyMiddleware({
  target: schedulesURL,
  changeOrigin: true,
  logLevel: 'debug'
}));
app.use('/api/drivers', createProxyMiddleware({
  target: driversURL,
  changeOrigin: true,
  logLevel: 'debug'
}));
app.use('/api/users', createProxyMiddleware({
  target: usersURL,
  changeOrigin: true,
  logLevel: 'debug'
}));
app.use('/api/bookings', createProxyMiddleware({
  target: bookingsURL,
  changeOrigin: true,
  logLevel: 'debug'
}));
app.use('/api/dashboard', createProxyMiddleware({
  target: dashboardURL,
  changeOrigin: true,
  logLevel: 'debug'
}));

app.listen(PORT, () => {
  console.log(`✅ API Gateway running at http://localhost:${PORT}`);
});