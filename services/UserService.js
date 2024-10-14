const CRUDServices = require("./lib/CRUDServices.js");
const JWT = require("../utils/security/JWT");
const Errors = require("../utils/errors/Errors.js");

/**
 * UserService class extending CRUDServices to handle user-related operations.
 * This service handles operations such as updating user passwords and deactivating users.
 *
 * @class
 * @extends {CRUDServices}
 */
class UserService extends CRUDServices {
  /**
   * Creates an instance of UserService.
   *
   * @constructor
   * @param {Model} model - The user model used for database interactions.
   */
  constructor(model) {
    super(model);
  }

  /**
   * Updates the password of a user identified by their ID.
   *
   * @async
   * @access Private
   * @param {Request} req - The request object containing the user's ID and new password.
   * @param {Response} res - The response object used to send back the updated user.
   * @param {Function} next - The next middleware function for error handling.
   * @returns {Promise<void>}
   * @throws {Errors} - Throws an error if the user is not found.
   */
  async updateUserPassword(req, res, next) {
    try {
      const { id } = req.params;
      const data = await this._model.findByIdAndUpdate(
        id,
        { password: req.body.password, passwordChangedAt: Date.now() },
        { new: true }
      );

      if (!data) throw new Errors(`No Document for this id ${id}`, 404);

      const token = JWT.createJWTToken({ userId: data._id });

      res.status(200).json({ status: "success", token });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deactivates a user account by setting the 'active' status to false.
   *
   * @async
   * @param {Request} req - The request object containing the user's ID.
   * @param {Response} res - The response object used to confirm the account deactivation.
   * @param {Function} next - The next middleware function for error handling.
   * @returns {Promise<void>}
   * @throws {Errors} - Throws an error if the user is not found.
   */
  async inactive(req, res, next) {
    const { id } = req.params;
    const data = await this._model.findById(id);
    if (!data) throw new Errors(`No Document for this id ${id}`, 404);

    data.active = false;
    await data.save();

    res.status(200).json({
      status: "success",
      message:
        "Your account is now inactive and will be deleted after 30 days. You can reactivate it by logging in again within 30 days before deletion.",
    });
  }
}

module.exports = UserService;
