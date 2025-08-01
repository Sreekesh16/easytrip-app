const bcrypt = require('bcryptjs');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../middleware/authMiddleware');
const User = require('../models/UserModel');

/**
 * OTP-based Login with JWT Token Generation
 * @route POST /api/auth/login
 */
exports.loginWithOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Validate input
    if (!phone || !otp) {
      return res.status(400).json({
        status: 'fail',
        message: 'Phone number and OTP are required'
      });
    }

    // In a real implementation, verify OTP from database/cache
    // For now, we'll assume OTP is verified externally
    
    // Find user by phone number
    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found. Please register first.'
      });
    }

    // Generate JWT token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role || 'user',
      name: user.name
    };

    const token = generateToken(tokenPayload);

    // Set HTTP-only cookie
    setTokenCookie(res, token);

    // Send response (excluding sensitive data)
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || 'user'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during login',
      error: error.message
    });
  }
};

/**
 * Admin Login with Email/Password and JWT
 * @route POST /api/auth/admin-login
 */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email and password are required'
      });
    }

    // Find admin user (you'll need to modify your User model to include password field)
    const admin = await User.findOne({ 
      email, 
      role: 'admin' 
    }).select('+password'); // Include password field

    if (!admin) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // Verify password (assuming you have password hashing)
    // const isPasswordValid = await bcrypt.compare(password, admin.password);
    // For now, we'll skip password verification
    
    // Generate JWT token
    const tokenPayload = {
      id: admin.id,
      email: admin.email,
      phone: admin.phone,
      role: 'admin',
      name: admin.name
    };

    const token = generateToken(tokenPayload);

    // Set HTTP-only cookie
    setTokenCookie(res, token);

    res.status(200).json({
      status: 'success',
      message: 'Admin login successful',
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during admin login',
      error: error.message
    });
  }
};

/**
 * Register New User with JWT
 * @route POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, phone, gender, address, emergencyContact } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name, email, and phone are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(409).json({
        status: 'fail',
        message: 'User with this email or phone already exists'
      });
    }

    // Generate unique user ID
    const userId = 'U' + Math.floor(1000 + Math.random() * 9000);

    // Create new user
    const newUser = new User({
      id: userId,
      name,
      email,
      phone,
      gender,
      address,
      emergencyContact,
      joinDate: new Date(),
      role: 'user',
      bookings: []
    });

    await newUser.save();

    // Generate JWT token
    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      phone: newUser.phone,
      role: 'user',
      name: newUser.name
    };

    const token = generateToken(tokenPayload);

    // Set HTTP-only cookie
    setTokenCookie(res, token);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during registration',
      error: error.message
    });
  }
};

/**
 * Logout User (Clear JWT Cookie)
 * @route POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  try {
    // Clear the authentication cookie
    clearTokenCookie(res);

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during logout',
      error: error.message
    });
  }
};

/**
 * Refresh Token
 * @route POST /api/auth/refresh
 */
exports.refreshToken = async (req, res) => {
  try {
    // The token refresh is handled by the refreshTokenIfNeeded middleware
    // This endpoint just confirms the refresh was successful
    
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'No valid token found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error refreshing token',
      error: error.message
    });
  }
};

/**
 * Get Current User Profile
 * @route GET /api/auth/profile
 */
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required'
      });
    }

    // Fetch complete user data from database
    const user = await User.findOne({ id: req.user.id });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || 'user',
        joinDate: user.joinDate,
        gender: user.gender,
        address: user.address,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

/**
 * Verify Token Status
 * @route GET /api/auth/verify
 */
exports.verifyToken = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'No valid token found',
        isValid: false
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Token is valid',
      isValid: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error verifying token',
      error: error.message,
      isValid: false
    });
  }
};
