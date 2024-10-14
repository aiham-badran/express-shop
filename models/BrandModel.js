const mongoose = require("mongoose");

const HelperModel = require("../utils/helpers/HelpersModels");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: [true, "Category is required"],
      unique: [true, "This Category is exist, it must be unique"],
      minlength: [2, "The Category must be more than 3 letters"],
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
 * make slug using brand name when create doc
 * */
brandSchema.pre("save", HelperModel.makeSlugFieldWhenSave("name"));

/**
 * update slug using name when update doc
 */
brandSchema.pre(
  "findOneAndUpdate",
  HelperModel.makeSlugFieldWhenUpdate("name")
);

/**
 * change image filed to app url + image name
 */
brandSchema.post("init", HelperModel.addImageUrlToDoc("image"));

/**
 * change image filed to app url + image name
 */
brandSchema.post("save", HelperModel.addImageUrlToDoc("image"));

const BrandModel = mongoose.model("Brands", brandSchema);

module.exports = BrandModel;
