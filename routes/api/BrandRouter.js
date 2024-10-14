const { Router } = require("express");
const { BrandService } = require("../../services");
const { BrandValidation } = require("../../utils/validation/Validations");
const { uploadImage } = require("../../middlewares/BrandMiddlewares");
const { AllowedTo, Protect } = require("../../middlewares/AuthMiddlewares");

const BrandRouter = Router();

BrandRouter.get("/", BrandService.getAll.bind(BrandService));

BrandRouter.get(
  "/:id",
  BrandValidation.checkParam(),
  BrandService.getById.bind(BrandService)
);

BrandRouter.use(Protect, AllowedTo("admin"));

BrandRouter.post(
  "/",
  uploadImage(),
  BrandValidation.whenCreate(),
  BrandService.create.bind(BrandService)
);

BrandRouter.route("/:id")
  .put(
    uploadImage(),
    BrandValidation.whenUpdate(),
    BrandService.updateById.bind(BrandService)
  )
  .delete(
    BrandValidation.checkParam(),
    BrandService.deleteById.bind(BrandService)
  );

module.exports = BrandRouter;
