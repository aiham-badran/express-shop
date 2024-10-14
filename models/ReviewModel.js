const mongoose = require("mongoose");
const ProductModel = require("./ProductModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      lowercase: true,
    },
    ratings: {
      type: Number,
      required: [true, "The Ratings is Required"],
      min: [1, "The Rating must be more than or equal 1.0 "],
      max: [5, "The Rating must be less than or equal 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "products",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * get user name when fetch data
 */
reviewSchema.pre("find", function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

/**
 * calculates the average rating and quantity of ratings for a product
 * and updates the product document with the calculated values
 *
 * @param {import("mongoose").ObjectId} productId - the ID of the product to calculate ratings for
 */
reviewSchema.statics.calcAvgRatingAndQuantity = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      // group the matched documents by product ID
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);

  // check if any documents were matched (i.e., the product exists)
  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingQuantity,
    });
  } else {
    // if no documents were matched, update the product document with default values
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

/**
 * calculates the average rating and quantity of ratings for the product
 * after the document has been saved to the database
 */
reviewSchema.post("save", async function () {
  await this.constructor.calcAvgRatingAndQuantity(this.product);
});

/**
 * calculates the average rating and quantity of ratings for the product
 * after the document has been deleted to the database
 */
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcAvgRatingAndQuantity(doc.product);
  }
});

const ReviewModel = mongoose.model("Reviews", reviewSchema);

module.exports = ReviewModel;
