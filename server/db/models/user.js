const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    min: 10,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  user.password = await bcrypt.hash(user.password, 10);
});

userSchema.methods.generateJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: "5d",
  });
};
module.exports = mongoose.model("users", userSchema);
