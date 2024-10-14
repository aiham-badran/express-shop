const mongoose = require("mongoose");

const HelperModel = require("../utils/helpers/HelpersModels");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Product is required"],
      unique: [true, "This Product is exist, it must be unique"],
      minlength: [10, "The Product must be more than 10 letters"],
      maxlength: [255, "The Product must bet less than 255 letters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Product Description is required"],
      minlength: [100, "The Product Description must be more than 100 letters"],
    },
    quantity: {
      type: Number,
      required: [true, "Product Quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "Product Price is required"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image Cover is required"],
    },
    images: [String],
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Categories",
        required: [true, "Category is required"],
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brands",
    },
    ratingsAverage: {
      type: Number,
      min: [0, "The Product Rating must be more than or equal 1.0 "],
      max: [5, "The Product Rating must be less than or equal 5.0"],
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    selectPopulatedPaths: false,
  }
);

/**
 * make slug name
 */
productSchema.pre("save", HelperModel.makeSlugFieldWhenSave("title"));

productSchema.pre(
  "findOneAndUpdate",
  HelperModel.makeSlugFieldWhenUpdate("title")
);

/**
 * get category name when fetch product data
 */
productSchema.pre(/find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});

/**
 * adds image URLs to a document
 * Check if the document has an image cover,Construct the image URL by concatenating the base URL and image cover path
 * Check if the document has an images field then use map method for  each image construct the image URL
 *
 * @returns mongooes middleware
 */

const addImagesUrlToDoc = function (doc) {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const newImages = doc.images.map(
      (image) => `${process.env.BASE_URL}/${image}`
    );
    doc.images = newImages;
  }
};

/**
 * change image filed to app url + image name
 */
productSchema.post("init", addImagesUrlToDoc);

/**
 * change image filed to app url + image name
 */
productSchema.post("save", addImagesUrlToDoc);

/**
 * make virtual field with name reviews belong to Reviews table
 */
productSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "product",
  localField: "_id",
});

/**
 * add reviews data when fetch one of product
 */
productSchema.pre("findOne", function (next) {
  this.populate("reviews");
  next();
});

const ProductModel = mongoose.model("Products", productSchema);

module.exports = ProductModel;
