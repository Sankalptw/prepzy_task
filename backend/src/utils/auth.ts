import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

// Get JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = '7d'; // Token valid for 7 days

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Higher = more secure but slower
  return await bcrypt.hash(password, saltRounds);
};

/**
 * COMPARE PASSWORD
 * Why? We can't "unhash" a password
 * Instead, we hash the login attempt and compare hashes
 * 
 * How it works:
 * - User enters password during login
 * - We hash it the same way
 * - Compare with stored hash
 * - If they match = correct password!
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * GENERATE JWT TOKEN
 * Why? Stateless authentication
 * Server doesn't need to "remember" logged-in users
 * Token itself contains user info (encrypted)
 * 
 * How it works:
 * - Takes user data (id, email, username)
 * - Encrypts it with secret key
 * - Creates a string token
 * - Token can be verified without database lookup!
 * 
 * Token structure: header.payload.signature
 * Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM...
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'smart-quiz-arena', // Who created this token
  });
};

/**
 * VERIFY JWT TOKEN
 * Why? Check if token is valid and not tampered with
 * 
 * How it works:
 * - Takes token from request
 * - Uses secret key to decrypt
 * - Checks if expired or modified
 * - Returns user data if valid
 * 
 * Throws error if:
 * - Token expired
 * - Token signature doesn't match (was modified)
 * - Token format is wrong
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired. Please login again.');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token. Please login again.');
    }
    throw new Error('Authentication failed.');
  }
};

/**
 * VALIDATE EMAIL FORMAT
 * Basic email validation using regex
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * VALIDATE PASSWORD STRENGTH
 * Ensures password meets minimum requirements
 */
export const isValidPassword = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Make it simpler - just need uppercase, lowercase, and number
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    errors.push('Password must contain uppercase, lowercase, and number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * VALIDATE USERNAME
 * Ensures username meets requirements
 */
export const isValidUsername = (username: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  if (username.length > 50) {
    errors.push('Username must be less than 50 characters');
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};