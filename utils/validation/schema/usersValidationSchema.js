const UserModel = require("../../../models/UserModel");
const Security = require("../../security/Security");

const commonConfirmPassword = {
  "confirm-password": {
    notEmpty: {
      errorMessage: "The confirm-password must be not empty !",
    },
    isLength: {
      options: {
        min: 6,
        max: 36,
      },
      errorMessage: "The length must be more than 6 and less than 36 letters",
    },
    custom: {
      options: async (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error(`The confirm-password not equal password`);
        }
      },
    },
  },
};

const commonPassword = {
  password: {
    notEmpty: {
      errorMessage: "The password must be not empty !",
    },
    isLength: {
      options: {
        min: 6,
        max: 36,
      },
      errorMessage: "The length must be more than 6 and less than 36 letters",
    },
  },
};

const commonEmail = {
  notEmpty: {
    errorMessage: "The email must be not empty !",
  },
  isEmail: {
    errorMessage: "The email is not correct",
  },
};

const commonUserSchema = {
  phone: {
    isMobilePhone: {
      options: ["tr-TR"],
      errorMessage: "invalid phone number format",
    },
    optional: true,
  },
};

exports.ForResetPassword = {
  ...commonPassword,
  ...commonConfirmPassword,
};

exports.ForChangePassword = {
  ...commonPassword,
  ...commonConfirmPassword,
  "current-password": {
    notEmpty: {
      errorMessage: "The current-password must be not empty !",
    },
    custom: {
      options: async (value, { req }) => {
        const user = await UserModel.findOne(
          { _id: req.params.id },
          { password: 1 }
        );
        if (!(await Security.bcryptCompare(value.toString(), user.password))) {
          throw new Error(`The current-password is not correct`);
        }
      },
    },
  },
};

exports.ForCreate = {
  ...commonUserSchema,
  email: {
    ...commonEmail,
    custom: {
      options: async (value) => {
        const user = await UserModel.findOne({ email: value });
        if (user) {
          throw new Error(
            `this email '${value}' is almost used, it must be unique`
          );
        }
      },
    },
  },
  name: {
    notEmpty: {
      errorMessage: "The name must be not empty !",
    },
  },
};

exports.ForUpdate = {
  ...commonUserSchema,
  name: {
    optional: true,
  },
};

exports.ForLogin = {
  ...commonEmail,
  ...commonPassword,
};
