const MainServiceClass = require("./lib/CRUDServices");
const UesServiceClass = require("./UserService");
const AuthServiceClass = require("./AuthService");
const WishlistServiceClass = require("./WishlistService");
const AddressServiceClass = require("./AddressService");
const CartServiceClass = require("./CartService");
const OrderServiceClass = require("./OrderService");

const BrandModel = require("../models/BrandModel");
const CategoryModel = require("../models/CategoryModel");
const SubCategoryModel = require("../models/SubCategoryModel");
const ProductModel = require("../models/ProductModel");
const CouponModel = require("../models/CouponModel");
const ReviewModel = require("../models/ReviewModel");
const UserModel = require("../models/UserModel");
const CartModel = require("../models/CartModel");
const OrderModel = require("../models/OrderModel");

module.exports = {
  BrandService: new MainServiceClass(BrandModel),
  CategoryService: new MainServiceClass(CategoryModel),
  SubCategoryService: new MainServiceClass(SubCategoryModel),
  ProductService: new MainServiceClass(ProductModel),
  ReviewService: new MainServiceClass(ReviewModel),
  CouponService: new MainServiceClass(CouponModel),
  UserService: new UesServiceClass(UserModel),
  AuthService: new AuthServiceClass(UserModel),
  WishlistService: new WishlistServiceClass(UserModel),
  AddressService: new AddressServiceClass(UserModel),
  CartService: new CartServiceClass(CartModel, ProductModel, CouponModel),
  OrderService: new OrderServiceClass(OrderModel, CartModel, ProductModel),
};
