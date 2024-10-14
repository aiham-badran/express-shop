const UploadImages = require("../utils/upload/UploadImages");

/**
 * Express Middleware
 *
 * add filter in req.filterObj for filtering order by logged user id
 * if user role is "user"
 */
const FilterOrderForLoggedUser = (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user.id };
  next();
};

/**
 * Express Middleware
 *
 * add id for logged user in req.params
 */
const GetLoggedUserId = (req, res, next) => {
  req.params.id = req.user._id;

  next();
};
/**
 * Express Middleware
 *
 * remove password form user data if exist when update user data for protection
 */
const RemovePasswordWhenUpdateUser = (req, res, next) => {
  if (req.body.password) delete req.body.password;

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
   * to resize image for user using
   * and store it in "users" folder in path:"./storage/upload/images/users"
   */
  const resize = (req, res, next) => {
    let image;
    if (req.file)
      image = uploadImage.resize(req.file.buffer, {
        name: "profileImage",
        folder: "users",
        size: [300, 300],
      });
    req.body["profileImage"] = image;
    next();
  };
  return [uploadImage.uploadSingle("profileImage"), resize];
};

module.exports = {
  FilterOrderForLoggedUser,
  GetLoggedUserId,
  RemovePasswordWhenUpdateUser,
  uploadImage,
};
