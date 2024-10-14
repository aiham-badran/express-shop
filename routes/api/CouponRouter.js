const { Router } = require("express");
const { CouponService } = require("../../services");
const { CouponValidation } = require("../../utils/validation/Validations");
const { AllowedTo, Protect } = require("../../middlewares/AuthMiddlewares");

const CouponRouter = Router();

CouponRouter.use(Protect, AllowedTo("admin"));

CouponRouter.route("/")
  .get(CouponService.getAll.bind(CouponService))
  .post(
    CouponValidation.whenCreate(),
    CouponService.create.bind(CouponService)
  );

CouponRouter.route("/:id")
  .get(CouponValidation.checkParam(), CouponService.getById.bind(CouponService))
  .put(
    CouponValidation.whenUpdate(),
    CouponService.updateById.bind(CouponService)
  )
  .delete(
    CouponValidation.checkParam(),
    CouponService.deleteById.bind(CouponService)
  );

module.exports = CouponRouter;
