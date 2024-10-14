const commonsSchema = {
  phone: {
    isMobilePhone: {
      options: ["tr-TR"],
      errorMessage: "invalid phone number format",
    },
    optional: true,
  },
};

exports.ForCreate = {
  ...commonsSchema,
  details: {
    notEmpty: {
      errorMessage: "The details must be not empty !",
    },
  },
  city: {
    notEmpty: {
      errorMessage: "The city must be not empty !",
    },
  },
  postalCode: {
    notEmpty: {
      errorMessage: "The postal code must be not empty !",
    },
  },
};

exports.ForUpdate = {
  ...commonsSchema,
};
