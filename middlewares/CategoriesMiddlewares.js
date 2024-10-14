const UploadImages = require("../utils/upload/UploadImages");

const AddCategoryIdToSubCategoryBody = (req, res, next) => {
  if (req.params.categoryId && !req.body.category)
    req.body.category = req.params.categoryId;

  next();
};
const FilterSubCategoriesByCategoryId = (req, res, next) => {
  if (req.params.categoryId)
    req.filterObj = { category: req.params.categoryId };

  next();
};

/**
 * return array has 2 middlewares first for upload image and second for resize the image
 * @returns {Array} array of Express Middlewares
 */
const uploadImage = () => {
  const uploadImage = new UploadImages();

  /**
   * Express Middleware
   *
   * to resize image for category using default setting
   * and store it in "categories" folder in path:"./storage/upload/images/categories"
   */
  const resize = (req, res, next) => {
    let image;
    if (req.file)
      image = uploadImage.resize(req.file.buffer, {
        name: "category",
        folder: "categories",
      });
    req.body["image"] = image;
    next();
  };

  return [uploadImage.uploadSingle("image"), resize];
};

module.exports = {
  AddCategoryIdToSubCategoryBody,
  FilterSubCategoriesByCategoryId,
  uploadImage,
};
