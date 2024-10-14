const ReviewModel = require("../models/ReviewModel");
const ProductModel = require("../models/ProductModel");
const Errors = require("../utils/errors/Errors");

/**
 * Express Middleware
 *
 * Make sure the user not add review for the product before
 * and then attach user id  in req.body
 */
exports.userAddedReviewPreviously = async (req, res, next) => {
  const { _id: userId } = req.user;
  try {
    const review = await ReviewModel.findOne({
      user: userId,
      product: req.body.product,
    });

    if (review)
      return next(
        new Errors(
          `You Previously Added Review with id ${review._id}, You cannot add new. `,
          400
        )
      );

    req.body.user = req.user._id;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Express Middleware
 *
 * Make sure the user is the one who added the review so they can update it
 * and then attach the user ID in the req.body.
 */
exports.userAllowToUpdateReview = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { id: reviewId } = req.params;
  try {
    const review = await ReviewModel.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!review) return next(new Errors("The Review not exist. ", 404));

    req.body.user = userId;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Express Middleware
 *
 * Make sure the user is the one who added the review so they can delete it
 */
exports.userAllowToDeleteReview = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { id: reviewId } = req.params;
  try {
    if (req.user.role === "user") {
      const review = await ReviewModel.findOne({
        _id: reviewId,
        user: userId,
      });

      if (!review)
        return next(new Errors("You cannot Delete this review.", 403));
    }

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Express Middleware
 *
 * check product is exist before add review
 */

exports.checkProductExist = async (req, res, next) => {
  try {
    if (req.params.productId) {
      const { productId } = req.params;

      const data = await ProductModel.findById(productId);

      if (!data)
        return next(new Errors(`Product with id ${productId} not exist`, 404));
    }
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Express Middleware
 *
 *  add filter in req.filterObj for filtering review by product id
 */
exports.filterReviewsByProductId = (req, res, next) => {
  if (req.params.productId) req.filterObj = { product: req.params.productId };
  next();
};

/**
 * Express Middleware
 *
 *  add product Id to req.body if not exist from req.params.productId
 */
exports.addProductIdToBodyReviews = (req, res, next) => {
  if (req.params.productId && !req.body.product)
    req.body.product = req.params.productId;

  next();
};
