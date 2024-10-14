const { Router } = require("express");
const { WishlistService, AddressService } = require("../../services");
const {
  AddressValidation,
  WishlistValidation,
} = require("../../utils/validation/Validations");

const UserToolsRouter = Router();

UserToolsRouter.get(
  "/wishlist",
  WishlistService.getWishlists.bind(WishlistService)
);
UserToolsRouter.route("/wishlist/:productId")
  .post(
    WishlistValidation.checkParam(),
    WishlistService.addToWishlist.bind(WishlistService)
  )
  .delete(
    WishlistValidation.checkParam(),
    WishlistService.removerFromWishlist.bind(WishlistService)
  );

UserToolsRouter.route("/address")
  .get(AddressService.getAddresses.bind(AddressService))
  .post(
    AddressValidation.whenCreate(),
    AddressService.addToAddress.bind(AddressService)
  );
UserToolsRouter.delete(
  "/address/:alias",
  AddressService.removerFroAddress.bind(AddressService)
);

module.exports = UserToolsRouter;
