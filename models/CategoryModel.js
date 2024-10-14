const mongoose = require("mongoose");

const HelperModel = require("../utils/helpers/HelpersModels");

const categoriesSchema = new mongoose.Schema(
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
    image: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 *
 */
categoriesSchema.pre("save", HelperModel.makeSlugFieldWhenSave("name"));

// update slug
categoriesSchema.pre(
  "findOneAndUpdate",
  HelperModel.makeSlugFieldWhenUpdate("name")
);

/**
 * change image filed to app url + image name
 */
categoriesSchema.post("init", HelperModel.addImageUrlToDoc("image"));

/**
 * change image filed to app url + image name
 */
categoriesSchema.post("save", HelperModel.addImageUrlToDoc("image"));

const CategoryModel = mongoose.model("Categories", categoriesSchema);

module.exports = CategoryModel;
