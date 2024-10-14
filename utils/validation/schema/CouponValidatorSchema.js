const CouponModel = require("../../../models/CouponModel");

const commonsSchema = {
  name: {
    custom: {
      options: async (value) => {
        const data = await CouponModel.findOne({ name: value });
        if (data) {
          throw new Error(
            `there is Coupon has this name '${value}' ,it must be unique`
          );
        }
      },
    },
  },
  expire: {
    isDate: {
      errorMessage: "The expire must be date format !",
    },
  },
  discount: {
    isFloat: {
      errorMessage: "The discount must be floating number !",
    },
  },
};

exports.ForCreate = {
  name: {
    ...commonsSchema.name,
    notEmpty: {
      errorMessage: "The name must be not empty !",
    },
  },
  expire: {
    ...commonsSchema.expire,
    notEmpty: {
      errorMessage: "The expire must be not empty !",
    },
  },
  discount: {
    ...commonsSchema.discount,
    notEmpty: {
      errorMessage: "The discount must be not empty !",
    },
  },
};

exports.ForUpdate = {
  name: {
    ...commonsSchema.name,
    optional: true,
  },
  expire: {
    ...commonsSchema.expire,
    optional: true,
  },
  discount: {
    ...commonsSchema.discount,
    optional: true,
  },
};
