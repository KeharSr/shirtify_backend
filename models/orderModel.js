// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user',
//         required: true
//     },
//     carts: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Cart',
//             required: true
//         }
//     ],
//     totalPrice: {
//         type: Number,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     street: {
//         type: String,
//         required: true
//     },
//     city: {
//         type: String,
//         required: true
//     },
//     state: {
//         type: String,
//         required: true
//     },
//     zipCode: {
//         type: Number,
//         required: true
//     },
//     country: {
//         type: String,
//         required: true
//     },
//     phone: {
//         type: String,
//     },
//     status: {
//         type: String,
//         default: 'pending'
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     },
//     payment: {
//         type: Boolean,
//         default: false
//     },  
//     paymentMethod: { type: String, enum: ["khalti"], default: "khalti" },

// });

// const Order = mongoose.model('Order', orderSchema);
// module.exports = Order;


const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    carts: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["placed", "processed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("order", orderSchema);
