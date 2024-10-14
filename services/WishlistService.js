const Services = require("./lib/Services");

/**
 * WishlistService class extending Services to handle wishlist-related operations.
 * This service manages user wishlists, including retrieving, adding, and removing products.
 *
 * @class
 * @extends {Services}
 */
class WishlistService extends Services {
  /**
   * Creates an instance of WishlistService.
   *
   * @constructor
   * @param {Model} model - The user model used for wishlist-related operations.
   */
  constructor(model) {
    super(model);
  }

  /**
   * Retrieves the wishlist of the currently logged-in user.
   *
   * @async
   * @param {Request} req - The request object containing user details.
   * @param {Response} res - The response object used to send back the wishlist data.
   * @param {Function} next - The next middleware function for error handling.
   * @returns {Promise<void>}
   * @throws {Errors} - Throws an error if the wishlist cannot be retrieved.
   */
  async getWishlists(req, res, next) {
    try {
      const { _id: userId } = req.user;

      const user = await this._model
        .findById(userId, "wishlist")
        .populate("wishlist");

      res.status(200).json({ data: user.wishlist });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Adds a product to the user's wishlist.
   *
   * @async
   * @param {Request} req - The request object containing the user ID and product ID.
   * @param {Response} res - The response object used to send back the updated user data.
   * @param {Function} next - The next middleware function for error handling.
   * @returns {Promise<void>}
   * @throws {Errors} - Throws an error if the product cannot be added to the wishlist.
   */
  async addToWishlist(req, res, next) {
    try {
      const { _id: userId } = req.user;
      const user = await this._model.findByIdAndUpdate(
        userId,
        {
          $addToSet: { wishlist: req.params.productId },
        },
        { new: true }
      );

      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Removes a product from the user's wishlist.
   *
   * @async
   * @param {Request} req - The request object containing the user ID and product ID.
   * @param {Response} res - The response object used to confirm the product removal.
   * @param {Function} next - The next middleware function for error handling.
   * @returns {Promise<void>}
   * @throws {Errors} - Throws an error if the product cannot be removed from the wishlist.
   */
  async removerFromWishlist(req, res, next) {
    try {
      const { _id: userId } = req.user;
      await this._model.findByIdAndUpdate(
        userId,
        {
          $pull: { wishlist: req.params.productId },
        },
        { new: true }
      );

      res.status(204).json({ status: "success" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WishlistService;
