const path = require("path");
const productModel = require("../models/productModel");
const fs = require("fs");



//delete product
const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      productCategory,
      productDescription,
      productQuantity,
      productSize,
      productColor,
    } = req.body;

    // Validation
    if (!productName?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Product name is required!" });
    }
    // product price is required and cant be in negative
    if (!productPrice) {
      return res
        .status(400)
        .json({ success: false, message: "Product price is required!" });
    }

    if (productPrice < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Product price cannot be negative!" });
    }


    if (!productCategory?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Product category is required!" });
    }
    if (!productDescription?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Product description is required!" });
    }
    if (!productQuantity) {
      return res
        .status(400)
        .json({ success: false, message: "Product quantity is required!" });
    }

    // product quantity cant be negative
    if (productQuantity < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Product quantity cannot be negative!" });
    }



    // Parse the JSON strings back into arrays
    let productSizes = [];
    let productColors = [];

    try {
      productSizes = JSON.parse(productSize || "[]");
      productColors = JSON.parse(productColor || "[]");
    } catch (error) {
      console.error("Error parsing sizes or colors:", error);
      return res
        .status(400)
        .json({ success: false, message: "Invalid size or color format!" });
    }

    if (!productSizes.length) {
      return res.status(400).json({
        success: false,
        message: "At least one product size is required!",
      });
    }
    if (!productColors.length) {
      return res.status(400).json({
        success: false,
        message: "At least one product color is required!",
      });
    }

    const imageNames = [];

    // Handle image uploads
    if (req.files && req.files.productImage) {
      const { productImage } = req.files;
      const images = Array.isArray(productImage)
        ? productImage
        : [productImage];

      for (const image of images) {
        const imageName = `${Date.now()}_${image.name}`;
        const imagePath = path.join(
          __dirname,
          `../public/products/${imageName}`
        );
        await image.mv(imagePath);
        imageNames.push(imageName);
      }
    }

    if (!imageNames.length) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required!",
      });
    }

    const newProduct = new productModel({
      productName,
      productPrice,
      productCategory,
      productDescription,
      productImage: imageNames,
      productQuantity,
      productSize: productSizes,
      productColor: productColors,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product Created Successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// get single products

const getSingleProduct = async (req, res) => {
  //get product id from url
  const productId = req.params.id;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      res.status(400).json({
        success: false,
        message: "No product found",
      });
    }
    res.status(200).json({
      success: true,
      message: "product fetched",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      messgae: "internal server error",
      error: error,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allproducts = await productModel.find({});
    res.status(201).json({
      success: true,
      message: "Products Fetched Successfully!",
      products: allproducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      productCategory,
      productDescription,
      productQuantity,
      productSize,
      productColor,
    } = req.body;

    // Find existing product
    const existingProduct = await productModel.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    // Validate required fields if they are being updated
    if (productName !== undefined && !productName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name cannot be empty!",
      });
    }
    if (productPrice !== undefined && !productPrice) {
      return res.status(400).json({
        success: false,
        message: "Product price cannot be empty!",
      });
    }

    if (productPrice !== undefined && productPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Product price cannot be negative!",
      });
    }

    if (productCategory !== undefined && !productCategory?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product category cannot be empty!",
      });
    }
    if (productDescription !== undefined && !productDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product description cannot be empty!",
      });
    }
    if (productQuantity !== undefined && !productQuantity) {
      return res.status(400).json({
        success: false,
        message: "Product quantity cannot be empty!",
      });
    }

    // Parse and validate sizes and colors if they are being updated
    let productSizes = existingProduct.productSize;
    let productColors = existingProduct.productColor;

    if (productSize !== undefined) {
      try {
        productSizes = JSON.parse(productSize || "[]");
        if (!productSizes.length) {
          return res.status(400).json({
            success: false,
            message: "At least one product size is required!",
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid size format!",
        });
      }
    }

    if (productColor !== undefined) {
      try {
        productColors = JSON.parse(productColor || "[]");
        if (!productColors.length) {
          return res.status(400).json({
            success: false,
            message: "At least one product color is required!",
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid color format!",
        });
      }
    }

    // Handle image updates if new images are provided
    let imageNames = existingProduct.productImage;

    if (req.files && req.files.productImage) {
      const { productImage } = req.files;
      const newImages = Array.isArray(productImage)
        ? productImage
        : [productImage];

      // Delete existing images
      for (const oldImage of existingProduct.productImage) {
        const oldImagePath = path.join(
          __dirname,
          `../public/products/${oldImage}`
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Upload new images
      imageNames = [];
      for (const image of newImages) {
        const imageName = `${Date.now()}_${image.name}`;
        const imagePath = path.join(
          __dirname,
          `../public/products/${imageName}`
        );
        await image.mv(imagePath);
        imageNames.push(imageName);
      }

      if (!imageNames.length) {
        return res.status(400).json({
          success: false,
          message: "At least one product image is required!",
        });
      }
    }

    // Update the product
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        ...(productName && { productName }),
        ...(productPrice && { productPrice }),
        ...(productCategory && { productCategory }),
        ...(productDescription && { productDescription }),
        ...(productQuantity && { productQuantity }),
        productSize: productSizes,
        productColor: productColors,
        productImage: imageNames,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

// update product
// const updateProduct = async (req, res) => {
//   try {
//     // if there is image
//     if (req.files && req.files.productImage) {
//       //destructing
//       const { productImage } = req.files;

//       //upload image to directory(/public/products folder)
//       const imageName = `${Date.now()}-${productImage.name}`;

//       //2. make an upload path (/path/upload- directory)
//       const imageUploadPath = path.join(
//         __dirname,
//         `../public/products/${imageName}`
//       );

//       //move the folder
//       await productImage.mv(imageUploadPath);

//       req.body.productImage = imageName; //image uploaded (generated name)

//       // if image is uploaded, and req.body is assigned
//       if (req.body.productImage) {
//         //find the product
//         const existingProduct = await productModel.findById(req.params.id);

//         //Searching in the directory folder
//         const oldImagePath = path.join(
//           __dirname,
//           `../public/products/${existingProduct.productImage}`
//         );

//         // delete from file system
//         fs.unlinkSync(oldImagePath);
//       }
//     }
//     //update the data
//     const updateProduct = await productModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       data: updateProduct,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error,
//     });
//   }
// };

const paginatonProducts = async (req, res) => {
  // results  page number
  const pageNo = req.query.page || 1;
  const limit = req.query.limit || 10;

  // Per page 2 products

  try {
    // Find all products,skip the products, limit the products
    const products = await productModel
      .find({})
      .skip((pageNo - 1) * limit)
      .limit(limit);

    // if page 6 is requested, result 0
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    //response
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//get products by category

const getProductsByCategory = async (req, res) => {
  const category = req.query.category || "All";
  const search = req.query.search || "";

  console.log(category);

  const pageNo = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 10);
  let products; // Declare products here to make it accessible throughout the function

  try {
    if (category === "All") {
      products = await productModel
        .find({
          productName: { $regex: search, $options: "i" },
        })
        .skip((pageNo - 1) * limit)
        .limit(limit);
    } else {
      products = await productModel
        .find({ ...(category && { productCategory: category }) })
        .find({ productName: { $regex: search, $options: "i" } })

        .skip((pageNo - 1) * limit)
        .limit(limit);
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products found for this category",
      });
    }

    res.status(201).json({
      success: true,
      message: "Products fetched successfully by category",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// search products by name
const searchProductsByName = async (req, res) => {
  const search = req.query.search || "";
  const pageNo = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Build the query conditionally based on the search term
    const query = { productName: { $regex: search, $options: "i" } };

    // Fetch the products and the total count
    const [products, totalProducts] = await Promise.all([
      productModel
        .find(query)
        .skip((pageNo - 1) * limit)
        .limit(limit),
      productModel.countDocuments(query),
    ]);

    // If no products are found, return an appropriate response
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this search",
      });
    }

    // Return the products along with the total count for pagination purposes
    res.status(200).json({
      success: true,
      message: "Products fetched successfully by search",
      products: products,
      totalProducts: totalProducts,
      currentPage: pageNo,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  paginatonProducts,
  getProductsByCategory,
  searchProductsByName,
};
