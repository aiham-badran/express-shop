const JWT = require("../utils/security/JWT");
const Errors = require("../utils/errors/Errors");
const UserModel = require("../models/UserModel");

/**
 * Ensure that the user has the authority to access this service.
 * @param  {...String} roles
 * @returns Express Middleware
 */
const AllowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Errors("You are not allowed to access this route", 403));
    }
    next();
  };
};

/**
 * Express Middleware
 *
 * Protecting services so that the user must log in using JWT token
 * and then make sure that user exists
 * and check token the user's owner exists and is correct and not expired
 * in the end set user data in req object or throw error  => req.user
 */
const Protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // token not found
    if (!token) {
      throw new Errors("You do not login, must be login again", 401);
    }
    const decoded = JWT.getDataFromValidToken(token);

    const currentUser = await UserModel.findById(
      decoded.userId,
      "+role +passwordChangedAt"
    );

    // the user not found
    if (!currentUser) {
      throw new Errors("the user does not exist", 401);
    }

    // change time form MSecond to Second
    if (currentUser.passwordChangedAt) {
      const userPassChangedAtTimestamps = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );

      // password changed after token created
      if (userPassChangedAtTimestamps > decoded.iat) {
        throw new Errors("Authentication failed, please try login again", 401);
      }
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  AllowedTo,
  Protect,
};
