const { Router } = require("express");
const { ProductService } = require("../../services");
const { ProductValidation } = require("../../utils/validation/Validations");
const { uploadImages } = require("../../middlewares/ProductMiddlewares.js");
const { AllowedTo, Protect } = require("../../middlewares/AuthMiddlewares");
const ReviewRoute = require("./ReviewRoute.js");

const ProductRouter = Router();

ProductRouter.use("/:productId/reviews", ReviewRoute);

ProductRouter.get("", ProductService.getAll.bind(ProductService)).get(
  "/:id",
  ProductValidation.checkParam(),
  ProductService.getById.bind(ProductService)
);

ProductRouter.use(Protect, AllowedTo("admin"));

ProductRouter.post(
  "",
  uploadImages(),
  ProductValidation.whenCreate(),
  ProductService.create.bind(ProductService)
);
ProductRouter.route("/:id")
  .put(
    uploadImages(),
    ProductValidation.whenUpdate(),
    ProductService.updateById.bind(ProductService)
  )
  .delete(
    ProductValidation.checkParam(),
    ProductService.deleteById.bind(ProductService)
  );

module.exports = ProductRouter;
