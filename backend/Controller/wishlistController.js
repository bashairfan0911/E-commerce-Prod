import userModel from "../Models/userModel.js";

export const addToWishlist = async (req, res) => {
  const { productId, userId } = req.body;

  try {
    const user = await userModel.findOne({ _id: userId });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productIndex = user.wishlist.findIndex(
      (id) => id.toString() === productId
    );

    if (productIndex > -1) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();
    
    return res.status(200).json({ message: "Added to wishlist successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add to wishlist", error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { productId, userId } = req.body;

  try {
    const user = await userModel.findOne({ _id: userId });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
    
    await user.save();
    return res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove from wishlist", error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel
      .findOne({ _id: userId })
      .populate("wishlist");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ 
      message: "Wishlist fetched successfully", 
      wishlist: user.wishlist || []
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
  }
};
