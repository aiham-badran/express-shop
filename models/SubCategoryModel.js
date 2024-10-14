const mongoose = require("mongoose");

const HelperModel = require("../utils/helpers/HelpersModels");

const subcategoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: [true, "Category is required"],
      unique: [true, "This Category is exist, it must be unique"],
      minlength: [3, "The Category must be more than 3 letters"],
      maxlength: [32, "The Category must bet less than 32 letters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Categories",
      required: [
        true,
        "Sub Category is required, it must be belong to parent category",
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * make slug using name
 */
subcategoriesSchema.pre("save", HelperModel.makeSlugFieldWhenSave("name"));

/**
 * update slug
 */
subcategoriesSchema.pre(
  "findOneAndUpdate",
  HelperModel.makeSlugFieldWhenUpdate("name")
);

/**
 * get category name when fetch data
 */
subcategoriesSchema.pre(/find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });

  next();
});

const SubCategoryModel = mongoose.model("SubCategories", subcategoriesSchema);

module.exports = SubCategoryModel;
