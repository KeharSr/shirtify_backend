const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
    maxLength: 500,
  },

  productSize: [{
    type: String,
    required: true,
  }],

  productColor: [{
    type: String,
    required: true,
  }],

  productImage: [{
    type: String,
    default: null,
  }],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  productQuantity: {
    type: Number,
  },
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
