const Services = require("./lib/Services");
/**
 * AddressService class
 *
 * This class extends the Services class and provides methods for managing user addresses.
 *
 * @extends Services
 */

class AddressService extends Services {
  /**
   * Constructor
   *
   * @param {object} model - The model used to interact with the database.
   */
  constructor(model) {
    super(model);
  }

  /**
   * Get User address
   *
   * Retrieves the user's addresses from the database.
   *
   */
  async getAddresses(req, res, next) {
    try {
      const { _id: userId } = req.user;

      const user = await this._model
        .findById(userId, "addresses")
        .populate("addresses");

      res.status(200).json({ data: user.addresses });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Add new address
   *
   * Adds a new address to the user's profile in the database.
   *
   */
  async addToAddress(req, res, next) {
    try {
      const { _id: userId } = req.user;

      const user = await this._model.findByIdAndUpdate(
        userId,
        {
          $addToSet: { addresses: req.body },
        },
        { new: true }
      );

      res.status(201).json({ data: user.addresses[user.addresses.length - 1] });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Remove specific product form address using product id
   *
   * Removes a specific address from the user's profile in the database.
   *
   */
  async removerFroAddress(req, res, next) {
    try {
      const { _id: userId } = req.user;

      const { alias } = req.params;

      const user = await this._model.findByIdAndUpdate(
        userId,
        {
          $pull: { addresses: { alias } },
        },
        { new: true }
      );

      res.status(204).json({ status: "success" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AddressService;
