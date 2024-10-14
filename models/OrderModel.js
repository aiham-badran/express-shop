const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Products",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    totalPrice: Number,
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    DeliveredAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * get user data inside order obj when fetch order data
 */
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImage email phone",
  }).populate({ path: "cartItems.product", select: "title imageCover" });

  next();
});

const OrderModel = mongoose.model("Orders", orderSchema);

module.exports = OrderModel;
