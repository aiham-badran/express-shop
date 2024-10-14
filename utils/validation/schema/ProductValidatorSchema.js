const ProductModel = require("../../../models/ProductModel");
const CategoryModel = require("../../../models/CategoryModel");
const BrandModel = require("../../../models/BrandModel");

const commonSchema = {
  title: {
    custom: {
      options: async (value) => {
        const data = await ProductModel.findOne({ title: value });
        if (data) {
          throw new Error(
            `there is Product has this title '${value}', it must be unique`
          );
        }
      },
    },
    isLength: {
      options: {
        min: 10,
        max: 255,
      },
      errorMessage:
        "The Product Title must be more than 10 and less than 255 letters",
    },
  },
  description: {
    isLength: {
      options: {
        min: 100,
      },
      errorMessage: "The Product Description must be more than 100 letters",
    },
  },
  quantity: {
    isNumeric: {
      errorMessage: "Product quantity must be a Number!",
    },
  },
  price: {
    isNumeric: {
      errorMessage: "Product price must be a Number!",
    },
    isLength: {
      options: {
        max: 100000,
      },
      errorMessage: "The Product price must be less than 100,000",
    },
  },
  discount: {
    isNumeric: {
      errorMessage: "Product discount must be a Number!",
    },
    isLength: {
      options: {
        max: 100,
        min: 0,
      },
      errorMessage: "The discount must be between 0 and 100",
    },
    optional: true,
  },
  category: {
    isMongoId: {
      errorMessage: "The id is in an invalid format",
    },
    isArray: {
      errorMessage:
        "The Category must be Array ,it has one or more categories id ",
    },
    custom: {
      options: async (value) => {
        const count = await CategoryModel.countDocuments({ _id: value });
        if (count !== value.length) {
          throw new Error(`One or more Categories do not exist.`);
        }
      },
    },
  },
  brand: {
    isMongoId: {
      errorMessage: "The id is in an invalid format",
    },
    custom: {
      options: async (value) => {
        const count = await BrandModel.countDocuments({ _id: value });
        if (!count) {
          throw new Error(`The Brand with id '${value} not exist'`);
        }
      },
    },
    optional: true,
  },
  colors: {
    isArray: {
      errorMessage: "The Colors must be Array of colors",
    },
    optional: true,
  },
};

exports.ForCreate = {
  ...commonSchema,
  title: {
    ...commonSchema.title,
    notEmpty: {
      errorMessage: `The Product Title must be not empty!`,
    },
  },
  description: {
    ...commonSchema.description,
    notEmpty: {
      errorMessage: "Product Description is required, it must not be empty!",
    },
  },
  quantity: {
    ...commonSchema.quantity,
    notEmpty: {
      errorMessage: "Product Quantity is required, it must not be empty!",
    },
  },
  price: {
    ...commonSchema.price,
    notEmpty: {
      errorMessage: "Product Price is required, it must not be empty!",
    },
  },
  imageCover: {
    notEmpty: {
      errorMessage: "Product Image Cover is required, it must not be empty!",
    },
  },
  category: {
    ...commonSchema.category,
    notEmpty: {
      errorMessage: "Category is required, it must not be empty!",
    },
  },
};

exports.ForUpdate = {
  ...commonSchema,
  title: {
    ...commonSchema.title,
    optional: true,
  },
  description: {
    ...commonSchema.description,
    optional: true,
  },
  quantity: {
    ...commonSchema.quantity,
    optional: true,
  },
  price: {
    ...commonSchema.price,
    optional: true,
  },
  imageCover: {
    optional: true,
  },
  category: {
    ...commonSchema.category,
    optional: true,
  },
};
