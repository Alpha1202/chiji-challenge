import bcrypt from 'bcryptjs'

import { User } from '../../db/models'
import UserHelper from './user.model'
import { Auth, hashPassword } from '../../services/helpers'

const { generateToken } = Auth

/**
 * @description This class handles user requests
 * @class UserController
 */
class UserController {
  /**
   *
   * @constructor
   * @description signup a user
   * @static
   * @param {object} req
   * @param {object} res
   * @memberof UserController
   */
  static async createAccount(req, res) {
    try {
      const { userName, email, password } = req.body
      const hashedpassword = hashPassword(password)

      const values = { userName, email, password: hashedpassword }
      const result = await User.create(values)

      const payload = {
        userName: result.userName,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        imageUrl: result.imageUrl,
      }

      return res.status(201).json({
        status: 201,
        message: 'Registration Successful',
        data: [payload],
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }

  /**
   *
   *@description logs in autheticated user
   * @static
   * @param {object} req the request body
   * @param {object} res the response body
   * @returns {object} res
   * @memberof UserController
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body
      const result = await User.findOne({ where: { email } })
      if (result) {
        if (bcrypt.compareSync(password, result.password)) {
          const { id } = result
          const token = await generateToken({
            id,
          })

          const user = {
            id: result.id,
            userName: result.userName,
            email: result.email,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
          }

          return res.status(200).json({
            status: 200,
            message: 'User Login successful',
            token,
            data: [user],
          })
        }
        return res.status(401).json({
          status: 401,
          message: 'Invalid email or password',
        })
      }
      return res.status(401).json({
        status: 401,
        message: 'Invalid email or password',
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }

  /**
   * @static
   * @description this function gets all registered users
   * @param {object} req the request body
   * @param {object} res the response body
   * @returns {object} res
   * @memberof UserController
   */
  static async getUserProfile(req, res) {
    const { userId } = req.params

    try {
      const userData = await User.findOne({
        attributes: ['firstName', 'lastName', 'userName', 'email', 'imageUrl'],
        where: { id: userId },
      })

      if (!userData) {
        return res.status(404).json({
          status: 404,
          message: 'User not found',
        })
      }

      return res.status(200).json({
        status: 200,
        message: 'Operation successful',
        data: [userData],
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }

  /**
   *@static
   *@description this function creates and updates user profile
   * @param {object} req the request body
   * @param {object} res the response body
   * @returns {object} res
   * @memberof UserController
   */
  static async updateProfile(req, res) {

    try {
      const { firstName, lastName, userName } = req.body
        
      const avatar = req.file
      const userId = req.user
      let { id } = req.params
      id = Number(id)

      let avatarValue

      if (avatar) avatarValue = avatar.url

      const userDetails = {
        firstName,
        lastName,
        userName,
        imageUrl: avatarValue,
      }

      const where = {
        id,
      }

      const attributes = ['id', 'firstName', 'lastName', 'userName', 'imageUrl']

      const userData = await User.findOne({ attributes, where })

      if (id === userId) {
        await userData.update(userDetails, { where })

        return res.status(200).json({
          status: 200,
          message: 'Profile updated successfully',
          data: [userDetails],
        })
      }
      return res.status(401).json({
        status: 401,
        message: 'You do not have permission to perform that operation',
      })
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).json({
          status: 400,
          message: 'User with that username already exists',
        })
      }
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }


  /**
   * @description - method for deleting a user
   * @static
   * @async
   * @param {object} req -  request object
   * @param {object} res - response object
   * @returns {object} - response object
   * @memberof UserController
   */
  static async deleteUser(req, res) {
    try {
      const { userId } = req.params

      await User.destroy({ where: { id: userId } })

      return res.status(200).json({
        status: 200,
        message: 'User successfully deleted',
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }
}

export default UserController
