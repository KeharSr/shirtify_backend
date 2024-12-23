const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const createUser = async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, userName, email, phoneNumber, password,confirmPassword } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !userName ||
    !email ||
    !phoneNumber ||
    !password ||
    !confirmPassword
  ) {
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
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password do not match!",
            });
    }

    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    const newUser = new userModel({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
      confirmPassword: hashedPassword,
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

module.exports = {
    createUser,
    };
