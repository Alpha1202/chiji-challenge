import { User } from '../../db/models'

/**
 *
 *@description This class checks a table for the presence or absence of a row
 * @class UserHelper
 */
export class UserHelper {
  /**
   *@description This function checks if a user exists
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof UserHelper
   */
  static async findUser(req, res, next) {
    const { userId } = req.params

    const findUser = await User.findOne({
      where: {
        id: userId,
      },
    })

    if (!findUser) {
      return res.status(404).json({
        status: 404,
        message: 'User does not exist',
      })
    }
    req.userResponse = findUser
    return next()
  }
  /**
   * @description Checks whether input username and email exists in database
   * @static
   * @async
   * @param {object} req - signup request object
   * @param {object} res - signup response object
   * @param {function} next - next function
   * @returns {object} checkExistingUser
   * @memberof UserHelper
   */
  static async checkExistingUser(req, res, next) {
    const { userName, email } = req.body
    let existingEmail = []
    let existingUsername = []

    try {
      existingUsername = await User.findAll({
        where: {
          userName,
        },
      })

      existingEmail = await User.findAll({
        where: {
          email,
        },
      })

      if (existingEmail.length > 0 && existingUsername.length > 0) {
        const errorMsg = {
          userName: 'Username already exists.',
          email: 'Email already exists.',
        }

        return res.status(409).json({
          status: 409,
          message: errorMsg,
        })
      }

      if (existingEmail.length > 0) {
        const errorMsg = {
          email: 'Email already exists.',
        }

        return res.status(409).json({
          status: 409,
          message: errorMsg,
        })
      }

      if (existingUsername.length > 0) {
        const errorMsg = {
          userName: 'Username already exists.',
        }

        return res.status(409).json({
          status: 409,
          message: errorMsg,
        })
      }
      return next()
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }
  /**
   *@description This function checks if a user exists by email
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof UserHelper
   */
  static async findUserByEmail(req, res, next) {
    const { email } = req.body

    const findUserByEmail = await User.findOne({
      where: {
        email,
      },
    })

    if (!findUserByEmail) {
      return res.status(404).json({
        status: 404,
        message: 'Email does not exist',
      })
    }
    req.userByEmail = findUserByEmail
    return next()
  }

  /**
   *@description This function returns user details
   * @param {string} userId
   * @returns {function} user
   * @memberof UserHelper
   */
  static async getUser(userId) {
    const findUser = await User.findOne({
      where: {
        id: userId,
      },
      attributes: [
        'firstName',
        'lastName',
        'userName',
        'email',
        'emailNotification',
      ],
    })
    return findUser
  }

  
}


