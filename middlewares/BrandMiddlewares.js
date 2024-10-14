const UploadImages = require("../utils/upload/UploadImages");

/**
 * return array has 2 middlewares first for upload image and second for resize the image
 * @returns {Array} array of Express Middlewares
 */
const uploadImage = () => {
  const uploadImage = new UploadImages();

  /**
   * Express Middleware
   *
   * to resize image for brand using default setting
   * and store it in "brands" folder in path:"./storage/upload/images/brands"
   */
  const resize = (req, res, next) => {
    let image;
    if (req.file)
      image = uploadImage.resize(req.file.buffer, {
        name: "brand",
        folder: "brands",
      });
    req.body["image"] = image;
    next();
  };
  return [uploadImage.uploadSingle("image"), resize];
};

module.exports = {
  uploadImage,
};
