const BrandModel = require("../../../models/BrandModel");

const commonsSchema = {
  name: {
    custom: {
      options: async (value) => {
        const brand = await BrandModel.findOne({ name: value });
        if (brand) {
          throw new Error(
            `there is Brand has this name '${value}' ,it must be unique`
          );
        }
      },
    },
    isLength: {
      options: {
        min: 2,
        max: 32,
      },
      errorMessage: "The Brand must be more than 2 and less than 32 letters",
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
};

exports.ForUpdate = {
  name: {
    ...commonsSchema.name,
    optional: true,
  },
};
