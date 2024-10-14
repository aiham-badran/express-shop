const commonSchema = {
  ratings: {
    isLength: {
      options: {
        min: 1,
        max: 5,
      },
      errorMessage: "The Review must be more than 0 and less than 6 ",
    },
  },
  product: {
    isMongoId: {
      errorMessage: "The id is invalid format",
    },
  },
};

exports.ForCreate = {
  ratings: {
    ...commonSchema.ratings,
    notEmpty: {
      errorMessage: "The Review must be not empty !",
    },
  },
  product: {
    ...commonSchema.product,
    notEmpty: {
      errorMessage: "The Product Id must be not empty !",
    },
  },
};

exports.ForUpdate = {
  ratings: {
    ...commonSchema.ratings,

    optional: true,
  },
  product: {
    ...commonSchema.product,

    optional: true,
  },
};
