import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
      res.status(400).json({ message: "This user is already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res
        .status(200)
        .json({ message: "User registred successfully", user: newUser });
    }
  } catch (error) {
    res.status(500).json({ message: "User not created" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Username or password is wrong" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "24h",
        });
        res
          .status(200)
          .json({ message: "user login successfully", token: token , user: user});
      } else {
        res.status(400).json({ message: "Username or password is wrong" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const userDetails = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(req.headers.authorization)
    // console.log(process.env.JWT_SECRET_KEY)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log('decoded',decoded)
    const userId = decoded.id;
    // console.log('userid : ' ,userId)
    const user = await userModel.findOne({ _id: userId }).select("-password");
    // console.log(user)

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ message: "User found", user: user });
  } catch (error) {
    res.status(500).json({ message: "Unauthorized or invalid token" });
  }
};

export const userUpdate = async (req, res) => {
  const { firstname, lastname, username, email, currentPassword, newPassword } = req.body;

  console.log('Update request:', { email, hasNewPassword: !!newPassword });

  try {
    const user = await userModel.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update basic info
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;

    // Update password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      console.log('Password updated for user:', email);
    }

    await user.save();
    
    const message = newPassword 
      ? "Account and password updated successfully" 
      : "Account updated successfully";
    
    res.status(200).json({ message, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: "Failed to update account" });
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
    res.status(200).json({message: 'User Updated', user: user})
  } catch (error) {
    res.status(500).json({message: 'User not Updated'})
    console.log(error)
  }


}


// Get all users count for admin dashboard
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password');
    
    res.status(200).json({
      message: "All users fetched successfully",
      users: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message
    });
  }
};
