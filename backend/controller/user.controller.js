const User = require("../models/user");

const userProfile = async (req, res) => {
  try {
    let user = await User.find({});
    return res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error fetching user profile" });
  }
};

const userRegister = async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    const user = new User({ username, email, password, userType });
    await user.save();
    return res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error registering user" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    return res.send({ message: "User logged in successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error logging in user" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const updatedData = { username, email, password };
    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error updating user profile" });
  }
};

module.exports = {
  userProfile,
  userRegister,
  userLogin,
  updateProfile,
};
