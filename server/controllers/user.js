const express = require("express");
const userModel = require("../db/models/user");
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already Exist" });
    }
    const user = await userModel.create({
      fullName,
      email,
      phoneNumber,
      password,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      res.status(400).json({ message: "User Not Exist!!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
