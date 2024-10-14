const { Router } = require("express");
const { UserService } = require("../../services");
const { UserValidation } = require("../../utils/validation/Validations");
const { AllowedTo, Protect } = require("../../middlewares/AuthMiddlewares");
const {
  GetLoggedUserId,
  uploadImage,
} = require("../../middlewares/UserMiddlewares");
const UserToolsRouter = require("./UserToolsRouter");

const UserRouter = Router({ mergeParams: true });

UserRouter.use(Protect, AllowedTo("user"));

UserRouter.use("/profile", UserToolsRouter);

// Logged User

UserRouter.put(
  "/profile/edit-password",
  GetLoggedUserId,
  UserValidation.whenChangePassword(),
  UserService.updateUserPassword.bind(UserService)
);

UserRouter.route("/profile")
  .put(
    uploadImage(),
    GetLoggedUserId,
    UserValidation.whenUpdate(),
    UserService.updateById.bind(UserService)
  )
  .get(GetLoggedUserId, UserService.getById.bind(UserService))
  .delete(GetLoggedUserId, UserService.inactive.bind(UserService));

// Admin Routes

UserRouter.use(AllowedTo("admin"));

UserRouter.route("/")
  .get(UserService.getAll.bind(UserService))
  .post(
    uploadImage(),
    UserValidation.whenCreate(),
    UserService.create.bind(UserService)
  );
UserRouter.route("/:id")
  .get(UserValidation.checkParam(), UserService.getById.bind(UserService))
  .put(
    uploadImage(),
    UserValidation.whenUpdate(),
    UserService.updateById.bind(UserService)
  )
  .delete(
    UserValidation.checkParam(),
    UserService.deleteById.bind(UserService)
  );

module.exports = UserRouter;
