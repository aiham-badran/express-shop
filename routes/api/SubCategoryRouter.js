const { Router } = require("express");
const { SubCategoryService } = require("../../services");
const {
  SubCategoriesValidation,
} = require("../../utils/validation/Validations");
const {
  AddCategoryIdToSubCategoryBody,
  FilterSubCategoriesByCategoryId,
} = require("../../middlewares/CategoriesMiddlewares.js");
const { AllowedTo, Protect } = require("../../middlewares/AuthMiddlewares.js");

const SubCategoryRouter = Router({ mergeParams: true });

SubCategoryRouter.get(
  "",
  FilterSubCategoriesByCategoryId,
  SubCategoryService.getAll.bind(SubCategoryService)
).get(
  "/:id",
  SubCategoriesValidation.checkParam(),
  SubCategoryService.getById.bind(SubCategoryService)
);

SubCategoryRouter.use(Protect, AllowedTo("admin"));
SubCategoryRouter.post(
  "",
  AddCategoryIdToSubCategoryBody,
  SubCategoriesValidation.whenCreate(),
  SubCategoryService.create.bind(SubCategoryService)
);
SubCategoryRouter.route("/:id")
  .put(
    SubCategoriesValidation.whenUpdate(),
    SubCategoryService.updateById.bind(SubCategoryService)
  )
  .delete(
    SubCategoriesValidation.checkParam(),
    SubCategoryService.deleteById.bind(SubCategoryService)
  );

module.exports = SubCategoryRouter;
