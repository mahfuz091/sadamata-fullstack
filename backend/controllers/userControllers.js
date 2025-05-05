const User = require("../models/User");



const postUser = async (req, res) => {
  console.log(req.body);
  
  try {
    const { fullName, email, phone, password } = req.body;

    // Validate required fields
    if (!fullName || !password || (!email && !phone)) {
      return res.status(400).json({
        message: "Full name, password, and either email or phone number are required.",
      });
    }

    // Check for existing user by email or phone
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email or phone number already exists.",
      });
    }

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      phone,
      password,
    });

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body; 

    // Find user by email
    const user = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email, phone or password." });
    }

    // Check password
    if (!user.matchPassword(password)) {
      return res.status(401).json({ message: "Invalid email, phone or password." });
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { postUser, loginUser };
