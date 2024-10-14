const Services = require("./lib/Services.js");
const JWT = require("../utils/security/JWT");
const Security = require("../utils/security/Security");
const Generators = require("../utils/security/Generators.js");
const Errors = require("../utils/errors/Errors");
const sendEmail = require("../utils/email/emailService");

/**
 * AuthService class
 *
 * This class extends the Services class and provides methods for managing user authentication.
 *
 * @extends Services
 */
class AuthService extends Services {
  /**
   * Constructor
   *
   * @param {object} model - The model used to interact with the database.
   */
  constructor(model) {
    super(model);
  }

  /**
   * Signup user
   *
   * Creates a new user account in the database.
   *
   */
  async signup(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await this._model.create({ name, email, password });

      const token = JWT.createJWTToken({ userId: user._id });
      res.status(201).json({ user, token });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Login user
   *
   * Logs in an existing user account in the database.
   *
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await this._model.findOne({ email }, "+password");
      console.log(user);
      if (!user || !(await Security.bcryptCompare(password, user.password)))
        throw new Errors("Incorrect Password or Email", 401);

      const token = JWT.createJWTToken({ userId: user._id });
      user["password"] = undefined;
      res.status(200).json({ user, token });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Send email for password reset
   *
   * Sends an email to the user with a password reset code.
   *
   * @param {string} email - The user's email address.
   * @param {string} name - The user's name.
   * @param {string} code - The password reset code.
   */
  async _sendResetPasswordEmail(email, name, code) {
    try {
      await sendEmail.sendEmail(
        email,
        "forgot password code",
        "resetPasswordCode",
        {
          name,
          code,
        }
      );
    } catch (err) {
      throw new Errors("Email Not Sent: Please Try Again Later", 500);
    }
  }

  /**
   * Sent email for user with reset code
   *
   * Sends an email to the user with a password reset code.
   *
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await this._model.findOne({ email });
      if (!user) throw new Errors("User Not Found", 404);

      const code = Generators.RandomNumbersCode(5);
      const hashCode = Security.hashCode(code);

      await this._sendResetPasswordEmail(email, user.name, code);

      user.resetPasswordExpires = Generators.timeOut("10m");
      user.resetPasswordCode = hashCode;
      user.resetPasswordVerified = false;

      await user.save();

      res.status(200).json({ status: "Success" });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Check if reset code is valid
   *
   * Verifies the password reset code sent to the user.
   *
   */
  async verifyRestCode(req, res, next) {
    try {
      const { resetCode } = req.body;

      if (!resetCode) throw new Errors("the resetCode must be not empty", 401);

      const hashCode = Security.hashCode(resetCode);
      const user = await this._model.findOne({
        resetPasswordCode: hashCode,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) throw new Errors("Reset Code Is Invalid Or Expired", 400);

      user.resetPasswordVerified = true;

      await user.save();

      res.status(200).json({ status: "Success" });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Reset password
   *
   * Resets the user's password.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The new password.
   */
  async resetPassword(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await this._model.findOne(
        { email },
        "+resetPasswordVerified"
      );
      if (!user) throw new Errors("User Not Found", 404);

      if (!user.resetPasswordVerified)
        throw new Errors("Rest Code Not Verified, Try Again Later", 400);

      user.password = password;
      user.passwordChangedAt = Date.now();
      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;
      user.resetPasswordVerified = undefined;

      await user.save();

      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthService;
