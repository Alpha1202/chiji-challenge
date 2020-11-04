
/**
 * @class ValidateToken
 */
class ValidateToken {
/**
  *
  *@description Checks if the token exists
  * @static
  * @param {string} req
  * @param {object} res
  * @param {function} next
  * @returns {object} It returns the error message
  * @memberof ValidateToken
  */
  static async checkToken(req, res, next) {
    const { token } = req.headers || req.body || req.query;
    if (!token) {
      return res.status(400).json({
        status: 400,
        message: 'Token is required',
      });
    }
    next();
  }
}

export default ValidateToken;