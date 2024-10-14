const UploadImages = require("../utils/upload/UploadImages");

/**
 * return array has 2 middlewares
 * first for upload 2 type of images , 1. imageCaver max of number 1 ,2. images max of number 8
 *  second for resize the 2 type of images by the same of settings
 * @returns {Array} array of Express Middlewares
 */
const uploadImages = () => {
  const uploadImage = new UploadImages();
  const folder = "products";
  const options = { size: [800, 800], folder };

  /**
   * Express Middleware
   *
   * to resize imageCover and images for product and make size 800,800
   * and store it in "products" folder in path:"./storage/upload/images/products"
   */
  const resize = async (req, res, next) => {
    // upload single image
    if (req.files?.imageCover) {
      req.body.imageCover = uploadImage.resize(req.files.imageCover[0].buffer, {
        ...options,
        name: "product-cover",
      });
    }

    // upload multi images
    if (req.files?.images) {
      req.body.images = [];
      await req.files.images.forEach(async (image) => {
        req.body.images.push(
          uploadImage.resize(image.buffer, {
            ...options,
            name: "product-image",
          })
        );
      });
    }

    next();
  };
  return [
    uploadImage.uploadFields([
      { name: "imageCover", maxCount: 1 },
      { name: "images", maxCount: 8 },
    ]),
    resize,
  ];
};

module.exports = {
  uploadImages,
};
