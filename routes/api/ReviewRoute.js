const { Router } = require("express");
const { ReviewService } = require("../../services");
const { ReviewValidation } = require("../../utils/validation/Validations");
const { AllowedTo, Protect } = require("../../middlewares/AuthMiddlewares");
const {
  filterReviewsByProductId,
  checkProductExist,
  addProductIdToBodyReviews,
  userAddedReviewPreviously,
  userAllowToDeleteReview,
  userAllowToUpdateReview,
} = require("../../middlewares/ReviewMiddlewares.js");

const ReviewRoute = Router({ mergeParams: true });

ReviewRoute.get(
  "",
  filterReviewsByProductId,
  ReviewService.getAll.bind(ReviewService)
).get(
  "/:id",
  ReviewValidation.checkParam(),
  checkProductExist,
  ReviewService.getById.bind(ReviewService)
);

ReviewRoute.use(
  Protect,
  AllowedTo("admin", "user"),
  checkProductExist,
  addProductIdToBodyReviews
);
ReviewRoute.post(
  "",
  ReviewValidation.whenCreate(),
  userAddedReviewPreviously,
  ReviewService.create.bind(ReviewService)
);
ReviewRoute.route("/:id")
  .put(
    ReviewValidation.whenUpdate(),
    userAllowToUpdateReview,
    ReviewService.updateById.bind(ReviewService)
  )
  .delete(
    userAllowToDeleteReview,
    ReviewValidation.checkParam(),
    ReviewService.deleteById.bind(ReviewService)
  );

module.exports = ReviewRoute;
