import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import config from '../db/config/config'

dotenv.config()
const { secret } = config

/**
 *
 *@description Handles access token generation and verification
 * @class Auth
 */
export class Auth {
    /**
 * @description verifies token provided by user
 * @param {object} req the request body
 * @param {object} res the response body
 * @param {function} next passes the request to another function to be processed
 * @returns {function} next
 */
static async verifyToken(req, res, next) {
    const { token } = req.headers;
  
    if (!token) {
      return res.status(401).json({
        status: 401,
        message: 'Token is not provided!',
      });
    }
  
    try {
      const decoded = await jwt.verify(token, secret);
      req.user = decoded.id;
      req.decodedUser = decoded;
      if (decoded) return next();
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid token provided',
      });
    }
  };

  /**
   * @description Handles access token generation
   * @param {object} payload - The user credential {id}
   * @return {string} access token
   */
  static generateToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: '24h' })
  }

  /**
   *
   *@description Verifies token
   * @param { string } token
   * @returns{ object } user details
   */
  static verifyToken(token) {
    return jwt.verify(token, secret)
  }
}

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}


