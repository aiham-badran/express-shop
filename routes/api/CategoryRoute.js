const { Router } = require("express");
const { CategoryService } = require("../../services");
const { CategoriesValidation } = require("../../utils/validation/Validations");
const { uploadImage } = require("../../middlewares/CategoriesMiddlewares.js");
const { AllowedTo, Protect } = require("../../middlewares/AuthMiddlewares.js");
const SubCategoryRouter = require("./SubCategoryRouter.js");

const CategoryRoute = Router();

// method: "category",

CategoryRoute.use("/:categoryId/subcategory", SubCategoryRouter);

CategoryRoute.get("", CategoryService.getAll.bind(CategoryService));
CategoryRoute.get(
  "/:id",
  CategoriesValidation.checkParam(),
  CategoryService.getById.bind(CategoryService)
);

CategoryRoute.use(Protect, AllowedTo("admin"));

CategoryRoute.post(
  "/",
  uploadImage(),
  CategoriesValidation.whenCreate(),
  CategoryService.create.bind(CategoryService)
);

CategoryRoute.route("/:id")
  .put(
    uploadImage(),
    CategoriesValidation.whenUpdate(),
    CategoryService.updateById.bind(CategoryService)
  )
  .delete(
    CategoriesValidation.checkParam(),
    CategoryService.deleteById.bind(CategoryService)
  );

module.exports = CategoryRoute;
