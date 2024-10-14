const stripe = require("stripe");
const CRUDServices = require("./lib/CRUDServices");
const Errors = require("../utils/errors/Errors");

/**
 * OrderService class extending CRUDServices to handle order-related operations.
 * This service handles operations such as creating cash orders, updating order
 * payment status, updating delivery status, and handling Stripe checkout sessions.
 *
 * @class
 * @extends {CRUDServices}
 */
class OrderService extends CRUDServices {
  /**
   * Creates an instance of OrderService.
   *
   * @constructor
   * @param {Model} model - The order model used for database interactions.
   * @param {Model} cartModel - The cart model used to manage user's cart.
   * @param {Model} productModel - The product model used to manage product inventory.
   */
  constructor(model, cartModel, productModel) {
    super(model);
    this._stripe = stripe(process.env.SECRET_KEY);

    this._cartModel = cartModel;
    this._productModel = productModel;
  }

  /**
   * Retrieves an order by ID and ensures the order belongs to the current user.
   *
   * @override
   * @async
   * @param {Request} req - The request object containing cart ID and user data.
   * @returns {Promise<Object>} - The found order document.
   * @throws {Errors} - Throws an error if the order is not found.
   */
  async _getByIdBody(req) {
    const { cartId } = req.params;
    const { _id: userId } = req.user;
    const data = await this._model.findOne({ _id: cartId, user: userId });
    if (!data) throw new Errors(`Document with ID ${cartId} not found`, 404);
    return data;
  }

  /**
   * Creates a new order based on the provided cart and marks it as a cash order.
   * It also handles inventory updates and cart deletion after order creation.
   *
   * @async
   * @param {Request} req - The request object containing cart ID and order details.
   * @param {Response} res - The response object used to send back the result.
   * @param {Function} next - The next middleware function for error handling.
   * @returns {Promise<void>}
   * @throws {Errors} - Throws an error if the cart or order is not found.
   */
  async createCash(req, res, next) {
    try {
      const { cartId } = req.params;
      const { _id: userId } = req.user;
      const { shippingAddress } = req.body;

      const cart = await this._cartModel.findById(cartId);
      if (!cart) throw new Errors("no cart found", 404);

      const taxPrice = 0;
      const shippingPrice = 0;
      const cartPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;

      const totalPrice = cartPrice + taxPrice + shippingPrice;

      const order = await this._model.create({
        user: userId,
        cartItems: cart.cartItems,
        totalPrice,
        shippingAddress,
      });

      if (!order) throw new Errors("no order found", 404);

      const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: {
            $inc: { quantity: -item.quantity, sold: +item.quantity },
          },
        },
      }));
      await this._productModel.bulkWrite(bulkOption, {});

      await this._cartModel.findByIdAndDelete(cartId);

      res.status(201).json({ order });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates the payment status of an order to paid.
   *
   * @async
   * @param {Request} req - The request object containing cart ID.
   * @param {Response} res - The response object used to send back the result.
   * @param {Function} next - The next middleware function for error handling.
   * @returns {Promise<void>}
   * @throws {Errors} - Throws an error if the order is not found.
   */
  async updatePaidInOrder(req, res, next) {
    try {
      const { cartId } = req.params;
      const order = await this._model.findById(cartId);

      if (!order) throw new Errors("No Order Found", 404);

      order.isPaid = true;
      order.paidAt = Date.now();
      await order.save();
      res.status(200).json({ status: "success" });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates the delivery status of an order to delivered.
   *
   * @async
   * @param {Request} req - The request object containing cart ID.
   * @param {Response} res - The response object used to send back the result.
   * @param {Function} next - The next middleware function for error handling.
   * @returns {Promise<void>}
   * @throws {Errors} - Throws an error if the order is not found.
   */
  async updateDeliveredInOrder(req, res, next) {
    const { cartId } = req.params;
    const order = await this._model.findById(cartId);

    if (!order) throw new Errors("No Order Found", 404);

    order.isDelivered = true;
    order.DeliveredAt = Date.now();
    await order.save();
    res.status(200).json({ status: "success" });
  }

  /**
   * Creates a Stripe checkout session for the user based on their cart.
   *
   * @async
   * @param {Request} req - The request object containing cart ID.
   * @param {Response} res - The response object used to send back the session URL.
   * @param {Function} next - The next middleware function for error handling.
   * @returns {Promise<void>}
   * @throws {Errors} - Throws an error if the cart is not found or Stripe fails to create the session.
   */
  async checkoutSession(req, res, next) {
    try {
      const { cartId } = req.params;

      const cart = await this._cartModel.findById(cartId);
      if (!cart) throw new Errors("no cart found", 404);

      const taxPrice = 0;
      const shippingPrice = 0;
      const cartPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;

      const totalPrice = (cartPrice + taxPrice + shippingPrice + 100) * 100;
      const price = await this._stripe.prices.create({
        unit_amount: totalPrice,
        currency: "try",
        product_data: {
          name: cart.cartItems[0].color,
        },
      });
      const session = await this._stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: price.id,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/order`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart`,
        customer_email: req.user.email,
        client_reference_id: cartId,
      });

      res.status(200).json({ status: "success", session });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderService;
