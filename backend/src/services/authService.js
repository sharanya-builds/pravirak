import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/index.js';

const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign(
    { sub: user.id, name: user.name },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function publicUser(user) {
  return { id: user.id, name: user.name, phone: user.phone, email: user.email };
}

export async function registerUser({ name, phone, email, password }) {
  if (!name || !password || (!phone && !email)) {
    const err = new Error('Name, password and either phone or email are required.');
    err.status = 400;
    throw err;
  }

  const { rows: existingRows } = await pool.query(
    `SELECT id FROM users WHERE (phone IS NOT NULL AND phone = $1) OR (email IS NOT NULL AND email = $2)`,
    [phone || null, email || null]
  );

  if (existingRows.length > 0) {
    const err = new Error('An account with this phone or email already exists.');
    err.status = 409;
    throw err;
  }

  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
  const { rows } = await pool.query(
    `INSERT INTO users (name, phone, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, phone || null, email || null, passwordHash]
  );

  const user = rows[0];
  const token = signToken(user);
  return { user: publicUser(user), token };
}

export async function loginUser({ identifier, password }) {
  if (!identifier || !password) {
    const err = new Error('Phone/email and password are required.');
    err.status = 400;
    throw err;
  }

  const { rows } = await pool.query(`SELECT * FROM users WHERE phone = $1 OR email = $1`, [identifier]);
  const user = rows[0];

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    const err = new Error('Invalid credentials. Please check your details and try again.');
    err.status = 401;
    throw err;
  }

  const token = signToken(user);
  return { user: publicUser(user), token };
}

export async function getUserById(id) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  const user = rows[0];
  if (!user) {
    const err = new Error('User not found.');
    err.status = 404;
    throw err;
  }
  return publicUser(user);
}
