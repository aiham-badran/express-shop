const MainValidationClass = require("./MainValidation");
const UserValidationClass = require("./UserValidation");

const MainValidatorSchema = require("../schema/MainValidatorSchema");
const BrandValidatorSchema = require("../schema/BrandValidatorSchema");
const CategoriesValidatorSchema = require("../schema/CategoryValidatorSchema");
const SubCategoriesValidatorSchema = require("../schema/SubCategoryValidatorSchema");
const ProductValidatorSchema = require("../schema/ProductValidatorSchema");
const ReviewValidatorSchema = require("../schema/ReviewValidatorSchema");
const UserValidatorSchema = require("../schema/usersValidationSchema");
const AddressValidatorSchema = require("../schema/AddressValidatorSchema");
const CouponValidatorSchema = require("../schema/CouponValidatorSchema");

const paramsIdValidator = MainValidatorSchema.checkValidMongoId("id");

module.exports = {
  BrandValidation: new MainValidationClass(
    BrandValidatorSchema.ForCreate,
    BrandValidatorSchema.ForUpdate,
    paramsIdValidator
  ),
  CategoriesValidation: new MainValidationClass(
    CategoriesValidatorSchema.ForCreate,
    CategoriesValidatorSchema.ForUpdate,
    paramsIdValidator
  ),
  SubCategoriesValidation: new MainValidationClass(
    SubCategoriesValidatorSchema.ForCreate,
    SubCategoriesValidatorSchema.ForUpdate,
    paramsIdValidator
  ),
  ProductValidation: new MainValidationClass(
    ProductValidatorSchema.ForCreate,
    ProductValidatorSchema.ForUpdate,
    paramsIdValidator
  ),
  ReviewValidation: new MainValidationClass(
    ReviewValidatorSchema.ForCreate,
    ReviewValidatorSchema.ForUpdate,
    paramsIdValidator
  ),
  WishlistValidation: new MainValidationClass(
    null,
    null,
    MainValidatorSchema.checkValidMongoId("productId")
  ),
  UserValidation: new UserValidationClass(
    UserValidatorSchema.ForCreate,
    UserValidatorSchema.ForUpdate,
    paramsIdValidator,
    UserValidatorSchema.ForLogin,
    UserValidatorSchema.ForChangePassword,
    UserValidatorSchema.ForResetPassword
  ),
  AddressValidation: new MainValidationClass(
    AddressValidatorSchema.ForCreate,
    null,
    MainValidatorSchema.checkValidMongoId("addressId")
  ),
  CouponValidation: new MainValidationClass(
    CouponValidatorSchema.ForCreate,
    CouponValidatorSchema.ForUpdate,
    paramsIdValidator
  ),
};
