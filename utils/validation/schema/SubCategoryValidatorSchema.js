const Errors = require("../../errors/Errors");
const CategoryModel = require("../../../models/CategoryModel");
const SubCategoryModel = require("../../../models/SubCategoryModel");

const commonSchema = {
  name: {
    custom: {
      options: async (value) => {
        const category = await SubCategoryModel.findOne({ name: value });
        if (category) {
          throw new Errors(
            `there is sub category has this name '${value}' ,it must be unique`,
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
  category: {
    isMongoId: {
      errorMessage: "The id is invalid format",
    },
    custom: {
      options: async (value) => {
        const data = await CategoryModel.findById({ _id: value });
        if (!data) {
          throw new Errors(
            `the Category parent with id ${value} not exist !`,
            404
          );
        }
      },
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
  category: {
    ...commonSchema.category,
    notEmpty: {
      errorMessage: "the Category parent must be not empty !",
    },
  },
};

exports.ForUpdate = {
  name: {
    ...commonSchema.name,
    optional: true,
  },
  category: {
    ...commonSchema.category,
    optional: true,
  },
};
