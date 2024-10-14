const { Router } = require("express");
const { AuthService } = require("../../services");
const { UserValidation } = require("../../utils/validation/Validations");

const routers = Router({ mergeParams: true });

routers.post(
  "/signup",
  UserValidation.whenCreate(),
  AuthService.signup.bind(AuthService)
);
routers.post(
  "/login",
  UserValidation.whenLogin(),
  AuthService.login.bind(AuthService)
);

routers.post("/forgotPassword", AuthService.forgotPassword.bind(AuthService));
routers.post("/verifyRestCode", AuthService.verifyRestCode.bind(AuthService));
routers.post(
  "/resetPassword",
  UserValidation.whenResetPassword(),
  AuthService.resetPassword.bind(AuthService)
);

module.exports = routers;
