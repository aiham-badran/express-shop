const Services = require("./lib/Services");
const Errors = require("../utils/errors/Errors");
/**
 * @class CartService
 * @extends Services
 * @description This service handles all cart-related operations such as adding, updating, and removing items,
 * applying coupons, and clearing the cart. It interacts with both the cart model and related product and coupon models.
 */
class CartService extends Services {
  /**
   * @param {Object} model - The cart model.
   * @param {Object} productModel - The product model used to fetch product details.
   * @param {Object} couponModel - The coupon model used to fetch coupon details.
   */
  constructor(model, productModel, couponModel) {
    super(model);
    this._productModel = productModel;
    this._couponModel = couponModel;
  }

  /**
   * Calculates the total price of the cart items.
   * @param {Array} cartItems - Array of cart items, each containing a `price` and `quantity` property.
   * @returns {Number} Total price of all items in the cart.
   */
  _calcTotalPrice(cartItems) {
    let total = 0;
    cartItems.forEach((item) => (total += item.quantity * item.price));
    return total;
  }

  /**
   * Generates a cart item by retrieving product details and setting the price.
   * @param {Object} param - The data required for the cart item.
   * @param {String} param.productId - The ID of the product to add to the cart.
   * @param {String} param.color - The color of the product to add.
   * @returns {Promise<Object>} The newly created cart item with product details.
   * @throws {Errors} If the product is not found.
   */
  async _makeCartItem({ productId, color }) {
    const product = await this._productModel.findById(productId);

    if (!product) throw new Errors("Product not found", 404);

    return {
      product: productId,
      price: product.price,
      color,
    };
  }

  /**
   * Creates a new cart with initial items for the user.
   * @param {String} user - The user ID for whom the cart is created.
   * @param {Object} data - The cart data containing product ID and color.
   * @returns {Promise<Object>} The newly created cart.
   */
  async _createCart(user, data) {
    const items = await this._makeCartItem(data);

    const cart = await this._model.create({
      user,
      cartItems: [items],
      totalCartPrice: items.price,
    });

    return cart;
  }

  /**
   * Finds the index of an item in the cart based on product ID and color.
   * @param {Array} cartItems - Array of cart items.
   * @param {Object} param - The product details to match.
   * @param {String} param.productId - The product ID to search for.
   * @param {String} param.color - The product color to search for.
   * @returns {Number} Index of the cart item, or -1 if not found.
   */
  _getIdxItemByAttributes(cartItems, { productId, color }) {
    return cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
  }

  /**
   * Finds the index of a cart item by its ID.
   * @param {Array} cartItems - Array of cart items.
   * @param {String} id - The cart item ID.
   * @returns {Number} Index of the cart item, or -1 if not found.
   */
  _getIdxItemById(cartItems, id) {
    return cartItems.findIndex((item) => item.id.toString() === id);
  }

  /**
   * Updates an existing cart by adding or updating items.
   * @param {Object} cart - The existing cart.
   * @param {Object} data - The new cart item data containing product ID and color.
   * @returns {Promise<Object>} The updated cart.
   */
  async _updateCart(cart, data) {
    const productIndexInCart = this._getIdxItemByAttributes(
      cart.cartItems,
      data
    );

    if (productIndexInCart > -1) {
      const cartItems = cart.cartItems[productIndexInCart];
      cartItems.quantity++;
      cart.cartItems[productIndexInCart] = cartItems;
    } else {
      const items = await this._makeCartItem(data);
      cart.cartItems.push(items);
    }

    cart.totalCartPrice = this._calcTotalPrice(cart.cartItems);
    cart.totalCartPriceAfterDiscount = undefined;

    await cart.save();
    return cart;
  }

  /**
   * Fetches the cart items for the authenticated user.
   * @route GET /api/cart
   * @access Private
   * @param {Object} req - The request object containing user details.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async getItemCart(req, res, next) {
    try {
      const { _id: userId } = req.user;

      const data = await this._model.findOne({ user: userId });

      res.status(200).json({ Items: data?.cartItems.length, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Adds an item to the cart or creates a new cart if it doesn't exist.
   * @route POST /api/cart
   * @access Private
   * @param {Object} req - The request object containing user details and item data.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async addItemToCart(req, res, next) {
    try {
      let data;
      const { _id: userId } = req.user;

      const cart = await this._model.findOne({ user: userId });

      if (!cart) data = await this._createCart(userId, req.body);
      else data = await this._updateCart(cart, req.body);

      res.status(200).json({ items: data?.cartItems.length, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates the quantity of a specific item in the cart.
   * @route PATCH /api/cart/:cartItemId
   * @access Private
   * @param {Object} req - The request object containing user details and item quantity.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async updateQuantityForItem(req, res, next) {
    try {
      let data;
      const { _id: userId } = req.user;
      const { cartItemId } = req.params;
      const { quantity } = req.body;

      const cart = await this._model.findOne({ user: userId });
      if (!cart) throw new Errors("No Cart Found", 404);

      const itemIdx = this._getIdxItemById(cart.cartItems, cartItemId);

      if (itemIdx > -1) {
        const cartItems = cart.cartItems[itemIdx];
        cartItems.quantity = quantity;
        cart.cartItems[itemIdx] = cartItems;
      } else {
        throw new Errors("No Item Found", 404);
      }

      cart.totalCartPrice = this._calcTotalPrice(cart.cartItems);
      cart.totalCartPriceAfterDiscount = undefined;
      await cart.save();

      res.status(200).json({ items: cart?.cartItems.length, cart });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Removes a specific item from the cart.
   * @route DELETE /api/cart/:cartItemId
   * @access Private
   * @param {Object} req - The request object containing user details and cart item ID.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async removerItem(req, res, next) {
    try {
      const { _id: userId } = req.user;
      const { cartItemId } = req.params;
      const cart = await this._model.findOneAndUpdate(
        { user: userId },
        {
          $pull: { cartItems: { _id: cartItemId } },
        },
        { new: true }
      );

      cart.totalCartPrice = this._calcTotalPrice(cart.cartItems);
      cart.totalCartPriceAfterDiscount = undefined;

      await cart.save();

      res.status(200).json({ Items: cart?.cartItems.length, data: cart });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Clears the cart for the authenticated user.
   * @route DELETE /api/cart
   * @access Private
   * @param {Object} req - The request object containing user details.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async clearCart(req, res, next) {
    try {
      const { _id: userId } = req.user;
      await this._model.findOneAndDelete({ user: userId });

      res.status(200).json({ status: "success" });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Applies a coupon to the cart, updating the total price with the discount.
   * @route POST /api/cart/apply-coupon
   * @access Private
   * @param {Object} req - The request object containing user details and coupon code.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async applyCoupon(req, res, next) {
    try {
      const { _id: userId } = req.user;
      const { coupon } = req.body;
      const theCoupon = await this._couponModel.findOne({
        name: coupon,
        expire: { $gt: Date.now() },
      });

      if (!theCoupon) throw new Errors("Coupon is invalid or expired");

      const cart = await this._model.findOne({ user: userId });
      const totalPrice = cart.totalCartPrice;

      cart.totalCartPriceAfterDiscount = (
        totalPrice -
        (totalPrice * theCoupon.discount) / 100
      ).toFixed(2);

      await cart.save();

      res.status(200).json({ Items: cart?.cartItems.length, data: cart });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CartService;
