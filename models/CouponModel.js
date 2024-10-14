const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon Name is required"],
      unique: [true, "This Coupon is exist, it must be unique"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire time is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CouponModel = mongoose.model("Coupons", couponSchema);

module.exports = CouponModel;
