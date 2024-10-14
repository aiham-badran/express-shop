const { Router } = require("express");
const { OrderService } = require("../../services/");
const { AllowedTo, Protect } = require("../../middlewares/AuthMiddlewares");
const {
  FilterOrderForLoggedUser,
} = require("../../middlewares/UserMiddlewares");

const OrderRouters = Router();

OrderRouters.use(Protect, AllowedTo("admin", "user"));

OrderRouters.get(
  "",
  FilterOrderForLoggedUser,
  OrderService.getAll.bind(OrderService)
);

OrderRouters.route("/:cartId")
  .get(OrderService.getById.bind(OrderService))
  .post(OrderService.createCash.bind(OrderService));

OrderRouters.get(
  "checkout-session/:cartId",
  OrderService.checkoutSession.bind(OrderService)
);

OrderRouters.use(AllowedTo("admin"));
OrderRouters.put(
  "/:cartId/paid",
  OrderService.updatePaidInOrder.bind(OrderService)
);
OrderRouters.put(
  "/:cartId/delivered",
  OrderService.updateDeliveredInOrder.bind(OrderService)
);

module.exports = OrderRouters;
