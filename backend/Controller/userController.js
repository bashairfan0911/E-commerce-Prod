import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "This user is already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res
      .status(200)
      .json({ message: "User registred successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "User not created" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Username or password is wrong" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });
      return res
        .status(200)
        .json({ message: "user login successfully", token: token , user: user});
    }
    
    return res.status(400).json({ message: "Username or password is wrong" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const userDetails = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = await userModel.findOne({ _id: userId }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({ message: "User found", user: user });
  } catch (error) {
    return res.status(500).json({ message: "Unauthorized or invalid token" });
  }
};

export const userUpdate = async (req, res) => {
  const { firstname, lastname, username, email, currentPassword, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();
    
    const message = newPassword 
      ? "Account and password updated successfully" 
      : "Account updated successfully";
    
    return res.status(200).json({ message, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update account" });
  }
};


export const userAddress = async(req,res) => {

  const {firstname ,lastname ,email ,country ,street_address ,city ,state ,zip_code ,phone, userId} = req.body

  const updateData = {
    firstname,
    lastname,
    address: {
      country,
      street_address,
      city,
      state,
      zip_code,
      phone
    }
  }

  try {
    const user = await userModel.findOneAndUpdate({_id: userId}, {$set: updateData}, {new: true})
    return res.status(200).json({message: 'User Updated', user: user})
  } catch (error) {
    return res.status(500).json({message: 'User not Updated'})
  }
}


export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password');
    
    return res.status(200).json({
      message: "All users fetched successfully",
      users: users,
      count: users.length
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching users",
      error: error.message
    });
  }
};
