const mongooes = require("mongoose");

const Security = require("../utils/security/Security");
const HelperModel = require("../utils/helpers/HelpersModels");

const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    alias: {
      type: String,
      required: [true, "Alias is required"],
      unique: true,
    },
    details: {
      type: String,
      required: [true, "Address details are required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
    },
  },
  { _id: false }
); // Prevent creating a separate _id for each address

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true, // Changed to true, as it does not require an array
      required: [true, "Email is required"],
      lowercase: true,
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Too short password, must be greater than 6 characters"],
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    resetPasswordCode: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    resetPasswordVerified: {
      type: Boolean,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        select: false,
      },
    ],
    addresses: [
      {
        type: addressSchema,
        select: false,
      },
    ], // Use the address schema
  },
  { timestamps: true, versionKey: false }
);

/**
 * hash password when save document
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await Security.bcryptData(this.password);
  next();
});

/**
 * hash password when update document
 */
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password)
    update.password = await Security.bcryptData(update.password);
  next();
});

/**
 *  change image filed to app url + image name
 */
userSchema.post("init", HelperModel.addImageUrlToDoc("profileImage"));

/**
 * change image filed to app url + image name
 */
userSchema.post("save", HelperModel.addImageUrlToDoc("profileImage"));

const UserModel = mongooes.model("Users", userSchema);

module.exports = UserModel;
