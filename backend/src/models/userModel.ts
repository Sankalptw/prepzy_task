import { query } from '../config/database';
import { User, UserResponse } from '../types';

export const createUser = async (
  username: string,
  email: string,
  passwordHash: string
): Promise<User> => {
  const result = await query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [username, email, passwordHash]
  );

  return result.rows[0];
};


export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0] || null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
};


export const emailExists = async (email: string): Promise<boolean> => {
  const result = await query(
    'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
    [email]
  );

  return result.rows[0].exists;
};


export const usernameExists = async (username: string): Promise<boolean> => {
  const result = await query(
    'SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)',
    [username]
  );

  return result.rows[0].exists;
};


export const updateUser = async (
  id: string,
  updates: Partial<Pick<User, 'username' | 'email'>>
): Promise<User> => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  
  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(', ');

  const result = await query(
    `UPDATE users 
     SET ${setClause}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${fields.length + 1}
     RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
};


export const sanitizeUser = (user: User): UserResponse => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    created_at: user.created_at,
  };
};