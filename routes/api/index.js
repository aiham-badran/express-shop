const { Router } = require("express");

const BrandRouter = require("./BrandRouter");
const CategoryRoute = require("./CategoryRoute");
const SubCategoryRouter = require("./SubCategoryRouter");
const ProductRouter = require("./ProductRouter");
const UserRouter = require("./UserRouter");
const AuthRouter = require("./AuthRouter");
const ReviewRoute = require("./ReviewRoute");
const CouponRouter = require("./CouponRouter");
const CartRouter = require("./CartRouter");
const OrderRouter = require("./OrderRouter");

const apiRoutes = Router();
apiRoutes.use("/auth", AuthRouter);
apiRoutes.use("/user", UserRouter);
apiRoutes.use("/brand", BrandRouter);
apiRoutes.use("/category", CategoryRoute);
apiRoutes.use("/subcategory", SubCategoryRouter);
apiRoutes.use("/product", ProductRouter);
apiRoutes.use("/review", ReviewRoute);
apiRoutes.use("/coupon", CouponRouter);
apiRoutes.use("/cart", CartRouter);
apiRoutes.use("/order", OrderRouter);
module.exports = apiRoutes;
