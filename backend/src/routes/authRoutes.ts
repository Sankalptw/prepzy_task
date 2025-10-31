import { Router } from 'express';
import { signup, login, getCurrentUser, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

/**
 * AUTHENTICATION ROUTES
 * Defines all auth-related API endpoints
 * 
 * Route structure:
 * Method + Path + Middleware + Controller
 * 
 * Public routes (no auth required):
 * - POST /api/auth/signup
 * - POST /api/auth/login
 * 
 * Protected routes (auth required):
 * - GET /api/auth/me
 * - POST /api/auth/logout
 */

const router = Router();

/**
 * POST /api/auth/signup
 * Register a new user account
 * 
 * Request body:
 * {
 *   "username": "johndoe",
 *   "email": "john@example.com",
 *   "password": "SecurePass123"
 * }
 * 
 * Response (201 Created):
 * {
 *   "success": true,
 *   "message": "Account created successfully",
 *   "user": { id, username, email, created_at },
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
router.post('/signup', signup);

/**
 * POST /api/auth/login
 * Authenticate existing user
 * 
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "SecurePass123"
 * }
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "user": { id, username, email, created_at },
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Get current logged-in user's information
 * PROTECTED ROUTE - requires valid JWT token
 * 
 * Request headers:
 * Authorization: Bearer <token>
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "user": { id, username, email, created_at }
 * }
 */
router.get('/me', authenticate, getCurrentUser);
//                ^^^^^^^^^^^^ This middleware runs before controller

/**
 * POST /api/auth/logout
 * Logout current user
 * PROTECTED ROUTE - requires valid JWT token
 * 
 * Request headers:
 * Authorization: Bearer <token>
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Logged out successfully"
 * }
 */
router.post('/logout', authenticate, logout);

export default router;