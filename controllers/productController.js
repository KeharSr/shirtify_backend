const path = require("path");
const productModel = require("../models/productModel");
const fs = require("fs");

const createProduct = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  const {
    productName,
    productPrice,
    productCategory,
    productDescription,
    productQuantity,
  } = req.body;

  if (
    (!productName || !productPrice || !productCategory || !productDescription,
    !productQuantity)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter all details!",
    });
  }
  var imageName = null;

  try {
    if (req.files && req.files.productImage) {
      const { productImage } = req.files;
      imageName = `${Date.now()}_${productImage.name}`;
      const imagePath = path.join(__dirname, `../public/products/${imageName}`);
      await productImage.mv(imagePath);
    }

    const newProduct = new productModel({
      productName: productName,
      productPrice: productPrice,
      productCategory: productCategory,
      productDescription: productDescription,
      productImage: imageName,
      productQuantity: productQuantity,

      // Save the path of the image
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product Created Successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

module.exports = {
    createProduct,
    };