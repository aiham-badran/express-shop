const Errors = require("../../errors/Errors");
const CategoryModel = require("../../../models/CategoryModel");

const commonSchema = {
  name: {
    custom: {
      options: async (value) => {
        const category = await CategoryModel.findOne({ name: value });
        if (category) {
          throw new Errors(
            `there is category has this name '${value}' ,it must be unique`,
            400
          );
        }
      },
    },
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage: "The Category must be more than 3 and less than 32 letters",
    },
  },
};

exports.ForCreate = {
  name: {
    ...commonSchema.name,
    notEmpty: {
      errorMessage: "The name must be not empty !",
    },
  },
};
exports.ForUpdate = {
  name: {
    ...commonSchema.name,
    optional: true,
  },
};
