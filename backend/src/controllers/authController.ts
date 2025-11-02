import { Request, Response } from 'express';
import {
  createUser,
  findUserByEmail,
  findUserById,
  emailExists,
  usernameExists,
  sanitizeUser,
} from '../models/userModel';
import {
  hashPassword,
  comparePassword,
  generateToken,
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from '../utils/auth';
import { SignupRequest, LoginRequest, AuthRequest } from '../types';

export const signup = async (
  req: Request<{}, {}, SignupRequest>,
  res: Response
) => {
  try {
    const { username, email, password } = req.body;


    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    const usernameValidation = isValidUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username',
        errors: usernameValidation.errors,
      });
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors,
      });
    }

    const emailTaken = await emailExists(email);
    if (emailTaken) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const usernameTaken = await usernameExists(username);
    if (usernameTaken) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken',
      });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await createUser(username, email, passwordHash);

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: sanitizeUser(newUser),
      token,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message,
    });
  }
};


export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordCorrect = await comparePassword(password, user.password_hash);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: sanitizeUser(user),
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const user = await findUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message,
    });
  }
}