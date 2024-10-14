const { Router } = require("express");
const { CartService } = require("../../services");
const { AllowedTo, Protect } = require("../../middlewares/AuthMiddlewares");
const { GetLoggedUserId } = require("../../middlewares/UserMiddlewares");

const CartRouter = Router({});

CartRouter.use(Protect, AllowedTo("admin", "user"), GetLoggedUserId);

CartRouter.route("/")
  .get(CartService.getItemCart.bind(CartService))
  .post(CartService.addItemToCart.bind(CartService))
  .delete(CartService.clearCart.bind(CartService));

CartRouter.put("/applyCoupon", CartService.applyCoupon.bind(CartService));

CartRouter.route("/:cartItemId")
  .put(CartService.updateQuantityForItem.bind(CartService))
  .delete(CartService.removerItem.bind(CartService));

module.exports = CartRouter;
