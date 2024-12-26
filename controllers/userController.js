const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createUser = async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, userName, email, phoneNumber, password } =
    req.body;

  if (!firstName ||!lastName ||!userName ||!email ||!phoneNumber ||!password ) {
    return res.status(400).json({
      success: false,
      message: "Please enter all details!",
    });
  }

  try {
    const existingUserByEmail = await userModel.findOne({ email: email });
    const existingUserByPhone = await userModel.findOne({
      phoneNumber: phoneNumber,
    });

    


    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists!",
      });
    }

    if (existingUserByPhone) {
      return res.status(400).json({
        success: false,
        message: "User with this phone number already exists!",
      });
    }

    // if the password and confirm password do not match
    

    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    const newUser = new userModel({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
      
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const loginUser = async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({
          success: false,
          message: 'Please enter all the fields'
      });
  }

  try {
      const user = await userModel.findOne({ email: email });

      if (!user) {
          return res.status(400).json({
              success: false,
              message: "Email Doesn't Exist !"
          });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
          return res.status(400).json({
              success: false,
              message: "Password Doesn't Match !"
          });
      }

      const token = await jwt.sign(
          {
              id: user._id, isAdmin: user.isAdmin
          },
          process.env.JWT_SECRET
      );

      return res.status(200).json({
          success: true,
          message: 'User Logged in Successfully!',
          token: token,
          userData: user
      });

  } catch (error) {
      console.log(error);
      return res.status(500).json({
          success: false,
          message: 'Internal Server Error'
      });
  }
}

const getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password'); // Do not return the password

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User found!',
            user: user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const getToken = async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.body;
 
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
 
    const token = await jwt.sign(
          {
              id : user._id, isAdmin : user.isAdmin},
              process.env.JWT_SECRET
    );
 
    return res.status(200).json({
      success: true,
      message: 'Token generated successfully!',
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

module.exports = {
    createUser,
    loginUser,
    getCurrentUser,
    getToken
    };
